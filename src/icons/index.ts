// @ts-nocheck

import ext from './icon-manifest.json';

export function importFont(name: string) {
  switch (name) {
    case './devopicons.woff2':
      return new URL(`./devopicons.woff2`, import.meta.url).href;
    case './file-icons.woff2':
      return new URL(`./file-icons.woff2`, import.meta.url).href;
    case './fontawesome.woff2':
      return new URL(`./fontawesome.woff2`, import.meta.url).href;
    case './mfixx.woff2':
      return new URL(`./mfixx.woff2`, import.meta.url).href;
    case './octicons.woff2':
      return new URL(`./octicons.woff2`, import.meta.url).href;
  }
}

export function injectStyles() {
  const rules: string = ext.fonts.map((font) => {
    const fontFile = new URL(`./file-icons.woff2`, import.meta.url).href;
    return `
      @font-face {
        src: url(${importFont(font.src[0].path)});
        font-family: ${font.id};
        font-weight: ${font.weight};
        font-style: ${font.style};
        font-size: ${font.size};
      }
    `;
  }).join('\n');

  const classes: string = Object.keys(ext.iconDefinitions).map((key: string) => {
    const icon = ext.iconDefinitions[key];
    return `
      .icon.icon${key}::before {
        padding-right: 6px;
        font-family: ${icon.fontId};
        font-weight: ${icon.fontWeight};
        font-size: ${icon.fontSize};
        content: "${icon.fontCharacter}";
        color: ${icon.fontColor};
      }
    `;
  }).join('\n');

  const style = document.createElement('style');
  style.innerHTML = rules + classes;
  document.head.appendChild(style);
}

export function getIconClass(
  path: string,
  language: string,
  isFolder: boolean,
  isRoot: boolean,
  theme: 'light' | 'dark',
) {
  // Path info
  const fileName = path.split('/').pop();
  const fileExtension = path.split('.').pop();

  // Default icons
  const defaultFileIcon = ext.file;
  const defaultFolderIcon = ext.folder;
  const defaultRootFolderIcon = ext.rootFolder;

  // Folder icons
  if (isFolder) {
    if (isRoot)
      return defaultRootFolderIcon;
    if (theme === 'light' && ext.light.folderNames[path])
      return ext.light.folderNames[path];
    if (ext.folderNames[path])
      return ext.folderNames[path];
    return defaultFolderIcon;
  }
  
  // File icons (based on name)
  if (fileName && ext.fileNames[fileName]) {
    if (theme === 'light' && ext.light.fileNames[fileName])
      return ext.light.fileNames[fileName];
    if (ext.fileNames[fileName])
      return ext.fileNames[fileName];
  }

  // File icons (based on language)
  if (ext.languageIds[language]) {
    if (theme === 'light' && ext.light.languageIds[language])
      return ext.light.languageIds[language];
    if (ext.languageIds[language])
      return ext.languageIds[language];
  }

  // File icons (based on extension)
  if (fileExtension && ext.fileExtensions[fileExtension]) {
    if (theme === 'light' && ext.light.fileExtensions[fileExtension])
      return ext.light.fileExtensions[fileExtension];
    if (ext.fileExtensions[fileExtension])
      return ext.fileExtensions[fileExtension];
  }

  return defaultFileIcon;
}

export function getIcon(
  path: string,
  language: string,
  isFolder: boolean,
  isRoot: boolean,
  theme: 'light' | 'dark',
) {
  const icon = getIconClass(path, language, isFolder, isRoot, theme);
  return `icon icon${icon}`;
}
