import {AutoTypings, LocalStorageCache} from 'monaco-editor-auto-typings/custom-editor';

import type * as monaco from 'monaco-editor';
import type {FileSystemAPI} from '@webcontainer/api';
import type {CollabInstance} from '../hooks/useCollab';

export type Editor = monaco.editor.IStandaloneCodeEditor;
export type Monaco = typeof monaco;

const sourceCache = new LocalStorageCache();

export async function initEditor(editor: Editor, monaco: Monaco, fs: FileSystemAPI, path: string, sync: CollabInstance) {
  // Augment
  AutoTypings.create(editor, {monaco, sourceCache, fileRootPath: './'});
  // Load file
  let contents = '';
  try { contents = await fs.readFile(path, 'utf-8')} catch (e) {}
  editor.setValue(contents);
  // Editor syncing
  if (sync) {
    editor.updateOptions({readOnly: false});
    sync.syncEditor(editor);
  }
}

export function getIconFromFileName(_name: string) {
  // TODO
  return 'file-code';
}
