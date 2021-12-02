module Day2

open FParsec

type Move =
    | Forward
    | Down
    | Up

let pcommand =
    stringReturn "forward" Forward
    <|> stringReturn "up" Up
    <|> stringReturn "down" Down

exception ParsingError of string

let solve (lines: seq<string>) =
    lines
    |> Seq.map (run (tuple2 (pcommand .>> spaces) (pint32 .>> spaces)))
    |> Seq.fold
        (fun (x, y) res ->
            match res with
            | Success ((command, value), _, _) ->
                match command with
                | Forward -> (x + value, y)
                | Up -> (x, y - value)
                | Down -> (x, y + value)
            | Failure (error, _, _) -> raise (ParsingError(error)))
        (0, 0)
    |> fun (x, y) -> string (x * y)

let solvep2 (lines: seq<string>) =
    lines
    |> Seq.map (run (tuple2 (pcommand .>> spaces) (pint32 .>> spaces)))
    |> Seq.fold
        (fun (x, depth, aim) res ->
            match res with
            | Success ((command, value), _, _) ->
                match command with
                | Forward -> (x + value, depth + aim * value, aim)
                | Up -> (x, depth, aim - value)
                | Down -> (x, depth, aim + value)
            | Failure (error, _, _) -> raise (ParsingError(error)))
        (0, 0, 0)
    |> fun (x, depth, _aim) -> string (x * depth)
