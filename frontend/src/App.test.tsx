import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import axios from 'axios';

jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
}));
const mockedAxios = axios as jest.Mocked<typeof axios>;

import { act } from 'react';

test('renders welcome message', async () => {
  mockedAxios.get.mockResolvedValue({ data: { clinic_name: 'Test Clinic' } });

  await act(async () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
  });

  const welcomeText = await screen.findByText(/Welcome to/i);
  expect(welcomeText).toBeInTheDocument();
});
