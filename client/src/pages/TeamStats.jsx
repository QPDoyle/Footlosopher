import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';

function TeamStats() {
  const { teamId } = useParams();
  const [searchParams] = useSearchParams();
  const league = searchParams.get('league');
  const season = searchParams.get('season');
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`/api/team/${teamId}?league=${league}&season=${season}`)
      .then(res => res.json())
      .then(data => setStats(data.response));
  }, [teamId, league, season]);

  return (
    <div>
      <h1>Team {teamId}</h1>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </div>
  );
}

export default TeamStats;