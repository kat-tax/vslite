import 'react-complex-tree/lib/style-modern.css';
import {useEffect, useRef} from 'react';
import {Tree as TreeView, UncontrolledTreeEnvironment} from 'react-complex-tree';
import {TreeDataProvider} from '../utils/TreeDataProvider';

import type {TreeItem, TreeItemIndex} from 'react-complex-tree';
import type {FileSystemAPI} from '@webcontainer/api';

interface TreeProps {
  fs: FileSystemAPI,
  onTriggerItem: (path: string, name: string) => void,
}

const root: TreeItem<string> = {
  index: 'root',
  data: 'root',
  isFolder: true,
  canMove: false,
  canRename: false,
  children: [],
};

export function Tree(props: TreeProps) {
  const provider = useRef<TreeDataProvider<string>>(
    new TreeDataProvider({root}, (item, data) => ({...item, data}))
  );

  const readDir = async (path: string, parent: string, db: Record<TreeItemIndex, TreeItem<string>>) => {
    const dir = await props.fs.readdir(path, {withFileTypes: true});

    if (parent === 'root') {
      db.root = root;
    }

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

      if (parent) {
        db?.[parent]?.children?.push(itemPath);
      }

      if (isDir) {
        return readDir(itemPath, itemPath, db);
      }
    });

    return db;
  };

  const refresh = async () => {
    const data = await readDir('.', 'root', {});
    provider.current.updateItems(data);
    console.log('tree', data);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <UncontrolledTreeEnvironment
      dataProvider={provider.current}
      getItemTitle={item => item.data}
      onPrimaryAction={item => props.onTriggerItem(item.index.toString(), item.data)}
      viewState={{}}>
      <TreeView treeId="files" rootItem="root" treeLabel="Explorer"/>
    </UncontrolledTreeEnvironment>
  );
}
