import {useState, useEffect} from 'react';

export function useLaunchQueue() {
  const [action, setAction] = useState<string | null>(null);
  const [files, setFiles] = useState<FileSystemFileHandle[]>([]);

  useEffect(() => {
    // @ts-ignore
    ('launchQueue' in window) && launchQueue.setConsumer((launchParams) => {
      if (launchParams.targetURL)
        setAction(new URL(launchParams.targetURL).searchParams.get('action'));
      if (launchParams?.files?.length)
        setFiles(launchParams.files);
    });
  }, []);

  return {action, files};
}
