import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import userRouter from './routes/user.routes.js';
import userComplaint from './routes/profile.routes.js';
import adminRouter from './routes/admin.routes.js';
import feedbackroutes from './routes/feedback.routes.js';
import rebateroutes from './routes/rebate.routes.js';
import accountroutes from './routes/account.routes.js';

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = ['http://localhost:5173'];

app.use(cors({
    origin: function(origin, callback){
        // Allow requests with no origin (like mobile apps or curl requests)
        if(!origin) return callback(null, true);
        if(allowedOrigins.indexOf(origin) === -1){
            const msg = `The CORS policy for this site does not allow access from the specified origin: ${origin}`;
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true, // Enable credentials (cookies, authorization headers, etc.)
}));

// Body parsing middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

app.use(express.static("public"));

// Cookie parser middleware
app.use(cookieParser());

// Root route
app.get('/', (req, res) => {
    res.send("Server is ready to use!!!");
});

// API routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/profile', userComplaint);
app.use("/feedback", feedbackroutes);
app.use("/api/v1/rebate/post", rebateroutes);
app.use("/api/v1/account", accountroutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({ success: false, statusCode, message });
});

// Handle CORS preflight requests
app.options('*', cors());

export default app;
