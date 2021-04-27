import Vue from "vue";
import Vuex from "vuex";
import { dataLap } from "../utils/axios";

Vue.use(Vuex);

function makeColor() {
    return "#" + Math.round(Math.random() * 0xffffff).toString(16);
}

export default new Vuex.Store({
    state: {
        chartData: "",
    },
    mutations: {
        CHANGE_CHART_DATA(state, data) {
            state.chartData = data;
        },
    },
    // 비동기 처리를 할때 actions에서 처리하고 commit을 통해 mutations에 보내서 state를 변경
    actions: {
        async generateChartData({ commit }) {
            const result = await dataLap.get();

            console.log(result);

            const chartData = {
                // labels에는 날짜가 들어가야한다(X축)
                // 날짜는 data[0]이던 [1]이던 날짜는 서로 같이 공유하기 때문에
                // data[0]을 사용
                // data[0].data
                labels: result.data[0].data.map((li) => li.period),
                datasets: result.data.reduce((acc, cur) => {
                    let label = cur.title;
                    // ratio는 상대적인 검색어 추정 값
                    let data = cur.data.map((li) => li.ratio);
                    let borderColor = makeColor();
                    let backgroundColor = makeColor();
                    acc.push({
                        label: label,
                        data,
                        borderColor,
                        backgroundColor,
                        fill: false,
                    });
                    return acc;
                }, []),
            };

            commit("CHANGE_CHART_DATA", chartData);
        },
    },
    modules: {},
});
