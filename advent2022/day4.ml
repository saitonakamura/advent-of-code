open Base
open Stdio

let parse_range str =
  match String.split ~on:'-' str with
  | [e1fromstr; e1tostr] ->
    Some (Int.of_string e1fromstr, Int.of_string e1tostr)
  | _ -> None

type overlap =
  | FullOverlap
  | PartialOverlap
  | NoOverlap
  | Error

let is_full_overlap (e1from, e1to, e2from, e2to) =
  if (e1from >= e2from && e1to <= e2to) then
    true
  else if (e1from <= e2from && e1to >= e2to) then
    true
  else
    false

let is_partial_overlap (e1from, e1to, e2from, e2to) =
  if (e1from >= e2from && e1from <= e2to) then
    true
  else if (e2from >= e1from && e2from <= e1to) then
    true
  else
    false



let calc e1 e2 =
  match (parse_range e1, parse_range e2) with
  | (Some(e1from, e1to), Some(e2from, e2to)) ->
    if is_full_overlap (e1from, e1to, e2from ,e2to) then
      FullOverlap
    else if is_partial_overlap (e1from, e1to, e2from ,e2to) then
      PartialOverlap
    else
      NoOverlap
  | _ -> Error


let parse (r1, r2) str =
  let (r1, r2) = match String.split ~on:',' str with
  | [e1; e2] -> (match (calc e1 e2) with
    | FullOverlap -> (r1 + 1, r2 + 1)
    | PartialOverlap -> (r1, r2 + 1)
    | NoOverlap -> (r1, r2)
    | Error -> (r1, r2 + 1000))
  | _ -> (r1, r2 + 1000) in
  (r1, r2)

let read =
  let file = In_channel.create "ri4.txt" in
  let (r1, r2) = List.fold ~init:(0,0) ~f:parse (In_channel.input_lines file) in
  In_channel.close file;
  (r1, r2)

let () =
  let (r1, r2) = read in
  printf "Done: %i, %i\n" r1 r2