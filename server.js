const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// This is the path Slack will send requests to:
// e.g. https://your-app.onrender.com/slack/events
app.post('/slack/events', (req, res) => {
  // 1. Slack will send a 'challenge' when verifying your endpoint
  if (req.body.type === 'url_verification') {
    // We respond with the challenge so Slack knows we own this URL
    return res.send({ challenge: req.body.challenge });
  }

  // 2. Later, Slack will send real events (like new messages) here
  const event = req.body.event;
  console.log('Received Slack event:', event);

  // 3. For now, just respond with a 200 OK
  return res.status(200).send('Event received');
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
