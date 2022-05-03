import { render } from '@testing-library/react';
import React from 'react';
import { XyzProvider } from './XyzProvider'
import { useXyz } from './useXyz';

describe('xyzContext', () => {
  it("should render", () => {
    function MyComponent() {
      const xyz = useXyz()
      return (<div data-testid="test">{JSON.stringify(xyz)}</div>);
    }
    const { getByTestId } = render(<XyzProvider><MyComponent /></XyzProvider>)
    expect(getByTestId("test").textContent).toEqual("{}");
  })
});
