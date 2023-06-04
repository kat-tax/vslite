import {useMonaco} from '@monaco-editor/react';

// import AutoImport, {regexTokeniser} from '@blitz/monaco-auto-import'
// import {AutoTypings, LocalStorageCache} from 'monaco-editor-auto-typings';

export function useEditor() {
  const monaco = useMonaco();
  /*
    AutoTypings.create(editor, {sourceCache: new LocalStorageCache()});
    const completor = new AutoImport({monaco, editor})

    completor.imports.saveFiles([{
      path: './node_modules/left-pad/index.js',
      aliases: ['left-pad'],
      imports: regexTokeniser(`
        export const PAD = ''
        export function leftPad() {}
        export function rightPad() {}
      `)
    }]);
  */
  return monaco;
}
