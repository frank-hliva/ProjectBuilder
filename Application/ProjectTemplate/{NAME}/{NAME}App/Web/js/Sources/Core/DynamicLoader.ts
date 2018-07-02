import * as Immutable from "immutable";

export type TLoaded = () => void;

export class DynamicLoader {
    private cssPaths: Immutable.Set<string>;
    private jsPaths: Immutable.Set<string>;

    constructor() {
        this.cssPaths = Immutable.Set<string>();
        this.jsPaths = Immutable.Set<string>();
    }

    get css() { return this.cssPaths; }
    get js() { return this.jsPaths; }

    protected registerLoadedCallback(element: HTMLLinkElement | HTMLScriptElement, afterLoad: TLoaded, loaded?: TLoaded) {
        function complete() {
            afterLoad();
            if (loaded) loaded();
        }
        if (element.addEventListener) {
            element.addEventListener("load", complete, false);
        } else if ((element as any).readyState) {
            (element as any).onreadystatechange = function () {
                if (this.readyState == 'complete') complete();
            };
        }
    }

    addCSS(path: string, loaded?: TLoaded) {
        const
            body = document.getElementsByTagName("body")[0],
            element = document.createElement("link");
        element.setAttribute("rel", "stylesheet");
        element.setAttribute("type", "text/css");
        element.setAttribute("href", path);
        this.registerLoadedCallback(element,
            () => this.cssPaths = this.css.add(path), loaded);
        body.appendChild(element);
    }

    addCSSOnce(path: string, loaded?: TLoaded) {
        if (!this.css.contains(path)) {
            this.addCSS(path, loaded);
        } else if (loaded) { 
            loaded();
        }
    }

    addJS(path: string, loaded?: TLoaded) {
        const
            body = document.getElementsByTagName("body")[0],
            element = document.createElement("script");
        element.setAttribute("type", "text/javascript");
        element.setAttribute("src", path);
        this.registerLoadedCallback(element,
            () => this.jsPaths = this.js.add(path), loaded);
        body.appendChild(element);
    }

    addJSOnce(path: string, loaded?: TLoaded) {
        if (!this.js.contains(path)) {
            this.addJS(path, loaded);
        } else if (loaded) {
            loaded();
        }
    }
}

export default new DynamicLoader();