module Day1

open Utils

let solve (lines: seq<string>) =
    lines
    |> Seq.map (int)
    |> Seq.pairwise
    |> Seq.fold (fun acc (x, y) -> if x < y then acc + 1 else acc) 0
    |> string

let solvep2 (lines: seq<string>) =
    lines
    |> Seq.map (int)
    |> seqTriplewise
    |> Seq.map (fun (x, y, z) -> x + y + z)
    |> Seq.pairwise
    |> Seq.fold (fun acc (x, y) -> if x < y then acc + 1 else acc) 0
    |> string
