import { useState } from 'react'
import { SERVER_PREFIX } from '../App'
import {
  Grid,
  IconButton,
  CircularProgress,
  TextField,
  Typography, Pagination
} from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Clear, Send } from '@mui/icons-material'
import { v4 } from 'uuid'
import AudioStreamPlayer from "./AudioStreamPlayer"

export const StoryBook = () => {
  const [storyBookPages, setStoryBookPages] = useState([])
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [page, setPage] = useState(1)
  const handleClearClick = () => {
    setPrompt('')
  }

  const handleChange = (event, value) => {
    setPage(value);
  }

  const getGPTResponse = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${SERVER_PREFIX}/chat/gpt/prompt?prompt=${prompt}`)
      const reply = await res.text()
      const replyArr = reply.split('\n').filter(i => i)
      const replyImgArr = await Promise.all(replyArr.map(async i => {
        const imageRes = await fetch(`${SERVER_PREFIX}/chat/gpt/image/prompt?prompt=${i}`)
        const image = await imageRes.text()
        return {
          id: v4(),
          reply: i,
          image
        }
      }))
      setStoryBookPages(replyImgArr)
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
          style={{ width: '100%' }}
          label='What story would you like to hear about today?'
          className='ChatGPTTextField'
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
                  {loading ? <CircularProgress size='1.5rem' /> : <Send />}
                </IconButton>
              </>
            )
          }}
        />
        <div>
          {storyBookPages.length > 0 && (
            <div >
              <Grid key={storyBookPages[page - 1].id} container spacing={3} alignItems='flex-start'>
                <Grid key={storyBookPages[page - 1].id} item style={{ width: '50px' }}>
                  <AudioStreamPlayer key={storyBookPages[page - 1].id} prompt={storyBookPages[page - 1].reply} />
                </Grid>
                <Grid key={storyBookPages[page - 1].id} item xs>
                  <Typography sx={{ fontSize: 24 }} className='ReplyHistory' color='text.secondary' gutterBottom>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{storyBookPages[page - 1].reply}</ReactMarkdown>
                  </Typography>
                </Grid>
                <Grid key={storyBookPages[page - 1].id} item style={{ width: '256px' }} className='DallEImg'>
                  <img alt='No Image canneth be foundest' src={`data:image/png;base64,${storyBookPages[page - 1].image}`}/>
                </Grid>
              </Grid>
              <Grid container spacing={1} alignItems='flex-start' justifyContent='center'>
                <Pagination count={storyBookPages.length} page={page} onChange={handleChange} />
              </Grid>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default StoryBook
