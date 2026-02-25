import React, { useState } from 'react';

function Fixtures() {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const season = 2024, league = 39;

  const fetchFixtures = () => {
    fetch(`/api/fixtures?league=${league}&season=${season}`)
      .then(res => res.json())
      .then(data => {
        console.log("data fetched", data)
        if (data.response && data.response.length > 0) {
          setFixtures(data.response);
        } else {
          setError('Could not fetch fixture data');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Something went wrong');
        setLoading(false);
      });
  };

  const getRowStyle = (f) => {
    const homeGoals = f.goals.home;
    const awayGoals = f.goals.away;
    console.log(homeGoals, awayGoals);
    if (homeGoals > awayGoals) return { home: '#90EE90', away: '#FF6B6B' };
    else if (awayGoals > homeGoals) return { home: '#FF6B6B', away: '#90EE90' };
    return { home: '', away: '' };
  };

  return (
    <div>
      <h1>Fixtures</h1>
      <button onClick={fetchFixtures}>Load Fixtures</button>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {fixtures.length > 0 && (
        <table border="1" cellPadding="8">
          <thead>
            <tr>
              <th>Date</th>
              <th>Home</th>
              <th>Score</th>
              <th>Away</th>
              <th>Venue</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fixtures.map(f => {
              const colors = getRowStyle(f);
              return (
              <tr key={f.fixture.id}>
                <td>{new Date(f.fixture.date).toLocaleDateString()}</td>
                <td style={{ backgroundColor: colors.home}}>{f.teams.home.name}</td>
                <td>{f.goals.home} - {f.goals.away}</td>
                <td style={{ backgroundColor: colors.away}}>{f.teams.away.name}</td>
                <td>{f.fixture.venue.name}</td>
                <td>{f.fixture.status.long}</td>
              </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Fixtures;