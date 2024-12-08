import React from 'react';
import ReactDOM from 'react-dom/client'; // Import from react-dom/client
import './index.css'; // Your styles if any
import App from './App'; // Importing the main App component

// Create a root and render the app
const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root using createRoot
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
