import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams, NavLink } from 'react-router-dom';
import './Fixtures.css';
import './PlayerProfile.css';

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
                </div>
              </div>
            </div>

            {statistics.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">📊</div>
                <p>No stats available for the {season} season.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default PlayerProfile;
