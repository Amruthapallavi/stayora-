import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('mongoDB connected');
    } catch (error) {
        console.error('mongodb connection error',error);
        process.exit(1); // check properly- exists process with failure

        
    }
};

export default connectDB;