# DevRank UZ Frontend 3.0

React + Monaco + Tailwind frontend for the real DevRank UZ backend.

## Run
1. `npm install`
2. Copy `.env.example` to `.env` if your API is not `http://localhost:5000`.
3. `npm start`

## Real features wired to backend
- real register/login
- persistent JWT session in local storage
- real PostgreSQL profile data
- live SSE leaderboard
- Web / AI / Cyber Security / UI-UX challenge catalog
- quiz + code challenge UI
- JavaScript / TypeScript / Python / C++ / C# editor selection
- terminal-style test results
- Gemini feedback returned by backend when configured
- real projects with purpose/problem/description/links and up to 5 images
- profile edit + skills
- IT news, events, notifications

This UI intentionally contains no fake developer leaderboard fallback. Empty database states show an empty-state message instead.
