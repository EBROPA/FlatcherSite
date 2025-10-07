require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const { MONGODB_URI, PORT = 3000 } = process.env;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    phone: { type: String, trim: true, required: true },
    email: { type: String, trim: true },
    message: { type: String, trim: true },
    page: { type: String },
    userAgent: { type: String },
    language: { type: String },
    platform: { type: String },
    screen: { type: String },
    viewport: { type: String },
    timezone: { type: String },
    referrer: { type: String },
    deviceType: { type: String },
    browser: { type: String },
    visitStartedAt: { type: Date },
    utm_source: { type: String },
    utm_medium: { type: String },
    utm_campaign: { type: String },
    utm_content: { type: String },
    utm_term: { type: String },
    ip: { type: String },
    submittedAt: { type: Date }
  },
  { timestamps: true }
);

const Lead = mongoose.model('Lead', leadSchema);

app.post('/api/leads', async (req, res) => {
  try {
    const payload = {
      name: req.body.name?.trim() || '',
      phone: req.body.phone?.trim() || '',
      email: req.body.email?.trim() || '',
      message: req.body.message?.trim() || '',
      page: req.body.meta?.page || req.headers['referer'] || '',
      userAgent: req.body.meta?.userAgent || req.headers['user-agent'] || '',
      language: req.body.meta?.language || '',
      platform: req.body.meta?.platform || '',
      screen: req.body.meta?.screen || '',
      viewport: req.body.meta?.viewport || '',
      timezone: req.body.meta?.timezone || '',
      referrer: req.body.meta?.referrer || req.headers['referer'] || '',
      deviceType: req.body.meta?.deviceType || '',
      browser: req.body.meta?.browser || '',
      visitStartedAt: req.body.meta?.visitStartedAt ? new Date(req.body.meta.visitStartedAt) : undefined,
      utm_source: req.body.utm?.utm_source || '',
      utm_medium: req.body.utm?.utm_medium || '',
      utm_campaign: req.body.utm?.utm_campaign || '',
      utm_content: req.body.utm?.utm_content || '',
      utm_term: req.body.utm?.utm_term || '',
      ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || '',
      submittedAt: new Date()
    };

    if (!payload.phone) {
      return res.status(400).json({ message: 'Phone is required' });
    }

    const lead = new Lead(payload);
    await lead.save();
    res.status(201).json({ message: 'Lead stored', leadId: lead.id });
  } catch (error) {
    console.error('Failed to store lead', error);
    res.status(500).json({ message: 'Failed to store lead' });
  }
});

app.get('/api/leads', async (req, res) => {
  try {
    const { limit = 50, skip = 0 } = req.query;
    const leads = await Lead.find()
      .sort({ createdAt: -1 })
      .skip(Number(skip))
      .limit(Math.min(Number(limit), 200));
    res.json(leads);
  } catch (error) {
    console.error('Failed to fetch leads', error);
    res.status(500).json({ message: 'Failed to fetch leads' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

