export const interceptRequest = (systemPrompt: string, requestDetails: any) => {
  if (requestDetails.body && requestDetails.body.messages) {
    const systemMessage = { role: "system", content: systemPrompt };
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
