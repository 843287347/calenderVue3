<script lang="ts">
import calendarHeader from "./canlendar-head.vue";
import colorBar from "./colorBar.vue";
import { calendar } from "./calendar.js";
import InspireCloud from "@byteinspire/js-sdk";
const serviceId = "qcl7ts";
const inspirecloud = new InspireCloud({ serviceId });
import { Edit, Share, Delete, Search, Upload } from "@element-plus/icons-vue";
const loadingTextList = [
  "💗请稍等",
  "😊再等一会会",
  "😎马上就OK",
  "😊请稍等～",
];
const DEFAULT_COLOR = "#F56C6C";
const getDayNum = (year, month) => {
  // 获取当月第一天
  let curMonthFirst = new Date(year, month, 1);
  let nextMonthFirst = new Date(year, month + 1, 1);
  let curTotalDays = (nextMonthFirst - curMonthFirst) / (24 * 60 * 60 * 1000);
  // 当月第一天是周几
  let weekDay = curMonthFirst.getDay();
  if (36 - curTotalDays <= weekDay) {
    return 42;
  } else {
    return 35;
  }
};

const DaysOneMonth = (year, month) => {
  let curMonthFirst = new Date(year, month, 1);
  let nextMonthFirst = new Date(year, month + 1, 1);
  let curTotalDays = (nextMonthFirst - curMonthFirst) / (24 * 60 * 60 * 1000);
  return curTotalDays;
};

const getStartTime = (year, month) => {
  // 获取当月第一天
  let curMonthFirst = new Date(year, month, 1);
  let weekDay = curMonthFirst.getDay();
  return curMonthFirst - weekDay * 24 * 60 * 60 * 1000;
};

export default {
  name: "Home",
  props: {
    options: Object,
  },
  components: {
    calendarHeader,
    colorBar,
  },
  mounted() {
    this.getContentsByMonth();
  },
  data() {
    return {
      calendarTitleArr: [
        "周日",
        "周一",
        "周二",
        "周三",
        "周四",
        "周五",
        "周六",
      ],
      colorList: ["#F56C6C", "pink", "orange", "#409EFF", "#67C23A", "#909399"],
      colorDes: ["学习", "运动", "工作", "社交", "娱乐", "其他"],
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      day: new Date().getDate(),
      records: [],
      loading: true,
      loadingText: loadingTextList[0],
      drawer: false,
      drawerTitle: "",
      activateIndex: -1,
      addContent: "",
      addbgColor: DEFAULT_COLOR,
      addbgColorVisible: false,
      addLoading: false,
    };
  },
  computed: {
    monthDayNum() {
      return getDayNum(this.year, this.month);
    },
    weekDay() {
      return new Date(this.year, this.month, 1).getDay();
    },

    visibleCalendar() {
      const calendatArr = [];
      const startTime = getStartTime(this.year, this.month);
      const monthDayNum = this.monthDayNum;
      for (let i = 0; i < monthDayNum; i++) {
        const date = new Date(startTime + i * 24 * 60 * 60 * 1000);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate(); //这个月第几号
        const lunar = calendar.solar2lunar(year, month + 1, day);
        const IDayCn: string = lunar.IDayCn;
        const IMonthCn = lunar.IMonthCn;
        calendatArr.push({
          date,
          year,
          month,
          day,
          IDayCn,
          IMonthCn,
          contents: [],
          index: i,
        });
      }
      return calendatArr;
    },
  },
  watch: {
    month: function () {
      this.loadingText =
        loadingTextList[Math.floor(Math.random() * loadingTextList.length)];
      this.getContentsByMonth();
    },
  },
  methods: {
    getWeekDay(year, month) {
      return new Date(this.year, this.month, 1).getDay();
    },
    getContentsByMonth() {
      this.loading = true;
      const year = this.year.toString();
      const month = this.month.toString();
      const monthDayNum = DaysOneMonth(this.year, this.month);
      inspirecloud
        .run("getContentsByMonth", { year, month, monthDayNum })
        .then((res) => {
          const { results } = res;
          const temp = results;
          for (let i = 0; i < this.weekDay; i++) {
            temp.unshift([]);
          }
          this.records = temp;
          this.loading = false;
        });
    },
    //是否是今天
    isCurrentDay(day) {
      const now = new Date();
      const nowYear = now.getFullYear();
      const nowMonth = now.getMonth();
      const nowDay = now.getDate();
      return this.year == nowYear && this.month == nowMonth && day == nowDay;
    },
    //是否是当前月
    isCurrentMonth(month) {
      return month == this.month;
    },
    //处理方法
    handleClickDay(item) {
      if (!this.isCurrentMonth(item.month)) return;

      this.drawer = true;
      this.activateIndex = item.index;
      const activateDate = this.visibleCalendar[item.index];
      this.drawerTitle = `${activateDate.year}-${activateDate.month + 1}-${
        activateDate.day
      }`;
    },
    handleClose() {
      this.drawer = false;
      this.activateIndex = -1;
    },

    // 添加内容
    handleAddChangebgColor(color: string) {
      this.addbgColor = color;
      this.addbgColorVisible = !this.addbgColorVisible;
    },
    handleAddContent() {
      const activateDay = this.visibleCalendar[this.activateIndex];
      const { day } = activateDay;
      const year = activateDay.year.toString();
      const month = activateDay.month.toString();
      const content = this.addContent;
      const bgColor = this.addbgColor;

      this.addLoading = true;
      this.addbgColor = DEFAULT_COLOR;
      this.addContent = "";

      inspirecloud
        .run("addRecord", { year, month, content, bgColor, day: day - 1 })
        .then((res) => {
          if (res.success) {
            this.getContentsByMonth();
            this.addLoading = false;
            ElMessage({
              message: "添加成功",
              type: "success",
            });
          } else {
            this.addLoading = false;
            ElMessage({
              message: "添加失败",
              type: "error",
            });
          }
        });
    },
    changebgColor(index, color) {
      const record = this.records[this.activateIndex][index];
      record.bgColor = color;
      inspirecloud.run("updateRecord", record).then((res) => {
        ElMessage({
          message: "已自动保存",
          type: "success",
          duration: "700",
        });
      });
    },
    handleEditContent(index) {
      const record = this.records[this.activateIndex][index];
      inspirecloud.run("updateRecord", record).then((res) => {
        ElMessage({
          message: "已自动保存",
          type: "success",
          duration: "700",
        });
      });
    },
    handleDelContent(index) {
      const activateDay = this.visibleCalendar[this.activateIndex];
      const { year, month } = activateDay;
      const contentId = this.records[this.activateIndex][index]._id;
      this.addLoading = true;

      inspirecloud
        .run("deleteRecord", { year, month, contentId })
        .then((res) => {
          if (res) {
            this.addLoading = false;
            this.getContentsByMonth();
            ElMessage({
              message: "删除成功",
              type: "success",
            });
          } else {
            ElMessage({
              message: "删除失败",
              type: "error",
            });
            this.addLoading = true;
          }
        });
    },
    // 上一个月
    handlePrevMonth() {
      this.records = {};
      let prevMonth = new Date(this.year, this.month, 1);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      this.year = new Date(prevMonth).getFullYear();
      this.month = new Date(prevMonth).getMonth();
    },
    // 下一个月
    handleNextMonth() {
      this.records = {};
      let nextMonth = new Date(this.year, this.month, 1);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      this.year = new Date(nextMonth).getFullYear();
      this.month = new Date(nextMonth).getMonth();
    },
    handleToday() {
      this.year = new Date().getFullYear();
      this.month = new Date().getMonth();
    },
  },
};
</script>

<template>
  <!-- <div style="font-size: 20px">
    <svg class="icon" aria-hidden="true">
      <use xlink:href="icon-ashbin"></use>
    </svg>
  </div> -->
  <div class="cc-calendar">
    <calendarHeader
      :year="year"
      :month="month"
      @handlePrevMonth="handlePrevMonth"
      @handleNextMonth="handleNextMonth"
      @handleToday="handleToday"
    />
    <ul class="calendar-week">
      <li
        v-for="(item, index) in calendarTitleArr"
        :key="index"
        class="week-item"
      >
        {{ item }}
      </li>
    </ul>
    <el-card
      :body-style="{ padding: '0px' }"
      v-loading="loading"
      :element-loading-text="loadingText"
    >
      <ul class="calendar-view">
        <li
          v-for="(item, index) in visibleCalendar"
          :key="index"
          class="date-view hover-list"
          :class="[
            { todayBg: isCurrentDay(item.day) },
            { 'month-class': !isCurrentMonth(item.month) },
          ]"
          @click="handleClickDay(item)"
        >
          <!-- 展示日期 -->
          <div class="date-show">
            <span
              class="date-lunar date-lunarMonth"
              v-if="item.IDayCn == '初一'"
              >{{ item.IMonthCn }}</span
            >
            <span class="date-lunar" v-if="item.IDayCn != '初一'">{{
              item.IDayCn
            }}</span>
            <span class="date-day">{{ item.day }}</span>
          </div>

          <!-- 展示计划 -->
          <ul class="date-todoList">
            <span
              v-for="({ content, bgColor }, index) in records[index]"
              :key="index"
              :style="{
                color: bgColor,
                backgroundColor: '#fff',
                borderLeft: `5px solid ${bgColor}`,
              }"
              >{{ content }}</span
            >
          </ul>
        </li>
      </ul>
    </el-card>
    <el-drawer
      v-model="drawer"
      :title="drawerTitle"
      :before-close="handleClose"
    >
      <!-- <div class="colorDes">
        <div
          class="colorBox"
          v-for="(color, cindex) in colorList"
          :key="cindex"
          :style="{ background: color }"
        >
          <span>{{ colorDes[cindex] }}</span>
        </div>
      </div> -->
      <colorBar></colorBar>
      <div class="DrawerContainer">
        <div
          v-for="({}, index) in records[activateIndex]"
          :key="index"
          class="contentWrap"
        >
          <!-- 改变计划颜色 -->
          <el-popover placement="right" :width="50" trigger="click">
            <template #reference>
              <el-button
                class="left"
                :style="{
                  backgroundColor:
                    records[activateIndex][index].bgColor || 'blue',
                }"
              ></el-button>
            </template>
            <div v-for="(color, cindex) in colorList" :key="cindex">
              <el-button
                :style="{ background: color, width: '100%' }"
                @click="changebgColor(index, color)"
              >
              </el-button>
            </div>
          </el-popover>
          <!-- 展示计划内容 -->
          <el-input
            type="textarea"
            autosize
            @change="handleEditContent(index)"
            class="contentItem"
            v-model="records[activateIndex][index].content"
          />
          <!-- 删除计划 -->
          <el-link class="right" type="danger" @click="handleDelContent(index)">
            删除
          </el-link>
        </div>

        <!-- 新添加计划 -->
        <div class="contentWrap">
          <!-- 选择计划颜色 -->
          <el-popover
            v-model:visible="addbgColorVisible"
            placement="right"
            :width="50"
          >
            <template #reference>
              <el-button
                class="left"
                :style="{ backgroundColor: addbgColor }"
                @click="addbgColorVisible = !addbgColorVisible"
              ></el-button>
            </template>
            <div v-for="(color, cindex) in colorList" :key="cindex">
              <el-button
                :style="{ background: color, width: '100%', marginLeft: '0' }"
                @click="handleAddChangebgColor(color)"
              >
              </el-button>
            </div>
          </el-popover>
          <!-- 输入计划内容 -->
          <el-input
            type="textarea"
            autosize
            class="contentItem"
            v-model="addContent"
          >
          </el-input>

          <div class="center">
            <el-button
              :style="{ marginLeft: '0' }"
              :loading="addLoading"
              @click="handleAddContent"
              >添加</el-button
            >
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<style lang="less">
.cc-calendar {
  padding: 10px;
  width: 100%;
  height: 100%;
  background: #f9fafc;
  box-sizing: border-box;

  .calendar-week {
    display: flex;
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding: 0px;
    margin: 0px;
    border: 1px solid #e4e7ea;
    border-right: none;
    li {
      list-style: none;
    }

    .week-item {
      width: 14.285%;
      text-align: center;
      font-size: 14px;
      color: #424953;
      border-right: 1px solid #e4e7ea;
      font-weight: 600;
    }
  }

  .calendar-view {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 0px;
    width: 100%;
    border-left: 1px solid #e4e7ea;

    .date-view {
      width: 14.285%;
      min-height: 150px;
      border-right: 1px solid #e4e7ea;
      border-bottom: 1px solid #e4e7ea;
      box-sizing: border-box;
      cursor: pointer;
      overflow: auto;

      .date-show {
        display: flex;
        flex-direction: row;
        justify-content: space-between;

        .date-lunar {
          color: #7f8794;
          padding: 5px 10px 0;
          font-size: 14px;
          display: block;
        }
        .date-lunarMonth {
          font-weight: 900;
          color: royalblue;
        }
        .date-day {
          padding: 5px 10px 0;
          display: block;
          float: right;
          //   width: 100%;
          font-size: 14px;
          color: #7f8794;
        }
      }

      .date-todoList {
        display: block;
        text-align: left;
        font-size: 15px;
        padding: 0 10px;

        span {
          display: inline-block;
          margin: 5px;
          padding: 0 5px;
          box-sizing: border-box;
          background-color: #f9fafc;
          // border-left: #2061ff 5px solid;
          border-radius: 3px;
        }
      }
      .calendar-num {
        margin-top: 6px;
        display: block;
        width: 100%;
        text-align: center;
        font-size: 30px;
        color: #424953;
      }
    }
    .hover-list {
      &:hover {
        background-color: rgba(182, 182, 182, 0.336);
        transition: all 1.5s;
      }
    }
    .opacity-class {
      opacity: 0.5;
    }
    .month-class {
      //   background-color: red;
      background-image: linear-gradient(
        45deg,
        rgba(000, 000, 000, 0.03) 25%,
        transparent 25%,
        transparent 50%,
        rgba(000, 000, 000, 0.03) 50%,
        rgba(000, 000, 000, 0.03) 75%,
        transparent 75%,
        transparent
      );
      background-size: 20px 20px;
    }
    .todayBg {
      background: #fffdef;
    }
    .handleDay {
      background: #2061ff !important;
      .date-day {
        color: #bccfff !important;
      }
      .calendar-num {
        color: #fff !important;
      }
    }
  }

  .colorDes {
    display: flex;
    flex-direction: row;
    width: 100%;

    .colorBox {
      height: 30px;
      width: 80px;

      span {
        font-size: 12px;
        line-height: 30px;
        text-align: center;
        overflow: hidden;
      }
    }
  }
  .DrawerContainer {
    .contentWrap {
      text-align: left;
      padding-left: 5px;
      margin: 15px 5px;

      .contentItem {
        width: 70%;
      }
      .center {
        margin-top: 0.5rem;
        display: flex;
        flex-direction: row;
        justify-content: center;
      }
      .left {
        margin-right: 0.5rem;
      }
      .right {
        margin-left: 1rem;
      }
    }
  }
}
</style>
