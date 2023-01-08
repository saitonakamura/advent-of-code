%token SPACE
%token <char> BOX 
%token EMPTY_LINE
%token <int> STACK_NUMBER
%token <string * int> OPERATION

%start <Day5menhir.value option> prog
%%

prog:
  | EOF { None }
  | v = value { Some v }
  ;