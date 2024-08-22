import React, { useEffect, useState } from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  ExpressCheckoutElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import supabase from '../../config/supabaseClient'; // Import your Supabase client
import { useNavigate, useLocation } from 'react-router-dom';
const key=process.env.REACT_APP_STRIPE_PUBLISH_KEY
const stripePromise = loadStripe(key);

const PaymentForm = ({ setBookingDetails }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const location = useLocation();
  const { userData, bus, currentLocation, selectedDestination, price, ticketCount } = location.state || {};

  useEffect(() => {
    if (stripe) {
      const pr = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          amount: price * 100,
          label: 'Ticket Purchase'
        },
        requestShipping: false,
        requestPayerName: true,
        requestPayerEmail: true,
      });

      pr.canMakePayment().then(result => {
        if (result) {
          setPaymentRequest(pr);
        }
      });
    }
  }, [stripe, price]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const cardNumber = elements.getElement(CardNumberElement);
    const cardExpiry = elements.getElement(CardExpiryElement);
    const cardCvc = elements.getElement(CardCvcElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: {
        number: cardNumber,
        exp_month: cardExpiry,
        exp_year: cardExpiry,
        cvc: cardCvc,
      },
    });

    if (error) {
      console.error(error);
      return;
    }

    try {
      const response = await fetch('/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: price * 100,
          payment_method: paymentMethod.id,
        }),
      });

      const paymentIntent = await response.json();

      if (paymentIntent.error) {
        console.error(paymentIntent.error);
        alert('Error during payment process.');
        return;
      }

      const { paymentIntent: confirmedPaymentIntent, error: confirmError } = await stripe.confirmCardPayment(paymentIntent.client_secret);

      if (confirmError) {
        console.error(confirmError);
        alert('Payment failed.');
        return;
      }

      if (confirmedPaymentIntent.status === 'succeeded') {
        console.log('Payment succeeded:', confirmedPaymentIntent);

        const bookingDate = new Date();

        const { data, error } = await supabase.from('bookings').insert([
          {
            user_id: userData.user_id,
            bus_id: bus.bus_id,
            bus_name: bus.bus_name,
            from_place: currentLocation,
            to_place: selectedDestination,
            price: price,
            payment_status: 'Paid',
            number: ticketCount,
            other_details: {
              seat_number: 'A1',
            },
          },
        ]);

        if (error) {
          console.error('Error recording booking:', error);
        } else {
          console.log('Booking recorded successfully:', data);
          setBookingDetails({ from: currentLocation, to: selectedDestination, time: bus.timing });
          navigate('/booking-confirmation');
        }
      }
    } catch (error) {
      console.error('Error during payment process:', error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <label className="mt-10 text-2xl">An amount of Rs. {price} will be deducted</label>
      <div style={{ maxWidth: '600px', width: '100%', backgroundColor: '#fff', padding: '40px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="card-number-element" style={{ display: 'block', marginBottom: '12px', fontSize: '18px', color: '#333' }}>Card Number</label>
            <CardNumberElement id="card-number-element" options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="card-expiry-element" style={{ display: 'block', marginBottom: '12px', fontSize: '18px', color: '#333' }}>Expiration Date</label>
            <CardExpiryElement id="card-expiry-element" options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label htmlFor="card-cvc-element" style={{ display: 'block', marginBottom: '12px', fontSize: '18px', color: '#333' }}>CVC</label>
            <CardCvcElement id="card-cvc-element" options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }} />
          </div>
          <button type="submit" disabled={!stripe} style={{ marginTop: '24px', padding: '12px 24px', backgroundColor: '#6772E5', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '18px' }}>
            Confirm Payment
          </button>
        </form>
        { paymentRequest && (
          <div style={{ marginTop: '24px' }}>
            <ExpressCheckoutElement options={{ paymentRequest }} />
          </div>
        )}
      </div>
    </div>
  );
};

const PaymentPage = (props) => (
  <Elements stripe={stripePromise}>
    <PaymentForm {...props} />
  </Elements>
);

export default PaymentPage;
