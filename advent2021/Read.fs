module Read

let readline (argv: string array) =
    match argv with
    | [| day; part; name |] ->
        let lines =
            System.IO.File.ReadLines($"./inputs/{day}{name}.txt")

        let solve: seq<string> -> string =
            match (day, part) with
            | ("1", "1") -> Day1.solve
            | ("1", "2") -> Day1.solvep2
            | ("2", "1") -> Day2.solve
            | ("2", "2") -> Day2.solvep2
            | _ -> fun _ -> "Please provide correct day"

        let res = solve lines
        printf "%s" res
    | _ -> printf "Provide input file name without extension"
