import {useRef, useCallback, useEffect} from 'react';

import type {ShellInstance} from '../hooks/useShell';
import type {Editor} from '../utils/monaco';
import type * as Sync from '../utils/sync';

export type SyncInstance = {
  key: React.MutableRefObject<string>,
  session: React.MutableRefObject<Sync.Session | null>,
  syncEditor: (editor: Editor) => void,
};

export function useSync(_shell: ShellInstance): SyncInstance {
  const key = useRef<string>('');
  const session = useRef<Sync.Session | null>(null);
  const syncMonaco = useRef<typeof Sync.monaco | null>(null);
  
  const init = useCallback(() => {
    const _key = location.href.match(/(?:\/\+\/|#\/)(.+)/)?.pop();
    const _hasFigma = _key?.startsWith('figma/');
    console.log('Setting up sync.', _key, 'Figma:', _hasFigma);
    if (!_key) return;
    // Figma integration sync
    if (_key.startsWith('figma/')) {
      key.current = _key?.split('/').pop() || _key;
    // Editor collab sync
    } else {
      key.current = _key;
    }
    // Import sync module & connect
    import('../utils/sync').then(sync => {
      session.current = sync.connect(key.current);
      syncMonaco.current = sync.monaco;
      console.log('Connected to sync.');
      if (_hasFigma) syncFigma();
    });
  }, []);

  const syncEditor = useCallback((editor: Editor) => {
    console.log(editor, session.current, syncMonaco.current);
    if (!session.current) return;
    if (!syncMonaco.current) return;
    console.log('Editor sync enabled.');
    syncMonaco.current(editor, session.current.document, session.current.provider);
  }, []);

  const syncFigma = useCallback(() => {
    if (!session.current) return;
    console.log('Figma sync enabled.');
    const files = session.current.document.getMap<string>('files');
    files.observe(e => console.log(e.changes));
  }, []);

  useEffect(init, []);

  return {key, session, syncEditor};
}
