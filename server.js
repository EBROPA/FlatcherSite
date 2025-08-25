import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const CLIENT_ID = process.env.AMO_CLIENT_ID;
const CLIENT_SECRET = process.env.AMO_CLIENT_SECRET;
let accessToken = /* загрузить из БД */;
let refreshToken = /* загрузить из БД */;

async function refreshAmoToken() {
  const resp = await fetch(`https://seretyy029.amocrm.ru/oauth2/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });
  const { access_token, refresh_token } = await resp.json();
  accessToken = access_token;
  refreshToken = refresh_token;
}

app.post('/api/lead', async (req, res) => {
  const leadData = {
    name: req.body.name,
    // ...другие поля
  };

  try {
    let resp = await fetch(`https://your_subdomain.amocrm.ru/api/v4/leads`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([ leadData ]),
    });

    if (resp.status === 401) {
      await refreshAmoToken();
      resp = await fetch(`https://your_subdomain.amocrm.ru/api/v4/leads`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([ leadData ]),
      });
    }

    const result = await resp.json();
    res.status(resp.status).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при создании лида в amoCRM');
  }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));
