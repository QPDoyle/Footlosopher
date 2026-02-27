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

  app.get("/api/team/:teamId", async (req, res) => {
    try {
      const response = await axios.get('https://v3.football.api-sports.io/teams/statistics', {
        headers: {
          'x-apisports-key': process.env.API_KEY
        },
        params: {
          // ?league=39&season=2024&team=42
          league: req.query.league,
          season: req.query.season,
          team: req.params.teamId
        }
      });
      res.json(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch team data' });
    }
  });

app.listen(5001, () => {
  console.log('Server is running on port 5001')
});