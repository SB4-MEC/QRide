import React, { useState } from 'react';
import supabase from './config/supabaseClient';  // Adjust the path according to your file structure

const AdminPage = () => {
  const [message, setMessage] = useState('');

  const postMessageToAPI = async (message) => {
    try {
      const response = await fetch('http://localhost:4000/admin/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) {
        throw new Error('Failed to post message');
      }
    } catch (error) {
      console.error('Error posting message to API:', error);
      throw error;
    }
  };

  const submitMessage = async (e) => {
    e.preventDefault();

    try {
      // Insert message into the Supabase notifications table
      const { data, error } = await supabase
        .from('notifications')
        .insert([{ message }]);

      if (error) {
        throw error;
      }

      // Post the same message to /admin/message
      await postMessageToAPI(message);

      alert('Message sent!');
      setMessage('');
    } catch (error) {
      alert('Error sending message');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Admin Page</h2>
      <form onSubmit={submitMessage}>
        <input 
          type="text" 
          value={message} 
          onChange={(e) => setMessage(e.target.value)} 
          placeholder="Type your message here" 
        />
        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default AdminPage;
