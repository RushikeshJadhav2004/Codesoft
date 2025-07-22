# Job Board Application

A full-stack job board web application built with React, Node.js, Express, and MongoDB. This platform allows employers to post job openings and job seekers to search and apply for jobs.

## Features

### For Job Seekers
- **User Registration & Authentication**: Secure signup and login system
- **Job Search & Filtering**: Advanced search with filters for location, job type, experience level, and more
- **Job Applications**: Apply to jobs with cover letters and resume uploads
- **Application Tracking**: Monitor application status and receive updates
- **Profile Management**: Maintain professional profiles with skills, experience, and education
- **Dashboard**: Personalized dashboard with application history and job recommendations

### For Employers
- **Company Registration**: Dedicated employer accounts
- **Job Posting**: Create detailed job listings with requirements and descriptions
- **Application Management**: Review applications, manage candidate status
- **Dashboard**: Employer dashboard to manage all job postings and applications
- **Candidate Communication**: Update application statuses with notes

### General Features
- **Home Page**: Welcome message and featured job listings
- **Mobile Responsive**: Works seamlessly on all devices
- **Email Notifications**: Automated notifications for applications and updates
- **Search Functionality**: Powerful search with multiple filters
- **Security**: JWT authentication, password hashing, and secure file uploads

## Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **Nodemailer** - Email notifications
- **Helmet** - Security middleware
- **Express Rate Limit** - API rate limiting

### Frontend
- **React** - Frontend framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **React Hook Form** - Form handling
- **Tailwind CSS** - Styling
- **Headless UI** - UI components
- **Heroicons** - Icons
- **Axios** - HTTP client

## Project Structure

```
job-board/
├── backend/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── config/          # Configuration files
│   ├── uploads/         # Uploaded files storage
│   ├── .env             # Environment variables
│   └── index.js         # Server entry point
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── pages/       # Page components
│   │   ├── store/       # Redux store and slices
│   │   ├── utils/       # Utility functions
│   │   └── App.js       # Main app component
│   ├── public/          # Static files
│   └── package.json     # Frontend dependencies
└── README.md            # Project documentation
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn package manager

### Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the backend directory and update the following variables:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/jobboard
   JWT_SECRET=your-secret-key-change-in-production
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```

### Frontend Setup

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

### Database Setup

1. **Install MongoDB locally or use MongoDB Atlas**
2. **Start MongoDB service** (if using local installation)
3. **The application will automatically create the necessary collections**

## Usage

### For Job Seekers

1. **Register as a Job Seeker**:
   - Visit `/register?role=jobseeker`
   - Fill in your details and create an account

2. **Complete Your Profile**:
   - Go to `/profile`
   - Add your skills, experience, education, and upload your resume

3. **Search for Jobs**:
   - Browse jobs on the `/jobs` page
   - Use filters to narrow down results
   - Click on job titles to view detailed descriptions

4. **Apply for Jobs**:
   - Click "Apply Now" on job detail pages
   - Write a cover letter and upload your resume
   - Track your applications in `/my-applications`

### For Employers

1. **Register as an Employer**:
   - Visit `/register?role=employer`
   - Create your company account

2. **Post Jobs**:
   - Use `/post-job` to create new job listings
   - Include detailed descriptions, requirements, and qualifications

3. **Manage Applications**:
   - Access `/employer-dashboard` to view all your job postings
   - Review applications and update candidate statuses
   - Communicate with applicants through status updates

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Jobs
- `GET /api/jobs` - Get all jobs with search and filters
- `GET /api/jobs/featured` - Get featured jobs
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (employers only)
- `PUT /api/jobs/:id` - Update job (employers only)
- `DELETE /api/jobs/:id` - Delete job (employers only)

### Applications
- `POST /api/applications` - Apply for job
- `GET /api/applications/my-applications` - Get user applications
- `GET /api/applications/job/:jobId` - Get job applications (employers only)
- `PATCH /api/applications/:id/status` - Update application status

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/upload-resume` - Upload resume

## Email Configuration

To enable email notifications:

1. **Gmail Setup**:
   - Enable 2-factor authentication
   - Generate an app password
   - Use the app password in `EMAIL_PASS`

2. **Other Email Providers**:
   - Update `EMAIL_HOST` and `EMAIL_PORT` accordingly
   - Ensure SMTP authentication is properly configured

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt for secure password storage
- **Rate Limiting**: Prevent API abuse
- **Helmet**: Security headers
- **File Upload Validation**: Only PDF files allowed for resumes
- **Role-based Access Control**: Different permissions for employers and job seekers

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Future Enhancements

- Advanced search with salary ranges
- Company profiles and ratings
- Job alerts and notifications
- Video interview integration
- Social media integration
- Advanced analytics for employers
- Mobile application

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@jobboard.com or create an issue in the repository.
