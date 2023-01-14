open Base

(* open Stdio *)
open Core
open Lexing
open Day7_parser

exception Fail

let print_position outx lexbuf =
  let pos = lexbuf.lex_curr_p in
  fprintf outx "%s:%d:%d" pos.pos_fname pos.pos_lnum
    (pos.pos_cnum - pos.pos_bol + 1)

let parse_with_error lexbuf =
  try Day7parser.prog Day7lexer.read lexbuf with
  | Day7lexer.SyntaxError msg ->
      fprintf stderr "%a: %s\n" print_position lexbuf msg;
      None
  | Day7parser.Error ->
      fprintf stderr "%a: syntax error\n" print_position lexbuf;
      exit (-1)

let rec parse_and_print lexbuf l =
  match parse_with_error lexbuf with
  | Some value ->
      printf "%a\n" Day7ast.output_value value;
      parse_and_print lexbuf (value :: l)
  | None -> l

type fs = File of string * int | Dir of string * fs list * fs option

let fold (r1, r2, d) line =
  match line with
  | `CdRootCommand -> (r1, r2, Dir ("/", [], None))
  | `CdToCommand _ -> (r1, r2, d)
  | `CdUpCommand -> (r1, r2, d)
  | `LsCommand -> (r1, r2, d)
  | `OutputDir dir_name ->
      let d =
        match d with
        | Dir (name, l, p) -> Dir (name, Dir (dir_name, [], ) :: l, p)
        | File (f, s) -> File (f, s)
      in
      (r1, r2, d)
  | `OutputFile (file_name, file_size) ->
      let d =
        match d with
        | Dir (name, l, p) -> Dir (name, File (file_name, file_size) :: l, p)
        | File (f, s) -> File (f, s)
      in
      (r1, r2, d)

let parse channel filename =
  let lexbuf = Lexing.from_channel channel in
  lexbuf.lex_curr_p <- { lexbuf.lex_curr_p with pos_fname = filename };
  let lines = parse_and_print lexbuf [] in
  let r1, r2, _ = List.fold ~init:(0, 0, Dir ("/", [])) ~f:fold lines in
  (r1, r2)

let read =
  let filename = (Sys.get_argv ()).(1) in
  let file = In_channel.create filename in
  let r1, r2 = parse file filename in
  In_channel.close file;
  (r1, r2)

let () =
  let r1, r2 = read in
  printf "Done: %i, %i\n" r1 r2
