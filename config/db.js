import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const uri = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${uri.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a failure code
  }
};

export default connectDB;
