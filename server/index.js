import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

//middleware
app.use(cors({ origin: FRONTEND_URL }));
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get('/', async (req, res) => {
    res.send('Hello from PromptCraft');
});

const startServer = async () => {
    try {
        await connectDB(process.env.MONGODB_URL);
        app.listen(PORT, () => console.log(`Server has started on port http://localhost:${PORT}`));
    } catch (error) {
        console.error('Failed to start server:', error.message || error);
        process.exit(1);
    }
};

startServer();
