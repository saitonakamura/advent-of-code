using System.IO;
using System.Linq;
using System.Text.RegularExpressions;
using System.Collections.Generic;
using System;

namespace advent2020
{
    public record Op(string code, ulong addr, ulong val, string mask);

    public class Day14
    {
        static List<Op> Parse(string input)
        {
            var maskRegex = new Regex(@"^mask\s+=\s+(?<mask>[X|1|0]+)$");
            var memRegex = new Regex(@"^mem\[(?<addr>\d+)\]\s+=\s+(?<val>\d+)$");

            var lines = File.ReadAllLines($"./day14-input{input}.txt");
            return lines.Aggregate(new List<Op>(), (acc, line) =>
            {
                var maskMatch = maskRegex.Match(line);
                var memMatch = memRegex.Match(line);

                if (maskMatch.Success)
                {
                    acc.Add(new Op("mask", 0L, 0L, maskMatch.Groups["mask"].Value));
                }
                else if (memMatch.Success)
                {
                    acc.Add(new Op("mem", ulong.Parse(memMatch.Groups["addr"].Value), ulong.Parse(memMatch.Groups["val"].Value), ""));
                }

                return acc;
            });
        }

        public static string Solve(string input = "1")
        {
            var data = Parse(input);
            ulong zeroMask = 0L;
            var oneMask = Convert.ToUInt64("".PadLeft(64, '1'), 2);
            var mem = new Dictionary<ulong, ulong>();

            foreach (var op in data)
            {
                switch (op.code)
                {
                    case "mask":
                        {
                            zeroMask = Convert.ToUInt64(op.mask.Replace("X", "1"), 2);
                            oneMask = Convert.ToUInt64(op.mask.Replace("X", "0"), 2);
                            break;
                        }
                    case "mem":
                        {
                            mem[op.addr] = (op.val & zeroMask) | oneMask;
                            break;
                        }
                }
            }

            return mem.Aggregate((ulong)0L, (acc, curr) => acc + curr.Value).ToString();
        }
    }
}