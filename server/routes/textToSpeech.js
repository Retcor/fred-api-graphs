import express from 'express'
import {
    v1ConvertTextToSpeech,
    v1GetTextToSpeech,
    v2GetStreamURL,
    v2StreamFromURL
} from "../services/textToSpeechService.js";

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

router.post('/v2/stream', async (req, res, next) => {
    try {
        // Make a request to the third-party API that returns the audio byte stream
        const streamData = await v2GetStreamURL(req.query.prompt, req.query.voice)
        const stream = await v2StreamFromURL(streamData)
        stream.pipe(res)
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default router
