namespace {NAME}App

open Deep
open Deep.Collections
open System
open System.Web
open System.Linq
open System.Text
open Model
open System.IO

type HomeController
    (
        request : Request,
        reply : Reply
    ) =
    inherit FrontendController()

    member c.Index() =
        let timestamp = DateTime.Now
        reply.View(["Timestamp" => timestamp.Ticks]);

    member c.Default() =
        reply.View
            ([
                "Welcome" => "Hello world"
                "Now" => DateTime.Now.ToString()
            ]);

    member c.Model() = async {
        let db = new Db();
        reply.ContentType <- "application/x-javascript"
        let json = [||] |> JSON.stringify
        reply |> Reply.printfn "var Tree = %s;" json
        |> ignore
    }