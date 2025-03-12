// server.js

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Parse incoming JSON from Slack
app.use(bodyParser.json());

// Slack events endpoint
app.post('/slack/events', (req, res) => {
  // Step 1: Slack verification
  if (req.body.type === 'url_verification') {
    return res.json({ challenge: req.body.challenge });
  }

  // Step 2: Later, handle actual Slack events (like messages)
  console.log('Received Slack event:', req.body.event);

  // Return 200 OK so Slack knows we got it
  return res.status(200).send('Event received');
});

// Start server on a port (Render sets process.env.PORT automatically)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

