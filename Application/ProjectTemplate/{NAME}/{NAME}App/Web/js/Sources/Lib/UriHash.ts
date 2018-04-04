module UriHash {

    export type ListenerAction = (uriHash: string) => void;

    export function get() {
        const hash = window.location.hash;
        return hash.startsWith('#') ? hash.substring(1) : hash;
    }
    
    export function listen(action: ListenerAction, defaultPage = true) {
        const hashChange = () => action(get());
        window.addEventListener("hashchange", hashChange);
        if (defaultPage) hashChange();
    }
    
}


export = UriHash;