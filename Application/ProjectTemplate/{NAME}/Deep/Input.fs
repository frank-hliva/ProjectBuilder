﻿namespace Deep

open System.IO
open System.Text
open System.Web

type Get(request : Request) =
    member f.Request = request
    member f.Fields with get() = request.QueryString
    member f.Item with get(name : string) = request.QueryString.[name]

type Post(request : Request) =
    let nameValueCollection =
        use reader = new StreamReader(request.InputStream)
        let input = reader.ReadToEnd()
        HttpUtility.ParseQueryString(input)
    member f.Request = request
    member f.Fields with get() = nameValueCollection
    member f.Item with get(name : string) = nameValueCollection.[name]


type MultipartForm(request : Request) =
    let stream = request.InputStream
    let mutable isDisposed = false
    let form = new Deep.Multipart.MultipartForm(stream)

    interface IAutoDisposable with
        member f.IsDisposed with get() = isDisposed
        member f.Dispose() =
            stream.Dispose()
            isDisposed <- true

    member f.Request = request

    member f.Fields = form.Fields
    member f.Item with get(index : int) = form.Item(index)
    member f.Item with get(name : string) = form.Item(name)