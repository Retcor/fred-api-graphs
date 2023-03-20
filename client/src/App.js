import logo from './logo.svg';
import './App.css';

export const SERVER_PREFIX = process.env.REACT_APP_API_PREFIX || 'http://localhost:3001'
const fetchTest = fetch(`${SERVER_PREFIX}/fred/test`).then(async res => console.log(await res.json()))

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
