import React, { Component, Suspense } from "react";
import { Redirect, Switch } from "react-router-dom";
import { BackTop, Layout } from "antd";
import { connect } from "react-redux";
import Loadable from "react-loadable";
import HeaderSelf from "../../components/header";
import LeftNav from "../../components/left-nav";
import FooterComponent from "../../components/footer";
import Loading from "../../components/loading";
import AuthRouter from "../../components/AuthRouter";
import NotFoundPage from "../../components/404";
import { TabBar } from 'antd-mobile'; // 导入 TabBar 组件
import { NavLink } from "react-router-dom"; // 导入 NavLink

// 导入页面组件
import HomePage from '../MainPage/HomePage'; // 请根据实际路径调整
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

const Home = Loadable({
    loader: () => import("../home/home"),
    loading: Loading
});

const Category = Loadable({
    loader: () => import("../category/category"),
    loading: Loading
});

const Role = Loadable({
    loader: () => import("../role/role"),
    loading: Loading
});

const User = Loadable({
    loader: () => import("../user/user"),
    loading: Loading
});

const Product = Loadable({
    loader: () => import("../product"),
    loading: Loading
});

const GitHub = Loadable({
    loader: () => import("../github"),
    loading: Loading
});

const { Footer, Sider, Content } = Layout;

class Admin extends Component {
    state = {
        collapsed: false,
        selectedTab: 'home'
    };

    onCollapse = collapsed => {
        this.setState({ collapsed });
    };

    renderTabBarItem(title, key, icon, selectedIcon, path) {
        return (
            <TabBar.Item
                title={title}
                key={key}
                icon={<div style={{
                    width: '22px',
                    height: '22px',
                    background: `url(${icon}) center center / 21px 21px no-repeat` }} />}
                selectedIcon={<div style={{
                    width: '22px',
                    height: '22px',
                    background: `url(${selectedIcon}) center center / 21px 21px no-repeat` }} />}
                selected={this.state.selectedTab === key}
                onPress={() => {
                    this.setState({
                        selectedTab: key,
                    });
                    this.props.history.push(path);
                }}
            />
        );
    }

    render() {
        const { userInfo } = this.props;
        if (!userInfo._id) {
            return <Redirect to="/login" />;
        }
        return (
            <Layout style={{ minHeight: "100%" }}>
                <Sider
                    style={{ zIndex: 2 }}
                    collapsible
                    collapsed={this.state.collapsed}
                    onCollapse={this.onCollapse}
                >
                    <LeftNav collapsed={this.state.collapsed} />
                </Sider>
                <Layout>
                    <HeaderSelf />
                    <Content style={{ margin: "100px 14px 14px", background: "#fff" }}>
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
                                {/*<AuthRouter path="/mainpage/my/address" component={AddressPage} />*/}
                                <AuthRouter path="/footprint" component={FootprintPage} />
                                {/*<AuthRouter path="/mainpage/my/reviews" component={ReviewsPage} />*/}

                                <AuthRouter path="/home" component={Home} />
                                <AuthRouter path="/category" component={Category} />
                                <AuthRouter path="/product" component={Product} />
                                <AuthRouter path="/role" component={Role} />
                                <AuthRouter path="/user" component={User} />
                                <AuthRouter path="/github" component={GitHub} />
                                <AuthRouter component={NotFoundPage} />
                            </Switch>
                        </Suspense>
                    </Content>
                    <TabBar>
                        {this.renderTabBarItem('首页', 'home', 'home-icon-url', 'home-selected-icon-url', '/mainpage/home')}
                        {this.renderTabBarItem('分类', 'category', 'category-icon-url', 'category-selected-icon-url', '/mainpage/category')}
                        {this.renderTabBarItem('购物车', 'cart', 'cart-icon-url', 'cart-selected-icon-url', '/mainpage/cart')}
                        {this.renderTabBarItem('我的', 'my', 'my-icon-url', 'my-selected-icon-url', '/mainpage/my')}
                    </TabBar>
                    <Footer style={{ textAlign: "center", background: "#fff" }}>
                        <FooterComponent />
                    </Footer>
                </Layout>
                <BackTop visibilityHeight={100} />
            </Layout>
        );
    }
}

const mapStateToProps = state => ({
    userInfo: state.loginUserInfo
});

export default connect(mapStateToProps, null)(Admin);
