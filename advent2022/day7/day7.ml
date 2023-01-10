open Base
(* open Stdio *)
open Core
open Lexing
open Day7_parser

exception Fail



let print_position outx lexbuf =
  let pos = lexbuf.lex_curr_p in
  fprintf outx "%s:%d:%d" pos.pos_fname
    pos.pos_lnum (pos.pos_cnum - pos.pos_bol + 1)

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

type fs =
  | File of string * int
  | Dir of string * fs list

let fold acc line =
  match line with
  | `CdRootCommand -> acc
  | `CdToCommand _ -> acc
  | `CdUpCommand -> acc
  | `LsCommand _ -> acc

let parse channel filename =
  let lexbuf = Lexing.from_channel channel in
  lexbuf.lex_curr_p <- { lexbuf.lex_curr_p with pos_fname = filename };
  let lines = parse_and_print lexbuf [] in
  let (r1, r2, _) = List.fold ~init:(0, 0, Dir ("/", [])) ~f:fold lines in
  (r1, r2)

let read =
  let filename = (Sys.get_argv ()).(1) in
  let file = In_channel.create filename in
  let (r1, r2) = parse file filename in
  In_channel.close file;
  (r1, r2)

let () =
  let (r1, r2) = read in
  printf "Done: %i, %i\n" r1 r2

