import React, { Component } from 'react';
import { Card, Col, Row } from 'antd';
import LinkA from 'components/link-a';

export default class extends Component {
    state = {};

    render() {
        return (
            <div style={{ padding: '30px' }}>
                <Row gutter={16}>
                    <Col span={24}>
                        <Card title="我的GitHub主页" hoverable={true}>
                            <p>点击下方链接查看我的GitHub主页：</p>
                            <LinkA
                                props={this.props}
                                params={{
                                    href: 'https://github.com/Brony01',
                                    target: '_black',
                                    text: 'Brony01的GitHub主页'
                                }}
                            />
                        </Card>
                    </Col>
                </Row>
            </div>
        );
    }
}
