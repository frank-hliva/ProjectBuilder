import * as React from 'react';
import * as moment from 'moment';

type TFooterProps = {

}

type TFooterState = {
    
}

export class Footer extends React.Component<TFooterProps, TFooterState> {
    render() {
        return (
            <footer>
                <p>&copy; Deep {moment().format("YYYY")}</p>
            </footer>
        )
    }
}