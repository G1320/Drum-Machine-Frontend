import React from 'react';
import '../../assets/styles/basic/404.css'; // Import the CSS file
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

function FourOhFour() {
  return (
    <Container className="container-404">
      <Typography variant="h1" className="header-404" gutterBottom>
        404
      </Typography>
      <Typography variant="h4" className="subheader-404" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" className="paragraph-404" paragraph>
        Sorry, the page you are looking for does not exist. You can always go back to the homepage.
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/">
        Go Home
      </Button>
    </Container>
  );
}

export default FourOhFour;
