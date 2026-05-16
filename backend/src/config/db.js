import mongoose from 'mongoose'

mongoose.set('bufferCommands', false)

export async function connectDB(uri) {
  if (!uri) {
    throw new Error('MONGODB_URI is not set')
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 2000,
    connectTimeoutMS: 2000,
    socketTimeoutMS: 5000,
  })

  console.log('MongoDB connected')
}
