import { config } from "dotenv";

import User from "../models/user.model.js";
import connectDB from "../libs/db.js";

config();

const seedUsers = [
    {
        email: "raj.kumar@example.com",
        fullname: "Raj Kumar",
        password: "123456",
        profilePic: "https://img.freepik.com/free-photo/cheerful-indian-businessman-smiling-closeup-portrait-jobs-career-campaign_53876-129416.jpg",
    },
    {
        email: "arjun.singh@example.com",
        fullname: "Arjun Singh",
        password: "123456",
        profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRwby0BOxy3Q1gZtWpJ8L_3msYD-D54NzuWg&s",
    },
    {
        email: "vikram.patel@example.com",
        fullname: "Vikram Patel",
        password: "123456",
        profilePic: "https://www.shutterstock.com/image-photo/happy-young-millennial-indian-businessman-260nw-2153777469.jpg",
    },
    {
        email: "rahul.sharma@example.com",
        fullname: "Rahul Sharma",
        password: "123456",
        profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaLLX2I6y2zcyigOcMs58TZd70l3ka8j5ysA&s",
    },
    {
        email: "akshay.mishra@example.com",
        fullname: "Akshay Mishra",
        password: "123456",
        profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYGxilwrKKK5WPcX_SFnGfR65DQA4hz48yLg&s",
    },
    {
        email: "anita.yadav@example.com",
        fullname: "Anita Yadav",
        password: "123456",
        profilePic: "https://www.shutterstock.com/image-photo/close-head-shot-portrait-preppy-260nw-1433809418.jpg",
    },
    {
        email: "sita.kapoor@example.com",
        fullname: "Sita Kapoor",
        password: "123456",
        profilePic: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTCwXUFTVjD_08iDhYUk9q-WNbF2o7c3RM4Mw&s",
    },
    {
        email: "meera.gupta@example.com",
        fullname: "Meera Gupta",
        password: "123456",
        profilePic: "https://media.istockphoto.com/id/1338134319/photo/portrait-of-young-indian-businesswoman-or-school-teacher-pose-indoors.jpg?s=612x612&w=0&k=20&c=Dw1nKFtnU_Bfm2I3OPQxBmSKe9NtSzux6bHqa9lVZ7A=",
    },

];

const seedDatabase = async () => {
    try {
        await connectDB();
        await User.insertMany(seedUsers);
        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
    }
};

// Call the function
seedDatabase();
