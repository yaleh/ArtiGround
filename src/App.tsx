import { useState } from 'react'
import './App.css'
import SandpackEditor from './SandpackEditor'

type Template = 'static' | 'angular' | 'react' | 'react-ts' | 'solid' | 'svelte' | 'vanilla' | 'vanilla-ts' | 'vue' | 'vue-ts'

function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<Template>('react-ts')

  const templates: Template[] = [
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
    <div className="app-container">
      <header className="app-header">
        <h1>ChatGround</h1>
        <div className="template-selector">
          <label htmlFor="template-select">Template: </label>
          <select
            id="template-select"
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value as Template)}
          >
            {templates.map((template) => (
              <option key={template} value={template}>
                {template}
              </option>
            ))}
          </select>
        </div>
      </header>
      <div className="main-content">
        <div className="chat-container">
          {/* Chat component will be added here in the next stage */}
        </div>
        <div className="sp-wrapper">
          <SandpackEditor template={selectedTemplate} />
        </div>
      </div>
    </div>
  )
}

export default App