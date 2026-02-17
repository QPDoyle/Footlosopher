import React, { useState } from 'react';

function Fixtures() {
  const [fixtureId, setFixtureId] = useState('');
  const [fixture, setFixture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchFixture = () => {
    if (!fixtureId) return;
    setLoading(true);
    setFixture(null);
    setError(null);

    fetch(`/api/fixtures?id=${fixtureId}`)
      .then(res => res.json())
      .then(data => {
        if (data.response && data.response.length > 0) {
          setFixture(data.response[0]);
        } else {
          setError('No fixture found for that ID');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Something went wrong');
        setLoading(false);
      });
  };

  return (
    <div>
      <h1>Fixtures</h1>
      <input
        type="text"
        placeholder="Enter fixture ID"
        value={fixtureId}
        onChange={e => setFixtureId(e.target.value)}
      />
      <button onClick={fetchFixture}>Search</button>

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {fixture && (
        <div>
          <p>{fixture.teams.home.name} vs {fixture.teams.away.name}</p>
          <p>Score: {fixture.goals.home} - {fixture.goals.away}</p>
          <p>Date: {fixture.fixture.date}</p>
          <p>Venue: {fixture.fixture.venue.name}</p>
          <p>Status: {fixture.fixture.status.long}</p>
        </div>
      )}
    </div>
  );
}

export default Fixtures;