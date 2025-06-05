# Hack the Future — Project Overview

## 🚀 Overview

**Hack the Future** is a full-stack web platform for organizing, managing, and participating in hackathons across Bangladesh. It empowers users to create, discover, and join hackathons, manage their portfolios, connect with the developer community, and collaborate in real time.

---

## ✨ Key Functionalities

### 1. **Authentication & User Management**
- Secure signup, login, and JWT-based authentication.
- User roles: Participant, Organizer.
- Profile editing, avatar upload, and portfolio management.

### 2. **Social Features**
- **Follower & Follow Back System:** Users can follow each other and build their network.
- **Messaging:** One-to-one direct messaging between users.
- **Group Messaging:** Create and participate in group chats for teams or hackathons.

### 3. **Hackathon Discovery**
- Browse and search hackathons by name, theme, and status.
- Responsive, animated masonry grid for hackathon cards.
- Filter by themes (e.g., AI, Web, Health), status (upcoming, ongoing, ended), and more.

### 4. **Hackathon Creation & Management**
- Multi-step, modern form for organizers to create hackathons:
  - **Step 1:** Basic Info (title, organizer, banners, thumbnail)
  - **Step 2:** Description, Requirements, Judging Criteria (markdown)
  - **Step 3:** Team Rules (min/max size, solo participation)
  - **Step 4:** Timeline (registration/submission deadlines)
  - **Step 5:** Review & Submit (preview before publishing)
- Image upload for banners and thumbnails.
- Edit and update hackathon details with a sticky sidebar stepper.

### 5. **Manage Hackathons Dashboard**
- View all created hackathons in a responsive, paginated masonry grid.
- Filter and search hackathons by theme, status, and name.
- Mobile-friendly filter drawer and multi-select theme filtering.

### 6. **Participation, Projects & Portfolio**
- Join hackathons as a participant.
- Add and submit projects to hackathons.
- Showcase projects and achievements in a personal portfolio.
- View other users’ portfolios.

### 7. **Judging System**
- Hackathon submissions can be judged by assigned judges.
- Intuitive UI for judges to review, score, and provide feedback on submitted projects.

### 8. **Admin & Organizer Tools**
- Role management (upgrade to organizer).
- Manage hackathon submissions, teams, and judging.

### 9. **Real-time Notifications and Chat**
- Receive instant notifications for messages, team invites, and hackathon updates.
- Real-time chat for both direct and group messaging.

### 10. **Team Formation and Collaboration**
- Tools for forming teams, inviting members, and collaborating on projects.
- Group chat and shared resources for team coordination.

### 11. **Advanced Judging and Scoring**
- Flexible scoring modules for judges.
- Customizable judging criteria and transparent results.

### 12. **Analytics Dashboard for Organizers**
- Visual analytics and insights for hackathon organizers.
- Track participation, submissions, and engagement metrics.

---

## 🛠️ Tech Stack

- **Frontend:** React, shadcn/ui, TailwindCSS, Zustand (state), React Router
- **Backend:** Node.js, Express, Drizzle ORM, PostgreSQL
- **Authentication:** JWT
- **Other:** File/image upload, Markdown support, Responsive design

---

## 📱 Responsive Design

- Fully responsive layouts for desktop and mobile.
- Sticky sidebar navigation for desktop, collapsible drawer for mobile.
- Animated transitions and modern UI components.

---