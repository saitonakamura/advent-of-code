import { read } from "./helper";

const r = /^([a-z]{3})\s+([+-]\d+)$/;

const parseStr = (s: string) => {
  const m = r.exec(s);
  return { op: m![1], v: parseInt(m![2]) };
};

type T = ReturnType<typeof parseStr>;

const f1 = (arr: T[]) => {
  let visited = new Set<number>();
  let p = 0;
  let v = 0;

  while (!visited.has(p)) {
    const op = arr[p].op;
    switch (op) {
      case "acc":
        visited.add(p);
        v += arr[p].v;
        p++;
        break;
      case "jmp":
        visited.add(p);
        p += arr[p].v;
        break;
      case "nop":
      default:
        visited.add(p);
        p++;
        break;
    }
  }

  return v;
};

const f2 = (arr: T[]) => {
  const f = (indexToChange: number) => {
    let visited = new Set<number>();
    let p = 0;
    let v = 0;

    while (!visited.has(p) && p < arr.length) {
      let op = arr[p].op;

      if (p === indexToChange) {
        switch (op) {
          case "jmp":
            op = "nop";
            break;
          case "nop":
            op = "jmp";
            break;
          case "acc":
          default:
            return { v, r: false };
        }
      }

      switch (op) {
        case "acc":
          visited.add(p);
          v += arr[p].v;
          p++;
          break;
        case "jmp":
          visited.add(p);
          p += arr[p].v;
          break;
        case "nop":
        default:
          visited.add(p);
          p++;
          break;
      }
    }

    return { v, r: p >= arr.length };
  };

  for (let i = 0; i < arr.length; i++) {
    const { r, v } = f(i);

    if (r) {
      return v;
    }
  }
};

(async () => {
  console.log(f1((await read(8, 1)).map(parseStr)));
  console.log(f1((await read(8, 2)).map(parseStr)));
  console.log("");
  console.log(f2((await read(8, 1)).map(parseStr)));
  console.log(f2((await read(8, 2)).map(parseStr)));
})();
