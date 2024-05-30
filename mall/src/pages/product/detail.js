import React, {Component} from 'react';
import {withRouter} from 'react-router-dom'
import {Card, Icon, List, Radio, Typography} from 'antd'
import EchartsReact from 'echarts-for-react'; // 引入EchartsReact组件
import * as echarts from 'echarts'; // 引入echarts库

const {Text} = Typography;
const listStyle = {fontSize: 15, marginRight: '1rem'}

class ProductDetail extends Component {
    state = {
        chartType: 'bar'
    }

    constructor() {
        super()
        this.title = (
          <Icon type="arrow-left" onClick={this.goBack} style={{fontSize: 20}}/>
        )
    }

    handleChartTypeChange = e => {
        this.setState({ chartType: e.target.value });
    }

    goBack = (e) => {
        this.props.history.goBack()
    }

    getOption = () => {
        const data = this.props.location.state
        const { chartType } = this.state;

        const commonOptions = {
            title: {
                text: '产品数据'
            },
            tooltip: {
                position: 'right' // 设置提示框的位置
            },
            legend: {
                data:['访问量','收藏量','成交量'],
                right: 0, // 设置图例的右边距
                bottom: 0 // 设置图例的下边距
            },
        };

        if (chartType === 'bar') {
            return {
                ...commonOptions,
                xAxis: {
                    data: ["访问量","收藏量","成交量"]
                },
                yAxis: {},
                series: [{
                    name: '数量',
                    type: 'bar',
                    data: [data.visitCount, data.favoriteCount, data.orderCount]
                }]
            };
        } else if (chartType === 'pie') {
            return {
                ...commonOptions,
                series: [{
                    name: '数量',
                    type: 'pie',
                    data: [
                        {value: data.visitCount, name: '访问量'},
                        {value: data.favoriteCount, name: '收藏量'},
                        {value: data.orderCount, name: '成交量'}
                    ]
                }]
            };
        }
    }

    render() {
        const data = this.props.location.state //路由传进来的数据
        const listTitle = [
            '商品名称', '商品描述', '商品价格', '商品详情'
        ]
        return (
          <Card title={this.title}>
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
                style={
                  {
                      marginTop: 20,
                      marginBottom: 20
                  }
              }
              >
                  <Radio value="bar">柱状图</Radio>
                  <Radio value="pie">饼图</Radio>
              </Radio.Group>
              <EchartsReact
                echarts={echarts}
                option={this.getOption()}
                notMerge={true}
                lazyUpdate={true}
              />
          </Card>
        );
    }
}

export default withRouter(ProductDetail)