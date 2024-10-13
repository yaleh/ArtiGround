export const updateHistory = (
    value: string,
    history: string[],
    maxItems: number = 10
  ): string[] => {
    if (value) {
      const updatedHistory = Array.from(new Set([value, ...history])).slice(0, maxItems);
      return updatedHistory;
    }
    return history;
  };