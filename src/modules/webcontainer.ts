import Debug from '../utils/debug';

import type {FileSystemAPI, FileSystemTree} from '@webcontainer/api';
import type {TreeItem, TreeItemIndex} from 'react-complex-tree';
import type {DockviewApi} from 'dockview';


const configRaw = globalThis.localStorage?.vslite_config;
const config = configRaw ? JSON.parse(configRaw) : {};
const debug = Debug('webcontainer');

export async function getDirAsTree(
  fs: FileSystemAPI,
  path: string,
  parent: string,
  root: TreeItem<string>,
  db: Record<TreeItemIndex, TreeItem<string>>,
) {
  const entries = await fs.readdir(path, {withFileTypes: true});
  const directory = !config.showHidden
    ? entries.filter((item) => !item.name.startsWith('.') && item.name !== 'node_modules')
    : entries;

  debug('getDirAsTree() directory', directory);

  if (parent === 'root') db.root = root;

  directory.forEach(item => {
    const isDir = item.isDirectory();
    const itemPath = `${path}/${item.name}`;
    db[itemPath] = {
      index: itemPath,
      data: item.name,
      isFolder: isDir,
      canMove: true,
      canRename: true,
      children: [],
    };
    if (parent) db?.[parent]?.children?.push(itemPath);
    if (isDir) return getDirAsTree(fs, itemPath, itemPath, root, db);
  });

  debug('getDirAsTree() db', db);

  return db;
}

export async function openFolder(_fs: FileSystemAPI, _api: DockviewApi) {
  // @ts-ignore
  const dir = await globalThis.showDirectoryPicker();
  for await (const entry of dir.values()) {
    console.log(entry);
  }
}

export const startFiles: FileSystemTree = {};