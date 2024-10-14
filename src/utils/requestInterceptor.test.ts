import { describe, it, expect } from 'vitest';
import { interceptRequest } from './requestInterceptor';

describe('interceptRequest', () => {
  it('should add system message to the beginning of messages array', () => {
    const systemPrompt = 'You are a helpful assistant.';
    const requestDetails = {
      body: {
        messages: [
          { role: 'user', content: 'Hello' }
        ]
      }
    };

    const result = interceptRequest(systemPrompt, requestDetails);

    expect(result.body.messages).toEqual([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'Hello' }
    ]);
  });

  it('should not modify request details if messages array is not present', () => {
    const systemPrompt = 'You are a helpful assistant.';
    const requestDetails = {
      body: {
        someOtherProperty: 'value'
      }
    };

    const result = interceptRequest(systemPrompt, requestDetails);

    expect(result).toEqual(requestDetails);
  });

  it('should not modify request details if body is not present', () => {
    const systemPrompt = 'You are a helpful assistant.';
    const requestDetails = {
      someOtherProperty: 'value'
    };

    const result = interceptRequest(systemPrompt, requestDetails);

    expect(result).toEqual(requestDetails);
  });
});