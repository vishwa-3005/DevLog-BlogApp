# DevLog-BlogApp
Fullstack blog application for Developers, students and Technical bloggers
# DevLog — Fullstack Blog Application

DevLog is a fullstack blog platform designed for developers, students, and technical writers to create, manage, and share content.
The project focuses on implementing a **secure authentication system and scalable architecture**, following real-world development practices.

---

## 🚀 Features

### 🔐 Authentication & Security

* JWT-based authentication (Access Token)
* Refresh token stored securely in httpOnly cookies
* Automatic token refresh mechanism
* Protected routes using Redux state
* Axios interceptors for handling authentication and retries

### 📝 Blog Management

* Create and publish blog posts
* Rich text editor integration (ReactQuill)
* Store content as HTML
* Fetch and display all posts
* Individual post viewing

### 👤 User System

* User registration and login
* Persistent session using refresh tokens
* Secure logout handling

---

## ⚙️ Architecture Highlights

* Feature-based Redux Toolkit architecture
* Centralized Axios instance with interceptors
* Token lifecycle management (access + refresh)
* Clean separation between frontend and backend
* RESTful API design

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Redux Toolkit
* Axios
* React Router
* ReactQuill

### Backend

* .NET Web API
* Entity Framework Core
* JWT Authentication

### Database

* PostgreSQL (planned: Neon / Railway)

### External Services

* Cloudinary (media storage)
* Cloudflare AI (planned integration)

---

## 📁 Project Structure

```bash
DevLog/
│
├── backend/
│   ├── Controllers/
│   ├── Services/
│   ├── Models/
│   ├── Data/
│   └── Program.cs
│
├── frontend/
│   ├── src/
│   │   ├── features/
│   │   ├── pages/
│   │   ├── components/
│   │   └── services/
│   └── vite.config.js
```

---

## 🔄 Authentication Flow

1. User logs in → receives **access token**
2. Refresh token stored in **httpOnly cookie**
3. On app reload:

   * `/api/auth/refresh` is triggered
   * New access token is issued
4. Axios interceptors:

   * Attach token automatically
   * Handle 401 errors
   * Retry failed requests after refresh

---

## ⚙️ Environment Configuration

### Frontend

```env
VITE_API_BASE_URL=http://localhost:7140
```

### Backend

```env
ConnectionStrings__DefaultConnection=your_database_url

Jwt__Key=your_secret_key
Jwt__Issuer=your_issuer
Jwt__Audience=your_audience

Cloudinary__CloudName=your_cloud_name
Cloudinary__ApiKey=your_api_key
Cloudinary__ApiSecret=your_api_secret
```

---

## 🧪 Running Locally

### Backend

```bash
cd backend
dotnet restore
dotnet run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🚧 Current Status

* Core backend and frontend implemented
* Authentication system completed
* Blog creation and fetching implemented
* Deployment in progress

---

## 🔐 Security Practices

* httpOnly cookies for refresh tokens
* No sensitive tokens stored in frontend storage
* Token expiration and refresh handling
* Proper CORS configuration for secure communication

---

## 📌 Future Improvements

* Comment system
* Like & bookmark functionality
* User profiles
* Search and filtering
* Pagination
* Deployment and CI/CD pipeline

---

## 👨‍💻 Author

**Vishwadeep Sankpal**
Software Developer

---

## ⭐ Final Note

This project emphasizes **real-world authentication flow, clean architecture, and scalable design**, going beyond basic CRUD implementations.
