import store from 'store';

// 封装对 localStorage 的操作
const localStorageService = {
  // 设置 localStorage 中的值
  set: (key, value) => {
    store.set(key, value);
  },

  // 获取 localStorage 中的值
  get: (key) => {
    return store.get(key);
  },

  // 移除 localStorage 中的值
  remove: (key) => {
    store.remove(key);
  },

  // 清空所有 localStorage 中的值
  clearAll: () => {
    store.clearAll();
  }
};

export default localStorageService;
