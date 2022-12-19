open Base
open Stdio

let find str1 str2 =
  let l1 = String.to_list str1 in
  let l2 = String.to_list str2 in
  let h1 = Hash_set.of_list (module Char) l1 in
  let h2 = Hash_set.of_list (module Char) l2 in
  Hash_set.inter h1 h2

let find3 str1 str2 str3 =
  let l1 = String.to_list str1 in
  let l2 = String.to_list str2 in
  let l3 = String.to_list str3 in
  let h1 = Hash_set.of_list (module Char) l1 in
  let h2 = Hash_set.of_list (module Char) l2 in
  let h3 = Hash_set.of_list (module Char) l3 in
  Hash_set.inter h1 h2 |> Hash_set.inter h3

let score c =
  let s = Char.to_int c in
  if s >= 97 then s - 96 else s - 64 + 26

let sum_map f acc curr =
  acc + f curr

let parse (r1, r2, g) str =
  let half = String.length str / 2 in
  let comp1 = String.sub str ~pos:0 ~len:half in
  let comp2 = String.sub str ~pos:half ~len:half in
  let inter = find comp1 comp2 in
  let f = sum_map score in
  let s = Hash_set.fold ~init:0 ~f:f inter in
  let (r2, g) = match g with
  | [] -> (r2, [str])
  | [_] -> (r2, str :: g)
  | [l1; l2] -> let inter2 = find3 l1 l2 str in
    let s2 = Hash_set.fold ~init:0 ~f:f inter2 in
    (r2 + s2, [])
  | _ :: _ :: _ -> (r2, g) in
  (r1 + s, r2, g)

let read =
  let file = In_channel.create "ri3.txt" in
  let (r1, r2, _) = List.fold ~init:(0, 0, []) ~f:parse (In_channel.input_lines file) in
  In_channel.close file;
  (r1, r2)

let () =
  let (r1, r2) = read in
  printf "Done: %i, %i\n" r1 r2