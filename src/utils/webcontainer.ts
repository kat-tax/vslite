import type {FileSystemAPI, FileSystemTree} from '@webcontainer/api';
import type {TreeItem, TreeItemIndex} from 'react-complex-tree';

export async function getDirAsTree(
  fs: FileSystemAPI,
  path: string,
  parent: string,
  root: TreeItem<string>,
  db: Record<TreeItemIndex, TreeItem<string>>,
) {
  const dir = await fs.readdir(path, {withFileTypes: true});
  if (parent === 'root') db.root = root;
  dir.forEach(item => {
    const isDir = item.isDirectory();
    const itemPath = `${path}/${item.name}`;
    db[itemPath] = {
      index: itemPath,
      data: item.name,
      isFolder: isDir,
      canMove: true,
      canRename: true,
      children: [],
    };
    if (parent) db?.[parent]?.children?.push(itemPath);
    if (isDir) return getDirAsTree(fs, itemPath, itemPath, root, db);
  });
  return db;
}

export const startFiles: FileSystemTree = {
  'index.js': {
    file: {
      contents:
`import express from 'express';
const app = express();
const port = 3111;

app.get('/', (req, res) => {
  res.send('Welcome to a WebContainers app! 🥳');
});

app.listen(port, () => {
  console.log(\`App is live at http://localhost:\${port}\`);
});
`,
    },
  },
  'package.json': {
    file: {
      contents:
`{
  "name": "example-app",
  "type": "module",
  "dependencies": {
    "express": "latest",
    "nodemon": "latest"
  },
  "scripts": {
    "start": "nodemon --watch './' index.js"
  }
}
`,
    },
  },
};
