import React from 'react';
import { useLocation } from 'react-router-dom';
import Countdown from 'react-countdown';

const CountdownPage = () => {
  const location = useLocation();
  const { state } = location;
  const startCountdown = state?.startCountdown || false;

  return (
    <div>
      <h1>Countdown Timer</h1>
      {startCountdown ? (
        <Countdown date={Date.now() + 5 * 60 * 1000} /> // 5-minute countdown
      ) : (
        <p>Countdown has not started yet.</p>
      )}
    </div>
  );
};

export default CountdownPage;
