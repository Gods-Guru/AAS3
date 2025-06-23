import axios from 'axios';
import API_BASE_URL from '../api/config';

export const validateDiscountCode = async (code) => {
  try {
    const res = await axios.get(`${API_BASE_URL}/discounts/validate/${code}`);
    return res.data; // { valid: true, discountPercentage, ... }
  } catch (err) {
    return { valid: false, message: err.response?.data?.message || 'Invalid code' };
  }
};
