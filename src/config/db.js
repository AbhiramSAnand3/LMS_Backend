import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfull!!y🚀");
    } catch (error) {
        console.log(error);
    }
};

export default connectDB;