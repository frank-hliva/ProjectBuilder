import * as React from 'react';

type TPageContentProps = {

}

type TPageContentState = {
    
}

export class PageContent extends React.Component<TPageContentProps, TPageContentState> {
    render() {
        return (
            <div className="container">
                <section className="page-content">
                    <div className="content">
                        {this.props.children}
                    </div>
                </section>
                <hr />
                <footer>
                    <p>&copy; Deep {new Date().getFullYear()}</p>
                </footer>
            </div>
        )
    }
}