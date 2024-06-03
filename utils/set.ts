export function set<T extends object, V>(
  obj: T,
  keys: string | ArrayLike<string | number>,
  value: V
): void {
  if (typeof keys === "string") {
    keys = keys.split(".");
  }

  let i = 0,
    l = keys.length,
    t = obj as any,
    x,
    k;

  if (Array.isArray(keys)) {
    while (i < l) {
      k = keys[i++];
      if (k === "__proto__" || k === "constructor" || k === "prototype") break;
      t = t[k] =
        i === l
          ? value
          : typeof (x = t[k]) === typeof keys
          ? x
          : keys[i] * 0 !== 0 || !!~("" + keys[i]).indexOf(".")
          ? {}
          : [];
    }
  }
}
