using System;
using advent2020;

var day = args.Length > 1 ? args[1] : "14";
var input = args.Length > 2 ? args[2] : "1";

Console.WriteLine($"day {day}, input {input}");

var answer = day switch
{
    "14" => Day14.Solve(input),
    _ => $"Unknown day {day}",
};

Console.WriteLine(answer);
