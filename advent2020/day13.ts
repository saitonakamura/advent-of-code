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
  const res = data.buses.reduce(
    (res, bus) => {
      if (bus === -1) {
        return res;
      }

      const wait = bus - ((data.start + bus) % bus);
      // console.log({ wait, bus, res })
      if (wait < res.wait) {
        return { wait, bus };
      }

      return res;
    },
    { wait: Number.MAX_SAFE_INTEGER, bus: -1 }
  );

  return res.wait * res.bus;
};

const primeFac = (n: number, map: Map<number, number>) => {
  while (n % 2 === 0) {
    map.set(2, (map.get(2) ?? 0) + 1);
    n /= 2;
  }

  for (let d = 3; d < Math.sqrt(n); d += 2) {
    while (n % d === 0) {
      map.set(d, (map.get(d) ?? 0) + 1);
      n /= d;
    }
  }

  if (n > 2) {
    map.set(n, (map.get(n) ?? 0) + 1);
  }
};

const f2 = (data: T) => {
  let p = 0n;
  let valid = false;

  const { buses } = data;

  let max = Number.MIN_SAFE_INTEGER;
  let maxIndex = -1;
  for (let i = 0; i < buses.length; i++) {
    if (max < buses[i]) {
      max = buses[i];
      maxIndex = i;
    }
  }

  console.log({ max });

  let step = max;

  const pairs = buses
    .map((b, i) => [i - maxIndex, b])
    .filter(([, b]) => b !== -1)
    .filter(([i, b]) => Math.abs(i) === b);

  const map = new Map<number, number>();
  for (let i = 0; i < pairs.length; i++) {
    primeFac(pairs[i][1], map);
  }

  primeFac(max, map);

  const lcm = Array.from(map.entries()).reduce(
    (acc, [prime, count]) => acc * prime ** count,
    1
  );

  console.log(map);
  console.log({ lcm });
  step = lcm;

  // p += BigInt(maxIndex);
  let c = 0;

  while (!valid) {
    c++;

    if (c % 1000 === 0) {
      process.stdout.cursorTo(0);
      process.stdout.write(p.toString().padStart(20, " "));
    }

    valid = true;

    for (let i = maxIndex + 1; i < buses.length; i++) {
      if (buses[i] === -1) {
        continue;
      }

      const n = p + BigInt(i) - BigInt(maxIndex);
      if (n % BigInt(buses[i]) !== 0n) {
        valid = false;
        break;
      }
    }

    if (valid) {
      for (let i = maxIndex - 1; i >= 0; i--) {
        if (buses[i] === -1) {
          continue;
        }

        const n = p + BigInt(i) - BigInt(maxIndex);
        if (n % BigInt(buses[i]) !== 0n) {
          valid = false;
          break;
        }
      }
    }

    if (!valid) {
      p += BigInt(step);
    }
  }

  console.log("");

  return p - BigInt(maxIndex);
};

(async () => {
  // console.log(f1(await read(13, 1, parseAll)));
  // console.log(f1(await read(13, 2, parseAll)));
  // console.log("");
  // console.log(f2(await read(13, 1, parseAll)));
  console.log(f2(await read(13, 2, parseAll)));
})();
