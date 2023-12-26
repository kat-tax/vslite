import type {DockviewApi, GridviewApi, PaneviewApi} from 'dockview';
import type {FileSystemAPI} from '@webcontainer/api';
import type {ShellInstance} from '../hooks/useShell';
import type {CollabInstance} from '../hooks/useCollab';

export function openDock(grid: GridviewApi, api: React.MutableRefObject<DockviewApi | undefined>) {
  grid.addPanel({
    id: 'dock',
    component: 'dock',
    params: {api},
  });
}

export function openPanes(grid: GridviewApi, api: React.MutableRefObject<PaneviewApi | undefined>) {
  grid.addPanel({
    id: 'panes',
    component: 'panes',
    params: {api},
    maximumWidth: 800,
    size: 200,
    position: {
      direction: 'left',
      referencePanel: 'dock',
    },
  });
}

export function openTerminal(shell: ShellInstance, grid: GridviewApi, dock: DockviewApi) {
  grid.addPanel({
    id: 'terminal',
    component: 'terminal',
    params: {dock, shell},
    minimumHeight: 100,
    size: 200,
    position: {
      direction: 'below',
      referencePanel: 'dock',
    },
  });
}

export function openFileTree(fs: FileSystemAPI, grid: PaneviewApi, dock: DockviewApi, sync: CollabInstance) {
  const filetree = grid.addPanel({
    id: 'filetree',
    title: 'Explorer',
    component: 'filetree',
    params: {dock, fs, sync},
    isExpanded: true,
  });
  filetree.headerVisible = false;
}

export function openUntitledFile(fs: FileSystemAPI, api: DockviewApi, sync: CollabInstance) {
  const path = './Untitled';
  api.addPanel({
    id: path,
    title: 'Untitled',
    component: 'editor',
    params: {fs, path, sync},
  });
}

export async function openStartFile(file: FileSystemFileHandle, fs: FileSystemAPI, api: DockviewApi, sync: CollabInstance) {
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

export function createPreviewOpener(api: DockviewApi) {
  return (serverUrl: string, serverPort: number) => {
    // Storybook can't be loaded immediately
    if (serverPort !== 6006) return;
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

export function createFileOpener(api: DockviewApi, fs: FileSystemAPI, sync: CollabInstance) {
  return async (path: string, name: string) => {
    const contents = await fs.readFile(path, 'utf-8');
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
