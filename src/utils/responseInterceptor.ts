export interface Artifact {
  filepath: string;
  content: string;
}

export const processResponseArtifacts = (
  text: string,
  modifyResponse: boolean = false
): { modifiedText: string; artifacts: Artifact[] } => {
  const artifacts: Artifact[] = [];
  let currentArtifact: Artifact | null = null;

  if (text) {
    let depth = 0;
    const modifiedText = text.replace(
      /^(<Artifact[^>]*>)|^(<\/Artifact>)/gm,
      (match: string, openTag: string | undefined, closeTag: string | undefined, offset: number, string: string): string => {
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
            if (modifyResponse) {
              let result = prevChar !== '\n' ? '\n' : '';
              result += '```';
              result += nextChar !== '\n' ? '\n' : '';
              return result;
            }
          }
          return match;
        } else if (closeTag) {
          if (depth === 1) {
            currentArtifact = null;
            if (modifyResponse) {
              let result = prevChar !== '\n' ? '\n' : '';
              result += '```';
              result += nextChar !== '\n' ? '\n' : '';
              depth--;
              return result;
            }
          }
          depth--;
          return match;
        }
        return match; // Add this line to ensure a string is always returned
      }
    );
    
    // Handle empty artifacts
    const finalModifiedText = modifyResponse
      ? modifiedText.replace(/```\s*```/g, '```\n```')
      : modifiedText;

    // Extract artifact content
    const lines = text.split('\n');
    let isInArtifact = false;
    let currentArtifactIndex = 0;
    let nestedDepth = 0;

    for (const line of lines) {
      if (line.trim().startsWith('<Artifact')) {
        if (isInArtifact) {
          nestedDepth++;
        } else {
          isInArtifact = true;
          continue; // Skip the opening tag
        }
      }
      if (isInArtifact && artifacts[currentArtifactIndex]) {
        if (line.trim().startsWith('</Artifact>')) {
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

    // Trim trailing newline from artifact content and remove inner ```
    artifacts.forEach(artifact => {
      artifact.content = artifact.content.trimEnd().replace(/^```[\w-]*\n|\n```$/gm, '');
    });

    // Remove inner ``` and language specifier from modifiedText
    const cleanedModifiedText = modifyResponse
      ? finalModifiedText.replace(
          /```\n```[\w-]*\n([\s\S]*?)```\n```/g,
          '```\n$1```'
        )
      : finalModifiedText;

    return { modifiedText: cleanedModifiedText, artifacts };
  }
  return { modifiedText: text, artifacts };
};
