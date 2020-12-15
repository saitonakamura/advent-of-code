import { read } from "./helper";

const parseStr = (s: string) => s.split(",").map((s) => parseInt(s, 10));

type T = ReturnType<typeof parseStr>;

const f1 = (arr: T[], step: number) => {
  return arr.map((input) => {
    const m = new Map<number, number>(
      input.map((item, index) => [item, index])
    );

    let i = input.length - 1;
    let spoken = input[input.length - 1];

    while (i < step - 1) {
      const cache = m.get(spoken);
      m.set(spoken, i);
      spoken = cache === undefined ? 0 : i - cache;
      i++;
    }

    return [input, spoken];
  });
};

(async () => {
  // console.log(f1((await read(15, 1)).map(parseStr), 2020));
  // console.log(f1((await read(15, 1)).map(parseStr), 30000000));
  // console.log("");
  // console.log(f1((await read(15, 2)).map(parseStr), 2020));
  console.log(f1((await read(15, 2)).map(parseStr), 30000000));
})();
