import {AutoTypings, LocalStorageCache} from 'monaco-editor-auto-typings/custom-editor';

import type * as monaco from 'monaco-editor';
import type {FileSystemAPI} from '@webcontainer/api';
import type {SyncInstance} from '../hooks/useSync';

export type Editor = monaco.editor.IStandaloneCodeEditor;
export type Monaco = typeof monaco;

const sourceCache = new LocalStorageCache();

export async function initEditor(editor: Editor, monaco: Monaco, fs: FileSystemAPI, path: string, sync: SyncInstance) {
  // Augment
  AutoTypings.create(editor, {monaco, sourceCache, fileRootPath: './'});
  // Load file
  let contents = '';
  try { contents = await fs.readFile(path, 'utf-8')} catch (e) {}
  editor.setValue(contents);
  // Editor syncing
  if (sync) {
    if (sync.key.current.startsWith('figma/')) {
      editor.updateOptions({readOnly: true});
    } else {
      editor.updateOptions({readOnly: false});
      sync.syncEditor(editor); // TODO: make this work w/ Figma, currently it clears file
    }
  }
}

export function getLanguageFromFileName(name: string) {
  // TODO: improve
  switch (name.split('.').pop()) {
    case 'md': return 'markdown';
    case 'js': return 'javascript';
    case 'ts': return 'typescript';
    case 'tsx': return 'typescript';
    case 'json': return 'json';
    case 'html': return 'html';
    case 'css': return 'css';
    default: return 'plaintext';
  }
}

export function getIconFromFileName(_name: string) {
  // TODO
  return 'file-code';
}
