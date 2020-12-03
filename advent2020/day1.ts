import fs from "fs/promises";

/** O(n) complexity, O(n) memory */
const sum2 = (input: number[], sum: number) => {
  const set = new Set<number>(input);

  for (let i = 0; i < input.length; i++) {
    if (set.has(sum - input[i])) {
      return (sum - input[i]) * input[i];
    }
  }
};

/** O(n^2/2) complexity, O(n^2) memory */
const sum3 = (input: number[], sum: number) => {
  const map = new Map<number, [number, number]>();

  for (let i = 0; i < input.length - 1; i++) {
    for (let j = 0; j < input.length; j++) {
      map.set(input[i] + input[j], [input[i], input[j]]);
    }
  }

  for (let i = 0; i < input.length; i++) {
    const two = map.get(sum - input[i]);
    if (two) {
      return two[0] * two[1] * input[i];
    }
  }
};

(async () => {
  let input = (await fs.readFile("./day1-input1.txt", { encoding: "utf-8" }))
    .split(/\s/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => parseFloat(s));

  if (process.argv[2]) {
    input = process.argv[2]
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => parseFloat(s));
  }

  console.log(sum2(input, 2020));
  console.log(sum3(input, 2020));
})();
