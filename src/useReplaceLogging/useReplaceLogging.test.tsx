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
  it('should work with no configuration', async () => {

    function MyComponent() {
      useReplaceLogging({      });

      return (
        <button
          data-testid="test"
        >
          Hello world
        </button>
      );
    }

    const {  unmount } = render(<MyComponent />);
    unmount();
  });

  it('swap all', async () => {
    const debugCallback = jest.fn();
    const logCallback = jest.fn();
    const infoCallback = jest.fn();
    const warnCallback = jest.fn();
    const errorCallback = jest.fn();

    function MyComponent() {
      useReplaceLogging({
        log: logCallback,
        debug: debugCallback,
        info: infoCallback,
        warn: warnCallback,
        error: errorCallback,
      });

      return (
        <button
          data-testid="test"
          onClick={() => {
            console.debug('click');
            console.log('click');
            console.info('click');
            console.warn('click');
            console.error('click');
          }}
        >
          Hello world
        </button>
      );
    }

    const { getByTestId, unmount } = render(<MyComponent />);
    getByTestId('test').click();
    expect(debugCallback.mock.calls).toEqual([['click']]);
    expect(logCallback.mock.calls).toEqual([['click']]);
    expect(infoCallback.mock.calls).toEqual([['click']]);
    expect(warnCallback.mock.calls).toEqual([['click']]);
    expect(errorCallback.mock.calls).toEqual([['click']]);
  });

});
