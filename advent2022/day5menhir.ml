open Base
open Stdio

(* exception Fail

type state =
  | Start
  | Boxes of string list
  | RowNumbers of char list array
  | EmptyLine of char list array
  | Instructions of char list array

type instruction = { howmany: int; takefrom: int; moveto: int }

let fold_boxes i arr ch =
  if (i - 1) % 4 = 0 then
    let stack_index = (i - 1) / 4 in
    printf "index %i %i\n" stack_index (Array.length arr);
    let l = if Array.length arr < stack_index then Array.get arr stack_index else [] in
    arr.(stack_index) <- (ch :: l);
    arr
  else
    arr

let parse_boxes boxes str =
  String.foldi ~init:boxes ~f:fold_boxes str

let parse_instruction str =
  let r = Str.regexp {|move \([0-9]+\) from \([0-9]+\) to \([0-9]+\)|} in
  if Str.string_match r str 0 then
    let howmany = Str.matched_group 1 str |> Int.of_string in
    let takefrom = Str.matched_group 2 str |> Int.of_string in
    let moveto = Str.matched_group 3 str |> Int.of_string in
    { howmany = howmany; takefrom = takefrom; moveto = moveto }
  else
    raise Fail

let execute_instruction boxes str =
  let instruction = parse_instruction str in
  let from = boxes.(instruction.takefrom) in
  let to_ = boxes.(instruction.moveto) in
  let (tomove, tail) = List.split_n from instruction.howmany in
  Array.set boxes instruction.takefrom tail;
  Array.set boxes instruction.moveto (List.rev tomove @ to_);
  boxes

let fold (r1, r2, state) str =
  let state = match state with
  | Start -> Boxes ([str])
  | Boxes (boxesstrs) ->
    (* (if (String.get str 1) = '1' then
      RowNumbers (boxes)
    else *)
     Boxes (str :: boxesstrs)
     (* ) *)
  | RowNumbers (boxes) ->
    (* (
    if str = "" then *)
      EmptyLine (Array.map boxes ~f:(fun stack -> List.rev stack))
    (* else
      raise (Fail)
    ) *)
  | EmptyLine (boxes) ->
    (* (
      if String.prefix str 4 = "move" then *)
        Instructions (execute_instruction boxes str)
      (* else
        raise (Fail)
    ) *)
  | Instructions (boxes) -> Instructions (execute_instruction boxes str) in
  (r1, r2, state) *)

(* type token =
  | STACK_LINE of string
  | STACK_NUMBERS of string
  | EMPTY_LINE
  | INSTRUCTIONS of string *)
type token =
  | SPACE
  | BOX of char
  | EMPTY_LINE
  | STACK_NUMBER of int
  | OPERATION of string * int

type value =
  | Data of string list array * (int * int * int)

let parse channel =
  (* let (r1, r2, _) = In_channel.fold_lines ~init:([], 0, Start) ~f:fold channel in *)
  (0, 0)

let read =
  let filename = (Sys.get_argv ()).(1) in
  let file = In_channel.create filename in
  let (r1, r2) = parse file in
  In_channel.close file;
  (r1, r2)

let () =
  let (r1, r2) = read in
  printf "Done: %s, %i\n" (String.of_char_list r1) r2