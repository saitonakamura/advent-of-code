import { read } from "./helper";

const parseStr = (s: string) => {
  const set = new Set<number>();

  const a = [...s];
  for (let i = 0; i < a.length; i++) {
    if (a[i] === "#") {
      set.add(i);
    }
  }

  return { set, l: a.length };
};

type T = ReturnType<typeof parseStr>;

const f1 = (arr: T[], slope: [number, number]) => {
  let treesEncounters = 0;
  let line = 0;
  let column = 0;
  const [deltaColumn, deltaLine] = slope;

  if (arr[line]?.set.has(column)) {
    treesEncounters++;
  }

  while (line < arr.length - 1) {
    column += deltaColumn;
    column = column % arr[line]?.l;
    line += deltaLine;

    if (arr[line]?.set.has(column)) {
      treesEncounters++;
    }
  }

  return treesEncounters;
};

const f2 = (arr: T[], slopes: Array<[number, number]>) => {
  return slopes
    .map((slope) => f1(arr, slope))
    .reduce((acc, curr) => acc * curr, 1);
};

(async () => {
  console.log(f1((await read(3, 1)).map(parseStr), [3, 1]));
  console.log(
    f2((await read(3, 1)).map(parseStr), [
      [1, 1],
      [3, 1],
      [5, 1],
      [7, 1],
      [1, 2],
    ])
  );

  console.log(f1((await read(3, 2)).map(parseStr), [3, 1]));
  console.log(
    f2((await read(3, 2)).map(parseStr), [
      [1, 1],
      [3, 1],
      [5, 1],
      [7, 1],
      [1, 2],
    ])
  );
})();
