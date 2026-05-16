# ChatterAI

ChatterAI is a full-stack AI chat application with user authentication, persistent conversations, and optional image uploads for multimodal prompts.

The repository is split into two apps:

- `Backend/` - Express, MongoDB, JWT auth, file upload handling, and Groq-compatible model calls
- `Frontend/` - Vite + React client with protected chat routes and cookie-based session support

## Features

- Email/password signup and login
- Cookie-based authentication with protected chat routes
- Multiple saved chat threads per user
- Model selection from the configured AI options in the UI
- Text and image message support
- Persistent message history stored in MongoDB
- Rate limiting and basic production security middleware on the API

## Requirements

- Node.js 18 or newer
- npm 9 or newer
- MongoDB database connection string
- Groq API key or another OpenAI-compatible key configured for the backend
- A deployed frontend URL for production CORS and cookies

## Project Structure

```text
ChatterAI/
├── Backend/
│   ├── app.js
│   ├── ai/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── util/
└── Frontend/
    ├── src/
    ├── public/
    ├── vite.config.js
    └── vercel.json
```

## Environment Variables

Create a `.env` file in `Backend/` with these values:

| Variable | Required | Description |
| --- | --- | --- |
| `MONGODB_URL` | Yes | MongoDB connection string |
| `JWT_SECRET` | Yes | Secret used to sign and verify auth tokens |
| `GROQ_API_KEY` | Recommended | API key for the AI provider |
| `API_KEY` | Optional | Fallback key name if `GROQ_API_KEY` is not set |
| `GROQ_BASE_URL` | Optional | Custom OpenAI-compatible base URL, defaults to Groq |
| `FRONTEND_URL` | Yes in production | Frontend origin used for CORS |
| `PORT` | No | Backend port, defaults to `5000` |
| `NODE_ENV` | No | Controls production vs development behavior |

Create a `.env` file in `Frontend/` if you want to override the API base URL:

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_BASE_URL` | No | Backend origin used by the React app |

If `VITE_API_BASE_URL` is not set, the frontend falls back to `http://localhost:5000` on localhost and `https://chatterai-backend.onrender.com` in production-like browser contexts.

## Local Setup

### 1. Install dependencies

Install the backend and frontend dependencies separately:

```bash
cd Backend
npm install

cd ../Frontend
npm install
```

### 2. Configure the backend

Create `Backend/.env`:

```env
MONGODB_URL=your-mongodb-connection-string
JWT_SECRET=your-long-random-secret
GROQ_API_KEY=your-groq-api-key
FRONTEND_URL=http://localhost:5173
PORT=5000
NODE_ENV=development
```

If you use a different AI gateway, set `GROQ_BASE_URL` and `API_KEY` accordingly.

### 3. Configure the frontend

Create `Frontend/.env` only if you want to override the API URL:

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 4. Start the development servers

Run both apps in separate terminals:

```bash
cd Backend
npm start
```

```bash
cd Frontend
npm run dev
```

The frontend is available at the Vite dev server, usually `http://localhost:5173`, and the backend listens on `http://localhost:5000` unless you change `PORT`.

## Production Build

### Frontend

Build the React app:

```bash
cd Frontend
npm run build
```

### Backend

Start the API with production environment variables set:

```bash
cd Backend
NODE_ENV=production npm start
```

The backend enables production middleware such as `helmet`, `morgan` in combined mode, and CORS restricted to `FRONTEND_URL`.

## API Overview

All routes are prefixed with `/api`.

### Auth routes

- `POST /api/user/signup` - Create a new account
- `POST /api/user/login` - Log in and set the session cookie
- `GET /api/user/logout` - Clear the session cookie
- `GET /api/user/check` - Check whether the current request is authenticated

### Chat routes

- `GET /api/chat/` - List the current user’s chat threads
- `POST /api/chat/new` - Create a new thread
- `GET /api/chat/:threadId` - Load a single thread and its messages
- `POST /api/chat/:threadId/message` - Send a message with optional image upload
- `DELETE /api/chat/:threadId` - Delete a thread

### Upload behavior

- Uploaded chat images are stored temporarily in `Backend/uploads/`
- Allowed formats: JPG, PNG, WEBP, and GIF
- Maximum image size: 10 MB
- Uploaded files are removed after the message request finishes

## Deployment Notes

- The frontend expects the backend to allow credentials from `FRONTEND_URL`
- Auth cookies are configured with `sameSite: "none"` and `secure: true`, so production deployments must use HTTPS
- If you deploy the frontend separately, set `VITE_API_BASE_URL` to the live backend URL
- If you host the backend on a platform that uses health checks, make sure the service has a valid root or health endpoint configured
- The frontend includes a Vercel rewrite so client-side routes continue working after refresh

## Troubleshooting

- If login or signup fails in production, verify `FRONTEND_URL`, HTTPS, and cookie settings first
- If chat requests return `401`, confirm the browser accepted the auth cookie and the frontend is using the correct API origin
- If AI calls fail, check `GROQ_API_KEY`, `GROQ_BASE_URL`, and the selected model name
- If file uploads fail, confirm the image is under 10 MB and uses a supported MIME type

## License

No license has been specified in the repository.