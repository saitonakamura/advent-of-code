import { read } from "./helper";

const r = /(\d+)\s+(.+)/;

const parseStr = (s: string) => {
  const [color, containsStr] = s.split(" bags contain ");

  const contains =
    containsStr !== "no other bags"
      ? containsStr
          .split(", ")
          .map((c) =>
            c.replace(".", "").replace(" bags", "").replace(" bag", "")
          )
          .map((c) => {
            const m = r.exec(c);
            return m ? { count: parseInt(m[1], 10), color: m[2] } : null;
          })
          .filter((x): x is NonNullable<typeof x> => !!x)
      : [];

  return { color, contains };
};

type T = ReturnType<typeof parseStr>;

const f1 = (arr: T[], neededColor: string) => {
  const r = (
    arr: T[],
    neededColor: string,
    acc: Set<string> = new Set<string>()
  ) =>
    arr.reduce((acc, curr: T) => {
      const item = curr.contains.find((x) => x.color === neededColor);

      if (item) {
        acc.add(curr.color);
        r(arr, curr.color, acc);
      }

      return acc;
    }, acc);

  return r(arr, neededColor).size;
};

const f2 = (arr: T[], startColor: string) => {
  const r = (arr: T[], neededColor: string): number =>
    arr.reduce(
      (acc, curr) =>
        curr.color === neededColor
          ? acc +
            curr.contains.reduce(
              (acc2, curr2) =>
                acc2 + curr2.count + curr2.count * r(arr, curr2.color),
              0
            )
          : acc,
      0
    );

  return r(arr, startColor);
};

(async () => {
  console.log(f1((await read(7, 1)).map(parseStr), "shiny gold"));
  console.log(f1((await read(7, 2)).map(parseStr), "shiny gold"));
  console.log("\n");
  console.log(f2((await read(7, 1)).map(parseStr), "shiny gold"));
  console.log(f2((await read(7, 3)).map(parseStr), "shiny gold"));
  console.log(f2((await read(7, 2)).map(parseStr), "shiny gold"));
})();
