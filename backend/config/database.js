import mongoose from 'mongoose';

const connectDB = async()=>{
    try{
          await mongoose.connect("mongodb+srv://Police:forensync@cluster0.zl38uzw.mongodb.net/Forensync")
          console.log("Database Connected")

    }catch(err)
    {
        console.error(`❌ Error: ${err.message}`);
        process.exit(1);
        
    }
}


export default connectDB;
