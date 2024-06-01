import React, { Component, Suspense } from "react";
import { Redirect, Switch, Route } from "react-router-dom";
import { BackTop, Layout } from "antd";
import { connect } from "react-redux";
import HeaderSelf from "../../components/header";
import BottomNav from "../../components/bottom-nav";
import FooterComponent from "../../components/footer";
import Loading from "../../components/loading";
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
                            <Route path="/mainpage/home" component={HomePage} />
                            <Route path="/mainpage/category" component={CategoryPage} />
                            <Route path="/mainpage/cart" component={CartPage} />
                            <Route path="/mainpage/my" component={MyPage} />
                            <Route path="/mainpage/products" component={ProductListPage} />
                            <Route path="/mainpage/product/detail" component={ProductDetailPage} />
                            <Route path="/checkout" component={CheckoutPage} />
                            <Route path="/order" component={OrderPage} />
                            <Route path="/order-confirmed" component={OrderConfirmedPage} />
                            <Route path="/order-details" component={OrderDetailsPage} />
                            <Route path="/favorite" component={FavoritePage} />
                            <Route path="/footprint" component={FootprintPage} />
                            <Route component={NotFoundPage} />
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
