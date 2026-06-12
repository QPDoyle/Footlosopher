import React, { useState } from 'react';
import './Fixtures.css';
import './Squads.css';

const POSITION_ORDER = ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker'];

function Squads() {
  const [teams, setTeams] = useState([]);
  const [loadingTeams, setLoadingTeams] = useState(false);
  const [teamsError, setTeamsError] = useState(null);
  const [league, setLeague] = useState("39");
  const [season, setSeason] = useState(2024);
  const seasons = [2024, 2023, 2022];

  const [selectedTeam, setSelectedTeam] = useState(null);
  const [squad, setSquad] = useState(null);
  const [loadingSquad, setLoadingSquad] = useState(false);
  const [squadError, setSquadError] = useState(null);

  const leagueNames = {
    "39": "Premier League",
    "140": "La Liga",
    "78": "Bundesliga",
  };

  const fetchTeams = () => {
    setLoadingTeams(true);
    setTeamsError(null);
    setSelectedTeam(null);
    setSquad(null);
    fetch(`/api/teams?league=${league}&season=${season}`)
      .then(res => res.json())
      .then(data => {
        if (data.response && data.response.length > 0) {
          setTeams(data.response);
        } else {
          setTeams([]);
          setTeamsError('No team data available.');
        }
        setLoadingTeams(false);
      })
      .catch(err => {
        console.error(err);
        setTeamsError('Something went wrong. Please try again.');
        setLoadingTeams(false);
      });
  };

  const fetchSquad = (team) => {
    setSelectedTeam(team);
    setSquad(null);
    setLoadingSquad(true);
    setSquadError(null);
    fetch(`/api/squad/${team.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.response && data.response.length > 0) {
          setSquad(data.response[0]);
        } else {
          setSquadError('No squad data available.');
        }
        setLoadingSquad(false);
      })
      .catch(err => {
        console.error(err);
        setSquadError('Something went wrong. Please try again.');
        setLoadingSquad(false);
      });
  };

  const groupedPlayers = () => {
    if (!squad) return {};
    return squad.players.reduce((groups, player) => {
      const position = player.position || 'Unknown';
      if (!groups[position]) groups[position] = [];
      groups[position].push(player);
      return groups;
    }, {});
  };

  return (
    <div className="app">
      <div className="noise" />

      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <span className="logo-dot" />
            <h1 className="logo-text">Squads</h1>
          </div>
          <select
            className="season-badge season-select"
            value={season}
            onChange={(e) => setSeason(Number(e.target.value))}
          >
            {seasons.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="main">
        <div className="controls">
          <div className="league-tabs">
            {Object.entries(leagueNames).map(([val, name]) => (
              <button
                key={val}
                className={`league-tab ${league === val ? 'active' : ''}`}
                onClick={() => setLeague(val)}
              >
                {name}
              </button>
            ))}
          </div>
          <button
            className={`fetch-btn ${loadingTeams ? 'loading' : ''}`}
            onClick={fetchTeams}
            disabled={loadingTeams}
          >
            {loadingTeams ? (
              <><span className="spinner" /> Loading</>
            ) : (
              <>Load Teams</>
            )}
          </button>
        </div>

        {teamsError && (
          <div className="error-msg">
            <span className="error-icon">!</span> {teamsError}
          </div>
        )}

        {teams.length === 0 && !loadingTeams && !teamsError && (
          <div className="empty-state">
            <div className="empty-icon">⚽</div>
            <p>Select a league and load teams to get started.</p>
          </div>
        )}

        {teams.length > 0 && (
          <div className="teams-grid">
            {teams.map(({ team }) => (
              <button
                key={team.id}
                className={`team-card ${selectedTeam?.id === team.id ? 'active' : ''}`}
                onClick={() => fetchSquad(team)}
              >
                <img className="team-card-logo" src={team.logo} alt={team.name} />
                <span className="team-card-name">{team.name}</span>
              </button>
            ))}
          </div>
        )}

        {loadingSquad && (
          <div className="empty-state">
            <span className="spinner" /> Loading squad...
          </div>
        )}

        {squadError && (
          <div className="error-msg">
            <span className="error-icon">!</span> {squadError}
          </div>
        )}

        {squad && !loadingSquad && (
          <div className="fixtures-wrapper squad-wrapper">
            <div className="fixtures-header">
              <span>{squad.team.name}</span>
              <span className="count-badge">{squad.players.length} players</span>
            </div>

            {POSITION_ORDER.filter(pos => groupedPlayers()[pos]).map(position => (
              <div className="squad-group" key={position}>
                <h3 className="squad-group-title">{position}s</h3>
                <div className="players-grid">
                  {groupedPlayers()[position].map(player => (
                    <div className="player-card" key={player.id}>
                      <img className="player-photo" src={player.photo} alt={player.name} />
                      <div className="player-info">
                        <span className="player-name">{player.name}</span>
                        <span className="player-meta">
                          {player.number != null && <span className="player-number">#{player.number}</span>}
                          {player.age != null && <span className="player-age">Age {player.age}</span>}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Squads;
