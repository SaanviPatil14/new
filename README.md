# Election Polling Website

A comprehensive and secure digital voting platform built with React, Node.js, Express, and MongoDB. This application allows candidates to register for elections, voters to cast their votes, and administrators to manage the entire electoral process.

## 🚀 Features

### For Voters
- User registration and authentication
- View candidate profiles and manifestos
- Cast secure votes
- View real-time election results
- Check voting history

### For Candidates
- Register as a candidate
- Create detailed profiles with manifestos
- Upload campaign materials
- Track vote counts
- Manage campaign information

### For Administrators
- Manage user accounts (voters and candidates)
- Approve or reject candidate registrations
- Monitor election statistics
- View detailed voting analytics
- Create additional admin accounts

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security middleware
- **cors** - Cross-origin resource sharing

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **React Icons** - Icon library

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd election-polling-website
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `config.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/election-polling
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=development
```

### 4. Initialize Database

```bash
# Create default admin user
node scripts/init-db.js
```

This will create a default admin account:
- **Email:** admin@election.com
- **Password:** admin123

### 5. Start the Application

#### Development Mode (Both Frontend and Backend)

```bash
# Start both frontend and backend concurrently
npm run dev:full
```

#### Production Mode

```bash
# Build the frontend
cd client
npm run build
cd ..

# Start the backend
npm start
```

The application will be available at:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:5000

## 📁 Project Structure

```
election-polling-website/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   └── ...
│   └── package.json
├── models/                 # MongoDB models
├── routes/                 # API routes
├── middleware/             # Custom middleware
├── scripts/                # Database scripts
├── server.js              # Main server file
├── package.json
└── README.md
```

## 🔐 Authentication & Authorization

The application uses JWT (JSON Web Tokens) for authentication. There are three user types:

1. **Admin** - Full system access
2. **Candidate** - Can register for elections and manage profiles
3. **Voter** - Can cast votes and view results

## 🗳️ Voting Process

1. **Registration**: Users register as either voters or candidates
2. **Candidate Approval**: Admins approve candidate registrations
3. **Voting**: Approved voters can cast their votes
4. **Results**: Real-time results are displayed to all users

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- Rate limiting
- CORS protection
- Helmet security headers
- Duplicate vote prevention

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Candidates
- `GET /api/candidates` - Get all approved candidates
- `POST /api/candidates/register` - Register as candidate
- `GET /api/candidates/:id` - Get candidate details

### Voting
- `POST /api/votes/cast` - Cast a vote
- `GET /api/votes/results` - Get election results
- `GET /api/votes/stats` - Get voting statistics

### Admin
- `GET /api/admin/dashboard` - Admin dashboard
- `GET /api/admin/users` - Manage users
- `GET /api/admin/candidates` - Manage candidates
- `PUT /api/admin/candidates/approve/:id` - Approve candidate

## 🎨 UI/UX Features

- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern Interface**: Clean and intuitive design
- **Real-time Updates**: Live results and notifications
- **Accessibility**: WCAG compliant components
- **Loading States**: Smooth user experience

## 🧪 Testing

```bash
# Run frontend tests
cd client
npm test

# Run backend tests (if implemented)
npm test
```

## 📦 Deployment

### Backend Deployment

1. Set up a MongoDB database (MongoDB Atlas recommended)
2. Configure environment variables
3. Deploy to your preferred platform (Heroku, Vercel, AWS, etc.)

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the `build` folder to your hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- Email verification
- Two-factor authentication
- Advanced analytics dashboard
- Mobile app
- Blockchain integration
- Multi-language support
- Advanced security features

---

**Note**: This is a demonstration project. For production use, implement additional security measures and follow electoral commission guidelines. 