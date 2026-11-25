Tic Tac Toe

A full-stack Tic-Tac-Toe application where players can challenge friends, play against AI opponents, manage their accounts, track game statistics, and compete online in real time.

Features

Gameplay

- Player vs Player (local).
- Player vs AI with Easy, Medium, and Hard difficulties.
- Hard AI powered by the Minimax algorithm.
- Win and draw detection.
- Animated winning combinations.
- Responsive interface.

Accounts and authentication

- User registration and login.
- Email verification.
- Google authentication.
- JWT authentication using HTTP-only cookies.
- Remember Me functionality.
- Profile and avatar management.
- Email address changes with verification.
- Password changes.
- Account deletion.

Game history

- Authenticated game history stored in MongoDB.
- Game statistics, including wins, losses, and draws.
- Guest history stored in browser session storage.
- Account-specific game records.

Online multiplayer

- Real-time matchmaking.
- Synchronized moves using Socket.IO.
- Server-side move and turn validation.
- Win and draw synchronization.
- Rematches with swapped player symbols.
- Disconnection and reconnection handling.

Technology Stack

Frontend

- React
- Vite
- JavaScript
- Tailwind CSS v4
- React Router
- Axios
- Socket.IO Client
- React Toastify
- Lucide React
- TanStack React Table

Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Socket.IO
- Nodemailer
- Google OAuth
- Cloudinary

Project Structure

Tic-Tac-Toe/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── .env.example
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   ├── utils/
│   ├── .env.example
│   └── package.json
│
└── README.md

Getting Started

Prerequisites

Install the following before running the application:

- Node.js and npm.
- MongoDB database (local MongoDB or MongoDB Atlas).
- Git.

Some features also require configured Google OAuth, Cloudinary, and email credentials.

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

Create a ".env" file inside both the "frontend" and "server" directories.

Use the corresponding ".env.example" files as templates.

Backend — "server/.env"

PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
EMAIL_VERIFICATION_SECRET=your_verification_secret

EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
GOOGLE_CLIENT_ID=your_google_client_id

Frontend — "frontend/.env"

VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name

Replace the placeholder values with your actual credentials.

Never commit real ".env" files or expose private credentials in frontend variables. Only variables prefixed with "VITE_" are intended for frontend exposure.

4. Run the application

Start the backend in one terminal:

cd server
npm run dev

Start the frontend in another terminal:

cd frontend
npm run dev

Open the local frontend address printed by Vite, normally:

http://localhost:5173

The backend normally runs at:

http://localhost:5000

Available Scripts

Frontend

Command| Description
"npm run dev"| Start the Vite development server.
"npm run build"| Create the production frontend build.
"npm run preview"| Preview the production build locally.
"npm run lint"| Run ESLint checks.

Backend

Command| Description
"npm run dev"| Start the backend using Nodemon.
"node server.js"| Start the backend directly.

API Documentation

All backend endpoints are prefixed with "/api".

Health

Method| Endpoint| Description
GET| "/api/health"| Check backend health.

Authentication

Method| Endpoint| Description
POST| "/api/auth/register"| Register a user.
POST| "/api/auth/login"| Log in.
POST| "/api/auth/google"| Authenticate using Google.
POST| "/api/auth/logout"| Log out.
POST| "/api/auth/verify-email"| Verify registration email.
POST| "/api/auth/resend-verification-code"| Request another verification code.

User management

These endpoints require authentication.

Method| Endpoint| Description
GET| "/api/users/profile"| Retrieve the current user's profile.
PATCH| "/api/users/profile"| Update profile information.
POST| "/api/users/request-email-change"| Request an email address change.
POST| "/api/users/verify-email-change"| Verify a new email address.
POST| "/api/users/resend-email-change"| Resend an email change code.
GET| "/api/users/email-change-status"| Retrieve email change status.
POST| "/api/users/change-password"| Change account password.
DELETE| "/api/users/account"| Delete the account.

Game management

These endpoints require authentication.

Method| Endpoint| Description
POST| "/api/games"| Create a game record.
GET| "/api/games"| Retrieve the user's games.
GET| "/api/games/:id"| Retrieve a game by ID.
PATCH| "/api/games/:id"| Update a game.
DELETE| "/api/games/:id"| Delete a game.

Authentication is handled through HTTP-only cookies. Requests from the frontend must include credentials where required.

Socket.IO Events

Online multiplayer uses authenticated Socket.IO connections.

Client-to-server events

Event| Description
"find-match"| Join the matchmaking queue.
"make-move"| Submit a move.
"request-rematch"| Request a rematch.

Server-to-client events

Event| Description
"waiting-for-opponent"| Waiting for another player.
"match-found"| A match has been created.
"game-updated"| Game state has changed.
"waiting-for-rematch"| Waiting for the opponent's rematch decision.
"rematch-requested"| Opponent requested a rematch.
"rematch-started"| A new rematch has started.
"rematch-cancelled"| A pending rematch was cancelled.
"match-restored"| A disconnected player's game was restored.
"opponent-disconnected"| Opponent disconnected.
"opponent-reconnected"| Opponent reconnected.
"opponent-failed-to-reconnect"| Opponent did not reconnect in time.

Guest and Authenticated Gameplay

The application deliberately separates guest gameplay from authenticated gameplay.

Guest players

- Can play without registering or logging in.
- Play locally in the frontend.
- Do not save games to MongoDB.
- Do not call authenticated game-management endpoints.
- Have game history stored in "sessionStorage", scoped to the browser tab session.

Authenticated players

- Can access account features.
- Can save completed games to MongoDB.
- Have account-specific game history and statistics.
- Can participate in online multiplayer.

Security

The backend includes:

- Password hashing with bcrypt.
- JWT authentication.
- HTTP-only authentication cookies.
- Protected account and game routes.
- Game ownership checks.
- Request rate limiting.
- Email verification.
- Server-side validation of online multiplayer moves.

Deployment

Production deployment requires configuring:

- Frontend and backend hosting.
- Production MongoDB connection.
- Production environment variables.
- Google OAuth authorized origins and redirect settings, where applicable.
- Cloudinary configuration.
- Email delivery credentials.
- Frontend/backend CORS origins.
- Secure cookie settings.
- Socket.IO connectivity.

The application has been developed and tested locally. Production deployment and live-host verification are the remaining steps.

Contributing

Contributions, suggestions, and improvements are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Test your changes.
5. Submit a pull request.

License

A license has not yet been specified for this repository.

Author

Lidon Jacob

GitHub: "LidonJacob" (https://github.com/LidonJacob)