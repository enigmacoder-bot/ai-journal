# AI-Powered Journal Chat App

An intelligent journaling application that provides empathetic AI responses, mood analysis, and insightful summaries to help users reflect and grow. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and powered by Google's Gemini API.

## Preview 

- **Sign Up:**
![image](https://github.com/user-attachments/assets/71da0cd1-f8b7-40b8-9352-e8bcc9a98005)


- **Login:**
![image](https://github.com/user-attachments/assets/aae88fc7-ffa8-40d2-9548-fbd4e22a23ab)


- **Chat Page:**
![image](https://github.com/user-attachments/assets/2a6edf5a-2e9e-4b58-a0ab-5376428e8a97)




## Features

- **Secure User Authentication:**
  - JWT-based signup and login system to protect user data.
  - Password hashing for secure credential storage.
- **Intuitive Chat Interface:**
  - Responsive, two-column layout mimicking a modern messaging app.
  - Real-time message display for user entries and AI replies.
  - Mobile-friendly design with a toggleable sidebar.
  - Custom SVG avatars for user and AI.
  - Visual typing indicator while AI is generating a response.
- **AI-Powered Journaling Companion (via Google Gemini API):**
  - **Empathetic Responses:** Receives supportive and constructive replies to daily journal entries.
  - **Conversational Prompts (Quick Actions):**
    - "Summarize my day": Get a concise AI-generated review of the day's entries.
    - "Give me motivation for tomorrow": Receive an uplifting and forward-looking message.
    - "What can I improve this week?": Obtain constructive feedback and suggestions.
  - **Daily Mood Tagging:**
    - Automatic sentiment analysis of user entries to tag moods (e.g., happy, sad, stressed, tired, neutral, excited).
    - Moods are stored with daily entries, enabling future mood tracking features.
- **Journal History & Insights:**
  - All chat history (user entries and AI responses) is stored per user in MongoDB.
  - Messages are grouped and displayed by date.
  - Sidebar displays a history of journal entries with corresponding mood badges for a quick emotional overview.

## Tech Stack

**Frontend (Client - `vite-project` directory):**

- **Framework:** React.js (with Vite)
- **UI Components:** DaisyUI & Tailwind CSS
- **Routing:** React Router DOM
- **State Management:** React Hooks (useState, useEffect, useRef)
- **Icons:** Lucide React (example, specify if changed), Custom SVGs

**Backend (Server - `server` directory):**

- **Framework:** Node.js with Express.js
- **Database:** MongoDB (with Mongoose ODM)
- **AI Integration:** Google Gemini API (`@google/generative-ai` SDK)
- **Authentication:** JSON Web Tokens (JWT) (`jsonwebtoken`, `bcryptjs`)
- **Environment Management:** `dotenv`
- **CORS Handling:** `cors`

**Development Tools:**

- Nodemon (for server auto-restart)
- ESLint (for code linting in client)

## Project Structure

```
ai-journal/
├── vite-project/      # React Frontend (Client)
│   ├── public/
│   │   ├── assets/      # SVGs, static images
│   │   ├── components/  # Reusable UI (JournalChat, etc.)
│   │   ├── pages/       # Top-level views (Login, Signup)
│   │   ├── services/    # API service utility
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── ...
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example   # Client-side environment variables template
│
├── server/            # Node.js/Express Backend
│   ├── config/        # Database connection (db.js)
│   ├── controllers/   # Request handlers (authController, chatController)
│   ├── middleware/    # Express middleware (authMiddleware)
│   ├── models/        # MongoDB schemas (User, Entry)
│   ├── routes/        # API route definitions (authRoutes, chatRoutes)
│   ├── services/      # Gemini API integration (geminiService)
│   ├── server.js      # Main server entry point
│   ├── package.json
│   └── .env.example   # Server-side environment variables template
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v16.x or later recommended)
- npm (or yarn)
- MongoDB instance (local or cloud-hosted like MongoDB Atlas)
- Google Gemini API Key (from Google AI Studio or Google Cloud Console)

### Setup & Installation

1.  **Clone the repository (or repositories if they are separate):**

    ```bash
    git clone <your-repo-url>
    cd ai-journal
    ```

2.  **Setup Backend (`server` directory):**

    - Navigate to the server directory:
      ```bash
      cd server
      ```
    - Install dependencies:
      ```bash
      npm install
      ```
    - Create a `.env` file by copying `.env.example` (if you provide one) or create it manually. Populate it with your credentials:
      ```env
      PORT=5001
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_very_strong_jwt_secret_key
      GEMINI_API_KEY=your_google_gemini_api_key
      ```

3.  **Setup Frontend (`vite-project` directory):**
    - Navigate to the client directory:
      ```bash
      cd ../vite-project
      # Or from root: cd vite-project
      ```
    - Install dependencies:
      ```bash
      npm install
      ```
    - Create a `.env` file (if needed, e.g., for `VITE_API_BASE_URL`). If your `apiService.js` defaults to `http://localhost:5001/api`, this might not be strictly necessary for local development but is good practice.
      ```env
      VITE_API_BASE_URL=http://localhost:5001/api
      ```

### Running the Application

1.  **Start the Backend Server:**

    - In the `server` directory:
      ```bash
      npm run dev
      # Or for production: npm start
      ```
    - The server should start on the port specified in your `.env` (default: 5001).

2.  **Start the Frontend Development Server:**
    - In the `vite-project` directory:
      ```bash
      npm run dev
      ```
    - The React app will typically open in your browser at `http://localhost:5173` (or another port if 5173 is busy).

## API Endpoints (Brief Overview)

- **Auth:**
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `GET /api/auth/me` (Protected)
- **Chat:**
  - `POST /api/chat/message` (Protected)
  - `GET /api/chat/date/:date` (Protected)
  - `GET /api/chat/history` (Protected)
  - `POST /api/chat/command` (Protected)

## Future Enhancements / Stretch Goals from Original Plan

- **End-of-Day Reflection (Automatic):** Implement a server-side scheduler (e.g., `node-cron`) to automatically generate and store daily reflection summaries.
- **Daily Mood Dashboard:** Create a visual dashboard to track mood trends over time.
- **In-app Notifications/Reminders:** For journaling or new AI insights.
- **Dark Mode:** A full dark theme for the application (Tailwind CSS and DaisyUI have good support for this).
- **Advanced AI Context:** Provide more historical context to AI for even more personalized motivation or improvement suggestions.
- **Top Themes of the Day (AI):** Enhance history/summaries by having Gemini identify and list key themes from daily entries.


## License

Distributed under the [MIT License](LICENSE.txt). See `LICENSE.txt` for more information.

## Acknowledgements

- Google Gemini API
- DaisyUI
- Tailwind CSS

---

