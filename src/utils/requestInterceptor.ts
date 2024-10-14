export const interceptRequest = (systemPrompt: string, requestDetails: any, variables?: Record<string, string>) => {
  if (requestDetails.body && requestDetails.body.messages) {
    let processedSystemPrompt = systemPrompt;
    if (variables) {
      processedSystemPrompt = Object.entries(variables).reduce(
        (prompt, [key, value]) => prompt.replace(`{${key}}`, value),
        systemPrompt
      );
    }
    const systemMessage = { role: "system", content: processedSystemPrompt };
    const filteredMessages = requestDetails.body.messages.filter(
      (message: any) => message.role !== "system"
    );

    // Find the index of the last user message
    const lastUserIndex = filteredMessages.map(m => m.role).lastIndexOf('user');
    
    // Insert the system message before the last user message
    if (lastUserIndex !== -1) {
      filteredMessages.splice(lastUserIndex, 0, systemMessage);
    } else {
      // If no user message is found, append the system message at the end
      filteredMessages.push(systemMessage);
    }

    return {
      ...requestDetails,
      body: {
        ...requestDetails.body,
        messages: filteredMessages
      }
    };
  }
  return requestDetails;
};
