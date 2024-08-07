import { TokenType, TurboFactory } from '@ardrive/turbo-sdk';
import { DataItem } from 'arbundles';
import { Tag } from 'arweave/node/lib/transaction';
import mime from 'mime-types';

import { WalletConnector } from '../wallets';

export interface ManifestPathMap {
  [index: string]: { id: string };
}
export interface Manifest {
  manifest: 'arweave/paths';
  version: '0.1.0';
  index?: {
    path: string;
  };
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

export async function uploadFile(config: {
  file: File;
  tags: Tag[];
  signer: WalletConnector;
  network?: TokenType;
}): Promise<{ id: string }> {
  const { file, tags, signer } = config;
  const turbo = TurboFactory.unauthenticated();

  let contentType = mime.lookup(file.name) || 'application/octet-stream';

  // Append charset for text files
  if (contentType.startsWith('text/')) {
    contentType += '; charset=utf-8';
  }

  const hasContentTypeTag = tags.some((tag) => tag.name === 'Content-Type');

  console.log(`Uploading file: ${file.name} with Content-Type: ${contentType}`);
  const buffer = Buffer.from(await file.arrayBuffer());
  // convert buffer to string for compatibility with arweave.app
  const bufferString = buffer.toString('utf-8');

  const dataItemRes = await signer.signDataItem({
    data: bufferString,
    tags: [
      ...(!hasContentTypeTag
        ? [{ name: 'Content-Type', value: contentType }]
        : []),
      ...tags,
    ],
    target: '0'.padEnd(43, '0'),
  } as any);
  const dataItem = new DataItem(Buffer.from(dataItemRes));

  const fileRes = await turbo.uploadSignedDataItem({
    dataItemSizeFactory: () => dataItem.getRaw().byteLength,
    dataItemStreamFactory: () => dataItem.getRaw(),
  });

  return { id: fileRes.id };
}

export async function uploadBuildFolder(config: {
  files: File[];
  tags: Tag[];
  signer: WalletConnector;
  indexFile?: string;
  network?: TokenType;
}): Promise<{ manifestId: string }> {
  const { files, tags, signer, indexFile = 'index.html' } = config;
  const items = new Map<string, string>();

  for (const file of files) {
    const fileRes = await uploadFile({
      file,
      tags,
      signer,
      network: config.network,
    });

    let filePath = file.webkitRelativePath ?? file.name;
    if (file.webkitRelativePath) {
      const pathParts = filePath.split('/');
      pathParts.shift();
      filePath = pathParts.join('/');
    }
    items.set(filePath, fileRes.id);
  }

  const manifest = buildManifest({ items, indexFile });
  const bloob = new Blob([JSON.stringify(manifest)], {
    type: 'application/x.arweave-manifest+json',
  });
  const manFile = new File([bloob], 'manifest.json');

  const manifestRes = await uploadFile({
    file: manFile,
    tags: [
      ...tags,
      new Tag('Content-Type', 'application/x.arweave-manifest+json'),
      new Tag('Type', 'manifest'),
    ],
    signer,
    network: config.network,
  });

  console.log(`Manifest uploaded with ID: ${manifestRes.id}`);
  return { manifestId: manifestRes.id };
}
