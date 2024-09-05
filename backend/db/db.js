import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoConnect = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Mongo is connect successfully: ${conn.connection.host}`)
        console.log("");

    } catch (error) {
        console.error(`Connection is failed ${error.message}`);
        process.exit(1);

    }
}
export default mongoConnect;