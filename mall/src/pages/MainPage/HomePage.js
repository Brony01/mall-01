import React from 'react';
import {
    Carousel, Input, Card, List, Button,
} from 'antd';
import {withRouter} from 'react-router-dom';
import specialIcon from './icons/special.png';
import eventIcon from './icons/special.png';
import discountIcon from './icons/special.png';
import promotionIcon from './icons/special.png';
import {Tabs} from "antd";
import {Space} from "antd-mobile";

const {Search} = Input;
const { TabPane } = Tabs;

const hotItems = [
    {title: '小米12 Pro', price: '¥2999'},
    {title: 'Redmi K50', price: '¥2099'},
];

const HomePage = ({history}) => {
    const handleSearch = (value) => {
        history.push({
            pathname: '/mainpage/products',
            state: {searchText: value},
        });
    };

    return (
        <div>
            <Space direction='vertical'  style={{ width: '100%' }}>
                <Search placeholder="请输入商品名称 如: 手机" onSearch={handleSearch} enterButton/>
                <Carousel autoplay>
                    <div><img src="https://res.vmallres.com/uomcdn/CN/cms/202405/ee061dafcb20437aa6e58e174e235c2c.jpg"
                              alt="HUAWEI Pura70系列"/></div>
                    <div><img src="https://res.vmallres.com/uomcdn/CN/cms/2024-05/5495c7a8405d47998f9804521dd500f8.jpg"
                              alt="华为Vision智慧屏4"/></div>
                    <div><img src="https://res.vmallres.com/uomcdn/CN/cms/2024-05/f1a956d19f5c44a7ab1f2a23db1eeae0.jpg"
                              alt="HUAWEI MateBook X Pro"/></div>
                </Carousel>
                <Tabs defaultActiveKey="1" centered>
                    <TabPane tab="专题" key="1">
                        {/*<div>Content of 专题</div>*/}
                    </TabPane>
                    <TabPane tab="活动" key="2">
                        {/*<div>Content of 活动</div>*/}
                    </TabPane>
                    <TabPane tab="优惠" key="3">
                        {/*<div>Content of 优惠</div>*/}
                    </TabPane>
                    <TabPane tab="特惠" key="4">
                        {/*<div>Content of 特惠</div>*/}
                    </TabPane>
                </Tabs>
                <Card title="品牌制造商直供">
                    <List
                        grid={{gutter: 16, column: 2}}
                        dataSource={hotItems}
                        renderItem={(item) => (
                            <List.Item>
                                <Card title={item.title}>{item.price}</Card>
                            </List.Item>
                        )}
                    />
                </Card>
            </Space>





        </div>
    );
};

export default withRouter(HomePage);
