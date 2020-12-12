import { read } from "./helper";

const r = /^(N|S|E|W|L|R|F)(\d+)$/;

const parseStr = (s: string) => {
  const m = r.exec(s);
  return [
    m![1] as "N" | "S" | "E" | "W" | "L" | "R" | "F",
    parseInt(m![2], 10),
  ] as const;
};

type T = ReturnType<typeof parseStr>;

const f1 = (arr: T[]) => {
  const res = arr.reduce(
    (state, [op, val]) => {
      // console.log(state);
      switch (op) {
        case "N":
          state.j += val;
          return state;
        case "S":
          state.j -= val;
          return state;
        case "E":
          state.i += val;
          return state;
        case "W":
          state.i -= val;
          return state;
        case "L":
          state.ang = (state.ang + val) % 360;
          return state;
        case "R":
          state.ang = (state.ang - val) % 360;
          return state;
        case "F":
          state.i += val * Math.cos(2 * Math.PI * (state.ang / 360));
          state.j += val * Math.sin(2 * Math.PI * (state.ang / 360));
          return state;
        default:
          return state;
      }
    },
    { i: 0, j: 0, ang: 0 }
  );

  return Math.abs(res.i) + Math.abs(res.j);
};

const f2 = (arr: T[]) => {
  const res = arr.reduce(
    (state, [op, val]) => {
      // console.log(state);
      // console.log();
      // console.log({ op, val });
      switch (op) {
        case "N":
          state.wj += val;
          return state;
        case "S":
          state.wj -= val;
          return state;
        case "E":
          state.wi += val;
          return state;
        case "W":
          state.wi -= val;
          return state;
        case "L":
        case "R":
          const radius = Math.sqrt(state.wi ** 2 + state.wj ** 2);
          const angiDeg = Math.round(
            (Math.atan2(state.wj, state.wi) * 360) / (2 * Math.PI)
          );
          // console.log({ angiDeg });
          state.wi = Math.round(
            radius *
              Math.cos(
                ((angiDeg + (op === "L" ? val : -val)) * 2 * Math.PI) / 360
              )
          );
          state.wj = Math.round(
            radius *
              Math.sin(
                ((angiDeg + (op === "L" ? val : -val)) * 2 * Math.PI) / 360
              )
          );
          return state;
        case "F":
          state.i += state.wi * val;
          state.j += state.wj * val;
          return state;
        default:
          return state;
      }
    },
    { i: 0, j: 0, wi: 10, wj: 1 }
  );

  // console.log(res);

  return Math.abs(res.i) + Math.abs(res.j);
};

(async () => {
  console.log(f1((await read(12, 1)).map(parseStr)));
  console.log(f1((await read(12, 2)).map(parseStr)));
  console.log("");
  console.log(f2((await read(12, 1)).map(parseStr)));
  console.log(f2((await read(12, 2)).map(parseStr)));
})();
