# State Management with Zustand

This directory contains Zustand stores for state management in our application.

## Auth Store Usage

The `useAuthStore` provides a clean and centralized way to handle authentication state throughout the application without needing React Context.

### Importing the Auth Store

````jsx
import useAuthStore from '@/store/useAuthStore';
```ion Store with Zustand

This directory contains Zustand stores for state management in our application.

## Auth Store Usage

The `authStore` provides a clean and centralized way to handle authentication state throughout the application.

### Importing the Auth Store

```jsx
import useAuthStore from "@/store/authStore";
````

### Available State and Actions

```jsx
const {
  // Auth state
  user, // Current user data object or null
  accessToken, // JWT access token or null
  isAuthenticated, // Boolean indicating if user is authenticated
  isLoading, // Boolean for loading states during auth operations
  error, // Error message or null

  // Auth actions
  login, // Async function to log in (credentials) => Promise
  register, // Async function to register (userData) => Promise
  logout, // Async function to log out () => Promise
  setAuth, // Function to manually set auth state (userData, token) => void
  updateUser, // Function to update user properties (userData) => void
  clearError, // Function to clear error state () => void
} = useAuthStore();
```

### Examples

#### Login

```jsx
import useAuthStore from '@/store/authStore';
import { toast } from 'sonner';

function LoginForm() {
  const { login, error } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await login({
        email: 'user@example.com',
        password: 'password123'
      });
      toast.success(result.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    // Your login form JSX
  );
}
```

#### Using Auth Data

```jsx
import useAuthStore from "@/store/authStore";

function ProfileComponent() {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <p>Please log in to view your profile</p>;
  }

  return (
    <div>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
    </div>
  );
}
```

#### Logout

```jsx
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom";

function LogoutButton() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return <button onClick={handleLogout}>Log Out</button>;
}
```

## Best Practices

1. **Access Token Handling**: The store automatically applies the access token to API requests using axios interceptor.

2. **Persistence**: Authentication state persists across page refreshes using localStorage.

3. **Error Handling**: Always handle errors during authentication operations to provide user feedback.

4. **Protected Routes**: Use the `ProtectedRoute` component to restrict access to authenticated users.

5. **State Updates**: Never modify the auth state directly; always use the provided actions.
