# Hack-the-Future: Code Conventions & MVP Roadmap

## Code Conventions

- Use React.js (with functional components) and Tailwind CSS for all UI.
- Use Zustand for state management in the frontend.
- Use Express.js for backend APIs, with modular route/controller/middleware structure.
- Use Drizzle ORM for all database access (PostgreSQL).
- Use JWT for authentication; protect sensitive routes with middleware.
- Use Axios for all HTTP requests from the frontend.
- Use react-router-dom for navigation.
- Use ShadCN UI components and avoid inline styles; always use Tailwind classes.
- Validate all API inputs with Zod schemas and custom middleware.
- Use utility functions (e.g., `cn` for class merging) for consistent styling.
- Use environment variables for config (validated with Zod on the backend).
- Use clear, consistent naming for files, variables, and functions.
- Organize code in layered structure: `components/ui`, `features/`, `routes/`, `lib/`, `store/`, etc.
- Use async/await for all asynchronous operations.
- Handle errors with centralized error middleware and custom error/response classes.
- Use ESLint and Prettier for code formatting and linting.

---

## mvp-1: Authentication & User Profiles

- [ ] JWT-based registration, login, and protected routes
- [ ] Public participant profiles (username, bio, hackathon history)
- [ ] Private organizer dashboard (list/manage created hackathons)
- [ ] Judge dashboard (activity history, response time tracking)

## mvp-2: Hackathon Management

- [ ] CRUD for hackathons (title, description, schedule, tags, location, accessibility)
- [ ] Sponsor management (logos, links)
- [ ] Prize system (up to 15 prizes, types, values, descriptions)
- [ ] Judge invitation and management (with 48h response logic)
- [ ] Submission window logic (edit only during Draft/Registration Open)

## mvp-3: Project Submission & Judging

- [ ] Project submission with version control and team collaboration
- [ ] Judging system (criteria defined by organizer, scoring/comments, deadline enforcement)
- [ ] Leaderboard (hidden until hackathon completed, average judge scores, prize display)

## mvp-4: Team Formation & Collaboration

- [ ] AI-powered team matching (skill/interest-based)
- [ ] Real-time chat and file sharing for teams
- [ ] Team stats and compatibility metrics

## mvp-5: Platform Operations & Security

- [ ] Rate limiting and CORS configuration
- [ ] Centralized logging (Winston)
- [ ] API documentation (Swagger/OpenAPI)
- [ ] Secure file uploads (AWS S3)
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Monitoring & analytics (New Relic/Datadog)

---
