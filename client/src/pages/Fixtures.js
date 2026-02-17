import React, { useState } from 'react';

function Fixtures() {
  const [fixtureId, setFixtureId] = useState('');
  const [fixture, setFixture] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchFixture = () => {
    setLoading(true);
    fetch(`/api/fixtures?id=${fixtureId}`)
      .then(res => res.json())
      .then(data => {
        setFixture(data.response[0]);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
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