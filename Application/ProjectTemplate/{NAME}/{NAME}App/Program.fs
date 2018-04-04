module {NAME}App.Application

open Deep
open Deep.Routing
open System

[<EntryPoint>]
let main argv =
    let booter = new ApplicationBooter<HttpApplication>(new Kernel())
    booter.Config(config)
    booter.Boot()
    Console.WriteLine("Server running...")
    Console.ReadKey() |> ignore
    0