import * as React from "react";
import * as ReactDOM from "react-dom";

import * as Guid from "../Lib/Guid";
import { Header } from "./Webparts/Header";
import { Main } from "./Webparts/Main";

type TApplicationProps = {
    page: string;
    model: any;
}

type TApplicationState = {
    
}

export class Application extends React.Component<TApplicationProps, TApplicationState> {

    handleResize = () => {
        this.setState({ Guid: Guid.newGuid() });
    }

    componentDidMount() {
        this.state = { Guid: Guid.newGuid() };
        window.addEventListener("resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    renderPage(page: string) {
        switch (page) {
            case "page": {
                return (
                    <div dangerouslySetInnerHTML={{ __html: this.props.model }} />
                );
            }
        }
    }

    render() {
        return (
            <div className="Application">
                <Header />
                <Main {...this.props}>{this.renderPage(this.props.page)}</Main>
            </div>
        )
    }
}