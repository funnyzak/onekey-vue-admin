/**
 * 根据城市代码集合获取具体的代码+名称集合
 *
 * @param {*} cityData
 * @param {*} codes
 * @param {number} [codeIndex=0]
 * @returns
 */
function getCityArrayByCodes(cityData, codes, codeIndex = 0) {
  if (cityData == null || cityData.length === 0 || (codes.length - codeIndex) === 0) return []

  let arr = []
  const temArr = cityData.filter(item => item.value === codes[codeIndex])
  if (temArr.length === 0) return arr

  arr.push({
    name: temArr[0].label,
    value: codes[codeIndex]
  })

  if (temArr[0].children && temArr[0].children.length > 0) {
    arr = arr.concat(getCityArrayByCodes(temArr[0].children, codes, ++codeIndex))
  }

  return arr
}

export {
  getCityArrayByCodes
}
