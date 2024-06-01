import React, { Component, Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { BackTop, Layout } from "antd";
import { connect } from "react-redux";
import Loadable from "react-loadable";
import HeaderSelf from "../../components/header";
import BottomNav from "../../components/bottom-nav"; // 修改导入的组件
import FooterComponent from "../../components/footer";
import Loading from "../../components/loading";
import AuthRouter from "../../components/AuthRouter";
import NotFoundPage from "../../components/404";

// 导入页面组件
import HomePage from '../MainPage/HomePage';
import CategoryPage from '../MainPage/CategoryPage';
import CartPage from '../MainPage/CartPage';
import MyPage from '../MainPage/MyPage';
import ProductListPage from '../purchase/ProductListPage';
import ProductDetailPage from '../purchase/ProductDetailPage';
import CheckoutPage from '../purchase/CheckoutPage';
import OrderConfirmedPage from '../purchase/OrderConfirmedPage';
import OrderPage from '../purchase/OrderPage';
import OrderDetailsPage from '../purchase/OrderDetailsPage';
import FavoritePage from "../purchase/FavoritePage";
import FootprintPage from "../purchase/FootprintPage";

const { Footer, Content } = Layout;

class Admin extends Component {
    state = {
        collapsed: false,
    };

    render() {
        const { userInfo } = this.props;
        if (!userInfo._id) {
            return <Redirect to="/login" />;
        }
        return (
            <Layout style={{ minHeight: "100%" }}>
                <HeaderSelf />
                <Content style={{ margin: "100px 14px 14px", background: "#fff", paddingBottom: "70px" }}>
                    <Suspense fallback={<Loading />}>
                        <Switch>
                            <AuthRouter path="/mainpage/home" component={HomePage} />
                            <AuthRouter path="/mainpage/category" component={CategoryPage} />
                            <AuthRouter path="/mainpage/cart" component={CartPage} />
                            <AuthRouter path="/mainpage/my" component={MyPage} />
                            <AuthRouter path="/mainpage/products" component={ProductListPage} />
                            <AuthRouter path="/mainpage/product/detail" component={ProductDetailPage} />
                            <AuthRouter path="/checkout" component={CheckoutPage} />
                            <AuthRouter path="/order" component={OrderPage} />
                            <AuthRouter path="/order-confirmed" component={OrderConfirmedPage} />
                            <AuthRouter path="/order-details" component={OrderDetailsPage} />
                            <AuthRouter path="/favorite" component={FavoritePage} />
                            <AuthRouter path="/footprint" component={FootprintPage} />
                            <AuthRouter component={NotFoundPage} />
                        </Switch>
                    </Suspense>
                </Content>
                <Footer style={{ textAlign: "center", background: "#fff" }}>
                    <FooterComponent />
                </Footer>
                <BottomNav />
                <BackTop visibilityHeight={100} />
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.loginUserInfo
});

export default connect(mapStateToProps, null)(Admin);
