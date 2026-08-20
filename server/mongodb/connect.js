import dns from 'dns';
import mongoose from 'mongoose';

// Node was resolving via 127.0.0.1, which refuses SRV lookups for Atlas (querySrv ECONNREFUSED).
dns.setServers(['8.8.8.8', '1.1.1.1']);

const connectDB = async (url) => {
    mongoose.set('strictQuery', true);
    await mongoose.connect(url, { serverSelectionTimeoutMS: 10000 });
    console.log('MongoDB connected successfully');
};

export default connectDB;
