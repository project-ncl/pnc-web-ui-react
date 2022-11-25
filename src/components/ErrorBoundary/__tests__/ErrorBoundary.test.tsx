import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useState } from 'react';

import { ErrorBoundary } from 'components/ErrorBoundary/ErrorBoundary';

jest.mock('services/uiLogger');

test('renders ErrorBoundary and fire an error', async () => {
  function BuggyCounter() {
    const [counter, setCounter] = useState<number>(0);

    function handleClick() {
      setCounter(counter + 1);
    }

    if (counter === 1) {
      // Simulate a JS error
      throw new Error('✅✅✅✅ SIMULATE INTENTIONAL CRASH CASES -- This is fine :) ✅✅✅✅');
    }

    return (
      <button data-testid="error-button" onClick={handleClick}>
        Fire Error
      </button>
    );
  }
  render(
    <ErrorBoundary>
      <BuggyCounter />
    </ErrorBoundary>
  );
  await waitFor(() => fireEvent.click(screen.getByTestId('error-button')));
  //@Todo:
  expect(screen.getByText('System Error'));
});
