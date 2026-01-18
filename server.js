// backend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the frontend
app.use(express.static(path.join(__dirname, '../')));

// Mock database
let users = [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Data Scientist', progress: 42 }
];

let courses = [
    { id: 1, title: 'Python Basics', description: 'Learn Python from scratch', completed: true },
    { id: 2, title: 'Statistics', description: 'Basic statistics for data science', completed: true },
    { id: 3, title: 'Data Analysis', description: 'Python for data analysis', completed: false, locked: true },
    { id: 4, title: 'Data Visualization', description: 'Visualizing data with Python', completed: false, locked: true },
    { id: 5, title: 'Machine Learning', description: 'Introduction to ML', completed: false, locked: true }
];

let resources = [
    { id: 1, title: 'Python Basics Tutorial', platform: 'YouTube', channel: 'Simplilearn' },
    { id: 2, title: 'Data Science Crash Course', platform: 'YouTube', channel: 'FreeCodeCamp' },
    { id: 3, title: 'SQL for Beginners', platform: 'Udemy', channel: 'CodeWithMosh' }
];

let notifications = [
    { id: 1, title: 'New course available', message: 'Python for Data Analysis is now available', read: false },
    { id: 2, title: 'Daily reminder', message: 'Complete your Python exercises', read: false }
];

// Authentication middleware
const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (token && token === 'Bearer mock-token-123') {
        next();
    } else {
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// ========== API ROUTES ==========

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// User endpoints
app.get('/api/user', authenticate, (req, res) => {
    res.json(users[0]);
});

app.put('/api/user', authenticate, (req, res) => {
    const updates = req.body;
    users[0] = { ...users[0], ...updates };
    res.json(users[0]);
});

// Dashboard data
app.get('/api/dashboard', authenticate, (req, res) => {
    const dashboardData = {
        user: users[0],
        progress: 42,
        activeCourses: courses.filter(c => !c.completed && !c.locked).length,
        completedCourses: courses.filter(c => c.completed).length,
        upcomingDeadlines: [
            { title: 'Python Project', date: '2023-12-15' },
            { title: 'Statistics Exam', date: '2023-12-20' }
        ],
        recentActivity: [
            { action: 'Completed Python Basics', time: '2 hours ago' },
            { action: 'Started Statistics course', time: '1 day ago' }
        ]
    };
    res.json(dashboardData);
});

// Courses endpoints
app.get('/api/courses', authenticate, (req, res) => {
    res.json(courses);
});

app.post('/api/courses/:id/complete', authenticate, (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);
    
    if (course) {
        course.completed = true;
        // Update user progress
        const completedCount = courses.filter(c => c.completed).length;
        users[0].progress = Math.round((completedCount / courses.length) * 100);
        
        res.json({ success: true, course, progress: users[0].progress });
    } else {
        res.status(404).json({ error: 'Course not found' });
    }
});

// Resources endpoints
app.get('/api/resources', authenticate, (req, res) => {
    res.json(resources);
});

app.post('/api/resources', authenticate, (req, res) => {
    const newResource = {
        id: resources.length + 1,
        ...req.body,
        createdAt: new Date().toISOString()
    };
    resources.push(newResource);
    res.status(201).json(newResource);
});

// Notifications endpoints
app.get('/api/notifications', authenticate, (req, res) => {
    res.json(notifications);
});

app.put('/api/notifications/:id/read', authenticate, (req, res) => {
    const notificationId = parseInt(req.params.id);
    const notification = notifications.find(n => n.id === notificationId);
    
    if (notification) {
        notification.read = true;
        res.json({ success: true, notification });
    } else {
        res.status(404).json({ error: 'Notification not found' });
    }
});

app.put('/api/notifications/read-all', authenticate, (req, res) => {
    notifications.forEach(n => n.read = true);
    res.json({ success: true, notifications });
});

// Career path endpoints
app.get('/api/career-path', authenticate, (req, res) => {
    const careerPath = {
        currentRole: 'Data Scientist',
        progress: 42,
        steps: [
            { id: 1, title: 'Python Basics', status: 'completed', order: 1 },
            { id: 2, title: 'Statistics Fundamentals', status: 'completed', order: 2 },
            { id: 3, title: 'Data Analysis with Python', status: 'in-progress', order: 3 },
            { id: 4, title: 'Data Visualization', status: 'pending', order: 4 },
            { id: 5, title: 'Machine Learning Basics', status: 'pending', order: 5 },
            { id: 6, title: 'SQL for Data Science', status: 'pending', order: 6 },
            { id: 7, title: 'Big Data Technologies', status: 'pending', order: 7 }
        ]
    };
    res.json(careerPath);
});

// Skills endpoints
app.get('/api/skills', authenticate, (req, res) => {
    const skills = [
        { name: 'Python', level: 70, target: 90 },
        { name: 'Statistics', level: 60, target: 85 },
        { name: 'Data Analysis', level: 40, target: 80 },
        { name: 'SQL', level: 50, target: 75 },
        { name: 'Machine Learning', level: 20, target: 70 }
    ];
    res.json(skills);
});

// Analytics endpoints
app.get('/api/analytics', authenticate, (req, res) => {
    const analytics = {
        dailyStudyTime: [2, 3, 1, 4, 2, 3, 5], // Last 7 days
        courseCompletionRate: 28.5,
        skillGrowth: 15,
        streak: 5
    };
    res.json(analytics);
});

// Mock authentication
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    
    // Mock validation
    if (email === 'rahul@example.com' && password === 'password123') {
        res.json({
            success: true,
            token: 'mock-token-123',
            user: users[0]
        });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

app.post('/api/logout', authenticate, (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});

// Serve frontend for any other route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`SOLVO server running on port 3000`);
    console.log(`Frontend: http://localhost:3000`);
    console.log(`API: http://localhost:3000/api/health`);
});

