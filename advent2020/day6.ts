import { map, reduce } from "fp-ts/lib/Array";
import { flow } from "fp-ts/lib/function";
import { read, sum, tapHack } from "./helper";

const parseAll = (s: string) => {
  return s
    .replace("\r\n", "\n")
    .split("\n\n")
    .filter(Boolean)
    .map((s) => s.split("\n").filter(Boolean));
};

type T = ReturnType<typeof parseAll>;

const anyTrue = reduce(
  (null as unknown) as Set<string>,
  (set, answers: string) => {
    // Dirty hack
    if (set === null) {
      set = new Set<string>();
    }

    // console.log({ set, answers });
    for (const trueAnswer of answers) {
      if (!set.has(trueAnswer)) {
        set.add(trueAnswer);
      }
    }

    return set;
  }
);

const everyTrue = (allAnwsers: string[]) => {
  const allAnwsersLength = allAnwsers.length;

  return flow(
    reduce((null as unknown) as Map<string, number>, (map, answers: string) => {
      // Dirty hack
      if (map === null) {
        map = new Map<string, number>();
      }

      // console.log({ set, answers });
      for (const trueAnswer of answers) {
        const v = map.get(trueAnswer);
        if (v === undefined) {
          map.set(trueAnswer, 1);
        } else {
          map.set(trueAnswer, v + 1);
        }
      }

      return map;
    }),
    (m) => {
      for (const [k, v] of m) {
        if (v < allAnwsersLength) {
          m.delete(k);
        }
      }

      return m;
    }
  )(allAnwsers);
};

const f1 = flow(
  // tapHack<string[][]>(console.log),
  map(anyTrue),
  // tapHack<Set<string>[]>(console.log),
  map((s) => s.size),
  sum
);

const f2 = flow(
  map(everyTrue),
  map((s) => s.size),
  sum
);

(async () => {
  console.log(f1(await read(6, 1, parseAll)));
  console.log(f1(await read(6, 2, parseAll)));
  console.log("\n");
  console.log(f2(await read(6, 1, parseAll)));
  console.log(f2(await read(6, 2, parseAll)));
})();
