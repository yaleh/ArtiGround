import { describe, it, expect } from 'vitest';
import { processResponseArtifacts } from './responseInterceptor';

describe('processResponseArtifacts', () => {
  it('should replace Artifact tags with Markdown code block symbols', () => {
    const text = `Here is some code: <Artifact type="application/lobe.artifacts.react">
const Example = () => {
  return <div>Hello</div>;
};
</Artifact>`;

    const result = processResponseArtifacts(text);

    expect(result).toBe(`Here is some code: 
\`\`\`
const Example = () => {
  return <div>Hello</div>;
};
\`\`\``);
  });

  it('should handle multiple Artifact blocks', () => {
    const text = `First block: <Artifact type="application/lobe.artifacts.react">
const A = () => <div>A</div>;
</Artifact>
Second block: <Artifact type="application/lobe.artifacts.react">
const B = () => <div>B</div>;
</Artifact>`;

    const result = processResponseArtifacts(text);

    expect(result).toBe(`First block: 
\`\`\`
const A = () => <div>A</div>;
\`\`\`
Second block: 
\`\`\`
const B = () => <div>B</div>;
\`\`\``);
  });

  it('should not modify text without Artifact tags', () => {
    const text = 'This is a regular response without any code blocks.';

    const result = processResponseArtifacts(text);

    expect(result).toEqual(text);
  });

  it('should return the original response if there is no text property', () => {
    const text = 'This is a regular response without any code blocks.';

    const result = processResponseArtifacts(text);

    expect(result).toEqual(text);
  });

  it('should handle empty Artifact tags', () => {
    const text = 'Empty block: <Artifact type="application/lobe.artifacts.react"></Artifact>';

    const result = processResponseArtifacts(text);

    expect(result).toBe(`Empty block: 
\`\`\`
\`\`\``);
  });

  it('should handle Artifact tags at the beginning of lines', () => {
    const text = `Some text
<Artifact type="application/lobe.artifacts.react">
const C = () => <div>C</div>;
</Artifact>
More text`;

    const result = processResponseArtifacts(text);

    expect(result).toBe(`Some text
\`\`\`
const C = () => <div>C</div>;
\`\`\`
More text`);
  });

  it('should handle Artifact tags within Markdown code blocks', () => {
    const text = `Here is a code block:

\`\`\`javascript
const x = 1;
<Artifact type="application/lobe.artifacts.react">
const D = () => <div>D</div>;
</Artifact>
const y = 2;
\`\`\``;

    const result = processResponseArtifacts(text);

    expect(result).toBe(`Here is a code block:

\`\`\`javascript
const x = 1;
\`\`\`
const D = () => <div>D</div>;
\`\`\`
const y = 2;
\`\`\``);
  });

  it('should keep nested Artifact tags unchanged', () => {
    const text = `Nested tags: <Artifact type="application/lobe.artifacts.react">
const Outer = () => (
  <div>
    <Artifact type="application/lobe.artifacts.react">
    const Inner = () => <span>Inner</span>;
    </Artifact>
    <Inner />
  </div>
);
</Artifact>`;

    const result = processResponseArtifacts(text);

    expect(result).toBe(`Nested tags: 
\`\`\`
const Outer = () => (
  <div>
    <Artifact type="application/lobe.artifacts.react">
    const Inner = () => <span>Inner</span>;
    </Artifact>
    <Inner />
  </div>
);
\`\`\``);
  });

  it('should handle Artifact tags with attributes', () => {
    const text = `With attributes: <Artifact type="application/lobe.artifacts.react" data-test="example" class="code-block">
const E = () => <div>E</div>;
</Artifact>`;

    const result = processResponseArtifacts(text);

    expect(result).toBe(`With attributes: 
\`\`\`
const E = () => <div>E</div>;
\`\`\``);
  });
});
