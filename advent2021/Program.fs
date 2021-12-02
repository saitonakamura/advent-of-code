open Read

let solve lines =
    lines
    |> Seq.map (int)
    |> Seq.pairwise
    |> Seq.fold (fun acc (x, y) -> if x < y then acc + 1 else acc) 0

[<EntryPoint>]
let main argv =
    do readline argv solve
    0
