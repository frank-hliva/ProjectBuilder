namespace {NAME}App

open System.IO
open Deep
open Deep.IO

type Paths(rootDir : string) =
    let imgDir = Path.Combine(rootDir, "img")
    let imgUploadDir = Path.Combine(imgDir, "upload")

    member d.RootDir = rootDir
    member d.ImgDir = imgDir
    member d.ImgUploadDir = imgUploadDir

    member d.GetFullPath(path) =
        Path.join [ rootDir; path ]

    member d.GetImgUploadPath(mediaName : string) =
        Path.Combine(imgUploadDir, mediaName)

    new (staticContent : StaticContentConfig) =
        let rootDir = staticContent.GetOptions().Directory
        Paths(rootDir)