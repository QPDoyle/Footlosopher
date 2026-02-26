require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');

app.get("/api/fixtures", async (req, res) => {
    try {
      const response = await axios.get('https://v3.football.api-sports.io/fixtures', {
        headers: {
          'x-apisports-key': process.env.API_KEY
        },
        params: {
          season: req.query.season,
          league: req.query.league,
          status: "FT"
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch fixtures' });
    }
  });

app.listen(5001, () => {
  console.log('Server is running on port 5001')
});