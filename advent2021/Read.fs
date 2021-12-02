module Read

let readline argv callback =
    match argv with
    | [| name |] ->
        let lines =
            System.IO.File.ReadLines($"./inputs/{name}.txt")

        printf "%i" (callback lines)
    | _ -> printf "Provide input file name without extension"
