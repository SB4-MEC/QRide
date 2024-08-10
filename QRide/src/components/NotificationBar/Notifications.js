import React, { useState, useEffect } from 'react';
import supabase from '../../config/supabaseClient';

const BusNotifications = () => {
  const [busInfo, setBusInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBusData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('bus_schedule')
          .select(`
            schedule_id,
            bus_id,
            scheduled_time,
            start_stop,
            end_stop,
            date_part('epoch', scheduled_time - NOW()) as diff
          `)
          .eq('start_stop', 105)
          .eq('end_stop', 104)
          .lt('diff', 600); // Filter by time difference less than 600 seconds (10 minutes)

        if (error) throw error;

        if (data.length === 0) {
          setBusInfo(null);
          setLoading(false);
          return;
        }
        
        // Find the nearest bus within the next 10 minutes
        const now = new Date();
        const nearestBus = data.reduce((closest, current) => {
          const currentDiff = Math.abs(new Date(current.scheduled_time) - now);
          const closestDiff = Math.abs(new Date(closest.scheduled_time) - now);
          return currentDiff < closestDiff ? current : closest;
        });

        setBusInfo(nearestBus);
      } catch (err) {
        console.error('Error fetching bus data:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Poll every minute (60000 milliseconds)
    const interval = setInterval(fetchBusData, 60000);

    // Initial fetch
    fetchBusData();

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Quickest Bus Arrival Notification</h1>
      {busInfo ? (
        <div>
          <p><strong>Bus ID:</strong> {busInfo.bus_id}</p>
          <p><strong>Scheduled Time:</strong> {new Date(busInfo.scheduled_time).toLocaleTimeString()}</p>
          <p><strong>Start Stop:</strong> {busInfo.start_stop}</p>
          <p><strong>End Stop:</strong> {busInfo.end_stop}</p>
        </div>
      ) : (
        <p>No buses arriving within the next 10 minutes</p>
      )}
    </div>
  );
};

export default BusNotifications;
