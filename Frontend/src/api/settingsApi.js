import api from './axios';

// Gets the current global interest rate
export const getInterestRate = () => {
  return api.get('/settings/rate');
};

// Updates the global interest rate (Admin)
export const updateInterestRate = (rate) => {
  return api.put('/settings/rate', { interestRate: rate });
};