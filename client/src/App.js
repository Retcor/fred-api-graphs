import './App.css'
import ChatGPT from './components/ChatGPT'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import HeaderBar from './components/HeaderBar'
import NoPage from './components/NoPage'
import ScratchPage from './components/ScratchPage'
import { Route, Routes } from 'react-router-dom'
import StoryBook from "./components/StoryBook";

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

export const SERVER_PREFIX = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_PREFIX || `http://${window.location.hostname}:3001`

function App () {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className='App'>
        <HeaderBar />
        <div className='App-content'>
          <Routes>
            <Route path='/' element={<ChatGPT />} />
            <Route path='/storybook' element={<StoryBook />} />
            <Route path='/scratch' element={<ScratchPage />} />
            <Route path='*' element={<NoPage />} />
          </Routes>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
