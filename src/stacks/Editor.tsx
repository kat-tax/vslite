import Monaco from '@monaco-editor/react';
import type {FileSystemAPI} from '@webcontainer/api';

interface EditorProps {
  path: string,
  fs: FileSystemAPI,
}

export function Editor(props: EditorProps) {
  return (
    <Monaco
      theme="vs-dark"
      language="typescript"
      path={props.path}
      options={{readOnly: true}}
      onMount={async (editor) => {
        let contents = '';
        try {contents = await props.fs.readFile(props.path, 'utf-8')} catch (e) {}
        editor.setValue(contents);
        editor.updateOptions({readOnly: false});
      }}
      onChange={async (value?: string) => {
        props.fs.writeFile(props.path, value || '', 'utf-8');
      }}
    />
  );
}
