const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/generate', async (req, res) => {
  try {
    const ollamaRes = await axios.post('http://localhost:11434/api/generate', req.body);
    res.json(ollamaRes.data);
  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(3000, () => {
  console.log('Proxy server running on http://localhost:3000');
});
