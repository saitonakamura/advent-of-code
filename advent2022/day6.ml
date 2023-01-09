open Base
open Stdio

exception Fail

type 'a fold_window_until_t  =
  | Stop of 'a
  | Continue of 'a

let fold_window4_until ~init ~f ~finish l =
  let rec loop l ac =
    match ac with
    | Stop (v) -> Stop (v)
    | Continue (v) -> ( 
      match l with
      | []
      | [_]
      | [_; _]
      | [_; _; _] -> ac
      | [x1; x2; x3; x4] -> f v (x1, x2, x3, x4)
      | x1 :: x2 :: x3 :: x4 :: tl ->
        loop (x2 :: x3 :: x4 :: tl) (f v (x1, x2, x3, x4))
    )
  in
  match loop l (Continue (init)) with
    | Continue (v) -> finish v
    | Stop (v) -> v
;;

let fold_window14_until ~init ~f ~finish l =
  let rec loop l ac =
    match ac with
    | Stop (v) -> Stop (v)
    | Continue (v) -> (
      match l with
      | [] -> Stop (v)
      | _ :: tl ->
        let length = List.length l in
        if length > 14 then
          let (lc14, _) = List.split_n l 14 in
          loop tl (f v lc14)
        else if length = 14 then
          f v l
        else
          Stop (v)
    )
  in
  match loop l (Continue (init)) with
    | Continue (v) -> finish v
    | Stop (v) -> v
;;

let char_different4 c1 c2 c3 c4 =
  let open Char in
  not (equal c1 c2)
  && not (equal c1 c3) 
  && not (equal c1 c4) 
  && not (equal c2 c3) 
  && not (equal c2 c4) 
  && not (equal c3 c4)

let chars_different lc =
  let set = Hash_set.of_list (module Char) lc in
  Hash_set.length set = List.length lc

let fold _ line =
  let r1 = String.to_list line |>
    fold_window4_until ~init:4 ~finish:(fun _ -> 0)
    ~f:(fun r1 (c1, c2, c3, c4) ->
      if char_different4 c1 c2 c3 c4 then
        Stop (r1)
      else
        Continue (r1 + 1)
    ) in
  let r2 = String.to_list line |>
    fold_window14_until ~init:14 ~finish:(fun _ -> 0)
    ~f:(fun r2 lc ->
      if chars_different lc then
        Stop (r2)
      else
        Continue (r2 + 1)
    ) in
  (r1, r2)

let parse channel =
  let (r1, r2) = In_channel.fold_lines ~init:(0, 0) ~f:fold channel in
  (r1, r2)

let read =
  let filename = (Sys.get_argv ()).(1) in
  let file = In_channel.create filename in
  let (r1, r2) = parse file in
  In_channel.close file;
  (r1, r2)

let () =
  let (r1, r2) = read in
  printf "Done: %i, %i\n" r1 r2