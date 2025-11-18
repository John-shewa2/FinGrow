import api from "./axios";

export const createLoan = (loanData) => {
  return api.post('/loans', loanData);
};

export const getMyLoans = () => {
  return api.get('/loans/myloans');
};

export const getLoanById = (id) => {
  return api.get(`/loans/${id}`);
};

export const getAllLoans = (status = '') => {
  return api.get(`/loans?status=${status}`);
};

export const updateLoanStatus = (id, status) => {
  return api.put(`/loans/${id}/status`, { status });
};

export const getLoanStats = () => {
  return api.get('/loans/stats');
};