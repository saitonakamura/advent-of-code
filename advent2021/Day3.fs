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
