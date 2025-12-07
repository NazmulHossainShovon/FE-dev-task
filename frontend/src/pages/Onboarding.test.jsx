/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import Onboarding from './Onboarding';

// Mock the utils functions
jest.mock('@/utils', () => ({
  createPageUrl: jest.fn((page) => `/${page}`),
  getLocalStorageWithExpiry: jest.fn(() => null),
  setLocalStorageWithExpiry: jest.fn(),
}));

// Mock fetch
global.fetch = jest.fn();

const renderOnboarding = () => {
  return render(
    <BrowserRouter>
      <Onboarding />
    </BrowserRouter>
  );
};

describe('Onboarding Form Validation', () => {
  beforeEach(() => {
    // Mock successful session start
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        onboardingId: 'test-onboarding-id'
      })
    });
    
    // Clear all mocks
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('shows website validation error when website input is empty and form is submitted', async () => {
    const user = userEvent.setup();
    
    renderOnboarding();

    // Wait for the component to load and session to start
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/session/start',
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      );
    });

    // Fill in all required fields except website
    await user.type(screen.getByTestId('email-input'), 'test@example.com');
    await user.type(screen.getByTestId('first-name-input'), 'John');
    await user.type(screen.getByTestId('last-name-input'), 'Doe');
    await user.type(screen.getByTestId('password-input'), 'password123');
    await user.selectOptions(screen.getByTestId('country-select'), 'United States');
    await user.type(screen.getByTestId('business-description-textarea'), 'Test business description');

    // Ensure website input is empty (it should be by default, but let's be explicit)
    const websiteInput = screen.getByTestId('website-input');
    expect(websiteInput.value).toBe('');

    // Don't upload any CSV file - skip it as requested

    // Click the continue button to submit the form
    const continueButton = screen.getByTestId('continue-button');
    await user.click(continueButton);

    // Wait for validation error to appear for website
    await waitFor(() => {
      const websiteError = screen.getByText('Website is required');
      expect(websiteError).toBeInTheDocument();
    });

    // Verify that the form did not proceed (no OTP request was made)
    expect(fetch).toHaveBeenCalledTimes(1); // Only the session start call
  });

  test('shows proper website validation error when invalid URL format is provided', async () => {
    const user = userEvent.setup();
    
    renderOnboarding();

    // Wait for the component to load and session to start
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/session/start',
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      );
    });

    // Fill in all fields including an invalid website URL
    await user.type(screen.getByTestId('email-input'), 'test@example.com');
    await user.type(screen.getByTestId('first-name-input'), 'John');
    await user.type(screen.getByTestId('last-name-input'), 'Doe');
    await user.type(screen.getByTestId('password-input'), 'password123');
    await user.selectOptions(screen.getByTestId('country-select'), 'United States');
    await user.type(screen.getByTestId('business-description-textarea'), 'Test business description');
    
    // Enter an invalid website URL (without http:// or https://)
    await user.type(screen.getByTestId('website-input'), 'invalid-url');

    // Click the continue button to submit the form
    const continueButton = screen.getByTestId('continue-button');
    await user.click(continueButton);

    // Wait for validation error to appear for website URL format
    await waitFor(() => {
      const websiteError = screen.getByText('Please enter a valid URL (include http:// or https://)');
      expect(websiteError).toBeInTheDocument();
    });

    // Verify that the form did not proceed (no OTP request was made)
    expect(fetch).toHaveBeenCalledTimes(1); // Only the session start call
  });

  test('proceeds with valid website URL when all required fields are filled', async () => {
    const user = userEvent.setup();
    
    // Mock successful OTP sending
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ onboardingId: 'test-onboarding-id' })
    }).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });
    
    renderOnboarding();

    // Wait for the component to load and session to start
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/session/start',
        expect.objectContaining({
          method: 'GET',
          credentials: 'include',
        })
      );
    });

    // Fill in all required fields with valid data including a proper website URL
    await user.type(screen.getByTestId('email-input'), 'test@example.com');
    await user.type(screen.getByTestId('first-name-input'), 'John');
    await user.type(screen.getByTestId('last-name-input'), 'Doe');
    await user.type(screen.getByTestId('password-input'), 'password123');
    await user.selectOptions(screen.getByTestId('country-select'), 'United States');
    await user.type(screen.getByTestId('business-description-textarea'), 'Test business description');
    
    // Enter a valid website URL
    await user.type(screen.getByTestId('website-input'), 'https://example.com');

    // Click the continue button to submit the form
    const continueButton = screen.getByTestId('continue-button');
    await user.click(continueButton);

    // Wait for OTP request to be made (indicates form validation passed)
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost:3001/api/v1/user-verification/send-otp?onboardingId=test-onboarding-id',
        expect.objectContaining({
          method: 'POST',
          credentials: 'include',
        })
      );
    });

    // Verify no website validation errors are shown
    expect(screen.queryByText('Website is required')).not.toBeInTheDocument();
    expect(screen.queryByText('Please enter a valid URL (include http:// or https://)')).not.toBeInTheDocument();
  });
});