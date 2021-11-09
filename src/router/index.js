import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

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
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
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
    component: () => import('@/views/login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    hidden: true
  },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: 'Dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export const asyncRouterMap = [
  {
    name: 'Acl',
    path: '/ac',
    component: Layout,
    redirect: '/ac/index',
    alwaysShow: true, // will always show the root menu
    meta: {
      title: 'Acl',
      icon: 'lock',
      roles: ['admin'],
      permissions: ['user.list', 'role.list', 'permission.list']
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/acl/userManager'),
        name: 'UserManager',
        meta: {
          title: 'UserManager',
          noCache: true,
          permissions: ['user.list']
        }
      },
      {
        path: 'role',
        component: () => import('@/views/acl/userRoleManager'),
        name: 'UserRole',
        meta: {
          title: 'UserRole',
          noCache: true,
          permissions: ['role.list']
        }
      },
      {
        path: 'permission',
        component: () => import('@/views/acl/permissionManager'),
        name: 'Permission',
        meta: {
          title: 'Permission',
          noCache: true,
          permissions: ['permission.list']
        }
      },
      {
        path: 'dataPermission',
        component: () => import('@/views/acl/dataRule'),
        name: 'DataPermission',
        meta: {
          title: 'DataPermission',
          noCache: true,
          permissions: ['data.permission.list']
        }
      }
    ]
  },
  {
    name: 'Structure',
    path: '/structure',
    component: Layout,
    redirect: '/structure/department',
    alwaysShow: false,
    meta: {
      title: 'Structure',
      icon: 'tree',
      permissions: ['dept.list']
    },
    children: [
      {
        path: 'department',
        component: () => import('@/views/structure/department'),
        name: 'Department',
        meta: {
          title: 'Department',
          noCache: true,
          permissions: ['dept.list']
        }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/index',
    alwaysShow: false,
    name: 'Setting',
    meta: {
      title: 'Setting',
      icon: 'config',
      permissions: ['config.list']
    },
    children: [
      {
        path: 'list',
        component: () => import('@/views/setting/index'),
        name: 'SettingList',
        meta: {
          title: 'SettingList',
          noCache: true,
          permissions: ['config.list']
        }
      }
    ]
  },
  {
    name: 'Cms',
    path: '/cms',
    component: Layout,
    redirect: '/cms/article',
    alwaysShow: false,
    meta: {
      title: 'Cms',
      icon: 'info',
      permissions: ['label.info.article.cate', 'cms.article.list']
    },
    children: [
      {
        path: 'article/list',
        component: () => import('@/views/cms/articleIndex'),
        props: {
          typeList: 'NORMAL',
          conf: {
            name: '文章',
            listFields: ['title', 'pic', 'addTime', 'author', 'source', 'updateTime'],
            editFields: ['title', 'pic', 'addTime', 'updateTime', 'author', 'source', 'content'],
            previewFields: ['title', 'addTime', 'author', 'source', 'updateTime', 'content'],
            permissionName: 'cms.article.',
            type: 'NORMAL'
          }
        },
        name: 'ArticleList',
        meta: {
          title: 'ArticleList',
          noCache: true,
          permissions: ['cms.article.list']
        }
      },
      {
        path: 'article/cate',
        component: () => import('@/views/cate/articleCateList'),
        name: 'ArticleCateList',
        meta: {
          title: 'ArticleCateList',
          noCache: true,
          permissions: ['label.info.article.cate']
        }
      }
    ]
  },
  {
    path: '/openservice',
    component: Layout,
    redirect: '/openservice/index',
    alwaysShow: true,
    meta: {
      title: 'OpenService',
      icon: 'platform',
      permissions: ['connector.list', 'connector.log.list', 'member.info.list']
    },
    children: [
      {
        path: 'connector',
        component: () => import('@/views/connector/index'),
        name: 'Connector',
        meta: {
          title: 'Connector',
          permissions: ['connector.list'],
          noCache: true
        }
      },
      {
        path: 'connectorlog/list',
        component: () => import('@/views/connector/log'),
        name: 'ConnectorLog',
        meta: {
          title: 'ConnectorLog',
          permissions: ['connector.log.list'],
          noCache: true
        }
      },
      {
        path: 'member/list',
        component: () => import('@/views/member/list'),
        name: 'MemberList',
        meta: {
          title: 'MemberList',
          permissions: ['member.info.list'],
          noCache: true
        }
      }
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/index',
    alwaysShow: true,
    meta: {
      title: 'Monitor',
      icon: 'monitor',
      permissions: ['system.database.monitor', 'system.operation.log', 'system.login.log']
    },
    children: [
      {
        path: 'database',
        component: () => import('@/views/system/database'),
        name: 'Database',
        meta: {
          title: 'Database',
          permissions: ['system.database.monitor'],
          noCache: true
        }
      },
      {
        path: 'trace',
        component: () => import('@/views/system/loginLog'),
        name: 'LoginLog',
        meta: {
          title: 'LoginLog',
          permissions: ['system.login.log'],
          noCache: true
        }
      },
      {
        path: 'systemlog',
        component: () => import('@/views/system/operateLog'),
        name: 'OperationLog',
        meta: {
          title: 'OperationLog',
          permissions: ['system.operation.log'],
          noCache: true
        }
      },
      {
        path: 'pmlog',
        component: () => import('@/views/system/pmLog'),
        name: 'PmLog',
        meta: {
          title: 'PmLog',
          permissions: ['system.pm.log'],
          noCache: true
        }
      }
    ]
  },
  {
    path: '/tools',
    component: Layout,
    redirect: '/tools/index',
    alwaysShow: true,
    meta: {
      title: 'Tools',
      icon: 'tool'
    },
    children: [
      {
        path: 'img/upload',
        component: () => import('@/views/tools/img/upload'),
        name: 'ImageUpload',
        meta: {
          title: 'ImageUpload',
          noCache: true
        }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
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
