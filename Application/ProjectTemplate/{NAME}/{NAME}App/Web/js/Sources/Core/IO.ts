import * as $ from 'jquery';

module IO {
    export function ANY(method: string, url: string, options: {} = {}) {
        return new Promise((resolve, reject) => {
            $.ajax({
                ...{
                    type: method,
                    url,
                    success: resolve,
                    error: reject,
                    dataType: "JSON"
                },
                ...options
            });
        });
    }
    export function GET(url, options = {}) { return ANY("GET", url, options); }
    export function POST(url, options = {}) { return ANY("POST", url, options); }
    export function PUT(url, options = {}) { return ANY("PUT", url, options); }
    export function DELETE(url, options = {}) { return ANY("DELETE", url, options); }

    export module Text {
        export function GET(url, options = {}) { return IO.GET(url, { dataType: "text", ...options }); }
        export function POST(url, options = {}) { return IO.POST(url, { dataType: "text", ...options }); }
        export function PUT(url, options = {}) { return IO.PUT(url, { dataType: "text", ...options }); }
        export function DELETE(url, options = {}) { return IO.DELETE(url, { dataType: "text", ...options }); }
    }
}

export = IO;