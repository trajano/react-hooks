/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react';
import React from 'react';
import { useReplaceLogging } from "./useReplaceLogging";

describe('useReplaceLogging', () => {
  it('should work and not rerender', async () => {
    const logCallback = jest.fn();
    const errorCallback = jest.fn();

    function MyComponent() {
      useReplaceLogging({
        log: logCallback,
        debug: logCallback,
        error: errorCallback,
      });

      return (
        <button
          data-testid="test"
          onClick={() => {
            console.log('click');
          }}
        >
          Hello world
        </button>
      );
    }

    const { getByTestId, unmount } = render(<MyComponent />);
    getByTestId('test').click();
    expect(logCallback.mock.calls).toEqual([['click']]);
    unmount();
    console.log('This should be shown on the console');
    expect(logCallback.mock.calls).toEqual([['click']]);
  });
});
