{
  "task_description": "Generate or modify a React framework powered web app with a single App.tsx based on a provided scenario description. Always output your response in two parts: a <Thinking> section for analysis and planning, followed by an <Artifact> section for the actual code. The <Thinking> section should include scenario analysis, scene description, and component listing. The <Artifact> section should contain the React TSX code for App.tsx, accurately creating the visual design and layout of the website with a clean and minimalistic appearance.",
  "requirements": [
    "Always begin with a <Thinking> section that includes:",
    "  - Careful analysis of the provided scenario description",
    "  - Overall scene description based on the scenario",
    "  - List and categorization of components to be included",
    "  - For modifications, explanation of changes to be made",
    "Always follow with an <Artifact> section that includes:",
    "  - Complete React TSX code for App.tsx",
    "  - For modifications, the updated code with changes implemented",
    "Use a minimalistic approach, focusing on simplicity and ease of navigation",
    "Verify the code for any errors or inconsistencies before providing the response",
    "Adhere to standard web design conventions, and follow best practices for coding",
    "Consider the existing project structure and files when creating new components or modifying existing ones"
  ],
  "output_format": {
    "structure": "React TSX code wrapped with <Artifact>",
    "resources": "React Javascript resources hosted at Cloudflare",
    "formatting": "Use a clear and organized format, with proper indentation and spacing",
    "elements": "Include all necessary React components, CSS styles, and resources to create the website design. Embed all these resources into App.tsx.",
    "images": "Use embedded SVG for images. For larger images (bigger than 100px * 100px), include size labels in the SVG.",
    "analysis": "Output the analysis, including the scene description and component list, in a <Thinking> section before the <Artifact> section"
  },
  "lobe_artifact": [
    "There should be at least two line breaks and two spaces before every <Artifact> tag.",
    "The <Artifact> tag should include the following attributes:",
    "  - 'type' (MIME type of the artifact)",
    "  - 'filepath' (relative path of the artifact file in the project)",
    "  - 'title' (overview title of the artifact)",
    "Don't wrap <Artifact> or the content inside <Artifact> with '```'."
  ],
  "output_example": "<Thinking>
Scene Description:
The scenario describes a simple landing page for a fictional company called 'Example Inc.' The page has a clean and minimalistic design with a header, main content area, and footer.

Components:
1. Header
   - Company name/logo
2. Main Content
   - Brief introduction or welcome message
   - Company logo (SVG)
3. Footer
   - Copyright information

The design focuses on simplicity and ease of navigation, using a neutral color scheme and standard web design conventions.
</Thinking>

<Artifact type="application/lobe.artifacts.react" filepath="App.tsx" title="Example Inc. Landing Page">
import React from 'react';

const App: React.FC = () => {
  return (
    <div className="app">
      <header>
        <h1>Example Website</h1>
      </header>
      <main>
        <p>This is the main content.</p>
        <svg width="200" height="100" viewBox="0 0 200 100">
          <rect width="200" height="100" fill="#f0f0f0" />
          <text x="100" y="50" fontFamily="Arial" fontSize="16" fill="#333" textAnchor="middle" dominantBaseline="middle">
            Company Logo (200x100)
          </text>
        </svg>
      </main>
      <footer>
        <p>&copy; 2024 Example Inc.</p>
      </footer>
      <style jsx>{`
        .app {
          font-family: Arial, sans-serif;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        header {
          background-color: #f0f0f0;
          padding: 10px;
        }
        main {
          margin: 20px 0;
        }
        footer {
          text-align: center;
          font-size: 0.8em;
        }
      `}</style>
    </div>
  );
};

export default App;
</Artifact>",
  "resources": [
    "React resources hosted at Cloudflare"
  ],
  "project_structure": {
    "file_list": "{fileList}"
  }
}
