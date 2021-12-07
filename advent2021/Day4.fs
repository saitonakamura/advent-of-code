module Day4

open FParsec

exception ParsingError of string

let parseNumbers =
    sepBy pint32 (pstring ",")
    .>> skipNewline
    .>> skipNewline

let parseBoardLine =
    (many (pstring " "))
    >>. parray 5 (pint32 .>> (many (pstring " ")))
    .>> (optional newline)

let parseBoard = parray 5 parseBoardLine

let parseBoards =
    manyTill (parseBoard .>> (optional newline)) eof

let parse path =
    runParserOnFile (tuple2 parseNumbers parseBoards) () path System.Text.Encoding.UTF8

let mark (boards: int array array list) number =
    boards
    |> List.iter (fun board ->
        Array.iter
            (fun row ->
                Array.iteri
                    (fun itemI n ->
                        if n = number then
                            Array.set row itemI -1
                        else
                            ())
                    row)
            board)

let checkLine (row: int array) = (Array.sum row) = -5

let checkLines (board: int array array) = board |> Array.exists checkLine

let checkColumns (board: int array array) =
    let mutable colSum = 0

    for i in [ 0 .. (board.Length - 1) ] do
        if colSum <> -5 then
            colSum <- 0
            let l = Array.length (board.[i]) - 1

            for j in [ 0 .. l ] do
                colSum <- colSum + board.[j].[i]
        else
            ()

    colSum = -5

let check (boards: int array array list) (number: int) =
    boards
    |> List.fold
        (fun acc board ->
            match acc with
            | Some (_) -> acc
            | None ->
                let isLineWon = checkLines board
                let isColumnWon = checkColumns board

                if isLineWon || isColumnWon then
                    Some(board, number)
                else
                    None)
        None

let nonMarkedSum board =
    board
    |> Array.sumBy (fun line -> (Array.sumBy (fun n -> if n <> -1 then n else 0) line))

let solvep1 (numbers: int list) boards =
    let res =
        numbers
        |> List.fold
            (fun (acc: option<array<array<int>> * int>) (number: int) ->
                match acc with
                | Some ((_)) -> acc
                | None ->
                    mark boards number
                    check boards number)
            None

    match res with
    | Some (winnerBoard, winnerNumber) ->
        // printfn "%A" winnerBoard
        (nonMarkedSum winnerBoard) * winnerNumber
        |> string
    | None -> "no winner board found"

let solvep2 (numbers: int list) b =
    let mutable boards = b

    let res =
        numbers
        |> List.fold
            (fun (acc: option<array<array<int>> * int>) (number: int) ->
                match acc with
                | Some (_) -> acc
                | None ->
                    mark boards number

                    let mutable b = Array.empty

                    boards <-
                        List.filter
                            (fun board ->
                                let isLineWon = checkLines board
                                let isColumnWon = checkColumns board

                                if (isColumnWon || isLineWon) then
                                    b <- board
                                else
                                    ()

                                not isLineWon && not isColumnWon)
                            boards

                    if List.length boards < 1 then
                        Some(b, number)
                    else
                        acc)
            None

    match res with
    | Some (loserBoard, lastNumber) ->
        printfn "%A __ %i" loserBoard lastNumber
        printfn "%A" boards
        (nonMarkedSum loserBoard) * lastNumber |> string
    | None -> "no loser board found"

let p1 (path: string) =
    match (parse path) with
    | Success ((numbers, boards), _, _) -> solvep1 numbers boards
    | Failure (error, parseError, _) ->
        printfn "%A" parseError
        raise (ParsingError error)

let p2 (path: string) =
    match (parse path) with
    | Success ((numbers, boards), _, _) -> solvep2 numbers boards
    | Failure (error, parseError, _) ->
        printfn "%A" parseError
        raise (ParsingError error)
