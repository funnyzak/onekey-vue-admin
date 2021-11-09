import store from '@/store'

function checkPermission(permissionConfig, permissions) {
  if (permissionConfig && ((permissionConfig instanceof Array && permissionConfig.length > 0) || (permissionConfig.list instanceof Array && permissionConfig.list.length > 0))) {
    if (permissionConfig.logic === 'AND') {
      return permissionConfig.list.every(permission => permissions.includes(permission))
    } else {
      return (Array.isArray(permissionConfig) ? permissionConfig : permissionConfig.list).some(permission => permissions.includes(permission))
    }
  } else {
    console.error(`need permissions! Like v-permission="{logic: 'AND/OR', list: ['table.list']}"`)
    return false
  }
}
/**
 * @param {Array} value
 * @returns {Boolean}
 */
export default function hasPermission(value) {
  return checkPermission(value, store.getters && store.getters.permissions)
}

export {
  checkPermission
}

