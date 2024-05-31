import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom'
import OrderDetail from './detail'
import Order from './order'

export default class extends Component {
  state = {}

  render() {
    return (
      <Switch>
        <Route exact path={'/order-manage'} component={Order}/>
        <Route path={'/order-manage/detail'} component={OrderDetail}/>
        <Redirect to={'/order-manage'}/>
      </Switch>
    );
  }
}