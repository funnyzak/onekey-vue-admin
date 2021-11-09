import defaultHtml from './defaultHtml'

const install = function(Vue) {
  Vue.directive('el-default-html', defaultHtml)
}

if (window.Vue) {
  window['el-default-html'] = defaultHtml
  Vue.use(install); // eslint-disable-line
}

defaultHtml.install = install
export default defaultHtml
