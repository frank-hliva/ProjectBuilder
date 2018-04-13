export class FileDropper {
    public fileUploaded: ((data: any) => void) | null = null;

    static containsFiles(event: React.DragEvent<HTMLElement>) {
        return !!(
            event.dataTransfer &&
            event.dataTransfer.files &&
            event.dataTransfer.files.length
        );
    }

    constructor(
        readonly event: React.DragEvent<HTMLElement>,
        readonly url: string,
        readonly data?: { [key: string]: any; }
    ) {}

    uploadFiles() {
        for (let file of this.event.dataTransfer.files as {} as File[]) {
            let reader = new FileReader();
            reader.addEventListener("load", (event: any) => {
                if (event.target.readyState == (FileReader as any).DONE) {
                    const result = event.target.result;
                    let req = new XMLHttpRequest();
                    req.open('POST', this.url, true);
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
                    formData.append('data', result);
                    if (this.data) {
                        for (let k in this.data) {
                            formData.append(k, this.data[k]);
                        }
                    }
                    req.send(formData);
                }
            }, false);
            reader.readAsDataURL(file);
        }
    }
}