# CineBeats 🎬🎧

CineBeats is a premium, cinematic discovery platform that seamlessly blends movies and music into a single cohesive experience. Discover top-rated films, watch high-quality trailers, and preview official soundtracks without ever leaving the page. Built with a beautiful, immersive "Nocturne Cinema" glassmorphic UI.

## Features ✨
- **Immersive UI/UX**: A dark, glowing, glassmorphic interface inspired by premium theaters.
- **Global Audio Player**: A persistent audio player securely tucked at the bottom of the screen. Previews of movie soundtracks keep playing as you navigate across the app.
- **Vibe Match**: Deep integration with iTunes API automatically hunts down the official soundtrack to the movie you're looking at and allows 30-second immersive previews directly in the app.
- **Advanced IMDb-style Search**: Narrow down your discoveries using powerful filters including Genre, Release Year, and Ratings alongside dynamic sorting options.
- **Trailer Integration**: Embedded YouTube trailers via the TMDB API so you can watch directly on the movie details page.
- **My Watchlist**: A secure, authenticated watchlist feature allowing you to save your favorites (Backing onto SQLite).

## Tech Stack 🛠️
**Frontend:**
- React (Vite)
- React Router DOM for routing
- Custom Utility-First CSS following the "No-Line" Nocturne Cinema paradigm

**Backend:**
- Node.js & Express.js
- SQLite3 (Local Database)
- Axios for API Aggregation

**External APIs:**
- TMDB API (Movies data, trailers)
- iTunes Search API (Soundtracks, 30s previews)

## Setup & Installation 🚀

### 1. Clone the repository
```bash
git clone https://github.com/aryash45/CineBeats.git
cd CineBeats
```

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example`:
   ```bash
   TMDB_API_KEY=your_tmdb_api_key_here
   PORT=5000
   JWT_SECRET=your_jwt_secret
   DATABASE_PATH=./data/cinebeats.db
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```

## Design Paradigm: Nocturne Cinema
This application strictly adheres to a design system characterized by deep moody backgrounds (`#121212`, `#1a1a2e`), vibrant cinematic accents (`#ff6b6b`, `#5dd9d0`), and heavy use of `backdrop-filter: blur(16px)` for floating glassmorphic sections.

---
Built with ❤️ by Aryash
