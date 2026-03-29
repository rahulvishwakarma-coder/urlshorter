import mongoose from "mongoose";
import {DB_NAME} from "../../constants.js"


const connectDB = async () =>{
    try {
        const mongodbinstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        console.log(`Database connection successfully on host ${mongodbinstance.connection.host}`)
    } catch (error) {
        console.log(`error occurs during mongodb connection ${error}`)
        throw new Error("DB connection failed");
    }
}

export default connectDB;