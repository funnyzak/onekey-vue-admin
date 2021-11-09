import request from '@/utils/request'

export default {
  /**
   * 部门列表
   * @param {number} page  页码
   */
  list(page, pageSize, searchKey, parentId) {
    return request({
      url: 'dept/list',
      method: 'get',
      params: {
        page: page,
        pageSize: pageSize || 15,
        key: searchKey || '',
        parentId: parentId
      }
    })
  },
  /**
   * 获取部分所有成员
   * @param {*} deptId 部门ID
   */
  userList(deptId) {
    return request({
      url: 'dept/list/user',
      method: 'get',
      params: {
        departmentId: deptId || 0
      }
    })
  },
  /**
   * 获取部门用户的设置情况
   * @param {number} deptId 部门ID
   */
  grantInfo(deptId) {
    return request({
      url: `dept/user/${deptId}`,
      method: 'get'
    })
  },
  /**
   * 为机构设置用户
   * @param {number} deptId 部门ID
   * @param {Array} userIds 用户ID列表
   */
  grant(deptId, userIds) {
    return request({
      url: 'dept/grant/user',
      method: 'post',
      data: {
        id: deptId,
        grantIds: userIds
      }
    })
  },
  /**
   * 添加部门
   * @param {Object} dept 部门
   */
  save(dept) {
    return request({
      url: 'dept/add',
      method: 'post',
      data: dept
    })
  },
  /**
   * 更新部门
   * @param {Object} dept 部门
   */
  update(dept) {
    return request({
      url: 'dept/edit',
      method: 'post',
      data: dept
    })
  },
  /**
   * 删除部门
   * @param {number} id 部门id
   * @param {*} success 回调
   */
  delete(id) {
    return request({
      url: 'dept/' + id,
      method: 'delete'
    })
  },
  /**
   * 移除部门成员
   * @param {*} deptId 部门ID
   * @param {*} userId 用户ID
   */
  userRemove(deptId, userId) {
    return request({
      url: 'dept/user/' + deptId,
      method: 'delete',
      params: {
        uid: userId
      }
    })
  }
}
