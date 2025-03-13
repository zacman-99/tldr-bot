// server.js

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// 1) Create the Express app
const app = express();

// 2) Use body-parser to parse JSON from Slack
app.use(bodyParser.json());

// 3) Helper function to post a message to Slack
async function postMessageToSlack(channel, text) {
  try {
    // The token is stored in Render's environment variable (SLACK_BOT_TOKEN)
    const token = process.env.SLACK_BOT_TOKEN;

    // Make an HTTP POST request to Slack's "chat.postMessage" method
    await axios.post(
      'https://slack.com/api/chat.postMessage',
      {
        channel: channel,
        text: text,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Slack expects "Bearer xoxb-..."
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error posting message to Slack:', error);
  }
}

// 4) Slack events endpoint
app.post('/slack/events', async (req, res) => {
  // Handle Slack's URL verification challenge
  if (req.body.type === 'url_verification') {
    return res.json({ challenge: req.body.challenge });
  }

  // Otherwise, handle actual Slack events
  const event = req.body.event;
  console.log('Received Slack event:', event);

  // If the event is a user message (not a bot message), reply
  if (event && event.type === 'message' && !event.bot_id) {
    await postMessageToSlack(event.channel, "Hello from your Slack Bot!");
  }

  // Return 200 OK so Slack knows we received the event
  return res.status(200).send('Event received');
});

// 5) Start the server on the port Render provides (or 3000 locally)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
