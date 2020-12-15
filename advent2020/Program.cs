using System;
using advent2020;

var day = args.Length > 1 ? args[1] : "14";
var input = args.Length > 2 ? args[2] : "1";
var part = args.Length > 3 ? args[3] : "1";

Console.WriteLine($"day {day}, input {input}, part {part}");

var answer = (day, part) switch
{
    ("14", "1") => Day14.Solve1(input),
    ("14", "2") => Day14.Solve2(input),
    _ => $"Unknown day {day}",
};

Console.WriteLine(answer);
