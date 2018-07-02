import { Moment } from 'moment';

module DateTime {
    export function unify(dateTime: Moment) {
        return dateTime.format("YYYY-MM-DD HH:mm:ss")
    }
}

export = DateTime;