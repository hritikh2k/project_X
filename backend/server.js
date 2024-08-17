import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import mongoConnect from "./db/db.js";
import cookieParser from "cookie-parser";
import usersRoutes from "./routes/users.routes.js";


dotenv.config()
const app = express();
const port = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);

app.listen(port, () => {
    console.log(`server is running at ${port}`)
    mongoConnect();
})

