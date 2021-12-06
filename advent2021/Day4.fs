module Day4

open FParsec

exception ParsingError of string

let parseNumbers = sepBy pint32 (pstring ",") .>> skipNewline .>> skipNewline

let parseBoardLine = tuple5 (spaces >>. pint32 .>> spaces) (pint32 .>> spaces) (pint32 .>> spaces) (pint32 .>> spaces) (pint32)

let parseBoard = tuple5 (parseBoardLine) (parseBoardLine) (parseBoardLine) (parseBoardLine) (parseBoardLine)

let parseBoards = sepBy parseBoard newline 

let parse path = runParserOnFile (tuple2 parseNumbers parseBoards) () path System.Text.Encoding.UTF8

let solvep1 (numbers: int list, boards) =
    printfn "%A" numbers
    printfn "%A" boards
    ""

let p1 (path: string) =
    match (parse path) with
    | Success  (res, _, _) -> solvep1 res
    | Failure (error, parseError, _) ->
        printfn "%A" parseError
        raise (ParsingError error)