import Button from '@src/components/buttons/Button';
import InlineTextInput from '@src/components/inputs/text/InlineTextInput';
import {
  buildGithubProject,
  fetchUserRepos,
} from '@src/services/builders/github';
import { errorEmitter } from '@src/services/events';
import { useState } from 'react';

function Home() {
  const [repo, setRepo] = useState<string>('ar-io/ar-io-sdk');

  async function handleBuild(repository: string) {
    try {
      if (!repository) {
        throw new Error('Repository is required');
      }
      const user = repository.split('/')[0];
      fetchUserRepos(user).then(console.log);
      const res = await buildGithubProject({ project: repo });
      console.log(res);
    } catch (error) {
      errorEmitter.emit('error', error);
    }
  }
  return (
    <div className="align-center flex h-full w-full flex-col justify-center gap-10 p-6">
      <InlineTextInput
        value={repo}
        setValue={(v) => setRepo(v)}
        placeholder="Enter a repo"
      />

      <Button onClick={() => handleBuild(repo)}>Build</Button>
    </div>
  );
}
3;

export default Home;
