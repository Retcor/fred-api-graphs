import React, { useEffect, useRef, useState } from 'react'
import { SERVER_PREFIX } from "../App"
import { IconButton, List, ListItemButton, ListItemText, Popover, CircularProgress } from "@mui/material"
import { PlayCircleOutline, PauseCircleOutline } from "@mui/icons-material"

const DAN_VOICE = 's3://voice-cloning-zero-shot/0f22b1b5-7ee8-4ad5-a553-9250fd8987cb/me/manifest.json'
const ALICIA_VOICE = 's3://voice-cloning-zero-shot/98429117-4da4-4aaf-9aee-017c81ef40da/leeshie/manifest.json'
const LITTLE_GUY_VOICE = 's3://voice-cloning-zero-shot/ff0e0869-64a4-48ed-8442-c5eb0782d27d/little-guy/manifest.json'
const BOOBOO_VOICE = 's3://voice-cloning-zero-shot/366fb501-a799-4b4f-ab13-8f6ded52f9b6/booboo/manifest.json'
const DAVEED_VOICE = 's3://voice-cloning-zero-shot/db6863d7-70c1-4479-8195-9eaee7365d7a/daveed/manifest.json'
const KAIUUHH_VOICE = 's3://voice-cloning-zero-shot/e4c22af0-dedf-4059-89b7-5e6e095acd9b/kaiuuuhh/manifest.json'
const CARUUHH_VOICE = 's3://voice-cloning-zero-shot/8828acd3-5824-4667-a7f8-6c3f82718578/caruuhh/manifest.json'
const CARTERMAN_VOICE = 's3://voice-cloning-zero-shot/189d5919-bfb6-42ac-a890-2db4421fb395/carterman/manifest.json'
const VOICE_MAP = [
  {
    id: DAN_VOICE,
    name: 'Dan'
  },
  {
    id: ALICIA_VOICE,
    name: 'Alicia'
  },
  {
    id: LITTLE_GUY_VOICE,
    name: 'Little Guy'
  },
  {
    id: BOOBOO_VOICE,
    name: 'Booboo'
  },
  {
    id: DAVEED_VOICE,
    name: 'Daveed'
  },
  {
    id: KAIUUHH_VOICE,
    name: 'Kaiuuhh'
  },
  {
    id: CARUUHH_VOICE,
    name: 'Caruuhh'
  },
  {
    id: CARTERMAN_VOICE,
    name: 'Carterman'
  }
]

const AudioStreamPlayer = ({ prompt }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const [audioMap, setAudioMap] = useState({})
  const [anchorEl, setAnchorEl] = useState(null)
  const [isVoiceLoading, setIsVoiceLoading] = useState(false)

  useEffect(() => {
    const audioElement = audioRef.current

    const handleAudioEnded = () => {
      setIsPlaying(false)
    }

    audioElement.addEventListener('ended', handleAudioEnded)

    return () => {
      audioElement.removeEventListener('ended', handleAudioEnded)
    }
  }, [])

  const handlePlayButton = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleVoiceSelect = async (voice) => {
    const audioElement = audioRef.current
    handleClose()

    if (!audioMap || !audioMap[voice]) {
      setIsVoiceLoading(true)
      const res = await fetch(`${SERVER_PREFIX}/text/to/speech/v1/convert?prompt=${prompt}&voice=${voice}`)
      const url = await res.text()
      setIsVoiceLoading(false)
      const newAudioMap = {...audioMap}
      newAudioMap[voice] = url
      setAudioMap(newAudioMap)

      audioElement.src = url
      audioElement.play()
    } else {
      audioElement.src = audioMap[voice]
      audioElement.play()
    }

    setIsPlaying(true)
  }

  const handlePause = () => {
    if (isPlaying) {
      const audioElement = audioRef.current
      audioElement.pause()
      setIsPlaying(false)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  return (
    <div>
      <audio ref={audioRef} />
      <IconButton>
        {isPlaying ? <PauseCircleOutline onClick={handlePause} /> : isVoiceLoading ? <CircularProgress size={24} /> : <PlayCircleOutline onClick={handlePlayButton} />}
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <List>
          {
            VOICE_MAP.map(voice => (
              <ListItemButton onClick={() => handleVoiceSelect(voice.id)}>
                <ListItemText primary={voice.name} />
              </ListItemButton>
            ))
          }
        </List>
      </Popover>
    </div>
  )
}

export default AudioStreamPlayer
