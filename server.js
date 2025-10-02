// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

// --- Import Models ---
const User = require('./models/user');
const Class = require('./models/Class');
const Attendance = require('./models/Attendance');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// --- Middlewares ---
app.use(bodyParser.json()); 

// =======================================================
// === Database Connection & Seeding =====================
// =======================================================

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB successfully connected');
    seedInitialData(); // Run data setup after connection
  })
  .catch(err => console.error('MongoDB connection error:', err));


// Mock data setup to ensure your frontend has classes and students to interact with
const mockStudentsData = [
    { studentId: 's001', name: 'Emily Clark' }, { studentId: 's002', name: 'David Lee' }, 
    { studentId: 's003', name: 'Sophia Chen' }, { studentId: 's004', name: 'Michael Rodriguez' },
    { studentId: 's005', name: 'Olivia Wilson' }, { studentId: 's006', name: 'James Brown' },
    { studentId: 's007', name: 'Ava Martinez' }, { studentId: 's008', name: 'Ethan Garcia' },
    { studentId: 's009', name: 'Isabella Scott' }, { studentId: 's010', name: 'Noah King' },
];

const mockClassesData = [
    { classId: 'c001', name: 'Advanced Calculus', students: mockStudentsData },
    { classId: 'c002', name: 'Web Development (React)', students: mockStudentsData },
    { classId: 'c003', name: 'Database Management', students: mockStudentsData },
    { classId: 'c004', name: 'Software Testing', students: mockStudentsData },
];

async function seedInitialData() {
    try {
        // Create a default teacher for ownership
        let defaultTeacher = await User.findOne({ email: 'teacher@demo.com' });
        if (!defaultTeacher) {
            defaultTeacher = await User.create({
                email: 'teacher@demo.com',
                password: 'password', 
                role: 'teacher',
                name: 'Professor Jane'
            });
            console.log('Default teacher created.');
        }

        // Seed classes if they don't exist
        for (const mockClass of mockClassesData) {
            const exists = await Class.findOne({ classId: mockClass.classId });
            if (!exists) {
                await Class.create({
                    ...mockClass,
                    teacher: defaultTeacher._id
                });
            }
        }
        console.log('Initial class data seeded.');
    } catch (error) {
        console.error('Data seeding failed:', error.message);
    }
}


// =======================================================
// === API Routes & Mock Auth ============================
// =======================================================

// Middleware to simulate authentication and provide user context
const mockAuth = (req, res, next) => {
    // In a real app, this decodes the JWT token
    req.user = { 
        id: 'user_t001', // Placeholder teacher ID
        role: 'teacher'
    };
    next();
};

// --- A. Get Classes for Dashboard ---
app.get('/api/teacher/classes', mockAuth, async (req, res) => {
    try {
        // Find classes and map the result to the structure the frontend expects
        const classes = await Class.find({}); 
        
        const frontendClasses = classes.map(cls => ({
            id: cls.classId,
            name: cls.name,
            students: cls.students.length,
            lastTaken: 'N/A' 
        }));
        
        res.status(200).json(frontendClasses);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch classes.' });
    }
});


// --- B. Get Students for Attendance Screen ---
app.get('/api/classes/:classId/students', mockAuth, async (req, res) => {
    try {
        const { classId } = req.params;
        const cls = await Class.findOne({ classId });

        if (!cls) {
            return res.status(404).json({ message: 'Class not found.' });
        }
        
        // Return the student roster
        res.status(200).json(cls.students);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch students.' });
    }
});


// --- C. Attendance Submission (POST /api/attendance/take) ---
app.post('/api/attendance/take', mockAuth, async (req, res) => {
    try {
        const { classId, className, date, studentStatuses } = req.body;

        const newAttendance = new Attendance({
            classId,
            className,
            date: new Date(date),
            studentStatuses,
            recordedBy: req.user.id 
        });

        const savedAttendance = await newAttendance.save();
        
        res.status(201).json({ 
            message: 'Attendance successfully recorded.', 
            id: savedAttendance._id
        });

    } catch (error) {
        console.error('Attendance submission error:', error);
        res.status(500).json({ message: 'Server error while recording attendance.', error: error.message });
    }
});


// --- D. Get Last Attendance Record for View ---
app.get('/api/attendance/record/:classId', mockAuth, async (req, res) => {
    try {
        const { classId } = req.params;

        // Find the single most recent record for the class
        const lastRecord = await Attendance.findOne({ classId })
                                        .sort({ date: -1 }) 
                                        .limit(1);

        if (!lastRecord) {
            return res.status(404).json({ message: 'No records found.' });
        }
        
        // Return only the data the frontend expects for the record view
        res.status(200).json({
            date: lastRecord.date.toLocaleDateString(),
            teacher: 'Professor Jane', // Mocked name, but could be looked up from User model
            studentStatuses: lastRecord.studentStatuses
        });

    } catch (error) {
        console.error('Attendance retrieval error:', error);
        res.status(500).json({ message: 'Server error while retrieving attendance.', error: error.message });
    }
});


// =======================================================
// === Server Start ======================================
// =======================================================
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});