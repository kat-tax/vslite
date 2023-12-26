import {useRef, Ref} from 'react';
import {Tree, UncontrolledTreeEnvironment, TreeEnvironmentRef} from 'react-complex-tree';
import {EventEmitter} from 'react-complex-tree/src/EventEmitter';
import {getDirAsTree} from '../modules/webcontainer';
import {useDarkMode} from '../hooks/useDarkMode';
import {debounce} from '../utils/debounce';
import {getIcon} from '../icons';

import Debug from '../utils/debug';

import type * as RCT from 'react-complex-tree';
import type {FileSystemAPI} from '@webcontainer/api';

const debug = Debug('FileTree');

interface FileTreeProps {
  fs: FileSystemAPI,
  onRenameItem: (path: string, name: string) => void,
  onTriggerItem: (path: string, name: string) => void,
}

const root: RCT.TreeItem<string> = {
  index: 'root',
  data: 'root',
  isFolder: true,
  canMove: false,
  canRename: false,
  children: [],
};

export const FileTreeState = {
  refresh: new Function(),
  treeEnv: null as Ref<TreeEnvironmentRef<any, never>>
}

export function FileTree(props: FileTreeProps) {
  const isDark = useDarkMode();
  const treeEnv = useRef() as Ref<TreeEnvironmentRef<any, never>>
  const provider = useRef<TreeProvider<string>>(new TreeProvider({root}));

  const refresh = async (updateMessage?: string) => {
    debug('refresh updateMessage', updateMessage);
    const data = await getDirAsTree(props.fs, '.', 'root', Object.assign({}, root, {children: []}), {});
    debug('refresh getDirAsTree', data);
    provider.current.updateItems(data);
  };
  
  // TODO: find a better way to call "refresh" outside of component
  // https://github.com/vitejs/vite-plugin-react-swc#consistent-components-exports
  Object.assign(FileTreeState, {treeEnv, refresh: debounce(refresh, 300)});

  const renderItem = (item: RCT.TreeItem<any>) => {
    const icon = getIcon(
      item.data,
      '',
      item.isFolder || false,
      item.index === 'root',
      isDark ? 'dark' : 'light',
    );
    return (
      <span className={icon}>
        {item.data}
      </span>
    );
  };

  return (
    <div style={{overflow: 'scroll'}}>
      <div className={isDark ? 'rct-dark' : 'rct-default'}>
        <UncontrolledTreeEnvironment
          ref={treeEnv}
          canRename
          canSearch
          canDragAndDrop
          canDropOnFolder
          canSearchByStartingTyping
          dataProvider={provider.current}
          getItemTitle={item => item.data}
          renderItemTitle={(props) => renderItem(props.item)}
          onPrimaryAction={item => props.onTriggerItem(item.index.toString(), item.data)}
          onRenameItem={(item, name) => props.onRenameItem(item.index.toString(), name)}
          // onExpandItem={(item) => {debug('expand', item)}}
          viewState={{filetree: {}}}>
          <Tree treeId="filetree" treeLabel="Explorer" rootItem="root"/>
        </UncontrolledTreeEnvironment>
      </div>
    </div>
  );
}

class TreeProvider<T = any> implements RCT.TreeDataProvider {
  private data: RCT.ExplicitDataSource;
  private onDidChangeTreeDataEmitter = new EventEmitter<RCT.TreeItemIndex[]>();

  constructor(items: Record<RCT.TreeItemIndex, RCT.TreeItem<T>>) {
    debug('TreeProvider constructor', items);
    this.data = {items};
  }

  public async updateItems(items: Record<RCT.TreeItemIndex, RCT.TreeItem<T>>) {
    debug('updateItems items', items)
    this.data = {items};
    this.onDidChangeTreeDataEmitter.emit(Object.keys(items));
  }

  public async getTreeItem(itemId: RCT.TreeItemIndex): Promise<RCT.TreeItem> {
    debug('getTreeItem', itemId, this.data.items[itemId]);
    return this.data.items[itemId];
  }
  
  public onDidChangeTreeData(listener: (changedItemIds: RCT.TreeItemIndex[]) => void): RCT.Disposable {
    debug('onDidChangeTreeData items', this.data.items);
    const handlerId = this.onDidChangeTreeDataEmitter.on(payload => listener(payload));
    return {dispose: () => this.onDidChangeTreeDataEmitter.off(handlerId)};
  }
}
