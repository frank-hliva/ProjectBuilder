export class YoutubeId {
    private videoId: string | null;

    static parse(source: string) {
        let regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        let match = source.match(regExp);
        return new YoutubeId(match && match[2].length == 11 ? match[2] : null)
    }

    constructor(videoId: string | null) {
        this.videoId = videoId;
    }

    isValid() {
        return this.videoId !== null;
    }

    createLink(template) {
        return this.videoId === null ? null : template.replace(new RegExp('{VIDEO_ID}', 'g'), this.videoId);
    }

    toEmbedLink() {
        return this.createLink('https://www.youtube.com/embed/{VIDEO_ID}');
    }

    toThumbnailLink() {
        return this.createLink('http://img.youtube.com/vi/{VIDEO_ID}/maxresdefault.jpg');
    }

    toString() {
        return this.videoId;
    }
}