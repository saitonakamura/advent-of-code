import { read } from "./helper";

const parseStr = (s: string) => {};

type T = ReturnType<typeof parseStr>;

const f1 = (arr: T[]) => {};
const f2 = (arr: T[]) => {};

(async () => {
  console.log(f1((await read(3, 1)).map(parseStr)));
  console.log(f1((await read(3, 2)).map(parseStr)));
  console.log("\n");
  console.log(f2((await read(3, 1)).map(parseStr)));
  console.log(f2((await read(3, 2)).map(parseStr)));
})();
