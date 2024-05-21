import React, { Component } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";
import zh_CN from "antd/es/locale-provider/zh_CN";
import moment from "moment";
import "moment/locale/zh-cn";

import store from "./utils/storeUtils";
import reduxStore from "./redux";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Admin from "./pages/admin/admin";
import Loading from "./components/loading";

moment.locale("zh-cn");

class ErrorBoundary extends Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        console.error(error);
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return <Loading />;
        }
        return this.props.children;
    }
}

class App extends Component {
    render() {
        const user = store.get("user_key");
        store.user = user;

        return (
            <Provider store={reduxStore}>
                <ConfigProvider locale={zh_CN}>
                    <BrowserRouter>
                        <ErrorBoundary>
                            <Switch>
                                <Route exact path={"/login"} component={Login} />
                                <Route exact path={"/register"} component={Register} />
                                <Route path={"/"} component={Admin} />
                            </Switch>
                        </ErrorBoundary>
                    </BrowserRouter>
                </ConfigProvider>
            </Provider>
        );
    }
}

export default App;
