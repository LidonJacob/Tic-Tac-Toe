Tic-Tac-Toe

A full-stack Tic-Tac-Toe application featuring intelligent AI opponents, real-time online multiplayer, user accounts, and game statistics.

Features

- Multiple game modes — Play locally against another player or challenge AI opponents.
- AI difficulty levels — Easy, Medium, and Hard, with Hard powered by the Minimax algorithm.
- Online multiplayer — Real-time matchmaking, synchronized gameplay, and rematches.
- User accounts — Registration, email verification, Google authentication, and profile management.
- Game history — Track completed games, wins, losses, and draws.
- Guest mode — Play without creating an account.
- Responsive design — Play across different screen sizes.

Tech Stack

Frontend: React, Vite, JavaScript, Tailwind CSS v4, React Router, Axios, Lucide React.

Backend: Node.js, Express.js, MongoDB, Mongoose, Socket.IO, JWT, Cloudinary, Nodemailer.

Authentication: JWT, Google OAuth, HTTP-only cookies.

Additional tools include Nodemailer, Google OAuth, and React Toastify.

Getting Started

Prerequisites

- Node.js and npm
- MongoDB or a MongoDB Atlas database
- Git

1. Clone the repository

git clone https://github.com/LidonJacob/Tic-Tac-Toe.git
cd Tic-Tac-Toe

2. Install dependencies

Install frontend dependencies:

cd frontend
npm install

Install backend dependencies:

cd ../server
npm install

3. Configure environment variables

Create ".env" files in both the "frontend" and "server" directories using the provided ".env.example" files as references.

Add your own credentials and configuration values before starting the application.

Note: Keep your actual ".env" files private.

4. Run the application

Start the backend:

cd server
npm run dev

In a separate terminal, start the frontend:

cd frontend
npm run dev

Open the local URL provided by Vite, usually:

http://localhost:5173

Project Structure

Tic-Tac-Toe/
├── frontend/
│ ├── public/
│ └── src/
│
├── server/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── socket/
│ └── utils/
│
└── README.md

Gameplay and Data

- Guests can play without authentication. Their game history is stored in browser session storage.
- Authenticated users can save games and access their personal statistics.
- Online multiplayer uses authenticated Socket.IO connections.
- Game records are protected by account ownership checks.

Security

The application includes password hashing, JWT authentication with HTTP-only cookies, protected routes, request rate limiting, email verification, and server-side game validation.

Author

Lidon Jacob

"GitHub Profile" (https://github.com/LidonJacob)

"Project Repository" (https://github.com/LidonJacob/Tic-Tac-Toe)
