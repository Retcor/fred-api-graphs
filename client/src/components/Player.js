import { StopCircle, VolumeUp } from '@mui/icons-material'
import { IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSpeechSynthesis } from 'react-speech-kit'

const Player = ({ text }) => {
  const [playing, setPlaying] = useState(false)

  const toggle = () => setPlaying(!playing)

  const { speak, cancel } = useSpeechSynthesis({ onEnd: toggle })

  useEffect(() => {
    playing ? speak({ text, volume: 20 }) : cancel()
  },
  [playing]
  )

  return (
    <div>
      <IconButton>
        {playing ? <StopCircle onClick={toggle} /> : <VolumeUp onClick={toggle} />}
      </IconButton>
    </div>
  )
}

export default Player
