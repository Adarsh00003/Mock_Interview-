import mongoose from "mongoose";

const connectDb = async () => {
    try {
        const uri = process.env.MONGODB_URL || process.env.MONGO_URI
        if (!uri) {
            throw new Error('Missing MongoDB connection URI in env variable MONGODB_URL or MONGO_URI')
        }
        await mongoose.connect(uri)
        console.log("DataBase Connected")
    } catch (error) {
        console.error(`DataBase Error ${error}`)
    }
}

export default connectDb