<template>
    <el-form ref="form" :model="form" label-width="120px">
        <!-- 메인 주제 이름쳐서 추가를 누르면 라벨이 추가되어야 함 -->
        <!-- group name, keyword 생성 되야됨-->

        <div class="groups-wrapper">
            <!-- 키워드 추가 -->
            <el-form-item style="width:500px;" label="키워드">
                <el-input v-model="form.keyword">
                    <el-button @click="saveKeyword" slot="append"
                        >키워드 추가</el-button
                    >
                </el-input>
            </el-form-item>

            <div v-if="keywords" class="tag-wrapper">
                <el-tag
                    @click="removeKeyword(keyword)"
                    v-for="keyword in keywords"
                    :key="keyword"
                    >{{ keyword }}</el-tag
                >
            </div>

            <el-form-item label="주제">
                <el-input v-model="form.groupName"></el-input>
            </el-form-item>

            <div v-if="keywordGroups">
                <el-tag
                    @click="removeGroup(group.groupName)"
                    v-for="(group, index) in keywordGroups"
                    :key="index"
                    >{{ group.groupName }}</el-tag
                >
            </div>

            <el-button @click="saveGroup" type="primary"
                >주제 생성하기</el-button
            >
        </div>

        <div class="groups-wrapper">
            <!-- 기간 -->
            <el-form-item label="시간대별 설정">
                <el-col :span="11">
                    <el-date-picker
                        type="date"
                        placeholder="date"
                        v-model="form.startDate"
                    ></el-date-picker>
                </el-col>

                <el-col class="line" :span="2">-</el-col>

                <el-col :span="11">
                    <el-date-picker
                        type="date"
                        placeholder="date"
                        v-model="form.endDate"
                    ></el-date-picker>
                </el-col>
            </el-form-item>

            <el-form-item label="구간 단위">
                <el-radio-group v-model="form.timeUnit">
                    <el-radio label="date"></el-radio>
                    <el-radio label="week"></el-radio>
                    <el-radio label="month"></el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="디바이스">
                <el-radio-group v-model="form.device">
                    <el-radio label="all"></el-radio>
                    <el-radio label="pc">pc</el-radio>
                    <el-radio label="mo">모바일</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="성별">
                <el-radio-group v-model="form.gender">
                    <el-radio label="all">모두</el-radio>
                    <el-radio label="f">여자</el-radio>
                    <el-radio label="m">남자</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="나이">
                <el-checkbox-group v-model="form.ages">
                    <el-checkbox label="1">0-12</el-checkbox>
                    <el-checkbox label="2">13-18</el-checkbox>
                    <el-checkbox label="3">19-24</el-checkbox>
                    <el-checkbox label="4">25-29</el-checkbox>
                    <el-checkbox label="5">30-34</el-checkbox>
                    <el-checkbox label="6">35-39</el-checkbox>
                    <el-checkbox label="7">40-44</el-checkbox>
                    <el-checkbox label="8">45-49</el-checkbox>
                    <el-checkbox label="9">50-54</el-checkbox>
                    <el-checkbox label="10">55-59</el-checkbox>
                    <el-checkbox label="11">60+</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </div>

        <el-form-item>
            <el-button @click="onSubmit">Create</el-button>
            <el-button>Cancel</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import { dataLap } from "../utils/axios";
import moment from "moment";
import { mapActions, mapState } from "vuex";

export default {
    data() {
        return {
            form: {
                startDate: null,
                endDate: null,
                timeUnit: "month",
                groupName: "",
                keyword: "",
                device: "all",
                gender: "all",
                ages: [], // 배열
            },
            keywordGroups: [],
            keywords: [],
        };
    },
    methods: {
        ...mapActions(["generateChartData"]),
        saveKeyword() {
            if (this.form.keyword) {
                this.keywords.push(this.form.keyword);
            }
            this.form.keyword = "";
        },
        saveGroup() {
            if (this.form.groupName) {
                this.keywordGroups.push({
                    groupName: this.form.groupName,
                    keywords: this.keywords,
                });
                this.form.groupName = "";
                this.keywords = [];
            }
        },
        removeKeyword(keyword) {
            this.keywords = this.keywords.filter((li) => li !== keyword);
        },
        async onSubmit() {
            const {
                startDate,
                endDate,
                timeUnit,
                device,
                gender,
                ages,
            } = this.form;

            const makeDate = (date) => {
                const toCalendarData = new Date(date);
                return `${toCalendarData.getFullYear()}-${toCalendarData.getMonth()}-${toCalendarData.getDate()}`;
            };

            if (
                this.keywordGroups.length &&
                startDate &&
                endDate &&
                timeUnit &&
                device &&
                gender &&
                ages.length
            ) {
                const data = {
                    keywordGroups: this.keywordGroups,
                    startDate: moment(startDate).format("YYYY-MM-DD"),
                    endDate: moment().format("YYYY-MM-DD"),
                    timeUnit,
                    device,
                    gender,
                    ages,
                };

                const result = await dataLap.post(data);

                if (result.data.status === "OK") {
                    this.generateChartData();
                }
            } else {
                alert("빈값들을 입력해주세요");
            }
        },
    },
};
</script>
