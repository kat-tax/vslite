import {EventEmitter} from 'react-complex-tree/src/EventEmitter';

import type * as RCT from 'react-complex-tree';

export class TreeDataProvider<T = any> implements RCT.TreeDataProvider {
  private data: RCT.ExplicitDataSource;
  private onDidChangeTreeDataEmitter = new EventEmitter<RCT.TreeItemIndex[]>();
  private setItemName?: (item: RCT.TreeItem<T>, newName: string) => RCT.TreeItem<T>;

  constructor(items: Record<RCT.TreeItemIndex, RCT.TreeItem<T>>, setItemName?: (item: RCT.TreeItem<T>, newName: string) => RCT.TreeItem<T>) {
    this.data = {items};
    this.setItemName = setItemName;
  }

  public async updateItems(items: Record<RCT.TreeItemIndex, RCT.TreeItem<T>>) {
    this.data.items = items;
    Object.keys(this.data.items).forEach(itemId => 
      this.onDidChangeTreeDataEmitter.emit([itemId])
    );
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
      // this.onDidChangeTreeDataEmitter.emit(item.index);
    }
  }
}
