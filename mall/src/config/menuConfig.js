const menuList = [
  {
    title: '商城首页',
    key: '/mainpage/home',
    icon: 'mainpage',
  },
  {
    title: '购物车',
    key: '/mainpage/cart',
    icon: 'cart',
  },
  {
    title: '分类',
    key: '/mainpage/category',
    icon: 'category',
  },
  {

    title: '我的',
    key: '/mainpage/my',
    icon: 'my',
  },
  {
    title: '首页',
    key: '/home',
    icon: 'home',
    isPublic: true,
  },
  {
    title: '菜单管理',
    key: '/products',
    icon: 'appstore',
    children: [
      // 子菜单列表
      {
        title: '菜单类别',
        key: '/category',
        icon: 'bars',
      },
      {
        title: '菜单内容',
        key: '/product',
        icon: 'tool',
      },
    ],
  },
  {
    title: '用户管理',
    key: '/user',
    icon: 'user',
  },
  {
    title: '角色管理',
    key: '/role',
    icon: 'safety',
  },
  {
    title: '订单管理',
    key: '/order-manage',
    icon: 'file',
  },
  {
    title: 'GitHub',
    key: '/github',
    icon: 'github',
  },
];

export default menuList;
