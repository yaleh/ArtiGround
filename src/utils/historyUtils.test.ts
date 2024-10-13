import { describe, it, expect } from 'vitest';
import { updateHistory } from './historyUtils';

describe('updateHistory', () => {
  it('should add a new value to the beginning of the history', () => {
    const result = updateHistory('new value', ['old value']);
    expect(result).toEqual(['new value', 'old value']);
  });

  it('should not add duplicate values', () => {
    const result = updateHistory('existing value', ['existing value', 'old value']);
    expect(result).toEqual(['existing value', 'old value']);
  });

  it('should limit the history to the specified maximum number of items', () => {
    const history = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];
    const result = updateHistory('new value', history, 5);
    expect(result).toEqual(['new value', '1', '2', '3', '4']);
  });

  it('should return the original history if the new value is empty', () => {
    const history = ['1', '2', '3'];
    const result = updateHistory('', history);
    expect(result).toEqual(history);
  });

  it('should work with an empty initial history', () => {
    const result = updateHistory('new value', []);
    expect(result).toEqual(['new value']);
  });
});