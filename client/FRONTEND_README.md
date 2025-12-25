# React Frontend - Authentication UI

A complete, production-ready React frontend with authentication built using React Hook Form, React Query, Axios, TypeScript, and React Router DOM v6.

## 🚀 Features

- ✅ **React Hook Form** - No uncontrolled inputs, proper form validation
- ✅ **React Query (TanStack Query)** - Efficient API state management
- ✅ **Axios** - HTTP client with interceptors
- ✅ **React Router DOM v6** - Client-side routing
- ✅ **TypeScript** - Full type safety
- ✅ **JWT Authentication** - Token-based auth with localStorage
- ✅ **Protected Routes** - Dashboard accessible only when authenticated
- ✅ **Clean Architecture** - Modular folder structure
- ✅ **Modern UI** - Beautiful, responsive design

## 📁 Project Structure

```
client/src/
├── api/
│   ├── axios.ts           # Axios instance with interceptors
│   └── auth.ts            # Auth API functions (register, login)
├── components/
│   ├── Input.tsx          # Reusable input component with validation
│   └── Button.tsx         # Reusable button component
├── hooks/
│   └── useAuth.ts         # Custom auth hook
├── pages/
│   ├── Home.tsx           # Landing page
│   ├── Register.tsx       # Registration form
│   ├── Login.tsx          # Login form
│   └── Dashboard.tsx      # Protected dashboard
├── router/
│   └── AppRouter.tsx      # Route configuration
├── App.tsx                # Main app component
├── App.css                # Application styles
└── main.tsx               # Entry point with React Query setup
```

## 📦 Dependencies

```json
{
  "react-hook-form": "^7.x",
  "@tanstack/react-query": "^5.x",
  "axios": "^1.x",
  "react-router-dom": "^6.x"
}
```

## 🛠️ Setup & Installation

### 1. Install Dependencies

```bash
cd client
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will run at: **http://localhost:5173**

## 🔗 API Integration

The frontend connects to Django REST API backend at:

- **Base URL:** `http://127.0.0.1:8000/api/`
- **Register:** `POST /register/`
- **Login:** `POST /login/`

### Axios Configuration

The axios instance automatically:

- Adds JWT token to all requests via interceptor
- Handles 401 errors (redirects to login)
- Sets proper headers

## 📄 Pages & Routes

| Route        | Component | Description             | Protected |
| ------------ | --------- | ----------------------- | --------- |
| `/`          | Home      | Landing page with links | No        |
| `/register`  | Register  | User registration form  | No        |
| `/login`     | Login     | User login form         | No        |
| `/dashboard` | Dashboard | Protected dashboard     | Yes       |

## 🔐 Authentication Flow

### Registration

1. User fills registration form (username, password)
2. React Hook Form validates inputs
3. React Query mutation sends data to backend
4. On success → redirect to login
5. On error → display error message

### Login

1. User fills login form (username, password)
2. React Hook Form validates inputs
3. React Query mutation sends credentials
4. On success → save tokens to localStorage → redirect to dashboard
5. On error → display error message

### Protected Route (Dashboard)

1. Component checks for token using `useAuth` hook
2. If no token → redirect to login
3. If token exists → render dashboard

### Logout

1. User clicks logout button
2. Tokens removed from localStorage
3. Redirect to login page

## 🎨 UI Components

### Input Component

```tsx
<Input
  label="Username"
  name="username"
  type="text"
  register={register}
  errors={errors}
  required
  placeholder="Enter username"
/>
```

**Features:**

- Integrated with React Hook Form
- Displays validation errors
- Type-safe props
- Accessible labels

### Button Component

```tsx
<Button type="submit" isLoading={mutation.isPending} variant="primary">
  Login
</Button>
```

**Features:**

- Loading state support
- Primary/secondary variants
- Disabled state handling

## 🔧 Custom Hooks

### useAuth Hook

```tsx
const { isLoggedIn, token, logout } = useAuth();
```

**Returns:**

- `isLoggedIn`: boolean - Authentication status
- `token`: string | null - Current access token
- `logout`: function - Logout and redirect to login

## 💾 Token Storage

Tokens are stored in `localStorage`:

- `access_token` - JWT access token
- `refresh_token` - JWT refresh token

## 🎯 React Query Configuration

```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

## 📝 Form Validation

All forms use React Hook Form with validation:

- **Required fields** - Username and password
- **Real-time validation** - Errors shown below inputs
- **Type-safe** - TypeScript interfaces for all forms

## 🎨 Styling

- **Modern gradient backgrounds**
- **Card-based layouts**
- **Smooth transitions and hover effects**
- **Fully responsive** - Mobile-friendly
- **No external UI libraries** - Custom CSS

## 🧪 Testing the Application

### 1. Start Backend

```bash
cd backend
source ../venv/bin/activate
python manage.py runserver
```

### 2. Start Frontend

```bash
cd client
npm run dev
```

### 3. Test Flow

1. Visit `http://localhost:5173`
2. Click "Register"
3. Create account (username: testuser, password: password123)
4. After success, click "Login"
5. Login with credentials
6. Should redirect to Dashboard
7. Click "Logout" to test logout

## 🔍 Code Quality

✅ **Full TypeScript** - No `any` types (except necessary places)  
✅ **React Hook Form** - No useState for form management  
✅ **React Query** - Proper mutation and query usage  
✅ **Clean Components** - Single responsibility principle  
✅ **Error Handling** - Comprehensive error states  
✅ **Comments** - Well-documented code  
✅ **No Linter Errors** - Clean, production-ready code

## 🐛 Troubleshooting

### CORS Errors

Ensure Django backend has CORS configured for `http://localhost:5173`

### 401 Unauthorized

- Check backend is running on port 8000
- Verify token is saved in localStorage
- Check network tab for request details

### Form Not Submitting

- Open browser console for errors
- Check React Query DevTools
- Verify backend endpoints are correct

## 📚 Learn More

- [React Hook Form Docs](https://react-hook-form.com/)
- [TanStack Query Docs](https://tanstack.com/query/latest)
- [Axios Docs](https://axios-http.com/)
- [React Router Docs](https://reactrouter.com/)

## ✅ Completed Features

- [x] React Hook Form integration
- [x] React Query setup
- [x] Axios configuration with interceptors
- [x] TypeScript types for all components
- [x] Registration page
- [x] Login page
- [x] Protected dashboard
- [x] Auth hook
- [x] Token management
- [x] Error handling
- [x] Success states
- [x] Clean UI design
- [x] Responsive layout
- [x] Router configuration

---

**🎉 Frontend is ready to use!**
