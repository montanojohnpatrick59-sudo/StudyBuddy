# StudyBuddy — Interactive Front-End Project

## Included features
- Responsive dashboard and sidebar navigation
- Discover groups with search and subject filtering
- Create study groups; join or leave groups
- Schedule study sessions; mark attendance or delete sessions
- Discussion board: create posts and like posts
- Edit student profile
- Privacy notice and reset-demo-data option
- Local browser persistence with `localStorage`

## Run in VS Code
1. Extract the ZIP.
2. Open the `StudyBuddy` folder in VS Code.
3. Install the **Live Server** extension (recommended).
4. Right-click `index.html` → **Open with Live Server**.

No npm packages are needed for this front-end demo. An internet connection is used for the font and icon CDN resources.

## Important limitation
This is a functional front-end prototype, not a production multi-user service. Data is stored only in the current browser profile. There is no secure login, shared database, real-time syncing, or server-side authorization.

For a real public release, connect a backend such as Supabase, configure authentication and Row Level Security, create database tables for profiles/groups/memberships/sessions/discussions, test access permissions, and update the privacy notice to match the deployed product. Never put a Supabase `service_role` key in browser JavaScript.
