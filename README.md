# Sani Ul — Personal Business Website

A premium personal business website with a custom CMS admin panel for Sani Ul.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** MongoDB
- **Image Storage:** Cloudinary
- **Email:** Resend
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Auth:** JWT (jose) + bcryptjs

## Required

- Node.js 18+ (recommended: 20+)
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)
- Resend account (for contact form emails)

## Installation

```bash
git clone <repository-url>
cd sani-ul-website
npm install
```

## Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in the values in `.env.local`:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `RESEND_API_KEY` | Resend API key |
| `ADMIN_EMAIL` | Admin login email |
| `ADMIN_PASSWORD_HASH` | Bcrypt hash of admin password |
| `NEXT_PUBLIC_SITE_URL` | Site URL (e.g., https://saniul.com) |
| `JWT_SECRET` | Secret key for JWT tokens |

## MongoDB Setup

### Local

Install MongoDB and start it, then use:

```
MONGODB_URI=mongodb://localhost:27017/sani-ul-website
```

### MongoDB Atlas (Recommended)

1. Create a free account at [mongodb.com](https://mongodb.com)
2. Create a cluster
3. Create a database user
4. Get the connection string
5. Set `MONGODB_URI` in `.env.local`

## Cloudinary Setup

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret from the dashboard
3. Set the values in `.env.local`

## Resend Setup (Email)

1. Create an account at [resend.com](https://resend.com)
2. Get your API key
3. Set `RESEND_API_KEY` in `.env.local`
4. For production, verify your domain

## Admin Setup

### Generate Password Hash

Run this command to generate a bcrypt hash of your password:

```bash
node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('your-password', 12).then(h => console.log(h))"
```

Set the output as `ADMIN_PASSWORD_HASH` in `.env.local`.

### Seed the Database

After setting up MongoDB and your environment variables, seed the database:

```bash
# Option 1: Visit /api/admin/seed in your browser after starting the dev server
# Option 2: Use the MongoDB shell to insert initial data
```

The database will also auto-seed default content on first load if empty.

## Local Development

```bash
npm run dev
```

Visit:
- Website: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin)

## Production Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Set environment variables
4. Deploy

### Other Platforms

```bash
npm run build
npm start
```

## How to Use the Admin Panel

### Login

1. Go to `/admin`
2. Enter your email and password
3. Click "Sign In"

### Edit Homepage

Dashboard → Homepage → Edit sections → Save Changes

### Add a Business

Dashboard → Businesses → Add Business → Fill form → Save

### Upload Gallery Images

Dashboard → Gallery → Upload → Select image → Edit title/caption → Save

### Write a Blog Post

Dashboard → Blog → New Post → Write content → Save Draft / Publish

### Read Contact Messages

Dashboard → Messages → Click message to read

### Update Contact Information

Dashboard → Settings → Contact Info → Edit → Save

### Update SEO Settings

Dashboard → Settings → SEO → Edit → Save

## Project Structure

```
src/
├── app/
│   ├── (public pages)/
│   ├── admin/           # Admin dashboard
│   └── api/             # API routes
├── components/
│   ├── admin/           # Admin UI components
│   ├── home/            # Homepage sections
│   ├── about/           # About page
│   ├── businesses/      # Businesses page
│   ├── experience/      # Experience page
│   ├── gallery/         # Gallery page
│   ├── blog/            # Blog page
│   ├── contact/         # Contact page
│   ├── layout/          # Navbar, Footer
│   └── ui/              # Reusable UI components
├── data/                # Static fallback data
├── hooks/               # Custom React hooks
├── lib/                 # Utilities (MongoDB, auth, etc.)
└── types/               # TypeScript types
```

## Security

- Admin routes are protected with JWT authentication
- API routes verify authentication server-side
- Passwords are stored as bcrypt hashes
- API secrets are never exposed to the client
- Contact form has rate limiting and input validation
- Images are uploaded to Cloudinary (not stored in MongoDB)

## License

Private — Sani Ul
