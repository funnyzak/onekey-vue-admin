<template>
  <div class="amap-page-container">
    <el-amap-search-box
      :search-option="searchOption"
      :on-search-result="onSearchResult"
      class="search-box"
    />
    <el-amap
      :amap-manager="amapManager"
      :plugin="plugin"
      :center="mapCenter"
      :events="events"
      :zoom="12"
      :class="mapClass"
      :style="{ height: height + 'px'}"
      vid="ali-map"
      class="ali-map"
    >
      <el-amap-marker :events="markerEvents" :draggable="true" :position="mapCenter" />
    </el-amap>
    <div v-if="formattedAddress.length > 0" class="toolbar">
      当前选择： {{ formattedAddress }} <el-button v-clipboard:copy="formattedAddress" v-clipboard:success="clipboardSuccess" type="primary" icon="document" size="mini">复制</el-button>
    </div>
  </div>
</template>
<style scoped>
  .ali-map {
    height: 400px;
  }

  .amap-scalecontrol {
    right: 0;
  }

  .search-box {
    position: absolute;
    top: 20px;
    height:40px;
    left: 100px;
  }

  .amap-page-container {
      position: relative;
  }
  .toolbar{
    border: 1px solid #e5e5e5;
    border-top:0;
    height: 37px;
    line-height: 37px;
    width: 100%;
    padding:0 1%;
    box-sizing: border-box;
  }
</style>
<style>
    .amap-copyright,
    .amap-logo {
        display: none !important;
    }

    .el-vue-search-box-container .search-box-wrapper .search-btn {
        background: #ccc !important;
    }
</style>

<script>
import VueAMap from 'vue-amap'
import clipboard from '@/directive/clipboard/index.js' // use clipboard by v-directive

const amapManager = new VueAMap.AMapManager()
export default {
  directives: {
    clipboard
  },
  props: {
    center: {
      type: Array,
      default: function() {
        return [0, 0]
      },
      required: false
    },
    mapClass: {
      type: String,
      default: '',
      required: false
    },
    height: {
      type: Number,
      default: 400,
      required: false
    }
  },
  data() {
    const self = this
    return {
      amapManager,
      formattedAddress: '',
      searchOption: {
        city: '北京',
        citylimit: false
      },
      mapCenter: [this.center[0], this.center[1]],
      events: {
        click(e) {
          const { lng, lat } = e.lnglat
          self.geocoder(lng, lat)
        }
      },
      markerEvents: {
        dragend: (e) => {
          console.log('---event---: dragend', e.lnglat.lng, e.lnglat.lat)
          self.geocoder(e.lnglat.lng, e.lnglat.lat)
          // this.markers[0].position = [e.lnglat.lng, e.lnglat.lat];
        }
      },
      plugin: [
        // {
        //   pName: 'MapType',
        //   defaultType: 0,
        //   events: {
        //     init(instance) {
        //       document.getElementsByClassName('amap-maptype-list')[0].style.display = 'none'
        //       console.log('Amap.MapType inited!')
        //     }
        //   }
        // },
        {
          pName: 'ToolBar',
          events: {
            init(instance) {
              // console.log('Amap.ToolBar inited!')
            }
          }
        },
        {
          pName: 'Geolocation',
          events: {
            init(o) {
              if (self.mapCenter[0] === 0 && self.mapCenter[1] === 0) {
                o.getCurrentPosition((status, result) => {
                  if (result && result.position) {
                    self.geocoder(result.position.lng, result.position.lat)
                    self.$nextTick()
                  }
                })
              } else {
                self.geocoder(self.mapCenter[0], self.mapCenter[1])
                self.$nextTick()
              }
            }
          }
        }
      ]
    }
  },
  created() {
  },
  methods: {
    clipboardSuccess() {
      this.$message({
        message: '复制成功',
        type: 'success'
      })
    },
    reset() {
      this.center = [0, 0]
    },
    notify(rs) {
      this.$emit('locationSelected', rs)
    },
    lacationAndnotify(lng, lat) {
      const self = this
      var geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'all'
      })
      geocoder.getAddress([lng, lat], (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          if (result && result.regeocode) {
            self.mapCenter = [lng, lat]
            self.notify({
              point: { lng: lng, lat: lat },
              address: result.regeocode.addressComponent,
              formattedAddress: result.regeocode.formattedAddress
            })
            this.formattedAddress = result.regeocode.formattedAddress
            self.$nextTick()
          }
        }
      })
    },
    geocoder(lng, lat) {
      const self = this
      if (lng === 0 && lat === 0) {
        new AMap.Geolocation().getCurrentPosition((status, result) => {
          if (result && result.position) {
            self.lacationAndnotify(result.position.lng, result.position.lat)
          }
        })
      } else {
        self.lacationAndnotify(lng, lat)
      }
    },
    onSearchResult(pois) {
      let latSum = 0
      let lngSum = 0
      if (pois.length > 0) {
        pois.forEach(poi => {
          const { lng, lat } = poi
          lngSum += lng
          latSum += lat
        })
        const center = {
          lng: lngSum / pois.length,
          lat: latSum / pois.length
        }
        this.geocoder(center.lng, center.lat)
      }
    }
  }
}
</script>
