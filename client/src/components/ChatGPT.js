import { useState } from 'react'
import { SERVER_PREFIX } from '../App'
import {
  Grid,
  IconButton,
  CircularProgress,
  TextField,
  Typography
} from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Clear, Send } from '@mui/icons-material'
import { v4 } from 'uuid'
import Player from './Player'

export const ChatGPT = () => {
  const [chatGPTResponse, setChatGPTResponse] = useState([])
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const handleClearClick = () => {
    setPrompt('')
  }

  const getGPTResponse = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${SERVER_PREFIX}/chat/gpt/prompt?prompt=${prompt}`)
      const reply = await res.text()
      setChatGPTResponse([{ prompt, reply, id: v4() }, ...chatGPTResponse])
    } catch (ex) {
      console.log(ex)
    }
    setLoading(false)
  }

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      await getGPTResponse()
    }
  }

  return (
    <div className='ChatGPT'>
      <div className='ChatGPTContent'>
        <TextField
          style={{ width: '100%' }} label='What is it you wish?'
          onKeyDown={handleKeyDown}
          onChange={e => setPrompt(e.target.value)}
          value={prompt}
          InputProps={{
            endAdornment: (
              <>
                <IconButton
                  sx={{ visibility: prompt ? 'visible' : 'hidden' }}
                  onClick={handleClearClick}
                >
                  <Clear />
                </IconButton>
                <IconButton
                  sx={{ visibility: prompt ? 'visible' : 'hidden' }}
                  onClick={getGPTResponse}
                >
                  {loading ? <CircularProgress color='success' size='1.5rem' /> : <Send />}
                </IconButton>
              </>
            )
          }}
        />
        <div>
          {chatGPTResponse.map(res => (
            <div key={res.id}>
              <Typography key={res.id} sx={{ fontSize: 14 }} className='PromptHistory' color='text.secondary' gutterBottom>
                {res.prompt}
              </Typography>
              <Grid key={res.id} container spacing={2} alignItems='flex-start'>
                <Grid key={res.id} item style={{ width: '50px' }}>
                  <Player key={res.id} text={res.reply} />
                </Grid>
                <Grid key={res.id} item xs>
                  <Typography sx={{ fontSize: 24 }} className='ReplyHistory' color='text.secondary' gutterBottom>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{res.reply}</ReactMarkdown>
                  </Typography>
                </Grid>
              </Grid>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ChatGPT
