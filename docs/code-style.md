# Hack-the-Future Code Style Guide

You are a specialized code assistant for the **hack-the-future** hackathon platform. Follow these strict coding conventions:

## Frontend (React/Tailwind)

- Use **React 19 functional components** with hooks only
- Use **Tailwind CSS classes** exclusively - NO inline styles
- Use **ShadCN UI components** from `@/components/ui/`
- Use **Zustand** for state management with persistence when needed
- Use **Axios** for all HTTP requests via `axiosInstance`
- Use **react-router-dom** for navigation with `<Link>` components
- Use **class-variance-authority (cva)** for component variants
- Use **cn()** utility for class merging: `className={cn("base-classes", conditionalClasses)}`

### File Organization

```
client/src/
├── components/ui/     # ShadCN components
├── components/        # Custom components
├── store/            # Zustand stores
├── context/          # React contexts
├── page/             # Route components
├── lib/              # Utilities
└── hooks/            # Custom hooks
```

### Component Example

```jsx
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/authStore";

export default function MyComponent({ className, variant = "default" }) {
  const { user, isAuthenticated } = useAuthStore();

  return (
    <div className={cn("flex items-center space-x-4", className)}>
      <Button variant={variant}>
        {isAuthenticated ? `Hello ${user.firstName}` : "Sign In"}
      </Button>
    </div>
  );
}
```

## Backend (Express/Drizzle)

- Use **ES modules** (`import/export`) syntax
- Use **asyncHandler** wrapper for all controller functions
- Use **ApiResponse** class for consistent responses
- Use **Drizzle ORM** for all database operations
- Use **Zod** for input validation with custom middleware
- Use **JWT** for authentication with middleware protection
- Use **bcryptjs** for password hashing

### File Organization

```
server/src/
├── controller/       # Request handlers
├── middleware/       # Custom middleware
├── route/           # Express routes
├── db/schema/       # Drizzle schemas
├── utils/           # Helper functions
├── config/          # Configuration
└── validation/      # Zod schemas
```

### Controller Example

```javascript
import { asyncHandler } from "../utils/async-handler.js";
import { ApiResponse } from "../utils/api-response.js";
import { db } from "../db/db.config.js";
import { usersTable } from "../db/schema/users.js";

const getUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await db.select().from(usersTable).where(eq(usersTable.id, id));

  res.status(200).json(new ApiResponse(200, user, "User fetched successfully"));
});

export { getUser };
```

## General Rules

- Use **async/await** for all async operations
- Use **descriptive variable names** in camelCase
- Use **PascalCase** for React components
- Use **kebab-case** for file names
- Always handle errors appropriately
- Use environment variables for configuration
- Implement proper TypeScript-like JSDoc comments
- Follow the MVP roadmap priorities (auth → hackathon management → judging → teams → operations)

When writing code, always:

1. Import necessary dependencies first
2. Use existing utilities and components
3. Follow the established patterns in the codebase
4. Ensure responsive design with Tailwind
5. Handle loading and error states
6. Validate inputs on both frontend and backend
