import { WebContainer } from '@webcontainer/api';
import { createFileTree } from 'github-to-webcontainer';

const GITHUB_TOKEN = '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';

/**
 * Build a GitHub project using WebContainer and return the built files.
 * @param project - The GitHub project in the format 'org/repo'.
 * @example
 * ```typescript
 * buildGithubProject({ project: 'org/repo' })
 * ```
 */
export async function buildGithubProject({
  project,
  apiKey = GITHUB_TOKEN,
}: {
  project: string;
  apiKey?: string;
}): Promise<Record<string, string>> {
  console.log('Building project:', project);
  const fileTree = await createFileTree(project, {
    apiKey,
  });

  if (!fileTree) {
    throw new Error('Failed to create file tree');
  }
  const container = await WebContainer.boot({ coep: 'none' });
  await container.mount(fileTree);

  const installProcess = await container.spawn('yarn');
  installProcess.output.pipeTo(
    new WritableStream({
      write(chunk) {
        console.log(chunk);
      },
    }),
  );

  // Wait for the install process to exit
  const exitCode = await installProcess.exit;

  if (exitCode !== 0) {
    throw new Error('Failed to install dependencies');
  }

  const files = await container.fs.readdir('/');
  console.log(files);

  // Run npm build
  const buildProcess = await container.spawn('yarn', ['build']);
  buildProcess.output.pipeTo(
    new WritableStream({
      write(chunk) {
        console.log(chunk);
      },
    }),
  );

  // Wait for the build process to exit
  const buildExitCode = await buildProcess.exit;

  if (buildExitCode !== 0) {
    throw new Error('Failed to build the project');
  }

  const allFiles = await container.fs.readdir('/');
  console.log(allFiles);
  // Read built files from the 'dist' directory
  const distDir = '/dist';
  const builtFiles = await readDirectory(container, distDir);

  return builtFiles;
}

/**
 * Recursively read a directory in the WebContainer filesystem and return a mapping of file paths to their content.
 * @param container - The WebContainer instance.
 * @param dir - The directory to read.
 * @returns A mapping of file paths to their content.
 */
async function readDirectory(
  container: WebContainer,
  dir: string,
): Promise<Record<string, string>> {
  const files: Record<string, string> = {};

  async function readDir(currentDir: string) {
    const items = await container.fs.readdir(currentDir);

    for (const item of items) {
      const fullPath = `${currentDir}/${item}`;
      const stats = await container.fs
        .readFile(fullPath, 'utf8')
        .catch(() => null);

      if (stats) {
        files[fullPath] = stats;
      } else {
        await readDir(fullPath);
      }
    }
  }

  await readDir(dir);
  return files;
}

export async function fetchUserRepos(username: string) {
  const url = `https://api.github.com/users/${username}/repos`;

  const options = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `token ${GITHUB_TOKEN}`, // Optional: Include this header if using a token
    },
  };

  const response = await fetch(url, options);

  if (!response.ok) {
    throw new Error(`Error fetching repositories: ${response.statusText}`);
  }

  const repos = await response.json();
  return repos;
}
