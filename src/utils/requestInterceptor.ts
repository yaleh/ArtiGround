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
    return {
      ...requestDetails,
      body: {
        ...requestDetails.body,
        messages: [systemMessage, ...filteredMessages]
      }
    };
  }
  return requestDetails;
};
