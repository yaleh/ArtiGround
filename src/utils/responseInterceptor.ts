export const processResponseArtifacts = (text: string): string => {
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
            let result = prevChar !== '\n' ? '\n' : '';
            result += '```';
            result += nextChar !== '\n' ? '\n' : '';
            return result;
          }
          return match;
        } else if (closeTag) {
          if (depth === 1) {
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
    return modifiedText.replace(/```\s*```/g, '```\n```');
  }
  return text;
};
