import {useRef, useCallback, useEffect} from 'react';

import type {Editor} from '../utils/monaco';
import type {ShellInstance} from '../hooks/useShell';
import type {FileSystemAPI} from '@webcontainer/api';
import type * as Sync from '../utils/sync';

export type SyncInstance = {
  key: React.MutableRefObject<string>,
  session: React.MutableRefObject<Sync.Session | null>,
  syncEditor: (editor: Editor) => void,
};

export function useSync(shell: ShellInstance): SyncInstance {
  const key = useRef<string>('');
  const init = useRef(false);
  const session = useRef<Sync.Session | null>(null);
  const syncMonaco = useRef<typeof Sync.monaco | null>(null);

  const syncEditor = useCallback((editor: Editor) => {
    if (!session.current || !syncMonaco.current) return;
    console.log('Editor sync enabled.');
    syncMonaco.current(editor, session.current.document, session.current.provider);
  }, []);

  const syncFigma = useCallback((fs: FileSystemAPI | undefined) => {
    if (!session.current || !fs) return;
    console.log('Figma sync enabled.');
    const $files = session.current.document.getMap<string>('files');
    $files.observe(e => {
      e.keys.forEach((_change, key) => {
        const $file = $files.get(key);
        if (!$file) return;
        fs.writeFile(key, $file, 'utf-8');
      });
    });
  }, []);

  useEffect(() => {
    if (init.current) return;
    if (shell && shell.container?.fs) {
      init.current = true;
      const _key = location.href.match(/(?:\/\+\/|#\/)(.+)/)?.pop();
      if (!_key) return;
      key.current = _key.replace('figma/', '');
      console.log('Setting up sync.', 'Key:', key.current);
      // Import sync module & connect
      import('../utils/sync').then(sync => {
        session.current = sync.connect(key.current);
        syncMonaco.current = sync.monaco;
        console.log('Connected to sync.');
        if (_key?.startsWith('figma/')) {
          syncFigma(shell.container?.fs);
        }
      });
    }
  }, [shell]);

  return {key, session, syncEditor};
}
