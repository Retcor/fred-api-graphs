import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import cors from 'cors'

import fredRouter from './routes/fred.js'
import chatgptRouter from './routes/chatgpt.js'
import textToSpeechRouter from './routes/textToSpeech.js'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

var app = express()

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/fred', fredRouter)
app.use('/chat/gpt', chatgptRouter)
app.use('/text/to/speech', textToSpeechRouter)

app.get('/health', (req, res) => {
  res.status(200).send('Healthy');
})

app.get('/', (req, res) => {
  res.status(200).send('Healthy');
})

export default app
