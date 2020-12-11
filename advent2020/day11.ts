import { read } from "./helper";

const parseStr = (s: string) => [...s];

type T = ReturnType<typeof parseStr>;

const f1 = (arr: T[]) => {
  let changed = true;

  const isOccupied = (s: string) => s === "#" || s === "!";

  const countAdjacent = (i: number, j: number) => {
    const left = i >= 1 ? isOccupied(arr[j][i - 1]) : false;
    const right = i < arr[j].length - 1 ? isOccupied(arr[j][i + 1]) : false;
    const top = j >= 1 ? isOccupied(arr[j - 1][i]) : false;
    const bottom = j < arr.length - 1 ? isOccupied(arr[j + 1][i]) : false;
    const topLeft = j >= 1 && i >= 1 ? isOccupied(arr[j - 1][i - 1]) : false;
    const topRight =
      j >= 1 && i < arr[j - 1].length - 1
        ? isOccupied(arr[j - 1][i + 1])
        : false;
    const bottomLeft =
      j < arr.length - 1 && i >= 1 ? isOccupied(arr[j + 1][i - 1]) : false;
    const bottomRight =
      j < arr.length - 1 && i < arr[j + 1].length - 1
        ? isOccupied(arr[j + 1][i + 1])
        : false;

    return [
      left,
      right,
      top,
      bottom,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    ].reduce((acc, curr) => (curr ? acc + 1 : acc), 0);
  };

  // console.log(arr.map((x) => x.join("")).join("\n"));
  // console.log("\n");
  // let c = 15;

  while (changed) {
    changed = false;

    for (let j = 0; j < arr.length; j++) {
      for (let i = 0; i < arr[j].length; i++) {
        if (arr[j][i] === ".") continue;

        const adj = countAdjacent(i, j);
        if (adj === 0 && arr[j][i] !== "#") {
          // @ means became occupied, but isn't occupied for the current calculations
          arr[j][i] = "@";
          changed = true;
        } else if (adj >= 4 && arr[j][i] !== "L") {
          // ! means became free, but isn't free for the current calculations
          arr[j][i] = "!";
          changed = true;
        }
      }
    }

    // Normalize
    for (let j = 0; j < arr.length; j++) {
      for (let i = 0; i < arr[j].length; i++) {
        if (arr[j][i] === "@") arr[j][i] = "#";
        if (arr[j][i] === "!") arr[j][i] = "L";
      }
    }

    // console.log(arr.map((x) => x.join("")).join("\n"));
    // console.log("\n");
  }

  let occupied = 0;
  for (let j = 0; j < arr.length; j++) {
    for (let i = 0; i < arr[j].length; i++) {
      if (arr[j][i] === "#") occupied++;
    }
  }

  return occupied;
};

const f2 = (arr: T[]) => {
  let changed = true;

  const isOccupied = (s: string) => s === "#" || s === "!";

  const isInField = (i: number, j: number) =>
    i >= 0 && j >= 0 && j < arr.length && i < arr[j].length;

  const move = (i: number, j: number, iDelta: number, jDelta: number) => {
    while (isInField(i, j) && arr[j][i] === ".") {
      i += iDelta;
      j += jDelta;
    }

    if (!isInField(i, j)) return false;

    return isOccupied(arr[j][i]);
  };

  const countAdjacent = (i: number, j: number) => {
    const left = i >= 1 ? move(i - 1, j, -1, 0) : false;
    const right = i < arr[j].length - 1 ? move(i + 1, j, 1, 0) : false;
    const top = j >= 1 ? move(i, j - 1, 0, -1) : false;
    const bottom = j < arr.length - 1 ? move(i, j + 1, 0, 1) : false;
    const topLeft = j >= 1 && i >= 1 ? move(i - 1, j - 1, -1, -1) : false;
    const topRight =
      j >= 1 && i < arr[j - 1].length - 1 ? move(i + 1, j - 1, 1, -1) : false;
    const bottomLeft =
      j < arr.length - 1 && i >= 1 ? move(i - 1, j + 1, -1, 1) : false;
    const bottomRight =
      j < arr.length - 1 && i < arr[j + 1].length - 1
        ? move(i + 1, j + 1, 1, 1)
        : false;

    return [
      left,
      right,
      top,
      bottom,
      topLeft,
      topRight,
      bottomLeft,
      bottomRight,
    ].reduce((acc, curr) => (curr ? acc + 1 : acc), 0);
  };

  // console.log(arr.map((x) => x.join("")).join("\n"));
  // console.log("\n");
  // let c = 15;

  while (changed) {
    changed = false;

    for (let j = 0; j < arr.length; j++) {
      for (let i = 0; i < arr[j].length; i++) {
        if (arr[j][i] === ".") continue;

        if (j === 0 && i === 6) {
          debugger
        }
        const adj = countAdjacent(i, j);
        if (adj === 0 && arr[j][i] !== "#") {
          // @ means became occupied, but isn't occupied for the current calculations
          arr[j][i] = "@";
          changed = true;
        } else if (adj >= 5 && arr[j][i] !== "L") {
          // ! means became free, but isn't free for the current calculations
          arr[j][i] = "!";
          changed = true;
        }
      }
    }

    // Normalize
    for (let j = 0; j < arr.length; j++) {
      for (let i = 0; i < arr[j].length; i++) {
        if (arr[j][i] === "@") arr[j][i] = "#";
        if (arr[j][i] === "!") arr[j][i] = "L";
      }
    }

    // console.log(arr.map((x) => x.join("")).join("\n"));
    // console.log("\n");
  }

  let occupied = 0;
  for (let j = 0; j < arr.length; j++) {
    for (let i = 0; i < arr[j].length; i++) {
      if (arr[j][i] === "#") occupied++;
    }
  }

  return occupied;
};

(async () => {
  console.log(f1((await read(11, 1)).map(parseStr)));
  console.log(f1((await read(11, 2)).map(parseStr)));
  console.log("");
  console.log(f2((await read(11, 1)).map(parseStr)));
  console.log(f2((await read(11, 2)).map(parseStr)));
})();
