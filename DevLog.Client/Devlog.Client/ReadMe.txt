src/
│
├── app/
│   └── store.js
│
├── features/
│   ├── auth/
│   │   ├── authSlice.js
│   │   ├── authThunks.js
│   │   └── authSelectors.js
│   │
│   └── posts/
│       ├── postSlice.js
│       ├── postThunks.js
│       └── postSelectors.js
│
├── services/
│   ├── axiosInstance.js
│   ├── tokenService.js
│   └── api/
│       ├── authApi.js
│       └── postApi.js
│
├── components/
│   ├── ProtectedRoute.jsx
│   ├── Navbar.jsx
│   └── Loader.jsx
│
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Posts.jsx
│   ├── CreatePost.jsx
│   └── EditPost.jsx
│
├── hooks/
│   ├── useAuth.js
│   └── usePosts.js
│
├── utils/
│   ├── constants.js
│   └── helpers.js
│
├── routes/
│   └── AppRoutes.jsx
│
├── App.jsx
└── main.jsx