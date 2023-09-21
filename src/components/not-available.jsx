import React from 'react';
import { Container, Typography } from '@mui/material';
import './NotAvailable.css';

function NotAvailable() {
  return (
    <Container className="na-container">
      <Typography variant="h1" gutterBottom>
        Page not available in database!
      </Typography>
      <Typography paragraph>
        We're sorry, but the page you searched for is not available in our data base. Please try
        searching for something else or browse through our available pages.
      </Typography>
    </Container>
  );
}

export default NotAvailable;
