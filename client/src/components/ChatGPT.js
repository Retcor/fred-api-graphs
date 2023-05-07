import {useState} from "react";
import {SERVER_PREFIX} from "../App";
import {LinearProgress, TextField, Typography} from "@mui/material";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const ChatGPT = () => {
  const [chatGPTResponse, setChatGPTResponse] = useState([])
  const [loading, setLoading] = useState(false)
  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      setLoading(true)
      try {
        const res = await fetch(`${SERVER_PREFIX}/chat/gpt/prompt?prompt=${e.target.value}`)
        const reply = await res.text()
        setChatGPTResponse([{prompt: e.target.value, reply}, ...chatGPTResponse])
      } catch (e) {
        console.log(e)
      }
      setLoading(false)
    }
  }

  return (
    <div className="ChatGPT">
      <div className="ChatGPTContent">
        <TextField style={{width: '100%'}} label="What is it you wish?" onKeyDown={handleKeyDown}/>
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
                <Typography sx={{ fontSize: 24 }} className="ReplyHistory" color="text.secondary" gutterBottom>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{res.reply}</ReactMarkdown>
                </Typography>
              </>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ChatGPT