const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  size: state => state.app.size,
  pageSize: state => state.app.pageSize,
  device: state => state.app.device,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  branchNameList: state => state.branch.nameList,
  avatar: state =>
    !state.user.uinfo.headKey || state.user.uinfo.headKey === null
      ? './assets/images/icon/avatar.png'
      : state.user.uinfo.headKey,
  name: state => state.user.uinfo.name,
  user: state => state.user.uinfo,
  permissions: state => state.user.uinfo.permissions,
  introduction: state => state.user.uinfo.introduction,
  status: state => state.user.uinfo.status,
  roles: state => state.user.uinfo.roles,
  setting: state => state.user.uinfo.setting,
  permission_routes: state => state.permission.routes,
  addRoutes: state => state.permission.addRoutes,
  errorLogs: state => state.errorLog.logs
}
export default getters
