import './App.css'
import ChatGPT from './components/ChatGPT'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const darkTheme = createTheme({
  palette: {
    mode: 'dark'
  }
})

export const SERVER_PREFIX = process.env.REACT_APP_API_URL || process.env.REACT_APP_API_PREFIX || 'http://localhost:3001'

function App () {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className='App'>
        <header className='App-header'>
          <ChatGPT />
        </header>
      </div>
    </ThemeProvider>
  )
}

export default App
