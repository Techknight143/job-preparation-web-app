const express = require('express');
const authRoutes = require('./routes/auth.routes')
const healthRouter = require('./routes/healthRoute')
const interviewRoutes = require('./routes/interview.routes') 
const cookieParser = require('cookie-parser');
const cors = require('cors');
const app = express();

//user middleware
app.use(express.json());
app.use(cookieParser());

const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173'
].filter(Boolean);

app.use(cors({origin: allowedOrigins, credentials: true}));


app.use('/',healthRouter);
app.use('/api/auth',authRoutes);
app.use('/api/interview',interviewRoutes);

module.exports = app;