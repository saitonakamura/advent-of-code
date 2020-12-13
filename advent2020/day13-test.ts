import { read } from "./helper";

const parseAll = (s: string) => {
  const [fir, sec] = s.split("\n").map((s) => s.trim());
  return {
    start: parseInt(fir, 10),
    buses: sec
      .split(",")
      .filter((s) => !!s)
      .map((s) => (s === "x" ? -1 : parseInt(s, 10))),
  };
};

type T = ReturnType<typeof parseAll>;

const f1 = (data: T) => {
  return JSON.stringify(
    data.buses.map((b, i) => [i - 23, b]).filter(([, b]) => b !== -1),
    undefined,
    2
  );
};

(async () => {
  console.log(f1(await read(13, 2, parseAll)));
})();
