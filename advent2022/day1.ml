open Base
open Stdio

let parse (list, sum) input =
  match input with
  | "" -> (sum :: list, 0)
  | str -> (list, sum + Int.of_string str)

let max maxn curr = if curr > maxn then curr else maxn

let max3 (m1, m2, m3) curr =
  if curr > m1 then (curr, m2, m3)
  else if curr > m2 then (m1, curr, m3)
  else if curr > m3 then (m1, m2, curr)
  else (m1, m2, m3)

let read =
  let file = In_channel.create "ri1.txt" in
  let numbers, _s =
    List.fold ~init:([], 0) ~f:parse (In_channel.input_lines file)
  in
  let sum = numbers |> List.fold ~init:0 ~f:max in
  let m1, m2, m3 = numbers |> List.fold ~init:(0, 0, 0) ~f:max3 in
  In_channel.close file;
  (sum, m1 + m2 + m3)

let () =
  let r1, r2 = read in
  printf "Done: %i, %i\n" r1 r2
