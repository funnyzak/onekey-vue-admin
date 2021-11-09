import Cookies from 'js-cookie'

const UserKey = 'Admin-User'

export function getUser() {
  return Cookies.get(UserKey) === undefined
    ? undefined
    : JSON.parse(Cookies.get(UserKey))
}

export function setUser(user) {
  try {
    return Cookies.set(UserKey, JSON.stringify(user))
  } catch (error) {
    console.log('setUser error:', error)
    return null
  }
}

export function removeUser() {
  return Cookies.remove(UserKey)
}
