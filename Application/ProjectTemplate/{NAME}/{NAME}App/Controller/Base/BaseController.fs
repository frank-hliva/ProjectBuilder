namespace {NAME}App

open System
open Deep
open Deep.Mvc

type App = {
    mutable Name : string
    mutable Title : string
    mutable FullTitle : string
    mutable Email : string
    mutable InfoEmail : string
    mutable SupportEmail : string
    mutable DEV_ENV : string
}

type BaseController() =

    let toFullTitle (app : App) =
        String.Join(" - ",
            (seq [app.Title; app.Name])
            |> Seq.filter(fun t -> t <> ""))

    let app = {
        Name = ""
        Title = ""
        FullTitle = ""
        Email = ""
        InfoEmail = ""
        SupportEmail = ""
        DEV_ENV = ""
    }

    member c.Title
        with get() = app.Title
        and set(value) =
            app.Title <- value
            app.FullTitle <- app |> toFullTitle

    member c.Loaded(reply : Reply, appInfoConfig : AppInfoConfig, flashMessages : FlashMessages) = async {
        let appInfo = appInfoConfig.GetAppInfo()
        app.Name <- appInfo.Name
        app.Email <- appInfo.Email
        app.InfoEmail <- appInfo.InfoEmail
        app.SupportEmail <- appInfo.SupportEmail
        app.DEV_ENV <- appInfo.DEV_ENV
        reply.ViewData.["DEV_ENV"] <- appInfo.DEV_ENV
        reply.ViewData.["App"] <- app
        reply.ViewData.["ActualYear"] <- DateTime.Now.Year
        let! falshMessages = flashMessages.GetAll()
        reply.ViewData.["FlashMessages"] <- falshMessages
        c.Title <- "" }