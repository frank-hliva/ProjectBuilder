import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import Store from './Model/Store';
import * as UriHash from './Lib/UriHash';
import { Router } from './Core/Router';
import { Application } from './Containers/Application';
import messenger from './App/Messenger';
import lang from './Core/LangManager'

async function changePage(page, loading = true) {
    return (dispatch, getState) => {
        if (loading && page.indexOf('/share/') !== 0) dispatch({ type: "LOADING" });
        let router = new Router();
        router.add("/:page", async params =>
            dispatch({
                type: "CHANGE_PAGE",
                page: params['page']
            })
        );
        router.add("", async (params) =>
            dispatch({
                type: "CHANGE_PAGE",
                page: "index"
            })
        );
        let result = router.match(page);
        if (result === null) {
            messenger.error(lang.value.INVALID_URL_ADDRESS);
        }
        else {
            const { handler, params } = result;
            handler(params);
        }
    }
}

UriHash.listen(async uri => Store.dispatch(await changePage(uri) as any));

module Mappers {
    export function mapStateToProps(state) {
        return { ...state };
    }

    export function mapDispatchToProps() {
        return {
        }
    }
}

const App = connect(
    Mappers.mapStateToProps,
    Mappers.mapDispatchToProps,
    null, { pure: false }
)(Application);

ReactDOM.render(
    <Provider store={Store}>
        <App />
    </Provider>,
    document.getElementById("Application")
);