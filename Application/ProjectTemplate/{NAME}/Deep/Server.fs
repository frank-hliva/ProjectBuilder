module Deep.Server

open System
open System.Net
open System.Threading

let listen uriPrefix action =
    let listener = new HttpListener()
    listener.IgnoreWriteExceptions <- true
    listener.Prefixes.Add(uriPrefix)
    listener.Start()
    let rec loop () = async {
        let! context = Async.FromBeginEnd(listener.BeginGetContext, listener.EndGetContext)
        async { 
            let! result = Async.Catch(action context)
            match result with
            | Choice.Choice1Of2 _ -> ()
            | Choice.Choice2Of2 exn -> ()
        } |> Async.Start
        do! loop ()
    }
    loop () |> Async.Start