import type {DockviewApi, GridviewApi, PaneviewApi} from 'dockview';
import type {FileSystemAPI} from '@webcontainer/api';
import type {ShellInstance} from '../hooks/useShell';
import type {SyncInstance} from '../hooks/useSync';

export function openTerminal(shell: ShellInstance, section: GridviewApi, content: DockviewApi) {
  section.addPanel({
    id: 'terminal',
    component: 'terminal',
    params: {content, shell},
    minimumHeight: 100,
    size: 200,
    position: {
      direction: 'below',
      referencePanel: 'content',
    },
  });
}

export function openFileTree(fs: FileSystemAPI, section: PaneviewApi, content: DockviewApi, sync: SyncInstance) {
  const filetree = section.addPanel({
    id: 'filetree',
    title: 'Explorer',
    component: 'filetree',
    params: {content, fs, sync},
    isExpanded: true,
  });
  filetree.headerVisible = false;
}

export function openUntitledFile(fs: FileSystemAPI, api: DockviewApi, sync: SyncInstance) {
  const path = './Untitled';
  api.addPanel({
    id: path,
    title: 'Untitled',
    component: 'editor',
    params: {fs, path, sync},
  });
}

export async function openStartFile(file: FileSystemFileHandle, fs: FileSystemAPI, api: DockviewApi, sync: SyncInstance) {
  const path = `./${file.name}`;
  const contents = await (await file.getFile()).text();
  await fs.writeFile(path, contents, 'utf-8');
  api.addPanel({
    id: path,
    title: file.name,
    component: 'editor',
    params: {fs, path, sync},
  });
}

// TODO
export async function openFolder(_fs: FileSystemAPI, _api: DockviewApi) {
  // @ts-ignore
  const dir = await globalThis.showDirectoryPicker();
  for await (const entry of dir.values()) {
    console.log(entry);
  }
}

export function createPreviewOpener(api: DockviewApi) {
  return (serverUrl: string, serverPort: number) => {
    const panel = api.getPanel(serverPort.toString());
    const title = `Port: ${serverPort}`;
    const url = `${serverUrl}?${Date.now()}`;
    // Update the existing preview panel
    if (panel) {
      panel.api.updateParameters({url});
      panel.api.setTitle(title);
    // Create the preview panel
    } else {
      api.addPanel({
        id: serverPort.toString(),
        title: `Port: ${serverPort}`,
        component: 'preview',
        params: {url},
        position: {
          direction: 'right',
        },
      });
    }
  };
}

export function createFileOpener(api: DockviewApi, fs: FileSystemAPI, sync: SyncInstance) {
  return async (path: string, name: string) => {
    const contents = await fs.readFile(path, 'utf-8');
    console.log('createFileOpener', contents)
    const panel = api.getPanel(path);
    if (panel) {
      panel.api.setActive();
    } else {
      api.addPanel({
        id: path,
        title: name,
        component: 'editor',
        params: {fs, path, contents, sync},
      });
    }
  };
}

export function createFileRenameHandler(api: DockviewApi, fs: FileSystemAPI) {
  return async (path: string, name: string) => {
    // Get contents of file
    const contents = await fs.readFile(path);
    // Remove file
    await fs.rm(path);
    // Write new file
    const dirPath = path.split('/').slice(0, -1).join('/');
    const newPath = `${dirPath}/${name}`;
    await fs.writeFile(newPath, contents || new Uint8Array());
    // Update editor panel
    const panel = api.getPanel(path);
    if (panel) {
      panel.api.updateParameters({path: newPath});
      panel.api.setTitle(name);
    }
  };
}
