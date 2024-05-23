const menuList = [
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
    title: 'GitHub',
    key: '/github',
    icon: 'github',
  },
];

export default menuList;
