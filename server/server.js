require('dotenv').config();
const express = require('express');
const app = express();
const axios = require('axios');

const API_BASE = 'https://v3.football.api-sports.io';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour
const cache = new Map();

// Wraps api-sports GET requests with caching (free plan is limited to 100 requests/day)
// and surfaces rate-limit responses as errors instead of silently returning empty data.
async function apiGet(path, params) {
  const key = `${path}?${JSON.stringify(params)}`;
  const cached = cache.get(key);
  if (cached && Date.now() - cached.time < CACHE_TTL) {
    return cached.data;
  }

  const response = await axios.get(`${API_BASE}${path}`, {
    headers: {
      'x-apisports-key': process.env.API_KEY
    },
    params
  });

  const { errors } = response.data;
  if (errors && (Array.isArray(errors) ? errors.length > 0 : Object.keys(errors).length > 0)) {
    const message = Array.isArray(errors) ? errors.join(', ') : Object.values(errors).join(', ');
    throw new Error(message);
  }

  cache.set(key, { data: response.data, time: Date.now() });
  return response.data;
}

app.get("/api/fixtures", async (req, res) => {
    try {
      const data = await apiGet('/fixtures', {
        season: req.query.season,
        league: req.query.league,
        status: "FT"
      });
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Failed to fetch fixtures' });
    }
  });

  app.get("/api/team/:teamId", async (req, res) => {
    try {
      const data = await apiGet('/teams/statistics', {
        league: req.query.league,
        season: req.query.season,
        team: req.params.teamId
      });
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Failed to fetch team data' });
    }
  });

app.get("/api/teams", async (req, res) => {
    try {
      const data = await apiGet('/teams', {
        league: req.query.league,
        season: req.query.season
      });
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Failed to fetch teams' });
    }
  });

  app.get("/api/squad/:teamId", async (req, res) => {
    try {
      const { season } = req.query;

      if (!season) {
        const data = await apiGet('/players/squads', {
          team: req.params.teamId
        });
        return res.json(data);
      }

      // For a specific season, build the squad from players who featured for
      // the team that season, since /players/squads only returns the current squad.
      const players = [];
      let teamInfo = null;
      let page = 1;
      let totalPages = 1;
      const MAX_PAGES = 3;

      do {
        const data = await apiGet('/players', {
          team: req.params.teamId,
          season,
          page
        });

        for (const entry of data.response) {
          const stats = entry.statistics?.find(s => s.team.id === Number(req.params.teamId)) || entry.statistics?.[0];
          if (!teamInfo && stats) {
            teamInfo = stats.team;
          }
          players.push({
            id: entry.player.id,
            name: entry.player.name,
            age: entry.player.age,
            photo: entry.player.photo,
            number: stats?.games?.number ?? null,
            position: stats?.games?.position ?? null,
          });
        }

        totalPages = Math.min(data.paging?.total ?? 1, MAX_PAGES);
        page += 1;
      } while (page <= totalPages);

      res.json({ response: [{ team: teamInfo, players }] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Failed to fetch squad' });
    }
  });

  app.get("/api/player/:playerId", async (req, res) => {
    try {
      const data = await apiGet('/players', {
        id: req.params.playerId,
        season: req.query.season
      });
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Failed to fetch player data' });
    }
  });

  app.get("/api/player/:playerId/teams", async (req, res) => {
    try {
      const data = await apiGet('/players/teams', {
        player: req.params.playerId
      });
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message || 'Failed to fetch player team history' });
    }
  });

app.listen(5001, () => {
  console.log('Server is running on port 5001')
});
