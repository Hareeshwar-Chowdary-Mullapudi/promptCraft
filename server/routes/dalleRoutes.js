import express from 'express';
import * as dotenv from 'dotenv';
import { InferenceClient } from '@huggingface/inference';

dotenv.config();

const router = express.Router();

const hf = new InferenceClient(process.env.HF_TOKEN);
const HF_MODEL = process.env.HF_MODEL || 'black-forest-labs/FLUX.1-schnell';

router.route('/').get((req, res) => {
    res.status(200).json({ message: 'Hello from PromptCraft!' });
});

router.route('/').post(async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ message: 'Prompt is required' });
        }

        if (!process.env.HF_TOKEN) {
            return res.status(500).json({ message: 'HF_TOKEN is not configured' });
        }

        const imageBlob = await hf.textToImage({
            model: HF_MODEL,
            inputs: prompt,
            provider: 'auto',
        });

        const arrayBuffer = await imageBlob.arrayBuffer();
        const image = Buffer.from(arrayBuffer).toString('base64');

        res.status(200).json({ photo: image });
    } catch (error) {
        console.error(error);
        const message =
            error?.message ||
            error?.error ||
            'Something went wrong generating the image';
        res.status(500).send(message);
    }
});

export default router;
