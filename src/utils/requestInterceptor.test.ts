import { describe, it, expect } from 'vitest';
import { interceptRequest } from './requestInterceptor';

describe('interceptRequest', () => {
  it('should add system message before the last user message', () => {
    const systemPrompt = 'You are a helpful assistant.';
    const requestDetails = {
      body: {
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' },
          { role: 'user', content: 'How are you?' }
        ]
      }
    };

    const result = interceptRequest(systemPrompt, requestDetails);

    expect(result.body.messages).toEqual([
      { role: 'user', content: 'Hello' },
      { role: 'assistant', content: 'Hi there!' },
      { role: 'system', content: systemPrompt },
      { role: 'user', content: 'How are you?' }
    ]);
  });

  it('should add system message at the end if no user message is present', () => {
    const systemPrompt = 'You are a helpful assistant.';
    const requestDetails = {
      body: {
        messages: [
          { role: 'assistant', content: 'Hello! How can I help you?' }
        ]
      }
    };

    const result = interceptRequest(systemPrompt, requestDetails);

    expect(result.body.messages).toEqual([
      { role: 'assistant', content: 'Hello! How can I help you?' },
      { role: 'system', content: systemPrompt }
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

  it('should replace placeholders in system prompt with provided variables', () => {
    const systemPrompt = 'You are a {role}. The user\'s name is {name}.';
    const variables = { role: 'helpful assistant', name: 'Alice' };
    const requestDetails = {
      body: {
        messages: [
          { role: 'user', content: 'Hello' },
          { role: 'assistant', content: 'Hi there!' },
          { role: 'user', content: 'How are you?' }
        ]
      }
    };

    const result = interceptRequest(systemPrompt, requestDetails, variables);

    expect(result.body.messages[2]).toEqual({
      role: 'system',
      content: 'You are a helpful assistant. The user\'s name is Alice.'
    });
  });

  it('should not modify system prompt if no variables are provided', () => {
    const systemPrompt = 'You are a {role}. The user\'s name is {name}.';
    const requestDetails = {
      body: {
        messages: [
          { role: 'user', content: 'Hello' }
        ]
      }
    };

    const result = interceptRequest(systemPrompt, requestDetails);

    expect(result.body.messages[0]).toEqual({
      role: 'system',
      content: systemPrompt
    });
  });
});
