// server.js

const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();

// --- CORS Configuration ---
// IMPORTANT: This 'origin' MUST exactly match your GitHub Pages URL
const corsOptions = {
  origin: 'https://adhikariganesh9813.github.io', // Your GitHub Pages URL
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// --- Middleware ---
app.use(express.json()); // To parse JSON bodies from incoming requests

// --- Nodemailer Transporter Setup ---
// These credentials will come from Render's Environment Variables.
// EMAIL_USER: your_gmail_address (e.g., adganesh19@gmail.com)
// EMAIL_PASS: your_gmail_app_password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Will be adganesh19@gmail.com from Render ENV
    pass: process.env.EMAIL_PASS  // Will be your App Password from Render ENV
  }
});

// --- API Routes ---

// Root route (for basic testing if backend is alive)
app.get('/', (req, res) => {
  res.send('Node.js Backend for contact form is running!');
});

// Endpoint to send email from the contact form
app.post('/api/send-message', async (req, res) => {
  const { name, email, message } = req.body;

  // Basic Server-Side Validation
  if (!name || !email || !message) {
    return res.status(400).json({ status: 'error', message: 'Name, email, and message are all required.' });
  }

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender: your Gmail account
    to: 'adganesh19@gmail.com', // Recipient: your target email
    subject: `New Message from Portfolio: ${name}`,
    text: `You have received a new message from your portfolio website:\n\nName: ${name}\nEmail: ${email}\nMessage:\n${message}`,
    html: `
      <p>You have received a new message from your portfolio website:</p>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent from ${email} by ${name}`);
    res.status(200).json({ status: 'success', message: 'Your message has been sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ status: 'error', message: 'Failed to send your message. Please try again later.' });
  }
});


// --- Start the Server ---
// Your Node.js server MUST listen on the port provided by Render.
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Node.js Backend listening on port ${PORT}`);
  console.log(`Access locally at: http://localhost:${PORT}`);
});