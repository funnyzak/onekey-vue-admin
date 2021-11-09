// 调用示例 v-defaultHtml="['未设置‘, true, 20]"
export default {
  bind(el, binding, vnode) {
    const { value } = binding
    const func = () => {
      if (['BODY', 'DIV', 'SPAN', 'LABEL', 'TD', 'TH', 'B', 'DD', 'DT'].includes(el.nodeName) && el.innerHTML.trim() === '') {
        el.innerHTML = value || '无'
      }
    }
    setTimeout(func, 10)
  }
}
