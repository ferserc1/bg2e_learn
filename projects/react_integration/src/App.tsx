import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import MyAppController from './AppController.ts'
import WebGLRenderer from 'bg2e-js/ts/render/webgl/Renderer.js'
import './App.css'
import useBg2e from "bg2e-js/ts/react/useBg2e.ts";

function App() {
  const [count, setCount] = useState(0);
  useBg2e(
    "#bg2eCanvas",
    WebGLRenderer,
    MyAppController
  );
  
  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
