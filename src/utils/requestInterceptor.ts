export const interceptRequest = (systemPrompt: string, requestDetails: any) => {
    if (requestDetails.body && requestDetails.body.messages) {
      const systemMessage = { role: "system", content: systemPrompt };
      return {
        ...requestDetails,
        body: {
          ...requestDetails.body,
          messages: [systemMessage, ...requestDetails.body.messages]
        }
      };
    }
    return requestDetails;
  };