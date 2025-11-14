import api from './axios';

// (Borrower) Submit a payment for review
export const submitPayment = (paymentData) => {
  // paymentData = { loanId, amount, receipt }
  return api.post('/payments', paymentData);
};

// (Admin) Get all payments with 'pending' status
export const getPendingPayments = () => {
  return api.get('/payments/pending');
};

// (Admin) Approve a payment
export const approvePayment = (paymentId) => {
  return api.put(`/payments/${paymentId}/approve`);
};

// (Admin) Reject a payment
export const rejectPayment = (paymentId) => {
  return api.put(`/payments/${paymentId}/reject`);
};