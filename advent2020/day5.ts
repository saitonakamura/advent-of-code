import { setPriority } from "os";
import { read } from "./helper";

const parseStr = (s: string) => s;

type T = ReturnType<typeof parseStr>;

const binary = (arr: string, length: number) => {
  // console.log(arr);
  return (
    [...arr].reduce(
      ({ value, step }, curr) => {
        // console.log({ curr, value, step });
        return curr === "F" || curr === "L"
          ? { value: value - step, step: step / 2 }
          : { value: value + step, step: step / 2 };
      },
      { value: length / 2, step: length / 4 }
    ).value - 0.5
  );
};

const f1 = (arr: T[]) => {
  return arr
    .map((el) => [
      binary(el.substring(0, 7), 128),
      binary(el.substring(7, 10), 8),
    ])
    .map(([seat, row]) => seat * 8 + row)
    .reduce((acc, curr) => (acc < curr ? curr : acc), -1);
};

const f2 = (arr: T[]) => {
  const ids = arr
    .map((el) => [
      binary(el.substring(0, 7), 128),
      binary(el.substring(7, 10), 8),
    ])
    .map(([seat, row]) => seat * 8 + row)
    .sort((a, b) => a - b);

  let i = 0;
  let s = ids[i];

  while (s === ids[i]) {
    s++;
    i++;
  }

  return s;
};

(async () => {
  console.log(f1((await read(5, 1)).map(parseStr)));
  // console.log(f2((await read(5, 1)).map(parseStr)));

  console.log(f1((await read(5, 2)).map(parseStr)));
  console.log(f2((await read(5, 2)).map(parseStr)));
})();
