import {AutoTypings, LocalStorageCache} from 'monaco-editor-auto-typings/custom-editor';

import type * as monaco from 'monaco-editor';
import type {FileSystemAPI} from '@webcontainer/api';

type Editor = monaco.editor.IStandaloneCodeEditor;
type Monaco = typeof monaco;

const sourceCache = new LocalStorageCache();

export async function initEditor(editor: Editor, monaco: Monaco, fs: FileSystemAPI, path: string) {
  // Augment
  AutoTypings.create(editor, {monaco, sourceCache, fileRootPath: './'});
  // Load file
  let contents = '';
  try { contents = await fs.readFile(path, 'utf-8')} catch (e) {}
  editor.setValue(contents);
  editor.updateOptions({readOnly: false});
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
