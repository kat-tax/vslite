import {useRef, useEffect} from 'react';
import {Tree, UncontrolledTreeEnvironment} from 'react-complex-tree';
import {EventEmitter} from 'react-complex-tree/src/EventEmitter';
import {getDirAsTree} from '../utils/webcontainer';
import {useDarkMode} from '../hooks/useDarkMode';
import Debug from '../utils/debug';
import { debounce } from '../utils/debounce';

import type * as RCT from 'react-complex-tree';
import type {FileSystemAPI} from '@webcontainer/api';

const debug = Debug('FileTree')

interface FileTreeProps {
  fs: FileSystemAPI,
  rev: number,
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
  refresh: new Function()
}

export function FileTree(props: FileTreeProps) {
  const isDark = useDarkMode();
  const provider = useRef<TreeProvider<string>>(new TreeProvider({root}));

  const refresh = async (updateMessage?: string) => {
    const data = await getDirAsTree(props.fs, '.', 'root', root, {});
    debug('refresh data', data, updateMessage)
    // const newData: Record<RCT.TreeItemIndex, RCT.TreeItem<string>> = {}
    // for (const item of Object.values(data)) {
    //   if (item.index.includes('/.')) {
    //     console.log('bad item', item)
    //   } else {
    //     newData[item.index] = item
    //   }
    // }
    try { provider.current.updateItems(data) } catch {}
  };
  FileTreeState.refresh = debounce(refresh, 2000)

  useEffect(() => {
    // refresh();
    //const i = setInterval(refresh, 200);
    //return () => clearInterval(i);
  }, []);

  return (
    <div style={{overflow: 'scroll'}}>
      <div className={isDark ? 'rct-dark' : 'rct-default'}>
        <UncontrolledTreeEnvironment
          canRename
          canSearch
          canDragAndDrop
          canDropOnFolder
          canSearchByStartingTyping
          dataProvider={provider.current}
          getItemTitle={item => item.data}
          onPrimaryAction={item => props.onTriggerItem(item.index.toString(), item.data)}
          onRenameItem={(item, name) => props.onRenameItem(item.index.toString(), name)}
          onMissingItems={(itemIds) => console.log('missing', itemIds)}
          onDrop={(item, target) => console.log('drop', item, target)}
          onExpandItem={(item) => { console.log('expand', item); FileTreeState.refresh() }}
          viewState={{}}>
          <Tree treeId="filetree" treeLabel="Explorer" rootItem="root"/>
        </UncontrolledTreeEnvironment>
      </div>
    </div>
  );
}

class TreeProvider<T = any> implements RCT.TreeDataProvider {
  private data: RCT.ExplicitDataSource;
  private onDidChangeTreeDataEmitter = new EventEmitter<RCT.TreeItemIndex[]>();
  private setItemName?: (item: RCT.TreeItem<T>, newName: string) => RCT.TreeItem<T>;

  constructor(
    items: Record<RCT.TreeItemIndex, RCT.TreeItem<T>>,
    setItemName?: (item: RCT.TreeItem<T>, newName: string) => RCT.TreeItem<T>,
  ) {
    this.data = {items};
    this.setItemName = setItemName;
  }

  public async updateItems(items: Record<RCT.TreeItemIndex, RCT.TreeItem<T>>) {
    // const changed: Partial<Record<RCT.TreeItemIndex, RCT.TreeItem<T>>> = diff(this.data.items, items);
    // console.log(changed);

    this.data = {items};
    this.onChangeItemChildren('root', Object.keys(this.data.items).filter(i => i !== 'root'));

    // update sub children
    /*for (const key of Object.keys(changed)) {
      const children = this.data.items[key]?.children;
      if (key && children) {
        this.onChangeItemChildren(key, children);
      }
    }*/
  }

  public async getTreeItem(itemId: RCT.TreeItemIndex): Promise<RCT.TreeItem> {
    return this.data.items[itemId];
  }

  public async onChangeItemChildren(itemId: RCT.TreeItemIndex, newChildren: RCT.TreeItemIndex[]): Promise<void> {
    this.data.items[itemId].children = newChildren;
    this.onDidChangeTreeDataEmitter.emit([itemId]);
  }

  public onDidChangeTreeData(listener: (changedItemIds: RCT.TreeItemIndex[]) => void): RCT.Disposable {
    const handlerId = this.onDidChangeTreeDataEmitter.on(payload => listener(payload));
    return {dispose: () => this.onDidChangeTreeDataEmitter.off(handlerId)};
  }

  public async onRenameItem(item: RCT.TreeItem<any>, name: string): Promise<void> {
    if (this.setItemName) {
      this.data.items[item.index] = this.setItemName(item, name);
      this.onDidChangeTreeDataEmitter.emit([item.index]);
    }
  }
}
