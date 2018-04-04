namespace {NAME}App

open Deep
open System
open System.Web

module private Tokenizer =

    open System

    type Token =
    | Text of string
    | LineEnd
    | Delimiter
    | Link of string * string

    let (|StartsWith|_|) (pattern : string) (input : char seq) =
        let input = input |> String.Concat
        if input.StartsWith(pattern) then 
            Some(pattern, input.[pattern.Length..])
        else None

    let (|StartsWithAny|_|) (patterns : string list) (input : char seq) =
        patterns
        |> List.tryPick
            (fun pattern ->
                match input with
                | StartsWith pattern (h, t) -> Some(pattern, t)
                | _ -> None)

    let toString : char list -> _ =
        List.rev >> String.Concat

    let toText = toString >> Text

    let tokenize (links : bool) (input : string) : Token list =
        let rec lineEnd count = function
        | '\n' :: t -> t |> lineEnd (count + 1)
        | t -> count, t
        and link acc = function
        | [] -> acc, []
        | ((ws :: _) as t) when Char.IsWhiteSpace(ws) -> acc, t
        | h :: t -> t |> link (h :: acc)
        and tokenize acc text = function
        | [] -> 
            match text with
            | [] -> acc
            | text -> (text |> toText) :: acc
        | StartsWithAny ["http://"; "https://"; "ftp://"; "www."] (scheme, t) when links ->
            let lnk, t = t |> List.ofSeq |> link []
            t |> tokenize (Link(scheme, lnk |> toString) :: (text |> toText) :: acc) []
        | '\n' :: t ->
            let count, t = t |> lineEnd 1
            match count with
            | 1 -> t |> tokenize (LineEnd :: (text |> toText) :: acc) []
            | _ -> t |> tokenize (Delimiter :: (text |> toText) :: acc) []
        | h :: t -> t |> tokenize acc (h :: text)
        input.Replace("\r\n", "\n").Replace('\r', '\n')
        |> List.ofSeq |> tokenize [] [] |> List.rev

module private Parser =

    open Tokenizer

    type Element =
    | Paragraph of Element list
    | Text of string
    | Link of string * string
    | LineEnd

    let parse (tokens : Token list) =
        let rec paragraph (acc : Element list) = function
        | [] -> acc, []
        | Token.Delimiter :: t -> acc, t
        | Token.LineEnd :: t -> t |> paragraph (Element.LineEnd :: acc)
        | Token.Link (scheme, link) :: t -> t |> paragraph (Element.Link(scheme, link) :: acc)
        | Token.Text text :: t -> t |> paragraph ((Element.Text text) :: acc)
        let rec parse (acc : Element list) = function
        | [] -> acc
        | t ->
            let p, t = t |> paragraph []
            t |> parse ((Paragraph (p |> List.rev)) :: acc)
        tokens |> parse [] |> List.rev

open System.Text
open Parser

type TextFormatterOptions = {
    ParseLinks : bool
    LinkMaxLength : int
}

type TextFormatterConfig(config : Config) =
    interface IConfigSection
    member c.GetTextFormatterOptions() = config.SelectAs<TextFormatterOptions>("TextFormatter")

type TextFormatter(options : TextFormatterOptions) =

    let generate (elements : Element list) =
        let rec generate (acc : StringBuilder) = function
        | [] -> acc
        | Text text :: t -> t |> generate (acc.Append text)
        | Link (scheme, link) :: t ->
            let scheme, link =
                if scheme = "www." then "http://", (sprintf "www.%s" link)
                else scheme, link
            let text =
                match options.LinkMaxLength with
                | -1 | 0 -> link
                | _ -> link.Turncate(options.LinkMaxLength, "&hellip;")
            t |> generate (acc.Append(sprintf "<a href='%s%s' rel='nofollow' target='_blank'>%s</a>" scheme link text))
        | LineEnd :: t -> t |> generate (acc.Append "<br>")
        | Paragraph paragraph :: t ->
            let p = paragraph |> generate (new StringBuilder())
            t |> generate (acc.AppendFormat("<p>{0}</p>", p))
        let builder = new StringBuilder()
        (elements |> generate builder).ToString()

    member c.Format(text : string, htmlEntitiesEncode : bool) =
        text
        |> fun text -> if htmlEntitiesEncode then text |> HttpUtility.HtmlEncode else text
        |> Tokenizer.tokenize options.ParseLinks
        |> Parser.parse
        |> generate

    new(config : TextFormatterConfig) =
        TextFormatter(config.GetTextFormatterOptions())
        