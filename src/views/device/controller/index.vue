<template>
<div>
    <el-row><el-color-picker v-model="color" size="medium" color-format="rgb" @change="colorChange"></el-color-picker>改变警报灯的颜色</el-row>
    <el-row><el-switch v-model="switch_val" @change="switchChange"></el-switch>照明灯开关</el-row>
</div>
</template>
<script>
import { sendCtrlMsg } from '@/api/sensor'

export default {
    data() {
        return {
            color: '',
            switch_val: true,
            params: {
                toDeviceId : 41,
	            data: ''
            }
        }
    },
    created(){
        this.switchChange()
    },
    methods: {
        colorChange(){
            console.log(this.color)
            var regex = /(?<=\()[^\(\)]+(?=\))/g;
            var rgbArray = this.color.match(regex)[0].split(',')
            rgbArray.forEach(function(item,index,arr){
                arr[index] = arr[index] > 100 ? 100 : arr[index]
            })
            this.params.data = 'rgb_rgb(' + rgbArray.toString() + ')'
            console.log(this.params)
            this.send()
        },
        switchChange(){
            if(this.switch_val){
                this.params.data = 'switch_1'
            }else{
                this.params.data = 'switch_0'
            }
            console.log(this.params)
            sendCtrlMsg(this.params).then(res => {
                this.$message({
                    showClose: true,
                    message: res.data.data,
                    type: 'success'
                })
            })
        },
        send(){
            sendCtrlMsg(this.params).then(res => {
                this.$message({
                    showClose: true,
                    message: res.data.data,
                    type: 'success'
                })
            })
        }
    }
}
</script>