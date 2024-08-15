import express from "express";
import authRoutes from "./routes/auth.routes.js";
import dotenv from "dotenv";
import mongoConnect from "./db/db.js";

dotenv.config()
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());
app.use("/api/auth", authRoutes)



app.listen(port, () => {
    console.log(`server is running at ${port}`)
    mongoConnect();
})

