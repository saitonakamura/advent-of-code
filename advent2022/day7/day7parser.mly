%token <int> INT
%token <string> STRING
%token NEWLINE
%token DOLLAR
%token CD
%token LS
%token ROOT
%token UP_DIR
%token DIR_WORD
%token EOF

%start <Day7ast.value option> prog
%%

prog:
  | EOF { None }
  | v = value { Some v }
  ;

value:
  | DOLLAR; CD; ROOT
    { `CdRootCommand }
  | DOLLAR; CD; path = STRING
    { `CdToCommand path }
  | DOLLAR; CD; UP_DIR
    { `CdUpCommand }
  | DOLLAR; LS; results = ls_results; NEWLINE
    { `LsCommand results }
  ;

ls_results:
  results = separated_list(NEWLINE, output)
    { results }
  ;

output:
  | DIR_WORD; name = STRING
    { `OutputDir name }
  | size = INT; name = STRING
    { `OutputFile (name, size) }
  ;
