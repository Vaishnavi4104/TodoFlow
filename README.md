# TodoFlow - Task Management Application

TodoFlow is a modern, full-stack task management application built with React, Node.js, Express, and MongoDB. It helps users stay organized and productive by managing their tasks efficiently.

## Features

- User Authentication (Register/Login)
- Create, Read, Update, and Delete Tasks
- Add Subtasks to Tasks
- Set Task Priority (High, Medium, Low)
- Set Due Dates for Tasks
- Mark Tasks as Complete
- Dark/Light Theme Toggle
- Responsive Design
- Real-time Updates

## Tech Stack

- **Frontend:**
  - React.js
  - React Router
  - Bootstrap 5
  - React Toastify
  - Axios

- **Backend:**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication
  - Bcrypt for Password Hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/todoflow.git
cd todoflow
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd client
npm install
```

4. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

5. Start the development servers:

In the root directory (for backend):
```bash
npm run dev
```

In a new terminal, navigate to the client directory (for frontend):
```bash
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
todoflow/
├── client/                 # React frontend
│   ├── public/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # React context
│   │   ├── pages/         # Page components
│   │   └── App.js         # Main App component
│   └── package.json
├── routes/                # Express routes
├── models/               # MongoDB models
├── middleware/           # Custom middleware
├── server.js            # Express server
└── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/yourusername/todoflow](https://github.com/yourusername/todoflow) 