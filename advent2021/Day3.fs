module Day3

let folder (avgs: float [], index: int) (curr: string) =
    let bitsChars = curr |> Seq.toArray
    let floatIndex = index |> float

    let bits =
        bitsChars |> Array.map string |> Array.map float

    if index = 0 then
        (bits, index + 1)
    else
        bits
        |> Array.iteri (fun i bit ->
            let prevAvg = Array.get avgs i

            let newAvg =
                (prevAvg * floatIndex + bit) / (floatIndex + 1.0)

            Array.set avgs i newAvg)

        (avgs, index + 1)

let solve (lines: seq<string>) =
    lines
    |> Seq.fold folder (Array.empty<float>, 0)
    |> fun (avgs, _) ->
        let strs = Array.map string avgs
        printfn "%s" (String.concat " " strs)
        avgs
    |> Array.fold
        (fun acc avg ->
            if avg >= 0.5 then
                acc + "1"
            else
                acc + "0")
        ""
    |> fun bitsStr ->
        let number = System.Convert.ToUInt32(bitsStr, 2)

        let nnumber =
            System.Convert.ToUInt32(
                bitsStr
                |> Seq.toArray
                |> Array.map (fun x -> if x = '1' then "0" else "1")
                |> String.concat "",
                2
            )

        printfn "%i %i %s" number nnumber bitsStr
        number * nnumber |> string

type Metric =
    | Oxygen
    | CO2

let rec p2rec (lines: seq<string>) (index: int) metric =
    let avg =
        lines
        |> Seq.map (fun str -> str.[index] |> string |> float)
        |> Seq.average

    let charThisTime =
        match metric with
        | Oxygen -> if avg >= 0.5 then '1' else '0'
        | CO2 -> if avg < 0.5 then '1' else '0'

    let newLines =
        lines
        |> Seq.filter (fun c -> c.[index] = charThisTime)

    if Seq.length newLines < 2 then
        Seq.head newLines
    else
        p2rec newLines (index + 1) metric

let solvep2 lines =
    let oxygenStr = p2rec lines 0 Oxygen
    let co2Str = p2rec lines 0 CO2

    let oxygen = System.Convert.ToInt32(oxygenStr, 2)
    let co2 = System.Convert.ToInt32(co2Str, 2)

    co2 * oxygen |> string
