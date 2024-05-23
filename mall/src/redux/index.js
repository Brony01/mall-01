import { applyMiddleware, createStore } from 'redux';
import ReduxThunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import appReducer from './reducer';

/**
 * @description 创建 Redux store，并根据环境选择是否启用 Redux DevTools。
 * @returns {Object} Redux store
 */
function configureStore() {
  let storeEnhancer = applyMiddleware(ReduxThunk);

  // 在开发环境下启用 Redux DevTools
  if (process.env.NODE_ENV === 'development') {
    storeEnhancer = composeWithDevTools(storeEnhancer);
  }

  return createStore(appReducer, storeEnhancer);
}

// 创建 Redux store
const store = configureStore();

export default store;
