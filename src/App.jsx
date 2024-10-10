import { useState } from 'react'
import './App.css'
import SandpackEditor from './SandpackEditor'

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState('react-ts')

  const templates = [
    'static',
    'angular',
    'react',
    'react-ts',
    'solid',
    'svelte',
    'vanilla',
    'vanilla-ts',
    'vue',
    'vue-ts'
  ]
  return (
    <>
      <h1>Vite + React</h1>
      <div className="template-selector">
        <label htmlFor="template-select">Select Template: </label>
        <select
          id="template-select"
          value={selectedTemplate}
          onChange={(e) => setSelectedTemplate(e.target.value)}
        >
          {templates.map((template) => (
            <option key={template} value={template}>
              {template}
            </option>
          ))}
        </select>
      </div>
      <div className="sp-wrapper">
        <SandpackEditor template={selectedTemplate} />
      </div>
    </>
  )
}

export default App
