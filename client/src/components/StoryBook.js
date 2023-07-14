import { useState } from 'react'
import { SERVER_PREFIX } from '../App'
import {
  Grid,
  IconButton,
  CircularProgress,
  TextField,
  Typography, Pagination, useMediaQuery, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Clear, Send } from '@mui/icons-material'
import { v4 } from 'uuid'
import AudioStreamPlayer from "./AudioStreamPlayer"
import Button from "@mui/material/Button";

export const StoryBook = () => {
  const [storyBookPages, setStoryBookPages] = useState([])
  const [loading, setLoading] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [page, setPage] = useState(1)
  const [percentage, setPercentage] = useState(0)
  const [loadingDescription, setLoadingDescription] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down('md'))
  const handleClearClick = () => {
    setPrompt('')
  }

  const handleChange = (event, value) => {
    setPage(value);
  }

  const getGPTResponse = async () => {
    setLoading(true)
    setStoryBookPages([])
    setConfirmOpen(false)
    try {
      setLoadingDescription(`Generating story...`)
      const res = await fetch(`${SERVER_PREFIX}/chat/gpt/prompt?prompt=${prompt}`)
      const reply = await res.text()
      const replyArr = reply.split('\n').filter(i => i)

      // Average time to generate all images is 5 seconds plus a 1 second for each image, minus 1
      const durationInSeconds = 5 + replyArr.length - 1
      const intervalTime = Math.floor((durationInSeconds * 1000) / 100); // Interval time for each 1% progress
      const interval = setInterval(() => {
        setPercentage((prevPercentage) => {
          const newPercentage = prevPercentage + 1
          if (newPercentage >= 100) {
            clearInterval(interval)
          }
          return newPercentage
        });
      }, intervalTime)

      setLoadingDescription(`Generating image${replyArr.length > 1 ? 's' : ''}...`)
      const replyImgArr = await Promise.all(replyArr.map(async i => {
        const imageRes = await fetch(`${SERVER_PREFIX}/chat/gpt/image/prompt?prompt=${i}`)
        const image = await imageRes.text()
        return {
          id: v4(),
          reply: i,
          image
        }
      }))
      clearInterval(interval)
      setPercentage(0)
      setStoryBookPages(replyImgArr)
    } catch (ex) {
      console.log(ex)
    }
    setLoading(false)
  }

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      if (storyBookPages.length) {
        setConfirmOpen(true)
      } else {
        await getGPTResponse()
      }
    }
  }

  const handleClose = () => {
    setConfirmOpen(false)
  }

  return (
    <div className='ChatGPT'>
      <div className='ChatGPTContent'>
        <Dialog open={confirmOpen} onClose={handleClose}>
          <DialogTitle>Confirmation</DialogTitle>
          <DialogContent>
            <p>Are you sure you want to generate a new story? This will replace the current story.</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={getGPTResponse} variant="contained" color="primary">
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
        <TextField
          style={{ width: '100%' }}
          label='What story would you like to hear about today?'
          className='ChatGPTTextField'
          onKeyDown={handleKeyDown}
          onChange={e => setPrompt(e.target.value)}
          value={prompt}
          disabled={loading}
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
                {loading && (
                  <div style={{ position: 'absolute', bottom: '0', width: '100%', height: '20%' }}>
                    <span style={{ position: 'relative', top: '30px', left: '45%' }}>{loadingDescription}</span>
                    <LinearProgress
                      variant="determinate"
                      value={percentage}
                      style={{ position: 'absolute', bottom: '0', width: '100%', height: '100%' }}
                    />
                  </div>
                )}
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
                  <Typography sx={{ fontSize: { xs: 18, md: 24 } }} className='ReplyHistory' color='text.secondary' gutterBottom>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{storyBookPages[page - 1].reply}</ReactMarkdown>
                  </Typography>
                </Grid>
                {storyBookPages[page - 1].image && (
                  <Grid key={storyBookPages[page - 1].id} item>
                    <img style={{ width: isMobile ? 128 : 256, height: isMobile ? 128 : 256 }} alt='No Image canneth be foundest' src={`data:image/png;base64,${storyBookPages[page - 1].image}`}/>
                  </Grid>
                )}
              </Grid>
              <Grid container spacing={1} alignItems='flex-start' justifyContent='center' className='Pagination'>
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
