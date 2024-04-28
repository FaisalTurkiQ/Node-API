const axios = require('axios');
require('dotenv').config();

async function sendSlackMessage(firstName, lastName, email, topic, message) {
    try {
        const formattedMessage = `
            *New Contact Form Submission:*
            *First Name:* ${firstName}
            *Last Name:* ${lastName}
            *Email:* ${email}
            *Topic:* ${topic}
            *Message:* ${message}
        `;

        await axios.post(process.env.SLACK_WEBHOOK_URL, {
            text: formattedMessage,
            mrkdwn: true
        });

        console.log('Slack message sent successfully');
    } catch (error) {
        console.error('Error sending Slack message:', error);
    }
}

module.exports = sendSlackMessage;
