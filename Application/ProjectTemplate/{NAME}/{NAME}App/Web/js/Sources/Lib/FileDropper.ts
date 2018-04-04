export class FileDropper {
    private _event: any;
    private _uploader: any;
    private _data: any;

    public fileUploaded: ((data: any) => void) | null = null;

    constructor(event, uploader, data) {
        this._event = event;
        this._uploader = uploader;
        this._data = data;
    }

    get event() { return this._event; }
    get uploader() { return this._uploader; }
    get data() { return this._data; }

    extractFileExt(url) {
        return url.substring(url.indexOf('/') + 1, url.indexOf(';'));
    }

    extractData(url) {
        return url.substring(url.indexOf(',') + 1);
    }

    uploadFiles() {
        for (let file of this.event.dataTransfer.files) {
            let reader = new FileReader();
            reader.addEventListener("load", (event: any) => {
                if (event.target.readyState == (FileReader as any).DONE) {
                    const result = event.target.result;
                    let req = new XMLHttpRequest();
                    req.open('POST', this.uploader, true);
                    req.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                    req.responseType = 'text';
                    req.addEventListener("load", (event) => {
                        if (req.status == 200) {
                            if (this.fileUploaded) {
                                this.fileUploaded(JSON.parse(req.responseText));
                            }
                        }
                        else {
                            throw "Invalid upload";
                        }
                    });
                    let formData = new FormData()
                    formData.append('data', this.extractData(result));
                    formData.append('ext', this.extractFileExt(result));
                    if (this.data) {
                        for (let k in this.data) formData.append(k, this.data[k]);
                    }
                    req.send(formData);
                }
            }, false);
            reader.readAsDataURL(file);
        }
    }
}