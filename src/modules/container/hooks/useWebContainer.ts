import {useState, useEffect, useCallback} from 'react';
import {WebContainer} from '@webcontainer/api';
import {files} from '../lib/files';

export function useWebContainer() {
  const [container, setContainer] = useState<WebContainer | null>(null);

  // Boot new container once
  useEffect(() => {WebContainer.boot().then(setContainer)}, []);

  // Mount container when ready
  useEffect(() => {container?.mount(files)}, [container]);

  // Commands
  const setup = useCallback(async () => {
    if (!container) {
      throw new Error('Container not ready');
    }

    const process = await container.spawn('npx', ['ult']);
    process.output.pipeTo(new WritableStream({
      write(data) {
        console.log(data);
      }
    }));
  }, [container]);

  return {container, setup};
}
