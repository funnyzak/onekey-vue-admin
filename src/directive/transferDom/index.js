import transferDom from './transferDom'

const install = function(Vue) {
  Vue.directive('transfer-dom', transferDom)
}

if (window.Vue) {
  window.transferDom = transferDom
  Vue.use(install); // eslint-disable-line
}

transferDom.install = install
export default transferDom
