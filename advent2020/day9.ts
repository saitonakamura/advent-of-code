import { read } from "./helper";

const parseStr = (s: string) => parseInt(s, 10);

type T = ReturnType<typeof parseStr>;

const f1 = (arr: T[], preamble: number) => {
  const cache = new Map<number, Map<number, Set<number>>>(
    arr.slice(0, preamble).map((item, index) => [
      index,
      arr.slice(0, preamble).reduce(
        (acc, curr, index) =>
          curr !== item
            ? acc.set(
                curr + item,
                acc.get(curr + item)?.add(index) ?? new Set<number>([index])
              )
            : acc,
        new Map<number, Set<number>>()
      ),
    ])
  );

  const movePreamble = (newLastIndex: number) => {
    const indexToDelete = newLastIndex - preamble;
    const item = arr[newLastIndex];

    cache.delete(indexToDelete);

    for (let i = indexToDelete + 1; i < indexToDelete + preamble; i++) {
      const cacheForIndex = cache.get(i);
      if (cacheForIndex) {
        if (arr[i] !== item) {
          cacheForIndex.set(
            arr[i] + item,
            cacheForIndex.get(arr[i] + item)?.add(newLastIndex) ??
              new Set<number>([newLastIndex])
          );
        }

        for (const [sum, indices] of cacheForIndex) {
          indices.delete(indexToDelete);
          if (indices.size === 0) {
            cacheForIndex.delete(sum);
          }
        }
      }
    }

    cache.set(
      newLastIndex,
      arr.slice(indexToDelete + 1, newLastIndex + 1).reduce(
        (acc, curr, index) =>
          curr !== item
            ? acc.set(
                curr + item,
                acc.get(curr + item)?.add(indexToDelete + index + 1) ??
                  new Set<number>([indexToDelete + index + 1])
              )
            : acc,
        new Map<number, Set<number>>()
      )
    );
  };

  for (let i = preamble; i < arr.length; i++) {
    let valid = false;
    for (let j = i - 1; j > i - 1 - preamble; j--) {
      if (cache.get(j)?.has(arr[i])) {
        valid = true;
        break;
      }
    }

    if (!valid) {
      return arr[i];
    }

    movePreamble(i);

    // return cache;
  }
};

const f2 = (arr: T[], preamble: number) => {
  const invalidNumber = f1(arr, preamble);

  for (let k = 2; k < arr.length; k++) {
    let sum = undefined;
    for (let i = 0; i < arr.length - k; i++) {
      if (sum === undefined) {
        sum = 0;
        for (let j = i; j < i + k; j++) {
          sum += arr[j];
        }
      } else {
        const prevFirst = arr[i - 1];
        const newLast = arr[i + k - 1];
        sum += newLast - prevFirst;
      }
      if (sum === invalidNumber) {
        let min = Number.MAX_SAFE_INTEGER;
        let max = Number.MIN_SAFE_INTEGER;

        for (let j = i; j < i + k; j++) {
          if (arr[j] > max) {
            max = arr[j];
          }
          if (arr[j] < min) {
            min = arr[j];
          }
        }

        return min + max;
      }
    }
  }
};

(async () => {
  console.log(f1((await read(9, 1)).map(parseStr), 5));
  console.log(f1((await read(9, 2)).map(parseStr), 25));
  console.log("");
  console.log(f2((await read(9, 1)).map(parseStr), 5));
  console.log(f2((await read(9, 2)).map(parseStr), 25));
})();
