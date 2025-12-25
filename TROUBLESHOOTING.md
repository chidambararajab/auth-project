# Troubleshooting Guide - Registration Error Fix

## Issue: "Registration failed. Please try again."

### Root Cause

The error was caused by CSRF token validation and incomplete CORS configuration between the React frontend (localhost:5173) and Django backend (127.0.0.1:8000).

### What Was Fixed

#### 1. CORS Headers Configuration

**File:** `backend/backend/settings.py`

Added explicit CORS headers to allow all necessary request headers:

```python
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
```

#### 2. CSRF Exemption for API Endpoints

**File:** `backend/accounts/views.py`

Added `@csrf_exempt` decorator to both register and login views:

```python
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    # ... registration logic
```

**Why This Is Safe:**

- JWT tokens provide authentication (not session cookies)
- CORS is properly configured to only allow localhost:5173
- This is standard practice for REST APIs with token-based auth

#### 3. Enhanced Error Logging

**File:** `client/src/pages/Register.tsx`

Added detailed console logging to help debug future issues:

```typescript
onError: (error: any) => {
  console.error("Registration error:", error);
  console.error("Error response:", error.response);
  console.error("Error data:", error.response?.data);

  // Better error message extraction
  let errorMessage = "Registration failed. Please try again.";

  if (error.response?.data) {
    if (error.response.data.username) {
      errorMessage = Array.isArray(error.response.data.username)
        ? error.response.data.username[0]
        : error.response.data.username;
    } else if (error.response.data.password) {
      errorMessage = Array.isArray(error.response.data.password)
        ? error.response.data.password[0]
        : error.response.data.password;
    } else if (error.response.data.error) {
      errorMessage = error.response.data.error;
    } else if (error.response.data.detail) {
      errorMessage = error.response.data.detail;
    }
  } else if (error.message) {
    errorMessage = `Network error: ${error.message}`;
  }

  alert(errorMessage);
};
```

---

## How to Test the Fix

### 1. Ensure Both Servers Are Running

**Terminal 1 - Backend:**

```bash
cd backend
source ../venv/bin/activate
python manage.py runserver
```

**Terminal 2 - Frontend:**

```bash
cd client
npm run dev
```

### 2. Test Registration

1. Open browser: `http://localhost:5173`
2. Click "Register"
3. Enter:
   - Username: `testuser`
   - Password: `password123` (min 8 characters)
4. Click "Register"
5. Should see: "Registration successful! Please login."

### 3. Test Login

1. Click "Login"
2. Enter same credentials
3. Should redirect to Dashboard
4. Should see: "You are logged in successfully!"

### 4. Check Browser Console

Open DevTools (F12) → Console tab:

- Should see no errors
- If errors appear, they will now be logged with full details

### 5. Check Backend Logs

In Terminal 1 (backend), you should see:

```
[25/Dec/2025 XX:XX:XX] "OPTIONS /api/register/ HTTP/1.1" 200 0
[25/Dec/2025 XX:XX:XX] "POST /api/register/ HTTP/1.1" 201 42
```

**Status Codes:**

- `200` - OPTIONS request (CORS preflight) succeeded
- `201` - Registration successful
- `400` - Validation error (check console for details)
- `500` - Server error (check backend terminal)

---

## Common Issues & Solutions

### Issue 1: CORS Error in Browser Console

**Error:**

```
Access to XMLHttpRequest at 'http://127.0.0.1:8000/api/register/'
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Solution:**

1. Check `backend/backend/settings.py`:
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://localhost:5173",
   ]
   ```
2. Ensure `corsheaders` is in INSTALLED_APPS
3. Ensure `corsheaders.middleware.CorsMiddleware` is in MIDDLEWARE (before CommonMiddleware)
4. Restart Django server

### Issue 2: 400 Bad Request

**Error:** Backend returns 400, frontend shows generic error

**Solution:**

1. Open browser DevTools → Network tab
2. Click on the failed request
3. Check "Response" tab for actual error
4. Common causes:
   - Missing username or password
   - Password too short (min 8 characters)
   - Username already exists

**Check with curl:**

```bash
curl -X POST http://127.0.0.1:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

### Issue 3: 403 Forbidden (CSRF)

**Error:** `CSRF Failed: CSRF token missing or incorrect`

**Solution:**
Already fixed with `@csrf_exempt` decorator. If still occurring:

1. Verify views.py has `@csrf_exempt` decorator
2. Restart Django server
3. Clear browser cache

### Issue 4: Network Error

**Error:** `Network error: Network Error`

**Causes:**

1. Backend not running
2. Backend on wrong port
3. Firewall blocking connection

**Solution:**

1. Check backend is running: `http://127.0.0.1:8000/admin/`
2. Check axios baseURL in `client/src/api/axios.ts`:
   ```typescript
   baseURL: "http://127.0.0.1:8000/api/",
   ```
3. Try `http://localhost:8000/api/` if 127.0.0.1 doesn't work

### Issue 5: Username Already Exists

**Error:** `Username already exists.`

**Solution:**

1. Use a different username
2. Or delete the user from Django admin:
   - Go to `http://127.0.0.1:8000/admin/`
   - Create superuser if needed: `python manage.py createsuperuser`
   - Login and delete the user

---

## Debugging Checklist

When registration fails, check these in order:

- [ ] Backend server is running (Terminal 1)
- [ ] Frontend server is running (Terminal 2)
- [ ] Browser console shows no CORS errors
- [ ] Network tab shows request reaching backend
- [ ] Backend terminal shows request received
- [ ] Username is unique (not already registered)
- [ ] Password is at least 8 characters
- [ ] Both username and password fields are filled

---

## Testing with curl (Backend Only)

Test backend independently:

### Test Registration:

```bash
curl -v -X POST http://127.0.0.1:8000/api/register/ \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"username": "curltest", "password": "password123"}'
```

**Expected Response:**

```json
{ "message": "User registered successfully" }
```

### Test Login:

```bash
curl -v -X POST http://127.0.0.1:8000/api/login/ \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"username": "curltest", "password": "password123"}'
```

**Expected Response:**

```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Production Considerations

The fixes applied are suitable for development and production:

### ✅ Safe for Production:

- CORS configured for specific origin (not wildcard)
- CSRF exemption is standard for JWT APIs
- AllowAny permission only on register/login (not all endpoints)

### 🔒 Additional Production Security:

1. **HTTPS Only:**

   ```python
   SECURE_SSL_REDIRECT = True
   SESSION_COOKIE_SECURE = True
   CSRF_COOKIE_SECURE = True
   ```

2. **Rate Limiting:**

   ```python
   REST_FRAMEWORK = {
       'DEFAULT_THROTTLE_CLASSES': [
           'rest_framework.throttling.AnonRateThrottle',
       ],
       'DEFAULT_THROTTLE_RATES': {
           'anon': '100/hour',
       }
   }
   ```

3. **Environment Variables:**
   ```python
   CORS_ALLOWED_ORIGINS = os.getenv('CORS_ORIGINS', '').split(',')
   ```

---

## Summary

The registration error was fixed by:

1. ✅ Adding explicit CORS headers configuration
2. ✅ Exempting CSRF for API endpoints (standard for JWT)
3. ✅ Enhanced error logging for better debugging

The application should now work correctly. If you still encounter issues, check the browser console and backend terminal for detailed error messages.
