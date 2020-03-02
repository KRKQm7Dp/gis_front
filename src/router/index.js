import Vue from 'vue'
import Router from 'vue-router'
import { getRoutes } from '@/api/role'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import { getToken } from '@/utils/auth'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: 'Dashboard', icon: 'dashboard' }
    }]
  },
  
]

export const asyncRoutes = 
[
  {
    path: '/user',
    component: Layout,
    redirect: '/user/home',
    name: 'User',
    meta: { 
      title: '用户及权限管理', 
      icon: 'example',
      roles: ['ROLE_ADMIN','super_editor']
    },
    children: [
      {
        path: 'home',
        name: 'UserHome',
        component: () => import('@/views/user/home/index'),
        meta: { 
          title: '用户管理', 
          icon: 'tree',
          roles: ['ROLE_ADMIN','super_editor']
        }
      },
      {
        path: 'role',
        name: 'Role',
        component: () => import('@/views/user/role/index'),
        meta: { 
          title: '角色管理', 
          icon: 'tree',
          roles: ['ROLE_ADMIN','super_editor']
        }
      },
      {
        path: 'druid',
        name: 'Druid',
        component: () => import('@/views/user/druid/index'),
        meta: { 
          title: '数据源监控', 
          icon: 'tree',
          roles: ['ROLE_ADMIN','super_editor']
        }
      },
    ]
  },
  {
    path: '/video',
    component: Layout,
    redirect: '/video/home',
    name: 'Video',
    meta: { title: '流媒体服务管理', icon: 'example' },
    children: [
      {
        path: 'home',
        name: 'VideoHome',
        component: () => import('@/views/video/home/index'),
        meta: { title: '资源监控', icon: 'tree' }
      },
      {
        path: 'push',
        name: 'Push',
        component: () => import('@/views/video/push/index'),
        meta: { title: '推流列表', icon: 'table' }
      },
      {
        path: '/video/play',
        name: 'Play',
        meta: { title: '播放页面'},
        hidden: true,
        component: () => import('@/views/video/push/play'),
      },
      {
        path: 'monitor',
        name: 'Monitor',
        component: () => import('@/views/video/monitor/index'),
        meta: { title: '视频图像', icon: 'tree' }
      }
    ]
  },
  {
    path: '/device',
    component: Layout,
    redirect: '/device/home',
    name: 'Device',
    meta: { title: '物联网设备管理', icon: 'example' },
    children: [
      {
        path: 'home',
        name: 'DeviceHome',
        component: () => import('@/views/device/home/index'),
        meta: { title: '设备管理', icon: 'tree' }
      },
    ]
  },
  
  {
    path: 'chatroom',
    component: Layout,
    children: [
      {
        path: 'http://localhost:8082/chat/chatroom?UAA_ACCESS_TOKEN=' + getToken(),
        meta: { title: '交流中心', icon: 'link' }
      }
    ]
  },

  // {
  //   path: '/chatroom',
  //   component: Layout,
  //   redirect: '/chat',
  //   children: [{
  //     path: 'chat',
  //     name: 'Chat',
  //     component: () => import('@/views/chatroom/index'),
  //     meta: { title: '交流中心', icon: 'link' }
  //   }]
  // },
  
  { path: '*', redirect: '/404', hidden: true }
];

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
