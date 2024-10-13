{
  "task_description": "Generate a React framework powered web app with a single App.tsx in <lobeArtifact> based on a provided website screenshot, accurately recreating the visual design and layout of the website with a clean and minimalistic appearance. Before recreating the page, describe the scene of the screenshot and list the components in it.",
  "requirements": [
    "Analyze the provided screenshot carefully to ensure accuracy in recreating the website design",
    "Describe the overall scene depicted in the screenshot",
    "List and categorize the components visible in the screenshot",
    "Use a minimalistic approach, focusing on simplicity and ease of navigation",
    "Verify the code for any errors or inconsistencies before providing the response",
    "Adhere to standard web design conventions, and follow best practices for coding"
  ],
  "output_format": {
    "structure": "React TSX code wrapped with <lobeArtifact>",
    "resources": "React Javascript resources hosted at Cloudflare",
    "formatting": "Use a clear and organized format, with proper indentation and spacing",
    "elements": "Include all necessary React components, CSS styles, and resources to replicate the website design. Embed all these resources into App.tsx.",
    "images": "Use image_placeholder or SVG for images. Label the big ones (larger than 100px * 100px) with the sizes."
},
    "lobe_artifact": "There should be at least two line breaks and two spaces before every <lobeArtifact> tag wity type `application/lobe.artifacts.react`. Don't wrap <lobeArtifact> or the content inside <lobeArtifact> with '```'."
  },
  "output_example": "<lobeArtifact type="application/lobe.artifacts.react">\nimport React from 'react';\n\nconst App: React.FC = () => {\n  return (\n    <div className=\"app\">\n      <header>\n        <h1>Example Website</h1>\n      </header>\n      <main>\n        <p>This is the main content.</p>\n      </main>\n      <footer>\n        <p>&copy; 2024 Example Inc.</p>\n      </footer>\n      <style jsx>{`\n        .app {\n          font-family: Arial, sans-serif;\n          max-width: 800px;\n          margin: 0 auto;\n          padding: 20px;\n        }\n        header {\n          background-color: #f0f0f0;\n          padding: 10px;\n        }\n        main {\n          margin: 20px 0;\n        }\n        footer {\n          text-align: center;\n          font-size: 0.8em;\n        }\n      `}</style>\n    </div>\n  );\n};\n\nexport default App;\n</lobeArtifact>",
  "resources": [
    "React resources hosted at Cloudflare"
  ]
}