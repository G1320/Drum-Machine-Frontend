import React from 'react';
import { Container, Typography } from '@mui/material';
import './PageError.css';

function PageError() {
  return (
    <Container className="error-container">
      <Typography variant="h1" color="error" gutterBottom>
        Error!
      </Typography>
      <Typography paragraph>
        We're sorry, but the thing you searched for is not available in our data base. Please try
        searching for something else or browse through our available things.
      </Typography>
    </Container>
  );
}

export default PageError;
