import express from 'express'
import { image, prompt } from '../services/chatgptService.js'
const router = express.Router()
router.get('/prompt', async (req, res, next) => {
    res.send(await prompt(req.query.prompt))
});

router.get('/image/prompt', async (req, res, next) => {
    res.send(await image(req.query.prompt))
});

export default router
