namespace BuilderLib

type BuilderOptions =
    {
        templatePath : string
        targetPath : string
        values: Map<string, string>
    }

module ProjectBuilder =

    open System
    open System.IO
    open System.Text

    let replaceAll (values: Map<string, string>) (text : string) =
        values
        |> Map.toSeq
        |> Seq.fold
            (fun (acc : StringBuilder) (key, value) ->
                acc.Replace(sprintf "{%s}" key, value))
            (new StringBuilder(text))
        |> fun result -> result.ToString()

    let isTemplateFile (path : string) =
        path
        |> Path.GetExtension
        |> fun ext -> ext.ToLower()
        |> function
        | ".fs" | ".fsx" | ".cs"
        | ".sln" | ".fsproj" | ".csproj"
        | ".config" | ".json" | ".txt" | ".xml" | ".xaml"
        | ".js" | ".ts" | ".tsx" | ".css" | ".styl" -> true
        | _ -> false

    let copyTemplateFile (dst : string) (values: Map<string, string>) (src : string) =
        src
        |> File.ReadAllText
        |> replaceAll values
        |> fun result -> File.WriteAllText(dst, result)

    let build (options : BuilderOptions) =
        options.templatePath
        |> fun path ->
            Directory.EnumerateFiles(path, "*.*", SearchOption.AllDirectories)
        |> Seq.iter
            (fun srcPath ->
                let path = srcPath.[options.templatePath.Length + 1..] |> replaceAll options.values
                let targetPath = Path.Combine(options.targetPath, path)
                let targetDir = targetPath |> Path.GetDirectoryName
                if targetDir |> Directory.Exists |> not
                then Directory.CreateDirectory(targetDir) |> ignore
                if path |> isTemplateFile
                then srcPath |> copyTemplateFile targetPath options.values
                else File.Copy(srcPath, targetPath, true))