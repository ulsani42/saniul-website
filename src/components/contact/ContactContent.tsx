"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, MessageCircle, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { person } from "@/data/person";

interface ContactData {
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
}

export default function ContactContent({ contactData }: { contactData?: ContactData }) {
  const email = contactData?.email ?? person.contact.email;
  const phone = contactData?.phone ?? person.contact.phone;
  const whatsapp = contactData?.whatsapp ?? person.contact.whatsapp;
  const location = contactData?.location ?? person.location;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const contactMethods = [
    {
      icon: <Mail size={20} />,
      label: "Email",
      value: email,
      href:
        email !== "[Email Address]"
          ? `mailto:${email}`
          : undefined,
    },
    {
      icon: <Phone size={20} />,
      label: "Phone",
      value: phone,
      href:
        phone !== "[Phone Number]"
          ? `tel:${phone}`
          : undefined,
    },
    {
      icon: <MessageCircle size={20} />,
      label: "WhatsApp",
      value: whatsapp,
      href:
        whatsapp !== "[WhatsApp Number]"
          ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`
          : undefined,
    },
    {
      icon: <MapPin size={20} />,
      label: "Location",
      value: location,
      href: undefined,
    },
  ];

  return (
    <>
      <section className="pt-32 md:pt-40 pb-16 md:pb-20 bg-ivory">
        <div className="container-main">
          <AnimatedSection>
            <p className="text-xs tracking-[0.25em] uppercase text-accent mb-4 font-medium">
              Contact
            </p>
            <h1 className="text-editorial text-4xl md:text-5xl lg:text-6xl text-ink font-medium mb-6">
              Let&apos;s{" "}
              <span className="italic text-muted">connect</span>
            </h1>
            <p className="text-muted text-base md:text-lg max-w-2xl leading-relaxed font-light">
              Whether you&apos;d like to know more about Sani Ul, discuss a
              business opportunity, or simply get in touch, feel free to reach
              out.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white border-t border-sand">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <AnimatedSection>
              <div>
                <h2 className="text-editorial text-2xl md:text-3xl text-ink font-medium mb-8">
                  Get in touch
                </h2>
                <div className="space-y-6 mb-10">
                  {contactMethods.map((method) => (
                    <div key={method.label} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-cream border border-sand flex items-center justify-center text-accent shrink-0 mt-0.5">
                        {method.icon}
                      </div>
                      <div>
                        <p className="text-xs tracking-[0.15em] uppercase text-stone mb-1 font-medium">
                          {method.label}
                        </p>
                        {method.href ? (
                          <a
                            href={method.href}
                            target={method.href.startsWith("http") ? "_blank" : undefined}
                            rel={method.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-sm text-charcoal hover:text-accent transition-colors duration-200"
                          >
                            {method.value}
                          </a>
                        ) : (
                          <p className="text-sm text-charcoal">{method.value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  {phone !== "[Phone Number]" && (
                    <a
                      href={`tel:${phone}`}
                      className="inline-flex items-center px-5 py-2.5 text-xs tracking-wider uppercase bg-ink text-white hover:bg-charcoal transition-colors duration-200"
                    >
                      <Phone size={14} className="mr-2" />
                      Call
                    </a>
                  )}
                  {whatsapp !== "[WhatsApp Number]" && (
                    <a
                      href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-5 py-2.5 text-xs tracking-wider uppercase border border-charcoal text-charcoal hover:bg-ink hover:text-white hover:border-ink transition-all duration-200"
                    >
                      <MessageCircle size={14} className="mr-2" />
                      WhatsApp
                    </a>
                  )}
                  {email !== "[Email Address]" && (
                    <a
                      href={`mailto:${email}`}
                      className="inline-flex items-center px-5 py-2.5 text-xs tracking-wider uppercase border border-charcoal text-charcoal hover:bg-ink hover:text-white hover:border-ink transition-all duration-200"
                    >
                      <Mail size={14} className="mr-2" />
                      Email
                    </a>
                  )}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2}>
              {status === "success" ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cream border border-sand flex items-center justify-center">
                      <CheckCircle size={24} className="text-accent" />
                    </div>
                    <h3 className="text-editorial text-xl text-ink font-medium mb-2">
                      Message Sent
                    </h3>
                    <p className="text-muted text-sm font-light">
                      Thank you for reaching out. Sani Ul will get back to you
                      shortly.
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {status === "error" && (
                    <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 text-sm">
                      <AlertCircle size={16} className="shrink-0" />
                      {errorMessage}
                    </div>
                  )}
                  <div>
                    <label htmlFor="name" className="block text-xs tracking-[0.15em] uppercase text-stone mb-2 font-medium">
                      Name
                    </label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required
                      className="w-full px-4 py-3 text-sm text-charcoal bg-ivory border border-sand focus:border-accent focus:outline-none transition-colors duration-200"
                      placeholder="Your name" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-xs tracking-[0.15em] uppercase text-stone mb-2 font-medium">
                        Email
                      </label>
                      <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required
                        className="w-full px-4 py-3 text-sm text-charcoal bg-ivory border border-sand focus:border-accent focus:outline-none transition-colors duration-200"
                        placeholder="your@email.com" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-xs tracking-[0.15em] uppercase text-stone mb-2 font-medium">
                        Phone
                      </label>
                      <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange}
                        className="w-full px-4 py-3 text-sm text-charcoal bg-ivory border border-sand focus:border-accent focus:outline-none transition-colors duration-200"
                        placeholder="+880 [XXX] [XXXXXXX]" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-xs tracking-[0.15em] uppercase text-stone mb-2 font-medium">
                      Subject
                    </label>
                    <select id="subject" name="subject" value={formData.subject} onChange={handleChange} required
                      className="w-full px-4 py-3 text-sm text-charcoal bg-ivory border border-sand focus:border-accent focus:outline-none transition-colors duration-200 appearance-none">
                      <option value="">Select a subject</option>
                      <option value="business">Business Inquiry</option>
                      <option value="partnership">Partnership Opportunity</option>
                      <option value="general">General Inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-xs tracking-[0.15em] uppercase text-stone mb-2 font-medium">
                      Message
                    </label>
                    <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5}
                      className="w-full px-4 py-3 text-sm text-charcoal bg-ivory border border-sand focus:border-accent focus:outline-none transition-colors duration-200 resize-none"
                      placeholder="Your message..." />
                  </div>
                  <button type="submit" disabled={status === "loading"}
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 text-sm tracking-wider uppercase bg-ink text-white hover:bg-charcoal transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed">
                    {status === "loading" ? (
                      <>
                        <Loader2 size={14} className="mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={14} className="mr-2" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
