import createFetchMock from 'vitest-fetch-mock';
import { vi } from 'vitest';
import '@testing-library/jest-dom';

// vitest.setup.js
import '@testing-library/jest-dom';
import { vi } from 'vitest';

vi.mock('some-module', () => {
  // Mocks necesarios para tus pruebas (si aplican)
});