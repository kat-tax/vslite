// https://gist.github.com/ca0v/73a31f57b397606c9813472f7493a940

export function debounce<T extends Function>(cb: T, wait = 150) {
  let h: NodeJS.Timeout;
  let callable = (...args: any) => {
    clearTimeout(h);
    h = setTimeout(() => cb(...args), wait);
  };
  return <T>(<any>callable);
}
