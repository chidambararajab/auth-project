# Django REST API Backend with JWT Authentication

A complete, production-ready Django REST API backend with JWT authentication for user registration and login.

## Features

- User Registration with username/password
- JWT-based Login with access and refresh tokens
- CORS support for Vite dev server (http://localhost:5173)
- Django REST Framework
- SimpleJWT for token management

## Project Structure

```
backend/
├── backend/
│   ├── __init__.py
│   ├── settings.py      # Django settings with JWT and CORS config
│   ├── urls.py          # Main URL configuration
│   └── wsgi.py
├── accounts/
│   ├── __init__.py
│   ├── serializers.py   # User registration serializer
│   ├── views.py         # Registration and login views
│   └── urls.py          # Accounts app URL routing
├── manage.py
├── requirements.txt
└── db.sqlite3           # SQLite database
```

## Setup Instructions

### 1. Activate Virtual Environment

```bash
cd /Users/chidambararajab/Documents/Chid/Development/ATasks/auth-project
source venv/bin/activate
```

### 2. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 3. Run Database Migrations (Already Done)

```bash
python manage.py migrate
```

### 4. Start the Django Development Server

```bash
python manage.py runserver
```

The server will start at: **http://127.0.0.1:8000**

## API Endpoints

### 1. User Registration

**Endpoint:** `POST /api/register/`

**Request Body:**

```json
{
  "username": "testuser",
  "password": "securepassword123"
}
```

**Success Response (201 Created):**

```json
{
  "message": "User registered successfully"
}
```

**Error Response (400 Bad Request):**

```json
{
  "username": ["Username already exists."],
  "password": ["This field is required."]
}
```

### 2. User Login (JWT)

**Endpoint:** `POST /api/login/`

**Request Body:**

```json
{
  "username": "testuser",
  "password": "securepassword123"
}
```

**Success Response (200 OK):**

```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

**Error Response (401 Unauthorized):**

```json
{
  "error": "Invalid credentials"
}
```

## Testing the APIs

### Using curl:

**Register a user:**

```bash
curl -X POST http://127.0.0.1:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

**Login:**

```bash
curl -X POST http://127.0.0.1:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "password": "password123"}'
```

### Using Postman or Thunder Client:

1. **POST** to `http://127.0.0.1:8000/api/register/`
   - Body: `{"username": "testuser", "password": "password123"}`
2. **POST** to `http://127.0.0.1:8000/api/login/`

   - Body: `{"username": "testuser", "password": "password123"}`
   - Copy the `access` token from response

3. Use the access token in Authorization header:
   - Header: `Authorization: Bearer <your-access-token>`

## Configuration Details

### CORS Settings

- Configured to allow requests from `http://localhost:5173` (Vite dev server)
- Credentials are allowed

### JWT Token Settings

- **Access Token Lifetime:** 60 minutes
- **Refresh Token Lifetime:** 1 day
- **Algorithm:** HS256
- **Authorization Header Type:** Bearer

### Security Notes

- Passwords are automatically hashed using Django's `create_user()` method
- Username uniqueness is validated
- Minimum password length: 8 characters
- CSRF protection is enabled (except for API endpoints with `@permission_classes([AllowAny])`)

## Dependencies

```
django==6.0
djangorestframework==3.16.1
djangorestframework-simplejwt==5.5.1
django-cors-headers==4.9.0
PyJWT==2.10.1
```

## Next Steps

To connect this backend with your frontend:

1. Make sure the backend is running on port 8000
2. Start your Vite frontend on port 5173
3. Use fetch or axios to make API calls from frontend
4. Include the JWT token in Authorization header for protected routes

## Troubleshooting

**Port already in use:**

```bash
python manage.py runserver 8001
```

**CORS errors:**

- Check that frontend is running on http://localhost:5173
- Verify CORS settings in `settings.py`

**Database locked:**

```bash
rm db.sqlite3
python manage.py migrate
```
