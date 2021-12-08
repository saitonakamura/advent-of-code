module Day5

open FParsec

let ppoint = tuple2 (pint32 .>> (pstring ",")) pint32

let pline =
    tuple2 (ppoint .>> (pstring " -> ")) ppoint

let parse path =
    runParserOnFile (sepBy pline newline) () path System.Text.Encoding.UTF8

let calc field =
    let mutable intersections = 0

    for i in [ 0 .. ((Array.length field) - 1) ] do
        for j in [ 0 .. ((Array.length (Array.item i field)) - 1) ] do
            if (Array.item j (Array.item i field)) >= 2 then
                intersections <- intersections + 1
            else
                ()

    intersections

let solve1 alldata =

    let data =
        alldata
        |> List.filter (fun ((x1, y1), (x2, y2)) -> x1 = x2 || y1 = y2)

    let field =
        Array.init 1000 (fun _ -> Array.init 1000 (fun _ -> 0))

    data
    |> List.iter (fun ((x1, y1), (x2, y2)) ->
        if x1 = x2 then
            let start = min y1 y2
            let finish = max y1 y2

            for i in [ start .. finish ] do
                let col = Array.item x1 field
                Array.set col i ((Array.item i col) + 1)
        else
            let start = min x1 x2
            let finish = max x1 x2

            for i in [ start .. finish ] do
                let col = Array.item i field
                Array.set col y1 ((Array.item y1 col) + 1))

    calc field |> string

let solve2 data =
    let fieldSize = 1000

    let field =
        Array.init fieldSize (fun _ -> Array.init fieldSize (fun _ -> 0))

    data
    |> List.iter (fun ((x1, y1), (x2, y2)) ->
        if x1 = x2 then
            let start = min y1 y2
            let finish = max y1 y2

            for i in [ start .. finish ] do
                let col = Array.item i field
                Array.set col x1 ((Array.item x1 col) + 1)
        elif y1 = y2 then
            let start = min x1 x2
            let finish = max x1 x2

            for i in [ start .. finish ] do
                let col = Array.item y1 field
                Array.set col i ((Array.item i col) + 1)
        elif y1 < y2 && x1 < x2 then
            for i in [ y1 .. y2 ] do
                let col = Array.item i field
                let j = (x1 + i - y1)
                Array.set col j ((Array.item j col) + 1)
        elif y1 < y2 && x1 > x2 then
            for i in [ y1 .. y2 ] do
                let col = Array.item i field
                let j = (x1 - i + y1)
                Array.set col j ((Array.item j col) + 1)
        elif y1 > y2 && x1 < x2 then
            for i in [ y2 .. y1 ] do
                let col = Array.item i field
                let j = (x2 - (i - y2))
                Array.set col j ((Array.item j col) + 1)
        elif y1 > y2 && x1 > x2 then
            for i in [ y2 .. y1 ] do
                let col = Array.item i field
                let j = (x2 + i - y2)
                Array.set col j ((Array.item j col) + 1))

    calc field |> string

let p1 path =
    match parse path with
    | Success (data, _, _) -> solve1 data
    | Failure (_, error, _) ->
        printfn "%A" error
        "fail"

let p2 path =
    match parse path with
    | Success (data, _, _) -> solve2 data
    | Failure (_, error, _) ->
        printfn "%A" error
        "fail"
