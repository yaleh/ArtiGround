export interface Artifact {
  filepath: string;
  content: string;
}

export const processResponseArtifacts = (text: string): { modifiedText: string; artifacts: Artifact[] } => {
  const artifacts: Artifact[] = [];
  let currentArtifact: Artifact | null = null;

  if (text) {
    let depth = 0;
    const modifiedText = text.replace(
      /(<Artifact[^>]*>)|(<\/Artifact>)/g,
      (match, openTag, closeTag, offset, string) => {
        const prevChar = offset > 0 ? string[offset - 1] : '\n';
        const nextChar = offset + match.length < string.length ? string[offset + match.length] : '\n';
        
        if (openTag) {
          depth++;
          if (depth === 1) {
            const filepathMatch = openTag.match(/filepath="([^"]+)"/);
            if (filepathMatch) {
              currentArtifact = { filepath: filepathMatch[1], content: '' };
              artifacts.push(currentArtifact);
            }
            let result = prevChar !== '\n' ? '\n' : '';
            result += '```';
            result += nextChar !== '\n' ? '\n' : '';
            return result;
          }
          return match;
        } else if (closeTag) {
          if (depth === 1) {
            currentArtifact = null;
            let result = prevChar !== '\n' ? '\n' : '';
            result += '```';
            result += nextChar !== '\n' ? '\n' : '';
            depth--;
            return result;
          }
          depth--;
          return match;
        }
      }
    );
    
    // Handle empty artifacts
    const finalModifiedText = modifiedText.replace(/```\s*```/g, '```\n```');

    // Extract artifact content
    const lines = text.split('\n');
    let isInArtifact = false;
    let currentArtifactIndex = 0;
    let nestedDepth = 0;

    for (const line of lines) {
      if (line.includes('<Artifact')) {
        if (isInArtifact) {
          nestedDepth++;
        } else {
          isInArtifact = true;
          continue; // Skip the opening tag
        }
      }
      if (isInArtifact && artifacts[currentArtifactIndex]) {
        if (line.includes('</Artifact>')) {
          if (nestedDepth > 0) {
            nestedDepth--;
            artifacts[currentArtifactIndex].content += line + '\n';
          } else {
            isInArtifact = false;
            currentArtifactIndex++;
            continue; // Skip the closing tag
          }
        } else {
          artifacts[currentArtifactIndex].content += line + '\n';
        }
      }
    }

    // Trim trailing newline from artifact content
    artifacts.forEach(artifact => {
      artifact.content = artifact.content.trimEnd();
    });

    return { modifiedText: finalModifiedText, artifacts };
  }
  return { modifiedText: text, artifacts };
};
