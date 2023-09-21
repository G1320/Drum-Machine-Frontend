import React from 'react';
import { Container, Typography, List, ListItem } from '@mui/material';
import '../styles/about.css';

function About() {
  return (
    <Container>
      <Typography variant="h1" gutterBottom>
        About the Drum Machine
      </Typography>
      <Typography paragraph>
        The Drum Machine project is a virtual instrument that enables users to create rhythmic patterns,
        beats, and musical loops. With an intuitive interface and flexible options, musicians and
        enthusiasts alike can explore their creativity in new and innovative ways.
      </Typography>
      <Typography paragraph>
        Designed with precision and built for performance, the Drum Machine offers a range of features,
        including:
      </Typography>
      <List>
        <ListItem>Multiple drum sounds and kits</ListItem>
        <ListItem>Customizable patterns and sequences</ListItem>
        <ListItem>Real-time adjustments and controls</ListItem>
        <ListItem>Export and share functionality</ListItem>
      </List>
      <Typography paragraph>
        Join the rhythm revolution and unleash your potential with the Drum Machine!
      </Typography>
    </Container>
  );
}

export default About;
