require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

function formatPhoneForBackend(value = '') {
  const digits = value.replace(/\D+/g, '');
  if (digits.length === 11 && digits.startsWith('7')) {
    return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  }
  if (digits.length === 10) {
    return `+7 ${digits.slice(0, 3)} ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
  }
  return value;
}

function extractMeaningfulFormValues(values) {
  if (!values || typeof values !== 'object') return null;
  const result = {};
  if (Array.isArray(values.rooms) && values.rooms.length) {
    result.rooms = values.rooms;
  }
  ['areaFrom', 'areaTo', 'priceFrom', 'priceTo'].forEach((key) => {
    const val = values[key];
    if (val !== null && val !== undefined && val !== '') {
      result[key] = val;
    }
  });
  if (values.search && String(values.search).trim()) {
    result.search = String(values.search).trim();
  }
  return Object.keys(result).length ? result : null;
}

const AMO_TOKENS_PATH = path.join(__dirname, 'amo-tokens.json');

function loadAmoTokens() {
  try {
    const raw = fs.readFileSync(AMO_TOKENS_PATH, 'utf-8');
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

function persistAmoTokens(tokens) {
  try {
    fs.writeFileSync(AMO_TOKENS_PATH, JSON.stringify(tokens, null, 2));
  } catch (error) {
    console.warn('Failed to persist amoCRM tokens:', error.message);
  }
}

// Some AmoCRM endpoints may return 204 No Content or an empty body even on success.
// Parsing such responses as JSON throws "Unexpected end of JSON input".
// This helper safely returns null when there is no JSON payload.
async function parseJsonSafely(response) {
  if (!response) return null;
  if (response.status === 204) return null;
  try {
    const text = await response.text();
    if (!text) return null;
    return JSON.parse(text);
  } catch (_) {
    return null;
  }
}

const storedAmoTokens = loadAmoTokens();

const {
  MONGODB_URI,
  PORT = 3000,
  AMOCRM_CLIENT_ID,
  AMOCRM_CLIENT_SECRET,
  AMOCRM_REDIRECT_URI,
  AMOCRM_ACCESS_TOKEN,
  AMOCRM_REFRESH_TOKEN,
  AMOCRM_SUBDOMAIN,
  AMOCRM_AGREEMENT_FIELD_ID,
  AMOCRM_SOURCE_FIELD_ID
} = process.env;

const initialAmoAccessToken = storedAmoTokens?.access_token || AMOCRM_ACCESS_TOKEN || null;
const initialAmoRefreshToken = storedAmoTokens?.refresh_token || AMOCRM_REFRESH_TOKEN || null;

let amoAccessToken = initialAmoAccessToken;
let amoRefreshToken = initialAmoRefreshToken;
let amoTokenExpiresAt = storedAmoTokens?.expires_at || 0;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

const app = express();
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'https://flatcher.su'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, origin);
    }
    return callback(null, false);
  },
  credentials: false
}));
app.use(express.json());

const normalizePhone = (value = "") => value.replace(/\D+/g, "");

async function refreshAccessToken(refreshToken) {
  const response = await fetch(`https://${AMOCRM_SUBDOMAIN}.amocrm.ru/oauth2/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: AMOCRM_CLIENT_ID,
      client_secret: AMOCRM_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
      redirect_uri: AMOCRM_REDIRECT_URI || 'https://example.com'
    })
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`AmoCRM refresh failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  return data;
}

async function ensureAmoToken() {
  if (!AMOCRM_CLIENT_ID || !AMOCRM_CLIENT_SECRET || !AMOCRM_SUBDOMAIN) {
    console.warn('AmoCRM credentials are missing, skip lead push');
    return null;
  }

  if (!AMOCRM_REDIRECT_URI) {
    console.warn('AMOCRM_REDIRECT_URI is missing; cannot obtain AmoCRM tokens.');
    return null;
  }

  if (amoAccessToken && Date.now() < amoTokenExpiresAt) {
    return amoAccessToken;
  }

  try {
    if (!amoRefreshToken) {
      console.warn('No AmoCRM refresh token available (neither .env nor amo-tokens.json). Cannot obtain access token.');
      return null;
    }

    const tokenResponse = await refreshAccessToken(amoRefreshToken);

    amoAccessToken = tokenResponse.access_token;
    amoRefreshToken = tokenResponse.refresh_token || amoRefreshToken;
    amoTokenExpiresAt = Date.now() + Math.max((tokenResponse.expires_in || 900) - 60, 60) * 1000;

    persistAmoTokens({
      access_token: amoAccessToken,
      refresh_token: amoRefreshToken,
      expires_at: amoTokenExpiresAt,
      updated_at: new Date().toISOString()
    });

    if (tokenResponse.refresh_token && tokenResponse.refresh_token !== AMOCRM_REFRESH_TOKEN) {
      console.log('AmoCRM refresh token updated. Please update your .env with AMOCRM_REFRESH_TOKEN=', tokenResponse.refresh_token);
    }

    return amoAccessToken;
  } catch (tokenError) {
    console.error('Failed to obtain AmoCRM access token:', tokenError.message);
    if (tokenError.message.includes('Cannot decrypt the refresh token')) {
      amoRefreshToken = null;
      amoTokenExpiresAt = 0;
      console.warn('Cleared stored AmoCRM refresh token; will require new authorization code or manual refresh token update.');
    }
    return null;
  }
}

async function findAmoLeadIdByPhone(token, phone) {
  const phoneDigits = normalizePhone(phone);
  if (!phoneDigits) return null;

  try {
    const response = await fetch(
      `https://${AMOCRM_SUBDOMAIN}.amocrm.ru/api/v4/contacts?with=leads&query=${encodeURIComponent(phoneDigits)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = await parseJsonSafely(response);
    if (!data) {
      return null;
    }
    const contacts = data?._embedded?.contacts || [];
    for (const contact of contacts) {
      const phones = (contact.custom_fields_values || []).find((field) => field.field_code === 'PHONE');
      const hasPhone = phones?.values?.some((item) => normalizePhone(item.value) === phoneDigits);
      if (!hasPhone) continue;

      const leadIds = contact._embedded?.leads || [];
      if (leadIds.length) {
        return String(leadIds[0].id || leadIds[0]);
      }
    }
  } catch (error) {
    console.warn('AmoCRM contact search failed:', error.message);
  }

    return null;
}

async function resolveExistingAmoLeadId({ token, phoneDigits }) {
  if (!phoneDigits) return null;

  const savedLead = await Lead.findOne({
    phoneDigits,
    amoLeadId: { $exists: true, $ne: null }
  }).sort({ createdAt: -1 });

  if (savedLead?.amoLeadId) {
    return savedLead.amoLeadId;
  }

  if (!token) {
    return null;
  }

  const contactLeadId = await findAmoLeadIdByPhone(token, phoneDigits);
  if (contactLeadId) {
    await Lead.updateMany({ phoneDigits }, { amoLeadId: contactLeadId });
    return contactLeadId;
  }

  try {
    const response = await fetch(`https://${AMOCRM_SUBDOMAIN}.amocrm.ru/api/v4/leads?query=${encodeURIComponent(phoneDigits)}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      await response.text();
      return null;
    }

    const data = await parseJsonSafely(response);
    if (!data) {
      return null;
    }
    const leads = data?._embedded?.leads || [];
    if (leads.length) {
      const leadId = String(leads[0].id || leads[0]);
      await Lead.updateMany({ phoneDigits }, { amoLeadId: leadId });
      return leadId;
    }
  } catch (error) {
    console.warn('AmoCRM lead search failed:', error.message);
  }

  return null;
}

async function sendAmoLead(leadPayload) {
  const accessToken = await ensureAmoToken();
  if (!accessToken) {
    return null;
  }

  const url = `https://${AMOCRM_SUBDOMAIN}.amocrm.ru/api/v4/leads/complex`;
  const payload = Array.isArray(leadPayload) ? leadPayload : [leadPayload];

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`AmoCRM lead creation failed: ${response.status} ${errorBody}`);
  }

  return response.json();
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    phone: { type: String, trim: true, required: true },
    phoneDigits: { type: String, index: true },
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
    entryPoint: { type: String },
    section: { type: String },
    numericId: { type: String },
    payloadSummary: { type: String },
    formValues: { type: Object },
    filters: { type: Object },
    extra: { type: Object },
    visitStartedAt: { type: Date },
    utm_source: { type: String },
    utm_medium: { type: String },
    utm_campaign: { type: String },
    utm_content: { type: String },
    utm_term: { type: String },
    ip: { type: String },
    submittedAt: { type: Date },
    amoLeadId: { type: String }
  },
  { timestamps: true }
);

const Lead = mongoose.model('Lead', leadSchema);

app.post('/api/leads', async (req, res) => {
  try {
    const phoneRaw = req.body.phone?.trim() || '';
    const phoneDigits = normalizePhone(phoneRaw);

    const payload = {
      name: req.body.name?.trim() || '',
      phone: formatPhoneForBackend(phoneRaw),
      phoneDigits,
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
      entryPoint: req.body.meta?.source || req.body.source || '',
      section: req.body.meta?.section || '',
      numericId: req.body.meta?.numericId || '',
      payloadSummary: req.body.meta?.payloadSummary || '',
      formValues: req.body.meta?.formValues || undefined,
      filters: req.body.meta?.filters || req.body.meta?.extra?.filters || undefined,
      extra: req.body.meta?.extra || undefined,
      visitStartedAt: req.body.meta?.visitStartedAt ? new Date(req.body.meta.visitStartedAt) : undefined,
      utm_source: req.body.utm?.utm_source || '',
      utm_medium: req.body.utm?.utm_medium || '',
      utm_campaign: req.body.utm?.utm_campaign || '',
      utm_content: req.body.utm?.utm_content || '',
      utm_term: req.body.utm?.utm_term || '',
      ip: req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || '',
      submittedAt: new Date(),
      amoLeadId: null
    };

    if (!payload.phone) {
      return res.status(400).json({ message: 'Phone is required' });
    }

    if (phoneDigits) {
      const existingLead = await Lead.findOne({
        phoneDigits,
        amoLeadId: { $exists: true, $ne: null }
      }).sort({ createdAt: -1 });
      if (existingLead?.amoLeadId) {
        payload.amoLeadId = existingLead.amoLeadId;
        console.log(`Reuse existing amoLeadId ${payload.amoLeadId} for phone ${phoneDigits}`);
      }
    }

    const lead = new Lead(payload);
    await lead.save();

    let amoLeadPayload = null;
    if (AMOCRM_SUBDOMAIN) {
      try {
        const token = await ensureAmoToken();
        if (!token) {
          console.warn('Cannot push AmoCRM lead: no access token obtained');
        } else {
          const amoContact = {
            name: payload.name || 'Без имени',
            first_name: payload.name || 'Без имени',
            custom_fields_values: [
              {
                field_code: 'PHONE',
                values: [{ value: payload.phone }]
              }
            ]
          };

          if (payload.email) {
            amoContact.custom_fields_values.push({
              field_code: 'EMAIL',
              values: [{ value: payload.email }]
            });
          }

          if (AMOCRM_AGREEMENT_FIELD_ID) {
            amoContact.custom_fields_values.push({
              field_id: Number(AMOCRM_AGREEMENT_FIELD_ID),
              values: [
                {
                  value: true
                }
              ]
            });
          }

          if (AMOCRM_SOURCE_FIELD_ID) {
            const sourceTag = payload.utm_source || payload.entryPoint || 'site';
            amoContact.custom_fields_values.push({
              field_id: Number(AMOCRM_SOURCE_FIELD_ID),
              values: [
                {
                  value: sourceTag
                }
              ]
            });
          }

          const baseSummary = payload.payloadSummary || payload.message || '';
          const leadClientName = payload.name || 'клиенту';
          const summaryText = `Сделка по ${leadClientName} с сайта`;
          const amoTags = [];
          const sourceLower = (payload.entryPoint || '').toLowerCase();
          const utmMedium = (payload.utm_medium || '').toLowerCase();

          if (sourceLower.includes('direct') || utmMedium.includes('cpc')) {
            amoTags.push({ name: 'Директ' });
          } else {
            amoTags.push({ name: 'SEO' });
          }

          const noteBlocks = new Set();
          if (baseSummary) {
            noteBlocks.add(`Запрос клиента: ${baseSummary}`);
          }

          const meaningfulFormValues = extractMeaningfulFormValues(payload.formValues) || extractMeaningfulFormValues(payload.filters);
          if (meaningfulFormValues) {
            noteBlocks.add(`Параметры формы: ${JSON.stringify(meaningfulFormValues)}`);
          }

          if (payload.utm_source || payload.utm_medium || payload.utm_campaign || payload.utm_content || payload.utm_term) {
            noteBlocks.add(
              `UTM: ${JSON.stringify({
                source: payload.utm_source,
                medium: payload.utm_medium,
                campaign: payload.utm_campaign,
                content: payload.utm_content,
                term: payload.utm_term
              })}`
            );
          }
          if (payload.page) noteBlocks.add(`page: ${payload.page}`);
          if (payload.referrer) noteBlocks.add(`referrer: ${payload.referrer}`);
          noteBlocks.add('Документы: https://flatcher.su/user-agreement | https://flatcher.su/data-processing | https://flatcher.su/consent');

          const noteText = Array.from(noteBlocks).join('\n').trim();
          const note = noteText
            ? [
                {
                  note_type: 'common',
                  params: {
                    text: noteText
                  }
                }
              ]
            : [];

          let existingLeadId = payload.amoLeadId;
          if (!existingLeadId) {
            existingLeadId = await resolveExistingAmoLeadId({
              token,
              phoneDigits: payload.phoneDigits
            });
          }

          if (existingLeadId) {
            console.log(`Appending note to existing amoCRM lead ${existingLeadId} for phone ${payload.phoneDigits}`);
            if (note.length) {
              await fetch(`https://${AMOCRM_SUBDOMAIN}.amocrm.ru/api/v4/leads/${existingLeadId}/notes`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(note)
              });
            }

            if (amoTags.length) {
              await fetch(`https://${AMOCRM_SUBDOMAIN}.amocrm.ru/api/v4/leads/${existingLeadId}`, {
                method: 'PATCH',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                  _embedded: {
                    tags: amoTags
                  }
                })
              });
            }

            await Lead.updateMany({ phoneDigits: payload.phoneDigits }, { amoLeadId: existingLeadId });
          } else {
            console.log(`Creating new amoCRM lead for phone ${payload.phoneDigits}`);
            amoLeadPayload = {
              name: `Сделка по ${leadClientName} с сайта`,
              price: undefined,
              _embedded: {
                contacts: [amoContact],
                notes: note,
                tags: amoTags
              }
            };

            const amoResponse = await sendAmoLead(amoLeadPayload);
            const newLeadId = amoResponse?._embedded?.leads?.[0]?.id;
            if (newLeadId) {
              console.log(`Stored new amoLeadId ${newLeadId} for phone ${payload.phoneDigits}`);
              await Lead.updateMany({ phoneDigits: payload.phoneDigits }, { amoLeadId: String(newLeadId) });
            }
          }
        }
      } catch (amoError) {
        console.error('Failed to push lead to AmoCRM:', amoError.message);
        if (amoLeadPayload) {
          console.error('AmoCRM payload:', JSON.stringify(amoLeadPayload, null, 2));
        }
      }
    }

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
