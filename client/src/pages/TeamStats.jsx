import { useEffect, useState } from 'react';
import { useParams, useSearchParams} from 'react-router-dom';
import './Fixtures.css';

function TeamLogo({ team_id }) {
  return <img src={`https://media.api-sports.io/football/teams/${team_id}.png`} alt="Team Logo" />;
}

function TeamStats() {
  const { teamId } = useParams();
  const [searchParams] = useSearchParams();
  const league = searchParams.get('league');
  const season = searchParams.get('season');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);

    const params = new URLSearchParams();
    if (league) params.set('league', league);
    if (season) params.set('season', season);

    fetch(`/api/team/${teamId}?${params.toString()}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
        return res.json();
      })
      .then(data => setStats(data.response))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [teamId, league, season]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <TeamLogo team_id={teamId} />
      <h1>{stats.team.name}</h1>
      <div>
        <h2> Season: {season}</h2>
      </div>


      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}

export default TeamStats;