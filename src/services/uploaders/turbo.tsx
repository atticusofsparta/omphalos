import { TurboFactory, TurboSigner } from '@ardrive/turbo-sdk';
import { ArconnectSigner, createData } from 'arbundles';
import { Tag } from 'arweave/node/lib/transaction';

export interface ManifestPathMap {
  [index: string]: { id: string };
}
export interface Manifest {
  /** manifest must be 'arweave/paths' */
  manifest: 'arweave/paths';
  /** version must be 0.1.0 */
  version: '0.1.0';
  /** index contains the default path that will redirected when the user access the manifest transaction itself */
  index?: {
    path: string;
  };
  /** paths is an object of path objects */
  paths: ManifestPathMap;
}

export function buildManifest(config: {
  items: Map<string, string>;
  indexFile?: string;
}): Manifest {
  const { items, indexFile } = config;
  const manifest: Manifest = {
    manifest: 'arweave/paths',
    version: '0.1.0',
    paths: {},
  };
  if (indexFile) {
    if (!items.has(indexFile)) {
      throw new Error(`Unable to access item: ${indexFile}`);
    }
    manifest.index = { path: indexFile };
  }
  for (const [k, v] of items.entries()) {
    manifest.paths[k] = { id: v };
  }
  return manifest;
}

export async function uploadBuildFolder(config: {
  files: File[];
  tags: Tag[];
  signer: ArconnectSigner;
  indexFile?: string;
}): Promise<{ manifestId: string }> {
  const { files, tags, signer, indexFile = 'index.html' } = config;
  const items = new Map<string, string>();

  const turbo = TurboFactory.authenticated({
    signer: signer as any,
  });

  for (const file of files) {
    const fileRes = await turbo.uploadFile({
      fileSizeFactory: () => file.size,
      fileStreamFactory: () => file.stream() as any,
    });
    items.set(file.name, fileRes.id);
  }
  const manifest = buildManifest({ items, indexFile });
  const bloob = new Blob([JSON.stringify(manifest)], {
    type: 'application/json',
  });
  const manFile = new File([bloob], 'manifest.json');

  const manifestRes = await turbo.uploadFile({
    fileSizeFactory: () => manFile.size,
    fileStreamFactory: () => manFile.stream() as any,
    dataItemOpts: {
      tags: [{ name: 'Content-Type', value: 'application/json' }, ...tags],
    },
  });
  return { manifestId: manifestRes.id };
}
