import { Repositories } from '@saber2pr/types-github-api';
import { fetchUserRepos } from '@src/services/builders/github';
import { useGlobalState } from '@src/services/state/useGlobalState';
import { useEffect, useState } from 'react';

function useGithub() {
  const profile = useGlobalState((s) => s.profile);
  const [repos, setRepos] = useState<Repositories>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!profile?.Profile?.GitIntegrations?.github) return;
    setLoading(true);
    const p = profile?.Profile;
    const user = p?.GitIntegrations.github.username;
    const apikey = p?.GitIntegrations.github.apiKey;
    if (user && apikey) {
      fetchUserRepos(user, apikey)
        .then((r: Repositories) => {
          setRepos(r);
        })
        .catch((e) => {
          console.error(e);
          setLoading(false);
        });
      setLoading(false);
      return;
    }

    setRepos(repos);
  }, [profile]);

  return {
    repositories: repos,
    loading,
  };
}

export default useGithub;
