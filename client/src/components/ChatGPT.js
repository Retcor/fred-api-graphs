import {useState} from "react";
import {SERVER_PREFIX} from "../App";
import {Grid, IconButton, LinearProgress, TextField, Typography} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {Clear, Send, StopCircle, VolumeUp} from "@mui/icons-material";
import {useSpeechSynthesis} from "react-speech-kit";

export const ChatGPT = () => {
  const [chatGPTResponse, setChatGPTResponse] = useState([])
  const [loading, setLoading] = useState(false)
  const [value, setValue] = useState('')
  const { speak, cancel, speaking } = useSpeechSynthesis()
  const handleClearClick = () => {
    setValue('');
  };

  const getGPTResponse = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${SERVER_PREFIX}/chat/gpt/prompt?prompt=${value}`)
      const reply = await res.text()
      setChatGPTResponse([{prompt: value, reply}, ...chatGPTResponse])
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

  const handleSpeak = (text) => {
    if (speaking) {
      cancel()
    } else {
      speak({text: text})
    }
  }

  return (
    <div className="ChatGPT">
      <div className="ChatGPTContent">
        <TextField
          style={{width: '100%'}} label="What is it you wish?"
          onKeyDown={handleKeyDown}
          onChange={e => setValue(e.target.value)}
          value={value}
          InputProps={{
            endAdornment: (
              <>
                <IconButton
                  sx={{ visibility: value ? "visible" : "hidden" }}
                  onClick={handleClearClick}
                >
                  <Clear />
                </IconButton>
                <IconButton
                  sx={{ visibility: value ? "visible" : "hidden" }}
                  onClick={getGPTResponse}
                >
                  <Send />
                </IconButton>
              </>
            ),
          }}
        />
        <br/>
        <br/>
        <div>
          {loading && <LinearProgress color="success"/>}
          {chatGPTResponse.map(res => {
            return (
              <>
                <Typography sx={{ fontSize: 14 }} className="PromptHistory" color="text.secondary" gutterBottom>
                  {res.prompt}
                </Typography>
                <Grid container spacing={2} alignItems="flex-start">
                  <Grid item style={{ width: '50px' }}>
                    <IconButton onClick={() => handleSpeak(res.reply)}>
                      {speaking ? <StopCircle/> : <VolumeUp />}
                    </IconButton>
                  </Grid>
                  <Grid item xs>
                    <Typography sx={{ fontSize: 24 }} className="ReplyHistory" color="text.secondary" gutterBottom>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{res.reply}</ReactMarkdown>
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ChatGPT