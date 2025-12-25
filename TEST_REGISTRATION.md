# Registration Testing Guide

## Quick Test Steps

### 1. Start Both Servers

**Terminal 1 - Backend:**

```bash
cd /Users/chidambararajab/Documents/Chid/Development/ATasks/auth-project
source venv/bin/activate
cd backend
python manage.py runserver
```

**Expected Output:**

```
Starting development server at http://127.0.0.1:8000/
```

**Terminal 2 - Frontend:**

```bash
cd /Users/chidambararajab/Documents/Chid/Development/ATasks/auth-project/client
npm run dev
```

**Expected Output:**

```
Local:   http://localhost:5173/
```

### 2. Test Registration Flow

1. **Open Browser:** `http://localhost:5173`

2. **Click "Register"**

3. **Fill Form:**

   - Username: `johndoe`
   - Password: `mypassword123`

4. **Click "Register" Button**

5. **Expected Result:**

   - ✅ Alert: "Registration successful! Please login."
   - ✅ Redirects to `/login` page

6. **Check Browser Console (F12):**

   - Should show no errors
   - If errors exist, they're now logged with details

7. **Check Backend Terminal:**
   ```
   [25/Dec/2025 XX:XX:XX] "OPTIONS /api/register/ HTTP/1.1" 200 0
   [25/Dec/2025 XX:XX:XX] "POST /api/register/ HTTP/1.1" 201 42
   ```

### 3. Test Login Flow

1. **On Login Page, Enter:**

   - Username: `johndoe`
   - Password: `mypassword123`

2. **Click "Login"**

3. **Expected Result:**

   - ✅ Redirects to `/dashboard`
   - ✅ Shows: "You are logged in successfully!"
   - ✅ Shows token preview

4. **Check LocalStorage:**
   - Open DevTools → Application → Local Storage → `http://localhost:5173`
   - Should see:
     - `access_token`: `eyJhbGc...`
     - `refresh_token`: `eyJhbGc...`

### 4. Test Protected Route

1. **Click "Logout"**

   - Should redirect to `/login`
   - LocalStorage should be cleared

2. **Try accessing `/dashboard` directly:**
   - Type in URL: `http://localhost:5173/dashboard`
   - Should redirect to `/login` (protected route working)

---

## What Changed (Technical)

### Backend Changes

#### 1. settings.py - Enhanced CORS Configuration

```python
# Added explicit headers
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

#### 2. views.py - CSRF Exemption

```python
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt  # ← Added this
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    # ... existing code
```

**Why CSRF Exempt?**

- REST APIs with JWT don't need CSRF protection
- CSRF protects session-based auth (cookies)
- JWT tokens are in headers, not cookies
- CORS still protects against unauthorized origins

### Frontend Changes

#### 3. Register.tsx - Better Error Handling

```typescript
onError: (error: any) => {
  console.error("Registration error:", error);
  console.error("Error response:", error.response);
  console.error("Error data:", error.response?.data);

  // Extract specific error messages
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
    }
    // ... more error checks
  }

  alert(errorMessage);
};
```

**Benefits:**

- Shows specific error (e.g., "Username already exists")
- Logs full error to console for debugging
- Handles different error formats from Django

---

## Verification Commands

### Test Backend Directly (Without Frontend)

```bash
# Test registration
curl -X POST http://127.0.0.1:8000/api/register/ \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"username": "testuser", "password": "password123"}'

# Expected: {"message":"User registered successfully"}
```

```bash
# Test login
curl -X POST http://127.0.0.1:8000/api/login/ \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"username": "testuser", "password": "password123"}'

# Expected: {"access":"eyJ...","refresh":"eyJ..."}
```

### Check CORS Preflight

```bash
# Test OPTIONS request (CORS preflight)
curl -X OPTIONS http://127.0.0.1:8000/api/register/ \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -v

# Should see headers:
# Access-Control-Allow-Origin: http://localhost:5173
# Access-Control-Allow-Methods: DELETE, GET, OPTIONS, PATCH, POST, PUT
```

---

## Error Scenarios to Test

### 1. Username Already Exists

**Steps:**

1. Register with username: `duplicate`
2. Try registering again with same username

**Expected:**

- Alert: "Username already exists."

### 2. Password Too Short

**Steps:**

1. Enter username: `shortpass`
2. Enter password: `123` (less than 8 chars)
3. Click Register

**Expected:**

- Frontend validation: "Password is required"
- Or backend: "Ensure this field has at least 8 characters."

### 3. Empty Fields

**Steps:**

1. Leave username empty
2. Click Register

**Expected:**

- Frontend validation: "Username is required"

### 4. Invalid Login

**Steps:**

1. Go to Login page
2. Enter wrong password
3. Click Login

**Expected:**

- Alert: "Invalid credentials"
- Status code: 401

---

## Success Criteria

✅ Registration works without errors  
✅ Login works and redirects to dashboard  
✅ Dashboard shows user is logged in  
✅ Logout clears tokens and redirects  
✅ Protected routes redirect when not logged in  
✅ Browser console shows no CORS errors  
✅ Backend logs show 200/201 status codes  
✅ Specific error messages displayed (not generic)

---

## If Still Not Working

### Step 1: Check Browser Console

1. Open DevTools (F12)
2. Go to Console tab
3. Look for error messages
4. Copy full error and check:
   - Is it a CORS error?
   - Is it a network error?
   - Is it a validation error?

### Step 2: Check Network Tab

1. Open DevTools → Network tab
2. Try registering
3. Click on the `/api/register/` request
4. Check:
   - **Headers:** Is Origin header present?
   - **Payload:** Is JSON formatted correctly?
   - **Response:** What's the actual error message?

### Step 3: Check Backend Terminal

1. Look at Terminal 1 (backend)
2. Check the status code:
   - `200` - Success
   - `201` - Created (registration successful)
   - `400` - Bad request (validation error)
   - `403` - Forbidden (CSRF issue)
   - `500` - Server error

### Step 4: Restart Everything

```bash
# Stop both servers (Ctrl+C in both terminals)

# Terminal 1 - Backend
cd backend
source ../venv/bin/activate
python manage.py runserver

# Terminal 2 - Frontend
cd client
npm run dev

# Clear browser cache (Cmd+Shift+R or Ctrl+Shift+R)
# Try again
```

---

## Contact/Debug Info

If issues persist, provide:

1. Browser console errors (screenshot)
2. Network tab response (screenshot)
3. Backend terminal output
4. Username and password used (for testing)

The enhanced error logging will now show exactly what's failing.
