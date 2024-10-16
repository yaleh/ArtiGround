import { describe, it, expect } from 'vitest';
import { processResponseArtifacts } from './responseInterceptor';

describe('processResponseArtifacts', () => {
  it('should replace Artifact tags with Markdown code block symbols and extract artifacts', () => {
    const text = `Here is some code:
<Artifact filepath="example.js">
const Example = () => {
  return <div>Hello</div>;
};
</Artifact>`;

    const result = processResponseArtifacts(text, true);

    expect(result.modifiedText).toBe(`Here is some code:
\`\`\`
const Example = () => {
  return <div>Hello</div>;
};
\`\`\``);
    expect(result.artifacts).toEqual([
      {
        filepath: 'example.js',
        content: 'const Example = () => {\n  return <div>Hello</div>;\n};'
      }
    ]);
  });

  it('should handle multiple Artifact blocks', () => {
    const text = `First block:
<Artifact filepath="a.js">
const A = () => <div>A</div>;
</Artifact>
Second block:
<Artifact filepath="b.js">
const B = () => <div>B</div>;
</Artifact>`;

    const result = processResponseArtifacts(text, true);

    expect(result.modifiedText).toBe(`First block:
\`\`\`
const A = () => <div>A</div>;
\`\`\`
Second block:
\`\`\`
const B = () => <div>B</div>;
\`\`\``);
    expect(result.artifacts).toEqual([
      {
        filepath: 'a.js',
        content: 'const A = () => <div>A</div>;'
      },
      {
        filepath: 'b.js',
        content: 'const B = () => <div>B</div>;'
      }
    ]);
  });

  it('should not modify text without Artifact tags', () => {
    const text = 'This is a regular response without any code blocks.';

    const result = processResponseArtifacts(text, true);

    expect(result.modifiedText).toEqual(text);
    expect(result.artifacts).toEqual([]);
  });

  it('should return the original response if there is no text property', () => {
    const text = '';

    const result = processResponseArtifacts(text, true);

    expect(result.modifiedText).toEqual(text);
    expect(result.artifacts).toEqual([]);
  });

  it('should handle empty Artifact tags', () => {
    const text = `Empty block:
<Artifact filepath="empty.txt">
</Artifact>`;

    const result = processResponseArtifacts(text, true);

    expect(result.modifiedText).toBe(`Empty block:
\`\`\`
\`\`\``);
    expect(result.artifacts).toEqual([
      {
        filepath: 'empty.txt',
        content: ''
      }
    ]);
  });

  it('should handle Artifact tags at the beginning of lines', () => {
    const text = `Some text
<Artifact filepath="c.js">
const C = () => <div>C</div>;
</Artifact>
More text`;

    const result = processResponseArtifacts(text, true);

    expect(result.modifiedText).toBe(`Some text
\`\`\`
const C = () => <div>C</div>;
\`\`\`
More text`);
    expect(result.artifacts).toEqual([
      {
        filepath: 'c.js',
        content: 'const C = () => <div>C</div>;'
      }
    ]);
  });

  it('should handle Artifact tags within Markdown code blocks', () => {
    const text = `Here is a code block:

\`\`\`javascript
const x = 1;
<Artifact filepath="d.js">
const D = () => <div>D</div>;
</Artifact>
const y = 2;
\`\`\``;

    const result = processResponseArtifacts(text, true);

    expect(result.modifiedText).toBe(`Here is a code block:

\`\`\`javascript
const x = 1;
\`\`\`
const D = () => <div>D</div>;
\`\`\`
const y = 2;
\`\`\``);
    expect(result.artifacts).toEqual([
      {
        filepath: 'd.js',
        content: 'const D = () => <div>D</div>;'
      }
    ]);
  });

  it('should keep nested Artifact tags unchanged', () => {
    const text = `Nested tags:
<Artifact filepath="outer.js">
const Outer = () => (
  <div>
    <Artifact filepath="inner.js">
    const Inner = () => <span>Inner</span>;
    </Artifact>
    <Inner />
  </div>
);
</Artifact>`;

    const result = processResponseArtifacts(text, true);

    expect(result.modifiedText).toBe(`Nested tags:
\`\`\`
const Outer = () => (
  <div>
    <Artifact filepath="inner.js">
    const Inner = () => <span>Inner</span>;
    </Artifact>
    <Inner />
  </div>
);
\`\`\``);
    expect(result.artifacts).toEqual([
      {
        filepath: 'outer.js',
        content: `const Outer = () => (
  <div>
    <Artifact filepath="inner.js">
    const Inner = () => <span>Inner</span>;
    </Artifact>
    <Inner />
  </div>
);`
      }
    ]);
  });

  it('should handle Artifact tags with attributes', () => {
    const text = `With attributes:
<Artifact filepath="e.js" data-test="example" class="code-block">
const E = () => <div>E</div>;
</Artifact>`;

    const result = processResponseArtifacts(text, true);

    expect(result.modifiedText).toBe(`With attributes:
\`\`\`
const E = () => <div>E</div>;
\`\`\``);
    expect(result.artifacts).toEqual([
      {
        filepath: 'e.js',
        content: 'const E = () => <div>E</div>;'
      }
    ]);
  });

  it('should remove inner ``` in Artifact section', () => {
    const text = `With attributes:

<Artifact filepath="f.js" data-test="example" class="code-block">
\`\`\`tsx
const F = () => <div>F</div>;
\`\`\`
</Artifact>`;

    const result = processResponseArtifacts(text, true);

    expect(result.modifiedText).toBe(`With attributes:

\`\`\`
const F = () => <div>F</div>;
\`\`\``);
    expect(result.artifacts).toEqual([
      {
        filepath: 'f.js',
        content: 'const F = () => <div>F</div>;'
      }
    ]);
  });

  it('should handle Thinking tags and Artifact tags with additional attributes', () => {
    const text = `<Thinking>
The error message "TypeError: Cannot read properties of undefined (reading 'setLocalizer')" suggests that the \`Calendar\` component from \`react-big-calendar\` is being used before it's fully initialized. This is likely happening because the \`setLocalizer\` method is being called at the top level of the file, outside of a component lifecycle method.
</Thinking>

<Artifact type="application/artifacts.react" filepath="App.tsx" title="日历应用">
\`\`\`tsx
import React, { useState } from 'react';
import Calendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const App: React.FC = () => {}
export default App;
\`\`\`
</Artifact>`;

    const result = processResponseArtifacts(text, true);

    expect(result.modifiedText).toBe(`<Thinking>
The error message "TypeError: Cannot read properties of undefined (reading 'setLocalizer')" suggests that the \`Calendar\` component from \`react-big-calendar\` is being used before it's fully initialized. This is likely happening because the \`setLocalizer\` method is being called at the top level of the file, outside of a component lifecycle method.
</Thinking>

\`\`\`
import React, { useState } from 'react';
import Calendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const App: React.FC = () => {}
export default App;
\`\`\``);

    expect(result.artifacts).toEqual([
      {
        filepath: 'App.tsx',
        content: `import React, { useState } from 'react';
import Calendar from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
const App: React.FC = () => {}
export default App;`
      }
    ]);
  });

  it('should handle Artifact tags with React TSX code and additional attributes', () => {
    const text = `Here is the \`<Artifact>\` section with the React TSX code for the App.tsx file:

<Artifact type="application/artifacts.react" filepath="App.tsx" title="GreenTech Chemicals Landing Page">
import React from 'react';
const App: React.FC = () => {
  return (
      <header>
        <h1>GreenTech Chemicals</h1>
        <nav>
          <ul>
            <li><a href="#">About Us</a></li>
          </ul>
        </nav>
      </header>
  );
};
export default App;
</Artifact>

This code creates a simple landing page with a header, main content area, and footer. The design is clean and minimalistic, with a neutral color scheme and a modern font. The navigation menu and social media links are included in the header and footer, respectively.`;

    const result = processResponseArtifacts(text, true);

    expect(result.modifiedText).toBe(`Here is the \`<Artifact>\` section with the React TSX code for the App.tsx file:

\`\`\`
import React from 'react';
const App: React.FC = () => {
  return (
      <header>
        <h1>GreenTech Chemicals</h1>
        <nav>
          <ul>
            <li><a href="#">About Us</a></li>
          </ul>
        </nav>
      </header>
  );
};
export default App;
\`\`\`

This code creates a simple landing page with a header, main content area, and footer. The design is clean and minimalistic, with a neutral color scheme and a modern font. The navigation menu and social media links are included in the header and footer, respectively.`);

    expect(result.artifacts).toEqual([
      {
        filepath: 'App.tsx',
        content: `import React from 'react';
const App: React.FC = () => {
  return (
      <header>
        <h1>GreenTech Chemicals</h1>
        <nav>
          <ul>
            <li><a href="#">About Us</a></li>
          </ul>
        </nav>
      </header>
  );
};
export default App;`
      }
    ]);
  });
});

describe('processResponseArtifacts with modifyResponse false', () => {
  it('should not modify text but still extract artifacts', () => {
    const text = `Here is some code:
<Artifact filepath="example.js">
const Example = () => {
  return <div>Hello</div>;
};
</Artifact>`;

    const result = processResponseArtifacts(text, false);

    expect(result.modifiedText).toBe(text);
    expect(result.artifacts).toEqual([
      {
        filepath: 'example.js',
        content: 'const Example = () => {\n  return <div>Hello</div>;\n};'
      }
    ]);
  });

  it('should handle multiple Artifact blocks without modifying text', () => {
    const text = `First block:
<Artifact filepath="a.js">
const A = () => <div>A</div>;
</Artifact>
Second block:
<Artifact filepath="b.js">
const B = () => <div>B</div>;
</Artifact>`;

    const result = processResponseArtifacts(text, false);

    expect(result.modifiedText).toBe(text);
    expect(result.artifacts).toEqual([
      {
        filepath: 'a.js',
        content: 'const A = () => <div>A</div>;'
      },
      {
        filepath: 'b.js',
        content: 'const B = () => <div>B</div>;'
      }
    ]);
  });

  it('should not modify text with Markdown code blocks', () => {
    const text = `Here is a code block:

\`\`\`javascript
const x = 1;
<Artifact filepath="d.js">
const D = () => <div>D</div>;
</Artifact>
const y = 2;
\`\`\``;

    const result = processResponseArtifacts(text, false);

    expect(result.modifiedText).toBe(text);
    expect(result.artifacts).toEqual([
      {
        filepath: 'd.js',
        content: 'const D = () => <div>D</div>;'
      }
    ]);
  });

  it('should not modify nested Artifact tags', () => {
    const text = `Nested tags:
<Artifact filepath="outer.js">
const Outer = () => (
  <div>
    <Artifact filepath="inner.js">
    const Inner = () => <span>Inner</span>;
    </Artifact>
    <Inner />
  </div>
);
</Artifact>`;

    const result = processResponseArtifacts(text, false);

    expect(result.modifiedText).toBe(text);
    expect(result.artifacts).toEqual([
      {
        filepath: 'outer.js',
        content: `const Outer = () => (
  <div>
    <Artifact filepath="inner.js">
    const Inner = () => <span>Inner</span>;
    </Artifact>
    <Inner />
  </div>
);`
      }
    ]);
  });
});
