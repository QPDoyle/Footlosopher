import React, { useState } from 'react';
import './Fixtures.css';
import { NavLink } from 'react-router-dom';

function Fixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [league, setLeague] = useState("39");
  const season = 2024;

  const leagueNames = {
    "39": "Premier League",
    "140": "La Liga",
    "78": "Bundesliga",
  };

  const fetchFixtures = () => {
    setLoading(true);
    setError(null);
    fetch(`/api/fixtures?league=${league}&season=${season}`)
      .then(res => res.json())
      .then(data => {
        if (data.response && data.response.length > 0) {
          setFixtures(data.response);
        } else {
          setError('No fixture data available.');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Something went wrong. Please try again.');
        setLoading(false);
      });
  };

  const getResult = (f) => {
    const h = f.goals.home;
    const a = f.goals.away;
    if (h === null || a === null) return 'upcoming';
    if (h > a) return 'home';
    if (a > h) return 'away';
    return 'draw';
  };
  
  return (
    <div className="app">
      <div className="noise" />

      <header className="header">
        <div className="header-inner">
          <div className="header-left">
            <span className="logo-dot" />
            <h1 className="logo-text">Fixtures</h1>
          </div>
          <div className="season-badge">Season {season}</div>
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
            className={`fetch-btn ${loading ? 'loading' : ''}`}
            onClick={fetchFixtures}
            disabled={loading}
          >
            {loading ? (
              <><span className="spinner" /> Loading</>
            ) : (
              <>Load Fixtures</>
            )}
          </button>
        </div>

        {error && (
          <div className="error-msg">
            <span className="error-icon">!</span> {error}
          </div>
        )}

        {fixtures.length === 0 && !loading && !error && (
          <div className="empty-state">
            <div className="empty-icon">⚽</div>
            <p>Select a league and load fixtures to get started.</p>
          </div>
        )}

        {fixtures.length > 0 && (
          <div className="fixtures-wrapper">
            <div className="fixtures-header">
              <span>{leagueNames[league]}</span>
              <span className="count-badge">{fixtures.length} matches</span>
            </div>
            <div className="fixtures-table-wrap">
              <table className="fixtures-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Home</th>
                    <th className="score-col">Score</th>
                    <th>Away</th>
                    <th>Venue</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fixtures.map((f, i) => {
                    const result = getResult(f);
                    return (
                      <tr key={f.fixture.id} className="fixture-row" style={{ animationDelay: `${i * 0.03}s` }}>
                        <td className="date-cell">
                          {new Date(f.fixture.date).toLocaleDateString('en-GB', {
                            day: '2-digit', month: 'short', year: 'numeric'
                          })}
                        </td>
                        <td className={`team-cell home-cell ${result === 'home' ? 'winner' : result === 'away' ? 'loser' : ''}`}>
                          <NavLink to={`/team/${f.teams.home.id}?league=${league}&season=${season}`}
                          className={() => "team-name"}>
                            {f.teams.home.name}
                          </NavLink>
                        </td>
                        <td className="score-cell">
                          {f.goals.home !== null ? (
                            <span className="score-pill">
                              <span className={result === 'home' ? 'score-win' : ''}>{f.goals.home}</span>
                              <span className="score-sep">–</span>
                              <span className={result === 'away' ? 'score-win' : ''}>{f.goals.away}</span>
                            </span>
                          ) : (
                            <span className="score-vs">vs</span>
                          )}
                        </td>
                        <td className={`team-cell away-cell ${result === 'away' ? 'winner' : result === 'home' ? 'loser' : ''}`}>
                          <NavLink to={`/team/${f.teams.away.id}?league=${league}&season=${season}`}
                          className={() => "team-name"}>
                            {f.teams.away.name}
                          </NavLink>
                        </td>
                        <td className="venue-cell">{f.fixture.venue.name}</td>
                        <td className="status-cell">
                          <span className={`status-badge status-${f.fixture.status.short?.toLowerCase()}`}>
                            {f.fixture.status.long}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Fixtures;
