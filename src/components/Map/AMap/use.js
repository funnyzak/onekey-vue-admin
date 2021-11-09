import Vue from 'vue'
import VueAMap from 'vue-amap'

Vue.use(VueAMap)

VueAMap.initAMapApiLoader({
  key: '1b12fd771b8d3abdcae725ede09682e9',
  // 插件集合
  plugin: [
    'AMap.Autocomplete',
    'AMap.Geocoder',
    'AMap.PlaceSearch',
    'AMap.Scale',
    'AMap.OverView',
    'AMap.ToolBar',
    'AMap.MapType',
    'AMap.PolyEditor',
    'AMap.CircleEditor',
    'AMap.Geolocation'
  ]
})
