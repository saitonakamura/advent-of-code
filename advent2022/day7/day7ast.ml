type value =
  [ `CdRootCommand
  | `CdToCommand of string
  | `CdUpCommand
  | `LsCommand
  | `OutputFile of string * int
  | `OutputDir of string ]

let value_to_string v =
  match v with
  | `CdRootCommand -> "CdRootCommand"
  | `CdToCommand s -> "CdToCommand " ^ s
  | `CdUpCommand -> "CdUpCommand"
  | `LsCommand -> "LsCommand"
  | `OutputFile (n, s) -> "OutputFile " ^ n ^ " " ^ string_of_int s
  | `OutputDir s -> "OutpuDir " ^ s

let output_value chan v = output_string chan (value_to_string v)
