import express from 'express'
import { v1ConvertTextToSpeech, v1GetTextToSpeech } from "../services/textToSpeechService.js";

const router = express.Router()
router.get('/v1/convert', async (req, res, next) => {
    try {
        // Make a request to the third-party API that returns the audio byte stream
        const convertRes = await v1ConvertTextToSpeech(req.query.prompt, req.query.voice)
        const getRes = await v1GetTextToSpeech(convertRes.transcriptionId)

        res.send(getRes.audioUrl[0])
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router
