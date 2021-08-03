import { useState } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

test('renders ErrorBoundary and fire an error', async () => {
  function BuggyCounter() {
    const [counter, setCounter] = useState<any>(0);

    function handleClick() {
      setCounter(counter + 1);
    }

    if (counter === 1) {
      // Simulate a JS error
      throw new Error('I crashed!');
    }
    return (
      <h1 id="error-button" onClick={handleClick}>
        Fire Error
      </h1>
    );
  }
  render(
    <MemoryRouter>
      <ErrorBoundary>
        <BuggyCounter />
      </ErrorBoundary>
    </MemoryRouter>
  );
  await waitFor(() => fireEvent.click(screen.getByText('Fire Error')));
  expect(screen.getByRole('title')).toHaveTextContent('System Error');
});
