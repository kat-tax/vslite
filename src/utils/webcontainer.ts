import type {FileSystemAPI, FileSystemTree} from '@webcontainer/api';
import type {TreeItem, TreeItemIndex} from 'react-complex-tree';
import Debug from '../utils/debug';

const debug = Debug('FileTree')

export async function getDirAsTree(
  fs: FileSystemAPI,
  path: string,
  parent: string,
  root: TreeItem<string>,
  db: Record<TreeItemIndex, TreeItem<string>>,
) {
  const dir = await fs.readdir(path, {withFileTypes: true});
  if (parent === 'root') db.root = root;
  dir.forEach(item => {
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
  debug('utils/webcontainer', db)
  return db;
}

export const startFiles: FileSystemTree = {};
