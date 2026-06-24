const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

const KEY = process.env.TMDB_API_KEY;
if (!KEY) {
  console.warn('Warning: TMDB_API_KEY is not set in server environment. Requests will fail without it.');
}

// simple request logger for diagnosing requests
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

app.get('/api/search', async (req, res) => {
  try {
    const q = encodeURIComponent(req.query.q || '');
    const type = req.query.type || 'multi';
    const url = `https://api.themoviedb.org/3/search/${type}?api_key=${KEY}&query=${q}&page=1`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'proxy_error', detail: String(err) });
  }
});

app.get('/api/watch/:endpoint/:id', async (req, res) => {
  try {
    const endpoint = req.params.endpoint === 'tv' ? 'tv' : 'movie';
    const id = encodeURIComponent(req.params.id);
    const url = `https://api.themoviedb.org/3/${endpoint}/${id}/watch/providers?api_key=${KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'proxy_error', detail: String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`TMDB proxy listening on http://localhost:${PORT}`);
});
