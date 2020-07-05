<template>
  <div class="sales-total">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <h3>销售统计</h3>
      </div>
      <div class="text item">
          <div id="echarts">

          </div>
      </div>
    </el-card>
  </div>
</template>
<style lang="less">
.sales-total{
    .box-card{
        #echarts{
            width:600px;
            height: 400px;
        }
    }
}
</style>
<script>
export default {
    // 钩子函数
    mounted (){
        // 初始化
        let myEcharts = this.echarts.init(document.querySelector('#echarts'));
        // option
        let option ={
            title: {
                text: '第一个案例'
            },
            tooltip: {},
            legend: {
                data:['销量']
            },
            xAxis: {
                data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        }
        // set option
        myEcharts.setOption(option);
    }
};
</script>