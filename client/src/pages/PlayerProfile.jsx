import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, NavLink } from 'react-router-dom';
import './Fixtures.css';
import './PlayerProfile.css';

const STAT_SECTIONS = [
  {
    title: 'General',
    stats: [
      { label: 'Appearances', value: s => s.games.appearences },
      { label: 'Minutes', value: s => s.games.minutes },
      { label: 'Rating', value: s => s.games.rating ? Number(s.games.rating).toFixed(2) : null },
      { label: 'Position', value: s => s.games.position },
    ],
  },
  {
    title: 'Attack',
    stats: [
      { label: 'Goals', value: s => s.goals.total },
      { label: 'Assists', value: s => s.goals.assists },
      { label: 'Shots', value: s => s.shots.total },
      { label: 'Shots on Target', value: s => s.shots.on },
      { label: 'Dribbles', value: s => s.dribbles.success },
    ],
  },
  {
    title: 'Passing',
    stats: [
      { label: 'Passes', value: s => s.passes.total },
      { label: 'Key Passes', value: s => s.passes.key },
      { label: 'Pass Accuracy', value: s => s.passes.accuracy != null ? `${s.passes.accuracy}%` : null },
    ],
  },
  {
    title: 'Defense',
    stats: [
      { label: 'Tackles', value: s => s.tackles.total },
      { label: 'Interceptions', value: s => s.tackles.interceptions },
      { label: 'Duels Won', value: s => (s.duels.won != null && s.duels.total != null) ? `${s.duels.won}/${s.duels.total}` : null },
    ],
  },
  {
    title: 'Discipline',
    stats: [
      { label: 'Yellow Cards', value: s => s.cards.yellow },
      { label: 'Red Cards', value: s => s.cards.red },
      { label: 'Fouls Drawn', value: s => s.fouls.drawn },
      { label: 'Fouls Committed', value: s => s.fouls.committed },
    ],
  },
];

// Collapses a list of season-start years into readable ranges, e.g. [2020,2021,2023] -> "2020-2022, 2023-2024"
function formatSeasons(seasons) {
  if (!seasons || seasons.length === 0) return null;
  const sorted = [...seasons].sort((a, b) => a - b);
  const ranges = [];
  let start = sorted[0];
  let end = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === end + 1) {
      end = sorted[i];
    } else {
      ranges.push([start, end]);
      start = sorted[i];
      end = sorted[i];
    }
  }
  ranges.push([start, end]);

  return ranges
    .map(([s, e]) => `${s}-${e + 1}`)
    .join(', ');
}

function PlayerProfile() {
  const { playerId } = useParams();
  const [searchParams] = useSearchParams();
  const season = searchParams.get('season');
  const team = searchParams.get('team');

  const [player, setPlayer] = useState(null);
  const [statistics, setStatistics] = useState([]);
  const [teamHistory, setTeamHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    Promise.all([
      fetch(`/api/player/${playerId}?season=${season}`).then(res => res.json()),
      fetch(`/api/player/${playerId}/teams`).then(res => res.json()),
    ])
      .then(([playerData, teamsData]) => {
        if (playerData.response && playerData.response.length > 0) {
          setPlayer(playerData.response[0].player);
          setStatistics(playerData.response[0].statistics || []);
        } else {
          setError('No player data available.');
        }
        setTeamHistory(teamsData.response || []);
      })
      .catch(err => {
        console.error(err);
        setError('Something went wrong. Please try again.');
      })
      .finally(() => setLoading(false));
  }, [playerId, season]);

  const currentClub = teamHistory.reduce((latest, entry) => {
    const maxSeason = Math.max(...(entry.seasons || [0]));
    if (!latest || maxSeason > latest.maxSeason) {
      return { team: entry.team, maxSeason };
    }
    return latest;
  }, null);

  const seasonsForTeam = (teamId) => {
    const entry = teamHistory.find(t => t.team.id === teamId);
    return formatSeasons(entry?.seasons);
  };

  return (
    <div className="app">
      <div className="noise" />

      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <span className="logo-dot" />
            <h1 className="logo-text">Player</h1>
          </div>
          <span className="season-badge">{season}</span>
        </div>
      </header>

      <main className="main">
        {team && (
          <NavLink to="/Squads" className="back-link">&larr; Back to Squad</NavLink>
        )}

        {loading && (
          <div className="empty-state">
            <span className="spinner" /> Loading player...
          </div>
        )}

        {error && (
          <div className="error-msg">
            <span className="error-icon">!</span> {error}
          </div>
        )}

        {player && !loading && !error && (
          <>
            <div className="player-profile-header">
              <img className="player-profile-photo" src={player.photo} alt={player.name} />
              <div className="player-profile-info">
                <div className="player-profile-name-row">
                  <h2>{player.name}</h2>
                  {currentClub && (
                    <span className="club-badge">
                      <img className="club-badge-logo" src={currentClub.team.logo} alt={currentClub.team.name} />
                      {currentClub.team.name}
                    </span>
                  )}
                </div>
                <div className="player-profile-meta">
                  {player.nationality && <span>{player.nationality}</span>}
                  {player.age != null && <span>Age {player.age}</span>}
                  {player.height && <span>{player.height}</span>}
                  {player.weight && <span>{player.weight}</span>}
                </div>
              </div>
            </div>

            {statistics.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <p>No stats available for the {season} season.</p>
              </div>
            )}

            {statistics.map((stat, idx) => (
              <div className="fixtures-wrapper stats-wrapper" key={idx}>
                <div className="fixtures-header">
                  <div className="stats-header-team">
                    <img className="stats-team-logo" src={stat.team.logo} alt={stat.team.name} />
                    <span>{stat.team.name} &mdash; {stat.league.name}</span>
                    {seasonsForTeam(stat.team.id) && (
                      <span className="seasons-badge">{seasonsForTeam(stat.team.id)}</span>
                    )}
                  </div>
                  <span className="count-badge">{stat.games.appearences ?? 0} apps</span>
                </div>

                {STAT_SECTIONS.map(section => {
                  const entries = section.stats
                    .map(s => ({ label: s.label, value: s.value(stat) }))
                    .filter(s => s.value != null && s.value !== '');

                  if (entries.length === 0) return null;

                  return (
                    <div className="stats-section" key={section.title}>
                      <h4 className="stats-section-title">{section.title}</h4>
                      <div className="stats-grid">
                        {entries.map(entry => (
                          <div className="stat-box" key={entry.label}>
                            <span className="stat-value">{entry.value}</span>
                            <span className="stat-label">{entry.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </>
        )}
      </main>
    </div>
  );
}

export default PlayerProfile;
