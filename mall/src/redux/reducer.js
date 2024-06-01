import { combineReducers } from 'redux';
import getHeadTitle from '../components/bottom-nav/reducer';
import loginUserInfo from '../pages/login/reducer';

/**
 * @description 将多个 reducer 合并成一个 reducer
 * @description 注意：每个 reducer 返回的 state 对象不能是 undefined
 */
export default combineReducers({
  // 左侧导航栏的头部标题 reducer
  getHeadTitle,
  // 登录用户信息的 reducer
  loginUserInfo,
});
