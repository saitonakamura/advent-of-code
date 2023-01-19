open Base
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
      (* printf "%a\n" Day7ast.output_value value; *)
      parse_and_print lexbuf (value :: l)
  | None -> l

type fs = File of string * int | Dir of string * fs list * int

let rec print_fs root indent =
  match root with
  | File (n, s) -> printf "%s%s (file, size=%i)\n" indent n s
  | Dir (n, l, s) ->
      printf "%s%s (dir, size=%i)\n" indent n s;
      List.iter ~f:(fun item -> print_fs item ("  " ^ indent)) l

let rec f (curr_dir, lines) =
  match lines with
  | [] -> (curr_dir, lines)
  | line :: tl -> (
      match line with
      | `CdRootCommand -> f (Dir ("/", [], 0), tl)
      | `CdToCommand name -> (
          match curr_dir with
          | Dir (n, l, s) ->
              let fold (new_l, new_tl, new_s) fd =
                match fd with
                | Dir (dir_name, dir_l, dir_s) when String.equal dir_name name
                  ->
                    let new_dir, new_tl =
                      f (Dir (dir_name, dir_l, dir_s), tl)
                    in
                    let new_s =
                      match new_dir with
                      | Dir (_, _, s) -> s + new_s
                      | _ -> new_s
                    in
                    (new_dir :: new_l, new_tl, new_s)
                | x -> (x :: new_l, new_tl, new_s)
              in
              let new_l, new_tl, new_s =
                List.fold ~init:([], tl, s) ~f:fold l
              in
              f (Dir (n, new_l, new_s), new_tl)
          | x -> f (x, tl))
      | `CdUpCommand -> (curr_dir, tl)
      | `LsCommand -> f (curr_dir, tl)
      | `OutputDir dir_name ->
          let curr_dir =
            match curr_dir with
            | Dir (name, l, s) -> Dir (name, Dir (dir_name, [], 0) :: l, s)
            | x -> x
          in
          f (curr_dir, tl)
      | `OutputFile (file_name, file_size) ->
          let curr_dir =
            match curr_dir with
            | Dir (name, l, s) ->
                Dir (name, File (file_name, file_size) :: l, s + file_size)
            | x -> x
          in
          f (curr_dir, tl))

type small_dir = SmallDir of int

let rec find_small_dirs (root, small_dirs) threshold =
  match root with
  | Dir (_, l, s) ->
      let small_dirs =
        List.fold ~init:small_dirs
          ~f:(fun acc fd -> find_small_dirs (fd, acc) threshold)
          l
      in
      if s <= threshold then SmallDir s :: small_dirs else small_dirs
  | _ -> small_dirs

type appropriate_dir = AppropriateDir of int

let rec find_approriate_dirs (root, dirs) unused needed =
  match root with
  | Dir (_, l, s) ->
      let dirs =
        List.fold ~init:dirs
          ~f:(fun acc fd -> find_approriate_dirs (fd, acc) unused needed)
          l
      in
      if unused + s >= needed then AppropriateDir s :: dirs else dirs
  | _ -> dirs

let size fd = match fd with Dir (_, _, s) -> s | File (_, s) -> s

let solve lines =
  let root, _ = f (Dir ("/", [], 0), List.rev lines) in
  print_fs root "- ";
  let small_dirs = find_small_dirs (root, []) 100000 in
  let appropriate_dirs =
    find_approriate_dirs (root, []) (70000000 - size root) 30000000
  in
  (* printf "%a\n" fs_output_value tree; *)
  ( List.fold ~init:0
      ~f:(fun acc d -> match d with SmallDir s -> acc + s)
      small_dirs,
    List.fold ~init:Int.max_value
      ~f:(fun acc d -> match d with AppropriateDir s -> min acc s)
      appropriate_dirs )

let parse channel filename =
  let lexbuf = Lexing.from_channel channel in
  lexbuf.lex_curr_p <- { lexbuf.lex_curr_p with pos_fname = filename };
  let lines = parse_and_print lexbuf [] in
  let r1, r2 = solve lines in
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
