# Pinterest Clone

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📋 Features
- ✅ User Registration (email/password + image upload)
- ✅ Social Login (Google, GitHub via NextAuth)
- ✅ MongoDB + Mongoose
- ✅ Cloudinary image storage
- ✅ TailwindCSS + Next.js 16 App Router

## 🔧 Environment Variables (`.env.local`)
```
MONGODB_URI=mongodb+srv://...  # Your MongoDB connection
CLOUDINARY_NAME=drglb999w
CLOUDINARY_API_KEY=737464546527541
CLOUDINARY_API_SECRET=L3-jxOEzaGget-48CpkKq4vUGyA
GOOGLE_CLIENT_ID=560655492096-...
GOOGLE_CLIENT_SECRET=GOCSPX-...
GITHUB_CLIENT_ID=Ov23lixFW...
GITHUB_CLIENT_SECRET=47081aece...
NEXTAUTH_SECRET=vVlIEr/XOo...
NEXTAUTH_URL=http://localhost:3000
```

## 🐛 Recent Fixes
- **Registration 500 Error**: Fixed Cloudinary config (env vars now load properly)
- Image upload → Cloudinary → MongoDB user creation now works end-to-end

## 📂 Project Structure
```
pinterest/
├── app/
│   ├── register/page.jsx      # Registration form
│   ├── api/auth/register/     # API route (fixed)
│   └── api/auth/[...nextauth]/ # OAuth
├── libs/
│   ├── cloudinary.js         # Image upload (fixed)
│   └── mongodb.js            # DB connection
├── models/
│   └── userModel.js          # User schema
└── public/                   # Static assets
```

## 🧪 Testing Registration
1. `npm run dev`
2. Go to `/register`
3. Fill form + upload avatar
4. Submit → Redirects to `/signIn`

**Status:** Production-ready. No known issues.

Happy pinning! 🎨
