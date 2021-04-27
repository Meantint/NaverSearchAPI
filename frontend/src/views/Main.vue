<template>
    <div class="main-container">
        <Form></Form>
        <!-- https://codesandbox.io/s/3j73wmjzq?file=/src/App.vue:316-841 -->
        <reactive-bar-chart
            v-if="chartData"
            :chart-data="chartData"
        ></reactive-bar-chart>
    </div>
</template>

<script>
import ReactiveBarChart from "../components/ReactiveBarChart.js";
import { dataLap } from "../utils/axios";
import Form from "../components/Form";
import { mapActions, mapState } from "vuex";
export default {
    name: "App",
    components: {
        ReactiveBarChart,
        Form,
    },
    data() {
        return {
            // chartData: null,
        };
    },
    computed: {
        ...mapState(["chartData"]),
    },
    methods: {
        ...mapActions(["generateChartData"]),
        // generateData() {
        //   let newArray = [];
        //   let newArray2 = [];
        //   for (let i = 0; i < 10; i++) {
        //     let randomValue = Math.floor(Math.random() * 10);
        //     newArray.push(randomValue);
        //   }

        //   for (let i = 0; i < 10; i++) {
        //     let randomValue = Math.floor(Math.random() * 10);
        //     newArray2.push(randomValue);
        //   }

        //   this.chartData = {
        //     labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
        //     datasets: [
        //       {
        //         label: "Data One",
        //         backgroundColor: "#f87979",
        //         data: newArray,
        //         fill: false,
        //       },
        //       {
        //         label: "Data One",
        //         backgroundColor: "#f87979",
        //         data: newArray2,
        //         fill: false,
        //       },
        //     ],
        //   };
        // },
        // async generateChartData(){
        //     const result = await dataLap.get();
        //     console.log(result.data);
        //     console.log(result.data[0].data);

        //     this.chartData = {
        //     // 라벨에 기간을 넣고(result.data의 배열안에있는 data의 period를 기반으로 labels 생성)
        //     // 1차 목표 넣고 period를 배열로 나열해주기.
        //     // 첫번째 배열의 날짜를 넣기

        //     labels: result.data[0].data.map(li => li.period),
        //     // datsets: result.data.reduce((acc, cur) => {

        //     // }.[])
        //     // datasets에 데이터를 넣고배열을 만들어 준다.
        //     datasets: result.data.reduce((acc, cur) => {
        //         console.log(cur);
        //         let label= cur.title;
        //         let data = cur.data.map(li => li.ratio);
        //         acc.push({label: label, data: data, backgroundColor: "#f87979",fill:false})
        //         return acc;
        //     },[])
        //   };
        //   console.log(this.chartData);
        // }
    },
    async mounted() {
        // setInterval(this.generateData, 2000);
        // setInterval(this.generateChartData, 2000);
        this.generateChartData();
        // this.ch
        // console.log(result.data);
        // 해당 배열을 읽어서 chart Data를 만들어주는 메소드를 작성해서 새로 작성해준다.
    },
};
</script>

<style>
.main-container {
    display: flex;
    padding: 20px;
    /* width:85vw; */
    /* justify-content:space-between; */
}
.main-container > * {
    /* flex:40%; */
    flex: 1;
}
</style>
