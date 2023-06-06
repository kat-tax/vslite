import Monaco from '@monaco-editor/react';
import {initEditor, getLanguageFromFileName} from '../utils/monaco';

import type {FileSystemAPI} from '@webcontainer/api';

interface EditorProps {
  fs: FileSystemAPI,
  path: string,
  contents?: string,
}

export function Editor(props: EditorProps) {
  return (
    <Monaco
      theme="vs-dark"
      path={props.path}
      options={{readOnly: true}}
      language={getLanguageFromFileName(props.path)}
      onMount={(editor, monaco) => initEditor(editor, monaco, props.fs, props.path)}
      onChange={(value) => props.fs.writeFile(props.path, value || '', 'utf-8')}
    />
  );
}
