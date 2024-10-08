import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import mongoConnect from "./db/db.js";
import cookieParser from "cookie-parser";
import usersRoutes from "./routes/users.routes.js";
import postRoutes from "./routes/post.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import { v2 as cloudinary } from "cloudinary";


const app = express();
const port = process.env.PORT || 3000;
dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDNARY_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET

})


app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/post", postRoutes);
app.use("/api/notification", notificationRoutes);

app.listen(port, () => {
    console.log("");
    console.log(`http://localhost:${port}`)
    mongoConnect();
})

