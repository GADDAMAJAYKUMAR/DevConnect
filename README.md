# DevConnect

A full-stack developer platform to connect developers, showcase profiles, and share reviews.  
Built with **React.js** for the frontend and **Node.js/Express** with **MongoDB** for the backend.

---

## Features

- User registration and login with JWT authentication
- View a list of all developers (name and skills)
- Click on skills to view detailed profile information
- Add and view reviews for developers
- User profile management
- Secure routes with token-based authorization
- Responsive UI with Bootstrap and card-based layout

---

## Tech Stack

- **Frontend:** React.js, React Router, Axios, Bootstrap  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT  
- **Authentication:** JSON Web Tokens (JWT)  
- **Password Hashing:** bcryptjs  
- **Dev Tools:** nodemon, concurrently  

---

## Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/GADDAMAJAYKUMAR/DevConnect.git
   cd DevConnect/server
Install backend dependencies:

bash
Copy
Edit
npm install
Create a .env file in the server folder with the following variables:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Start the backend server:

bash
Copy
Edit
npm run server
Frontend Setup
Open a new terminal, navigate to the frontend folder:

bash
Copy
Edit
cd ../client
Install frontend dependencies:

bash
Copy
Edit
npm install
Start the frontend development server:

bash
Copy
Edit
npm start
Usage
Open your browser and go to http://localhost:3000

Register a new user or login

Browse developers on the dashboard

Click on skills to view developer details and add/view reviews

Logout securely when done

Folder Structure
csharp
Copy
Edit
DevConnect/
│
├── server/            # Backend code (Node.js + Express)
│   ├── routes/
│   ├── model/
│   ├── middleWare/
│   ├── index.js
│   └── package.json
│
├── client/            # Frontend code (React.js)
│   ├── src/
│   ├── public/
│   └── package.json
│
├── .gitignore
├── README.md
└── ...
Environment Variables
PORT: Port for the backend server (default 5000)

MONGO_URI: MongoDB connection string

JWT_SECRET: Secret key for signing JWT tokens

Contributing
Feel free to fork the repo and submit pull requests.
Please ensure to keep the code clean and add comments where necessary.

License
This project is licensed under the MIT License.

Contact
Ajay Kumar Gaddam
Email: gaddamajaykumar1@gmail.com
GitHub: https://github.com/GADDAMAJAYKUMAR

Thank you for checking out DevConnect!
