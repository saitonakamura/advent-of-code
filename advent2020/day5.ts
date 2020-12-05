import { map, reduce } from "fp-ts/lib/Array";
import { flow } from "fp-ts/lib/function";
import { read } from "./helper";

const parseStr = (s: string) => s;

type T = ReturnType<typeof parseStr>;

const binary = (arr: string, length: number) =>
  reduce({ value: length / 2, step: length / 4 }, ({ value, step }, curr) => {
    return curr === "F" || curr === "L"
      ? { value: value - step, step: step / 2 }
      : { value: value + step, step: step / 2 };
  })([...arr]).value - 0.5;

const max = reduce(-1, (acc, curr: number) => (acc < curr ? curr : acc));

const min = reduce(Number.MAX_SAFE_INTEGER, (acc, curr: number) =>
  acc > curr ? curr : acc
);

const sum = reduce(0, (acc, curr: number) => acc + curr);

const getIds = map(
  (el: string) =>
    binary(el.substring(0, 7), 128) * 8 + binary(el.substring(7, 10), 8)
);

const f1 = flow(getIds, max);

const f2 = (arr: T[]) => {
  const ids = getIds(arr);
  const ma = max(ids);
  const mi = min(ids);
  const realSum = sum(ids);

  const fullSum = ((ma + mi) * (ma - mi + 1)) / 2;

  return fullSum - realSum;
};

(async () => {
  console.log(f1(await read(5, 1)));
  console.log("\n");
  console.log(f1(await read(5, 2)));
  console.log(f2(await read(5, 2)));
})();
