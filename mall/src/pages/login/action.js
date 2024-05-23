import { message } from 'antd';
import { reqLogin, reqAddUser } from '../../api/index';
import { LOGIN_USER_INFO, REGISTER_USER_INFO } from './action-type';

import store from '../../utils/storeUtils';
import { normalUserId } from '../role/role';

export const getLoginUserInfo = (loginInfo) => async (dispatch) => {
  try {
    const res = await reqLogin(loginInfo);
    if (res.status === 0) {
      message.success('登录成功！');
      dispatch({
        type: LOGIN_USER_INFO,
        data: res.data,
      });
      store.set('user_key', res.data); // 全局存储
      store.set('token', res.token); // 全局存储
    } else {
      message.error('登录失败！');
    }
  } catch (error) {
    console.error('获取登录用户信息失败：', error);
    message.error('获取登录用户信息失败！');
  }
};

export const registerUserInfo = (userInfo) => async (dispatch) => {
  try {
    // Use the dynamically fetched '普通用户' role ID
    const newUser = {
      ...userInfo,
      role_id: normalUserId,
    };

    const res = await reqAddUser(newUser);
    if (res.status === 0) {
      message.success('注册成功！');
      dispatch({
        type: REGISTER_USER_INFO,
        data: res.data,
      });
    } else {
      message.error(`注册失败：${res.msg}`);
    }
  } catch (error) {
    console.error('注册用户信息失败：', error);
    message.error('注册用户信息失败！');
  }
};
