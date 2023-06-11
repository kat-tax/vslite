/// <reference types="vite/client" />

declare module globalThis {
  var process: Record<string, any>;
}