open Base
open Stdio

exception Fail

type state =
  | Start
  | Boxes of string list
  | RowNumbers of char list array
  | EmptyLine of char list array
  | Instructions of char list array

type instruction = { howmany: int; takefrom: int; moveto: int }

type stringtype =
  | Empty
  | StackLine of string
  | StackNumbers of int
  | Instruction of instruction

let log_boxes boxes =
  Array.iteri boxes ~f:(fun i stack -> 
    printf "boxes state %i: %s\n" i (String.of_char_list stack);
  );
  ()

let fold_boxes i arr ch =
  if (i - 1) % 4 = 0 && not (Char.equal ch ' ') then
    let stack_index = (i - 1) / 4 in
    (* printf "index %i %i\n" stack_index (Array.length arr); *)
    let l = Array.get arr stack_index in
    arr.(stack_index) <- (ch :: l);
    arr
  else
    arr

let fold boxes str = String.foldi ~init:boxes ~f:fold_boxes str

let parse_boxes boxes strs =
  List.fold ~init:boxes ~f:fold strs

let parse_instruction str =
  let r = Str.regexp {|move \([0-9]+\) from \([0-9]+\) to \([0-9]+\)|} in
  if Str.string_match r str 0 then
    let howmany = Str.matched_group 1 str |> Int.of_string in
    let takefrom = Str.matched_group 2 str |> Int.of_string in
    let moveto = Str.matched_group 3 str |> Int.of_string in
    { howmany = howmany; takefrom = takefrom - 1; moveto = moveto - 1 }
  else
    raise Fail

let execute_instruction boxes instruction =
  let from = boxes.(instruction.takefrom) in
  let to_ = boxes.(instruction.moveto) in
  let (tomove, tail) = List.split_n from instruction.howmany in
  Array.set boxes instruction.takefrom tail;
  Array.set boxes instruction.moveto (tomove @ to_);
  log_boxes boxes;
  boxes

let parse_line str =
  if String.contains str '[' then
    StackLine (str)
  else if String.is_empty str then
    Empty
  else if String.is_prefix str ~prefix:"move" then
    let instruction = parse_instruction str in
    Instruction (instruction)
  else if String.contains str '1' then
    let count = String.split str ~on:' '
      |> List.filter ~f:(fun s -> not (String.is_empty s))
      |> List.map ~f:Int.of_string
      |> List.fold ~init:0 ~f:max in
    StackNumbers (count)
  else
    Empty

let fold state str =
  printf "working with line %s\n" str;
  let state = match (state, parse_line str) with
  | (Start, StackLine (str)) ->
    printf "start, stackline\n";
    Boxes ([str])
  | (Boxes (strs), StackLine (str)) ->
    printf "boxes, stackline\n";
    Boxes (str :: strs)
  | (Boxes (strs), StackNumbers (count)) ->
    printf "boxes, stacknumbers %i\n" count;
    let boxes = parse_boxes (Array.create ~len:count []) strs in
    log_boxes boxes;
    RowNumbers (boxes)
  | (RowNumbers (boxes), Empty) ->
    printf "rownumbers, empty\n";
    EmptyLine (boxes)
  | (EmptyLine (boxes), Instruction (instruction)) ->
    printf "emptyline, instruction: %i %i %i \n" instruction.howmany instruction.takefrom instruction.moveto;
    Instructions (execute_instruction boxes instruction)
  | (Instructions (boxes), Instruction (instruction)) ->
    printf "rownumbers, instruction\n";
    Instructions (execute_instruction boxes instruction)
  | _ -> raise Fail in
  state

let parse channel =
  let state = In_channel.fold_lines ~init:Start ~f:fold channel in
  let r1 = (match state with
    | Instructions (boxes) ->
      Array.fold ~init:[] ~f:(fun l s -> match s with | h :: _ -> h :: l | _ -> l) boxes
      |> List.rev
      |> String.of_char_list
    | _ -> raise Fail) in
  let r2 = 0 in
  (r1, r2)

let read =
  let filename = (Sys.get_argv ()).(1) in
  let file = In_channel.create filename in
  let (r1, r2) = parse file in
  In_channel.close file;
  (r1, r2)

let () =
  let (r1, r2) = read in
  printf "Done: %s, %i\n" r1 r2