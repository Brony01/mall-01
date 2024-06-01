import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Icon, List, Radio, Typography } from 'antd';
import EchartsReact from 'echarts-for-react'; // 引入EchartsReact组件
import * as echarts from 'echarts'; // 引入echarts库

const { Text } = Typography;
const listStyle = { fontSize: 15, marginRight: '1rem' };

class ProductDetail extends Component {
    state = {
        chartType: 'bar' // 默认图表类型为柱状图
    }

    constructor() {
        super();
        this.title = (
            <Icon type="arrow-left" onClick={this.goBack} style={{ fontSize: 20 }} />
        );
    }

    handleChartTypeChange = e => {
        this.setState({ chartType: e.target.value });
    }

    goBack = (e) => {
        this.props.history.goBack();
    }

    getOption = () => {
        const data = this.props.location.state;
        const { chartType } = this.state;

        const commonOptions = {
            title: {
                text: '产品数据'
            },
            tooltip: {
                position: 'right' // 设置提示框的位置
            },
            legend: {
                data: ['访问量', '收藏量', '成交量'],
                right: 0, // 设置图例的右边距
                bottom: 0 // 设置图例的下边距
            },
        };

        if (chartType === 'bar') {
            return {
                ...commonOptions,
                xAxis: {
                    data: ["访问量", "收藏量", "成交量"]
                },
                yAxis: {},
                series: [{
                    name: '数量',
                    type: 'bar',
                    data: [data.visitCount, data.favoriteCount, data.orderCount]
                }],
                color: ['#ff7f50', '#87cefa', '#ece05a']
            };
        } else if (chartType === 'pie') {
            return {
                ...commonOptions,
                series: [{
                    name: '数量',
                    type: 'pie',
                    data: [
                        { value: data.visitCount, name: '访问量' },
                        { value: data.favoriteCount, name: '收藏量' },
                        { value: data.orderCount, name: '成交量' }
                    ]
                }],
                color: ['#ff7f50', '#87cefa', '#8a75ff']
            };
        } else if (chartType === 'conversionFavorite') {
            return this.getConversionOption(data.visitCount, data.favoriteCount, '访问量', '收藏量');
        } else if (chartType === 'conversionOrder') {
            return this.getConversionOption(data.visitCount, data.orderCount, '访问量', '成交量');
        }
    }

    getConversionOption = (fromValue, toValue, fromLabel, toLabel) => {
        const conversionRate = ((toValue / fromValue) * 100).toFixed(2);
        const fromRadius = Math.sqrt(fromValue) * 15; // 加大半径
        const toRadius = Math.sqrt(toValue) * 15; // 加大半径

        return {
            title: {
                text: `${fromLabel}转化为${toLabel}`,
                left: 'center'
            },
            series: [
                {
                    type: 'custom',
                    renderItem: (params, api) => {
                        const fromCoord = api.coord([0, 0.5]);
                        const toCoord = api.coord([1, 0.5]);
                        const pointSize = 15;

                        const circles = [
                            {
                                type: 'circle',
                                shape: { cx: fromCoord[0], cy: fromCoord[1], r: fromRadius },
                                style: { fill: '#ff7f50' },
                                textContent: {
                                    style: {
                                        text: `${fromValue}`,
                                        fontSize: 14,
                                        fill: '#5e3636'
                                    }
                                },
                                textConfig: {
                                    position: 'inside',
                                    insideColor: '#000'
                                }
                            },
                            {
                                type: 'circle',
                                shape: { cx: toCoord[0], cy: toCoord[1], r: toRadius },
                                style: { fill: '#87cefa' },
                                textContent: {
                                    style: {
                                        text: `${toValue}`,
                                        fontSize: 14,
                                        fill: '#fff'
                                    }
                                },
                                textConfig: {
                                    position: 'inside',
                                    insideColor: '#000'
                                }
                            }
                        ];

                        const texts = [
                            {
                                type: 'text',
                                style: {
                                    text: `转化率: ${conversionRate}%`,
                                    x: (fromCoord[0] + toCoord[0]) / 2,
                                    y: fromCoord[1] - 30,
                                    textAlign: 'center',
                                    font: 'bold 18px sans-serif'
                                }
                            }
                        ];

                        const points = {
                            type: 'group',
                            children: circles
                        };

                        const line = {
                            type: 'line',
                            shape: { x1: fromCoord[0], y1: fromCoord[1], x2: toCoord[0], y2: toCoord[1] },
                            style: { stroke: '#6db1f5', lineWidth: 10 },
                            silent: true
                        };

                        return {
                            type: 'group',
                            children: [line, points, ...texts]
                        };
                    },
                    data: [0]
                }
            ],
            xAxis: { show: false, min: 0, max: 1 },
            yAxis: { show: false, min: 0, max: 1 },
            grid: {
                left: '20%',
                right: '30%',
                top: '20%',
                bottom: '20%'
            }
        };
    }

    render() {
        const data = this.props.location.state; // 路由传进来的数据
        const listTitle = [
            '商品名称', '商品描述', '商品价格', '商品详情'
        ];
        return (
            <Card title={this.title}>
                <img src={data.imgs[0]} alt={data.name} style={{ width: '100%', marginBottom: '1rem' }} />
                <List
                    header={<div>商品详情</div>}
                    bordered
                >
                    <List.Item>
                        <Text style={listStyle}>{listTitle[0]}:</Text>{data.name}
                    </List.Item>
                    <List.Item>
                        <Text style={listStyle}>{listTitle[1]}:</Text>{data.desc}
                    </List.Item>
                    <List.Item>
                        <Text style={listStyle}>{listTitle[2]}:</Text>{data.price}
                    </List.Item>
                    <List.Item>
                        <Text style={listStyle}>{listTitle[3]}:</Text>{data.detail}
                    </List.Item>
                </List>
                <Radio.Group
                    defaultValue="bar"
                    onChange={this.handleChartTypeChange}
                    style={{
                        marginTop: 20,
                        marginBottom: 20
                    }}
                >
                    <Radio value="bar">柱状图</Radio>
                    <Radio value="pie">饼图</Radio>
                    <Radio value="conversionFavorite">转化率（访问量到收藏量）</Radio>
                    <Radio value="conversionOrder">转化率（访问量到成交量）</Radio>
                </Radio.Group>
                <EchartsReact
                    echarts={echarts}
                    option={this.getOption()}
                    notMerge={true}
                    lazyUpdate={true}
                    style={{ height: '400px' }}
                />
            </Card>
        );
    }
}

export default withRouter(ProductDetail);
