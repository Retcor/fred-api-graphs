import express from 'express'
import { prompt } from '../services/chatgptService.js'
const router = express.Router()

/* GET users listing. */
router.get('/prompt', async (req, res, next) => {
    res.send(await prompt(req.query.prompt))
});

export default router
