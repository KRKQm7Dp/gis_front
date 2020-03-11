<template>
     <el-color-picker v-model="color" size="medium" color-format="rgb" @change="colorChange"></el-color-picker>
</template>
<script>
export default {
    data() {
        return {
            color: ''
        }
    },
    methods: {
        colorChange(){
            console.log(this.color)
        }
    }
}
</script>