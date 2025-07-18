# AI Writing Assistant

A modern, full-stack AI-powered writing platform with user authentication, content management, and a rich text editor built with Next.js, FastAPI, and TipTap.

---

## Features

- **Google & JWT Authentication** (FastAPI backend, Next.js frontend)
- **Rich Text Editor** (TipTap with custom extensions, image upload, formatting, etc.)
- **AI Content Generation** (Gemini Writer integration)
- **User Dashboard** (View, create, edit, and delete documents)
- **Responsive UI** (Tailwind CSS, mobile-friendly)
- **Protected Routes** (Frontend and backend)
- **SEO-Ready** (Meta tags, favicon, semantic HTML)

---

## Tech Stack

### Frontend

- **Next.js 13+ (App Router)**
- **React 19**
- **TypeScript**
- **TipTap Editor**
- **Tailwind CSS**
- **Sonner** (toasts/notifications)
- **Lucide Icons**
- **Axios** (API calls)
- **React Query** (data fetching/caching)

### Backend

- **FastAPI**
- **SQLModel** (ORM)
- **JWT & Google OAuth**
- **Rate Limiting** (core/limiter.py)
- **Gemini Writer** (AI content generation)
- **PostgreSQL** (default)

---

## Project Structure

```
AI-Writing-Assistant/
  ├── Frontend/
  │   ├── app/
  │   │   ├── (auth)/auth/
  │   │   ├── (content)/dashboard/
  │   │   │   ├── editor/[id]/page.tsx
  │   │   │   ├── editor/page.tsx
  │   │   │   └── page.tsx
  │   │   ├── favicon.svg
  │   │   ├── layout.tsx
  │   │   └── page.tsx
  │   ├── components/
  │   ├── hooks/
  │   ├── lib/
  │   ├── styles/
  │   ├── public/
  │   ├── package.json
  │   └── tsconfig.json
  ├── Backend/
  │   ├── auth/
  │   ├── config/
  │   ├── core/
  │   ├── models/
  │   ├── routes/
  │   ├── utils/
  │   ├── main.py
  │   ├── pyproject.toml
  │   └── README.md
  └── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- (Optional) Google OAuth credentials

### 1. **Backend Setup**

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install poetry
poetry install
uvicorn main:app --reload
```

- Configure your `.env` for PostgreSQL and Google credentials as needed.

### 2. **Frontend Setup**

```bash
cd Frontend
npm install
npm run dev
```

- The app will be available at [http://localhost:3000](http://localhost:3000)

---

## Usage

- **Sign up or log in** (Google or email)
- **Create, edit, and delete documents** from your dashboard
- **Use the AI assistant** to generate content
- **Edit with rich formatting** (headings, lists, images, etc.)
- **All content is private to your account**

---

## Customization

- **Favicon:** Place your `favicon.svg` in `Frontend/app/`
- **SEO:** Edit `Frontend/app/layout.tsx` for meta tags and favicon
- **Styling:** Customize Tailwind config and global styles

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

MIT
