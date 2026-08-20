import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

const isAllowedOrigin = (origin) => {
    if (!origin) return true;
    const normalized = origin.replace(/\/$/, '');
    if (allowedOrigins.includes(normalized)) return true;
    // Deploy previews / alternate hosts
    try {
        const { hostname } = new URL(normalized);
        if (hostname.endsWith('.vercel.app')) return true;
        if (hostname.endsWith('.netlify.app')) return true;
        if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    } catch {
        return false;
    }
    return false;
};

app.use(cors({
    origin(origin, callback) {
        if (isAllowedOrigin(origin)) {
            // Reflect the exact request origin (required for browsers)
            return callback(null, origin || true);
        }
        return callback(null, false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
}));
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get('/', async (req, res) => {
    res.send('Hello from PromptCraft');
});

app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        service: 'PromptCraft API',
        time: new Date().toISOString(),
    });
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
