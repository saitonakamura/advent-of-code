{
  (* open Lexing *)
  open Day7parser
  let newline lexbuf = Lexing.new_line lexbuf

  exception SyntaxError of string
}

let white = [' ' '\t']
let dir_file_name = ['a'-'z' 'A'-'Z' '0'-'9' '_' '.']+
let newline = '\r' | '\n' | "\r\n"
let int = ['0'-'9']+

rule read =
  parse
  | white { read lexbuf }
  | newline { newline lexbuf; read lexbuf  }
  | '$' { DOLLAR }
  | "cd" { CD }
  | "ls" { LS }
  | '/' { ROOT }
  | ".." { UP_DIR }
  | "dir" { DIR_WORD }
  | int { INT (int_of_string (Lexing.lexeme lexbuf)) }
  | dir_file_name { STRING (Lexing.lexeme lexbuf) }
  | eof { EOF }
  | _ { raise (SyntaxError ("Unexpected char: " ^ Lexing.lexeme lexbuf)) }
