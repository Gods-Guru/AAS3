import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaystackPayment = ({ amount, email = "ekonduobe@gmail.com" }) => {
  const navigate = useNavigate();

  const publicKey = "pk_test_fb04251c3f89183067c042bff929228c83ff8350"; // Replace with your real key
  const paystackAmount = amount * 100; // Paystack uses Kobo

  const handlePayment = () => {
    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount: paystackAmount,
      currency: 'NGN',
      callback: function (response) {
        console.log('Payment success:', response);
        navigate('/order-success');
      },
      onClose: function () {
        alert('Payment cancelled');
      },
    });

    handler.openIframe();
  };

  return (
    <button onClick={handlePayment} className="paystack-button">
      Pay Now
    </button>
  );
};

export default PaystackPayment;