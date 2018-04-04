import * as React from 'react';
import { Footer } from './Footer';

type TMainProps = {

}

type TMainState = {
    
}

export class Main extends React.Component<TMainProps, TMainState> {
    render() {
        return (
            <main className="container">
                <section className="page-content">
                    <div className="content">
                        {this.props.children}
                    </div>
                </section>
                <hr />
                <Footer />
            </main>
        )
    }
}