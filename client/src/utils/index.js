import FileSaver from 'file-saver';
import { surpriseMePrompts } from '../constants';

export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080')
    .split(',')[0]
    .trim();

export function getRandomPrompt(prompt) {
    const randomIndex = Math.floor(Math.random() * surpriseMePrompts.length);
    const randomPrompt = surpriseMePrompts[randomIndex];

    if (randomPrompt === prompt) return getRandomPrompt(prompt);

    return randomPrompt;
}

export async function downloadImage(_id, photo) {
    FileSaver.saveAs(photo, `download-${_id}.jpg`);
}