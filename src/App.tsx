import './App.css'
import SandpackEditor from './SandpackEditor'
import Chat from './Chat'
import { TemplateProvider } from './TemplateContext'
import TemplateSelector from './TemplateSelector'

function App() {
  return (
    <TemplateProvider>
      <div className="app-container">
        <header className="app-header">
          <h1>ChatGround</h1>
          <TemplateSelector />
        </header>
        <div className="main-content">
          <div className="chat-container">
            <Chat />
          </div>
          <div className="sp-wrapper">
            <SandpackEditor />
          </div>
        </div>
      </div>
    </TemplateProvider>
  )
}

export default App
