// Alert.js
import React from 'react';
import '../Design/alert.css'; // Import CSS for styling

const Alert = ({ message }) => {
  return <div className="alert">{message}</div>;
};

export default Alert;
