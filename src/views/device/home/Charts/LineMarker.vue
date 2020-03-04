<template>
    <div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from "echarts";
import resize from "./mixins/resize";
import { getTempHumList } from "@/api/sensor";

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: "chart"
    },
    id: {
      type: String,
      default: "chart"
    },
    width: {
      type: String,
      default: "200px"
    },
    height: {
      type: String,
      default: "200px"
    },
    type: {  // 由父组件传递的图表类型 temp / humidity 
      type: String,
      default: "temp"
    },
    deviceId: ''
  },
  data() {
    return {
      chart: null,
      timer: null,
      chartData: [],
      tempList: [],
      humList: [],
      timeList: [],
      params: {
        deviceId: this.deviceId, // 设备 id
        size: 100 // 请求数据量
      },
    };
  },
  mounted() {
    console.log("chartType="+this.type)
    this.getTempHum();
    this.timer = setInterval(() => {
      console.log("定时执行");
      this.getTempHum();
    }, 5000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  watch: {
    type: function() {
      console.log('type 发生变化')
      this.initChart()
    }
  },
  methods: {
    getTempHum() {
      getTempHumList(this.params).then(res => {
        this.chartData = res.data.data;
        if (this.chartData.length === 0){
          this.$alert('此设备暂无数据', '提示', {
            confirmButtonText: '返回设备列表',
            callback: action => {
              this.$router.push('/device/home')
            }
          });
          clearInterval(this.timer);
        }
        this.tempList = [];
        this.humList = [];
        this.timeList = [];
        this.chartData.reverse().forEach(data => {
          this.tempList.push(data.temp);
          this.humList.push(data.humidity);
          this.timeList.push(data.time.split(" ")[1]);
        });
        this.initChart();
      }).catch(e => {
        console.log(e)
      })
    },
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id));
      var option = {
        backgroundColor: "#394056",
        title: {
          top: 20,
          text: "Device ID: " + this.params.deviceId,
          textStyle: {
            fontWeight: "normal",
            fontSize: 16,
            color: "#F1F1F3"
          },
          left: "1%"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            lineStyle: {
              color: "#57617B"
            }
          }
        },
        legend: {
          top: 20,
          icon: "rect",
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: ["温度", "湿度", "CUCC"],
          // right: "4%",
          textStyle: {
            fontSize: 12,
            color: "#F1F1F3"
          }
        },
        toolbox: {
          // 工具箱
          show: true,
          feature: {
            dataZoom: {
              yAxisIndex: "none"
            },
            dataView: { readOnly: false },
            magicType: { type: ["bar", "line"] },
            restore: {}
          }
        },
        grid: {
          top: 100,
          left: "2%",
          right: "2%",
          bottom: "2%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: "#57617B"
              }
            },
            data: this.timeList
          }
        ],
        yAxis: [
          {
            type: "value",
            name: "(℃)",
            axisTick: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#57617B"
              }
            },
            axisLabel: {
              margin: 10,
              textStyle: {
                fontSize: 14
              }
            },
            splitLine: {
              lineStyle: {
                color: "#57617B"
              }
            }
          }
        ],
        series: [
          // {
          //   name: "温度",
          //   type: "line",
          //   smooth: true,
          //   symbol: "circle",
          //   symbolSize: 5,
          //   showSymbol: false,
          //   lineStyle: {
          //     normal: {
          //       width: 1
          //     }
          //   },
          //   areaStyle: {
          //     normal: {
          //       color: new echarts.graphic.LinearGradient(
          //         0,
          //         0,
          //         0,
          //         1,
          //         [
          //           {
          //             offset: 0,
          //             color: "rgba(137, 189, 27, 0.3)"
          //           },
          //           {
          //             offset: 0.8,
          //             color: "rgba(137, 189, 27, 0)"
          //           }
          //         ],
          //         false
          //       ),
          //       shadowColor: "rgba(0, 0, 0, 0.1)",
          //       shadowBlur: 10
          //     }
          //   },
          //   itemStyle: {
          //     normal: {
          //       color: "rgb(137,189,27)",
          //       borderColor: "rgba(137,189,2,0.27)",
          //       borderWidth: 12
          //     }
          //   },
          //   data: this.tempList
          // },
        ]
      }
      if (this.type === "humidity"){
        option.yAxis[0].name = "(%)"
        option.series.push({
            name: "湿度",
            type: "line",
            smooth: true,
            symbol: "circle",
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0,0,0,1,
                  [
                    {
                      offset: 0,
                      color: "rgba(0, 136, 212, 0.3)"
                    },
                    {
                      offset: 0.8,
                      color: "rgba(0, 136, 212, 0)"
                    }
                  ],
                  false
                ),
                shadowColor: "rgba(0, 0, 0, 0.1)",
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: "rgb(0,136,212)",
                borderColor: "rgba(0,136,212,0.2)",
                borderWidth: 12
              }
            },
            data: this.humList
          })
      } else if (this.type === "temp"){
        option.yAxis[0].name = "(℃)"
        option.series.push({
            name: '温度',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1
              }
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                  offset: 0,
                  color: 'rgba(219, 50, 51, 0.3)'
                }, {
                  offset: 0.8,
                  color: 'rgba(219, 50, 51, 0)'
                }], false),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10
              }
            },
            itemStyle: {
              normal: {
                color: 'rgb(219,50,51)',
                borderColor: 'rgba(219,50,51,0.2)',
                borderWidth: 12
              }
            },
            data: this.tempList
          })
      }
      this.chart.setOption(option);
    }
  }
};
</script>
