open Base
open Stdio

type rps_them = Rock_them | Paper_them | Scissors_them
type rps_we = Rock_we | Paper_we | Scissors_we
type rps_we_true = Lose | Draw | Win

let parse_them str =
  match str with
  | "A" -> Some Rock_them
  | "B" -> Some Paper_them
  | "C" -> Some Scissors_them
  | _ -> None

let parse_we str =
  match str with
  | "X" -> Some Rock_we
  | "Y" -> Some Paper_we
  | "Z" -> Some Scissors_we
  | _ -> None

let parse_we2 str =
  match str with
  | "X" -> Some Lose
  | "Y" -> Some Draw
  | "Z" -> Some Win
  | _ -> None

let solve2 them str =
  match (them, parse_we2 str) with
  | Some Rock_them, Some Lose -> Some Scissors_we
  | Some Rock_them, Some Draw -> Some Rock_we
  | Some Rock_them, Some Win -> Some Paper_we
  | Some Paper_them, Some Lose -> Some Rock_we
  | Some Paper_them, Some Draw -> Some Paper_we
  | Some Paper_them, Some Win -> Some Scissors_we
  | Some Scissors_them, Some Lose -> Some Paper_we
  | Some Scissors_them, Some Draw -> Some Scissors_we
  | Some Scissors_them, Some Win -> Some Rock_we
  | _ -> None

let count (them, we) score =
  match (them, we) with
  | Some Rock_them, Some Rock_we -> score + 3 + 1
  | Some Rock_them, Some Paper_we -> score + 6 + 2
  | Some Rock_them, Some Scissors_we -> score + 0 + 3
  | Some Paper_them, Some Rock_we -> score + 0 + 1
  | Some Paper_them, Some Paper_we -> score + 3 + 2
  | Some Paper_them, Some Scissors_we -> score + 6 + 3
  | Some Scissors_them, Some Rock_we -> score + 6 + 1
  | Some Scissors_them, Some Paper_we -> score + 0 + 2
  | Some Scissors_them, Some Scissors_we -> score + 3 + 3
  | _ -> score

let solve_both (them_str, we_str) (score1, score2) =
  let them = parse_them them_str in
  (count (them, parse_we we_str) score1, count (them, solve2 them we_str) score2)

let parse scores input =
  let l = String.split ~on:' ' input in
  match l with
  | [] -> scores
  | [ _ ] -> scores
  | [ them; we ] -> solve_both (them, we) scores
  | _ :: _ :: _ -> scores

let read =
  let file = In_channel.create "ri2.txt" in
  let r1, r2 = List.fold ~init:(0, 0) ~f:parse (In_channel.input_lines file) in
  In_channel.close file;
  (r1, r2)

let () =
  let r1, r2 = read in
  printf "Done: %i, %i\n" r1 r2
