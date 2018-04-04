import * as Cookie from 'js-cookie';
import sk from '../Lang/sk';
import en from '../Lang/en';
import * as Text from '../Lib/Text'

export module Lang {
    export function inflectionSuffix(count: number) {
        if (count === 1) return '_SINGULAR';
        else if (count >= 2 && count <= 4) return '_PLURAL_2_4';
        else return '_PLURAL';
    }
}

export class LangManager {
    private _lang: string;
    private _transitions: {};

    constructor() {
        this._lang = Cookie.get('Lang') || 'sk';
        this._transitions = { sk, en };
    }

    get lang() { return this._lang; }

    set lang(value: string) {
        this._lang = value;
        Cookie.set('Lang', value, { expires: 365, path: '/' });
    }

    get value() { return this._transitions[this.lang]; }

    get(key: string) {
        return this.value[key] === undefined
            ? ""
            : this.value[key];
    }
    
    getUcf(key: string) { return Text.ucfirst(this.get(key)); }
}

export default new LangManager();