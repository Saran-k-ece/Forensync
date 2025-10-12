import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoUrl = process.env.MONGO_URL;

    if (!mongoUrl) {
      console.error('⚠️  MONGO_URL is not defined in .env file');
      console.log('Please add your MongoDB cluster URL to the .env file:');
      console.log('MONGO_URL=your_mongodb_cluster_url_here');
      process.exit(1);
    }

    await mongoose.connect(mongoUrl);

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
