// Lib
import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
// Routes
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
// Other
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

// Increase limit for JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' })); // or higher if needed
app.use(express.urlencoded({ limit: '10mb', extended: true }));


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes)

app.listen(PORT, () => {
    console.log("Server is running on http://localhost:" + PORT);
    connectDB();
})

