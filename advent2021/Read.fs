module Read

let readline (argv: string array) =
    match argv with
    | [| day; part; name |] ->
        let inputPath = $"./inputs/{day}{name}.txt"
        let readLines = fun _ ->
            System.IO.File.ReadLines(inputPath)

        let res =
            match (day, part) with
            | ("1", "1") -> Day1.solve (readLines ())
            | ("1", "2") -> Day1.solvep2 (readLines ())
            | ("2", "1") -> Day2.solve (readLines ())
            | ("2", "2") -> Day2.solvep2 (readLines ())
            | ("3", "1") -> Day3.solve (readLines ())
            | ("3", "2") -> Day3.solvep2 (readLines ())
            | ("4", "1") -> Day4.p1 inputPath
            | _ -> "Please provide correct day"

        printfn "%s" res
    | _ -> printf "Provide input file name without extension"
