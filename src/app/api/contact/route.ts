import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 15 * 60 * 1000;

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return "unknown";
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, subject, message, phone } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
      return NextResponse.json({ error: "Subject is required." }, { status: 400 });
    }

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json({ error: "Message is required." }, { status: 400 });
    }

    if (message.length > 5000) {
      return NextResponse.json({ error: "Message must be 5000 characters or fewer." }, { status: 400 });
    }

    const db = await getDb();
    const doc = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone && typeof phone === "string" ? phone.trim() : undefined,
      subject: subject.trim(),
      message: message.trim(),
      read: false,
      createdAt: new Date(),
    };

    await db.collection("messages").insertOne(doc);

    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f5f5f0;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f0;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border:1px solid #e8e4dd;">
          <tr>
            <td style="padding:40px 40px 20px;">
              <p style="font-size:10px;letter-spacing:0.25em;text-transform:uppercase;color:#b8a88a;margin:0 0 16px;font-family:Arial,sans-serif;">New Website Contact</p>
              <h1 style="font-size:24px;font-weight:500;color:#1a1a1a;margin:0 0 24px;font-family:Georgia,serif;">${subject}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #e8e4dd;">
                <tr>
                  <td style="padding:20px 0 12px;">
                    <p style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#8a8a8a;margin:0 0 4px;font-family:Arial,sans-serif;">From</p>
                    <p style="font-size:14px;color:#1a1a1a;margin:0;font-family:Arial,sans-serif;">${name.trim()}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:0 0 12px;">
                    <p style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#8a8a8a;margin:0 0 4px;font-family:Arial,sans-serif;">Email</p>
                    <p style="font-size:14px;color:#1a1a1a;margin:0;font-family:Arial,sans-serif;"><a href="mailto:${email.trim()}" style="color:#1a1a1a;">${email.trim()}</a></p>
                  </td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding:0 0 12px;">
                    <p style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#8a8a8a;margin:0 0 4px;font-family:Arial,sans-serif;">Phone</p>
                    <p style="font-size:14px;color:#1a1a1a;margin:0;font-family:Arial,sans-serif;">${phone.trim()}</p>
                  </td>
                </tr>
                ` : ""}
                <tr>
                  <td style="padding:0 0 12px;">
                    <p style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#8a8a8a;margin:0 0 4px;font-family:Arial,sans-serif;">Subject</p>
                    <p style="font-size:14px;color:#1a1a1a;margin:0;font-family:Arial,sans-serif;">${subject.trim()}</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 0;">
                    <p style="font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#8a8a8a;margin:0 0 8px;font-family:Arial,sans-serif;">Message</p>
                    <p style="font-size:14px;color:#1a1a1a;margin:0;line-height:1.7;font-family:Arial,sans-serif;white-space:pre-wrap;">${message.trim()}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #e8e4dd;">
              <p style="font-size:11px;color:#b8a88a;margin:0;font-family:Arial,sans-serif;">Sent from Sani Ul Website Contact Form</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

        await resend.emails.send({
          from: "Sani Ul Website <onboarding@resend.dev>",
          to: process.env.CONTACT_EMAIL || process.env.ADMIN_EMAIL || "noreply@example.com",
          subject: `New Website Contact — ${subject.trim()}`,
          html,
          replyTo: email.trim().toLowerCase(),
        });
      } catch (emailError) {
        console.error("Failed to send email notification:", emailError);
      }
    } else {
      console.warn("RESEND_API_KEY is not set. Email notification skipped. Message saved to database.");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
