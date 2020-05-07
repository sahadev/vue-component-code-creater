<template>
  <div class="grade-info-wrapper" v-loading="loading">
    <!-- 标题内容 -->
    <div class="grade-info-title">
      <span style="color: black;" @click="goBack">
        <i class="el-icon-back"></i>
      </span>
      我的班级
    </div>
    <!-- 学员信息 -->
    <div class="grade-info-top">
      <div class="grade-info-content">
        <div class="info-top">{{ className }}（总人数：{{ totalNum }}）</div>
        <div class="info-bottom">
          <div class="info-bottom-progress" v-if="Number(class_status) == 1">开课日期：{{ time }}</div>
          <div
            class="info-bottom-progress"
            v-else-if="Number(class_status) == 2 || Number(class_status) == 3"
          >今日进度：{{ time }}</div>
          <div class="info-bottom-btn" v-if="subject_id === 3">
            <img :src="planImgUrl" alt />
            <el-button type="text" @click="handleCheckLearningPlan(true)">学习计划</el-button>
          </div>
          <!-- <div class="info-bottom-total">
            总人数：<span>{{ totalNum }}</span>
          </div>-->
        </div>
      </div>
      <rate-block title="加V率" :rate="addFriendRate" :num="addFriendNum" :total="totalNum" />
      <rate-block title="进群率" :rate="addGroupRate" :num="addGroupNum" :total="totalNum" />
      <rate-block title="完课率" :rate="finishRate" />
      <rate-block title="点评率" :rate="remarkRate" />
      <rate-block
        v-show="course_type == 1 && class_status !== 1"
        title="转化率"
        :rate="transferRate"
        :num="transferNum"
        :total="transferTotal"
      />
    </div>
    <iframe-dialog
      title="今日学习计划"
      :width="'60%'"
      :isShow="iframeVisible"
      :updateShow="handleCheckLearningPlan"
      :path="cls_plan_url"
    ></iframe-dialog>
    <!-- 列表详情 -->
    <div class="grade-info-list-container">
      <el-tabs v-model="activeTab">
        <el-tab-pane label="讲次列表" name="curList">
          <div class="grade-info_tab-container">
            <div class="grade-info_cur_title-container">
              <div class="grade-info_cur_sel-container">
                <selector v-on:update-selector="handleDateVal" :weekDatas="lessonDate" />
                <div
                  class="grade-info_cur_sel-finish-rate"
                >完课率: {{ finish_rate === "" ? 0 : finish_rate }}%</div>
                <div
                  class="grade-info_cur_sel-finish-rate"
                >点评率: {{ remark_rate === "" ? 0 : remark_rate }}%</div>
              </div>
              <el-button
                v-if="+subject_id === 2 && +dateVal[1] !== 5"
                type="text"
                @click="handleExportPraiseList('math')"
              >
                <span class="grade-info_cur_sel-finish-icon"></span>
                思维挑战表扬榜
              </el-button>
              <el-button
                v-if="+subject_id === 1 || +subject_id === 3"
                type="text"
                @click="handleExportPraiseList('')"
              >
                <span class="grade-info_cur_sel-finish-icon"></span>
                导出本课次完课榜单
              </el-button>
            </div>
            <div class="list-search">
              <el-input
                size="mini"
                class="list-input"
                placeholder="输入学员ID、姓名、手机号后4位进行查询"
                suffix-icon="el-icon-search"
                v-model.trim="searchStuList"
                @input="filterStuList"
              ></el-input>
              <el-button
                size="mini"
                class="list-button"
                type="primary"
                plain
                :disabled="Number(noFinishList.length) == 0"
                @click="lessonList = noFinishList"
              >未完课({{ noFinishList.length }})</el-button>
              <el-button
                size="mini"
                class="list-button"
                type="primary"
                plain
                :disabled="Number(noCommentList.length) == 0"
                @click="lessonList = noCommentList"
              >未点评({{ noCommentList.length }})</el-button>
              <el-button
                size="mini"
                type="primary"
                plain
                @click="
                  lessonList = lessonListBase;
                  searchStuList = '';
                "
              >重置</el-button>
            </div>
            <div class="list-table-wrapper">
              <el-table
                size="mini"
                ref="curListTable"
                :data="lessonList"
                v-loading="lessonLoading"
                height="100%"
                style="width: 100%"
                :header-cell-style="getRowClass"
                @selection-change="handleLessonSelectionChange"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="id" label="ID" width="120">
                  <template slot-scope="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column prop="name" label="学员姓名">
                  <template slot-scope="scope">
                    <span
                      @click="handleJump(scope.row.id, scope.row.name)"
                      style="cursor: pointer; color: #639bff;"
                    >{{ scope.row.name }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="mobile" label="手机号码">
                  <template slot-scope="scope">
                    <div class="phone-class">
                      <span>
                        {{ scope.row.mobile }}
                        <el-popover
                          placement="bottom"
                          width="200"
                          trigger="click"
                          content="studentMobile"
                          @show="getPhoneNumber(scope.row.id)"
                        >
                          <div class="bubble">{{ currentPhoneNumber }}</div>
                          <el-button
                            class="table-scan"
                            type="text"
                            slot="reference"
                            v-show="scope.row.mobile !== '无'"
                          >查看</el-button>
                        </el-popover>
                        <outbound-item
                          :isShow="scope.row.mobile"
                          :biz_stu_id="scope.row.id"
                          :width="20"
                          :bottom="3"
                        ></outbound-item>
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="process" label="课程进度" show-overflow-tooltip width="116"></el-table-column>
                <el-table-column prop="finish" label="完课" show-overflow-tooltip width="120">
                  <template slot-scope="scope">
                    <span
                      :style="
                        scope.row.finish === '未完课' ? 'color: #E02727' : ''
                      "
                    >{{ scope.row.finish }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="score" label="课堂评分" show-overflow-tooltip width="120"></el-table-column>
                <el-table-column prop="report" label="报告点评" show-overflow-tooltip width="120">
                  <template slot-scope="scope">
                    <span v-if="scope.row.report === ''">-</span>
                    <span
                      v-else-if="scope.row.is_remark === 0"
                      @click="handleCheckReport(scope.row, true)"
                      style="cursor: pointer; color: #639bff;"
                    >去点评</span>
                    <span
                      v-else
                      @click="handleCheckReport(scope.row, false)"
                      style="cursor: pointer; color: #639bff;"
                    >查看</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="grade-info-bottom">
              <span class="info-title">已选择{{ selectedLessons.length }}项</span>
              <el-button size="mini" @click.native="exportLessonExcel">列表导出</el-button>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="学员列表" name="stuList">
          <div class="grade-info_tab-container">
            <el-radio-group v-model="stuType" size="mini">
              <el-radio-button :disabled="!tableDataStore['1']" label="1">
                在读({{
                (tableDataStore["1"] && tableDataStore["1"].length) || 0
                }})
              </el-radio-button>
              <el-radio-button :disabled="!tableDataStore['2']" label="2">
                调入({{
                (tableDataStore["2"] && tableDataStore["2"].length) || 0
                }})
              </el-radio-button>
              <el-radio-button :disabled="!tableDataStore['3']" label="3">
                调出({{
                (tableDataStore["3"] && tableDataStore["3"].length) || 0
                }})
              </el-radio-button>
              <el-radio-button :disabled="!tableDataStore['4']" label="4">
                退费({{
                (tableDataStore["4"] && tableDataStore["4"].length) || 0
                }})
              </el-radio-button>
            </el-radio-group>
            <div class="list-search">
              <el-input
                size="mini"
                class="list-input"
                placeholder="输入学员ID、姓名、手机号后4位进行查询"
                suffix-icon="el-icon-search"
                v-model.trim="searchInput"
                @input="filterList('name', $event)"
              ></el-input>
              <el-button
                v-if="+stuType === 1"
                size="mini"
                class="list-button"
                type="primary"
                plain
                :disabled="Number(noBind) == 0"
                @click="filterList('bind', 0)"
              >未绑定({{ noBind }})</el-button>
              <el-button
                v-if="+stuType === 1"
                size="mini"
                type="primary"
                plain
                :disabled="Number(noGroup) == 0"
                @click="filterList('group', 0)"
              >未进群({{ noGroup }})</el-button>
              <el-button
                v-if="+stuType === 1"
                size="mini"
                type="primary"
                v-show="course_type == 1 && class_status !== 1"
                plain
                :disabled="Number(noTransfer) == 0"
                @click="filterList('translate', 0)"
              >未转化({{ noTransfer }})</el-button>
              <el-button size="mini" type="primary" plain @click="filterList('reset', '')">重置</el-button>
            </div>
            <div class="list-table-wrapper">
              <el-table
                size="mini"
                ref="stuListTable"
                v-loading="stuLstLoading"
                :data="tableData"
                :key="stuType"
                height="100%"
                style="width: 100%"
                :header-cell-style="getRowClass"
                @selection-change="handleSelectionChange"
              >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column v-if="+cloList[0] === 1" prop="id" label="ID" width="120"></el-table-column>
                <el-table-column v-if="+cloList[1] === 1" prop="name" label="学员姓名">
                  <template slot-scope="scope">
                    <span
                      @click="
                        handleJump(scope.row.biz_stu_id, scope.row.stu_name)
                      "
                      style="cursor: pointer; color: #639bff;"
                    >
                      {{ scope.row.name || scope.row.hide_mobile }}
                      <el-tag v-if="+stuType === 1 && +scope.row.stu_type === 2" size="mini">调入</el-tag>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="是否绑定"
                  show-overflow-tooltip
                  width="80"
                  v-if="+cloList[2] === 1"
                >
                  <template slot-scope="scope">
                    <span v-if="Number(scope.row.bind) === 1">是（wxid：{{ scope.row.wxid }}）</span>
                    <span v-else>否</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="是否进群"
                  show-overflow-tooltip
                  width="80"
                  v-if="+cloList[3] === 1"
                >
                  <template slot-scope="scope">
                    <span v-if="Number(scope.row.group) === 1">是</span>
                    <span v-else>否</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="完课"
                  show-overflow-tooltip
                  prop="finish"
                  width="100"
                  v-if="+cloList[4] === 1"
                ></el-table-column>
                <el-table-column v-if="+cloList[14] === 1" label="已点评率" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="scope.row.remark_num === 0">-</span>
                    <span v-else>
                      {{ scope.row.remark_rate }}%({{
                      scope.row.finish_remark_num
                      }}/{{ scope.row.remark_num }})
                    </span>
                  </template>
                </el-table-column>
                <el-table-column v-if="+cloList[15] === 1" label="未点评" width="80">
                  <template slot-scope="scope">
                    <span v-if="scope.row.wait_remark_num > 0" class="color-span" @click="handleJumpComment(scope.row)"  >{{ scope.row.wait_remark_num }}</span>
                    <span v-else-if="scope.row.wait_remark_num === 0">-</span>
                    <span v-else>{{ scope.row.wait_remark_num }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  label="是否转化"
                  show-overflow-tooltip
                  width="80"
                  v-if="
                    course_type == 1 && class_status !== 1 && +cloList[5] === 1
                  "
                >
                  <template slot-scope="scope">
                    <span v-if="Number(scope.row.translate) === 1">是</span>
                    <span style="color: #E02727" v-else>否</span>
                  </template>
                </el-table-column>
                <el-table-column v-if="+cloList[6] === 1" label="手机号">
                  <template slot-scope="scope">
                    <div class="phone-class">
                      <span>
                        {{ scope.row.hide_mobile }}
                        <el-popover
                          placement="bottom"
                          width="200"
                          trigger="click"
                          content="studentMobile"
                          @show="getPhoneNumber(scope.row.biz_stu_id)"
                        >
                          <div class="bubble">{{ currentPhoneNumber }}</div>
                          <el-button
                            class="table-scan"
                            type="text"
                            slot="reference"
                            v-show="scope.row.hide_mobile !== '无'"
                          >查看</el-button>
                        </el-popover>
                        <outbound-item
                          :isShow="scope.row.hide_mobile"
                          :biz_stu_id="scope.row.biz_stu_id"
                          :width="20"
                          :bottom="3"
                        ></outbound-item>
                      </span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  v-if="+cloList[7] === 1"
                  prop="call_in_time"
                  label="调入时间"
                  width="200"
                ></el-table-column>
                <el-table-column
                  v-if="+cloList[8] === 1"
                  prop="call_out_cls"
                  label="调出班级"
                  width="200"
                ></el-table-column>
                <el-table-column
                  v-if="+cloList[9] === 1"
                  prop="call_out_tch"
                  label="辅导老师"
                  width="200"
                ></el-table-column>
                <el-table-column
                  v-if="+cloList[10] === 1"
                  prop="call_out_time"
                  label="调出时间"
                  width="200"
                ></el-table-column>
                <el-table-column
                  v-if="+cloList[11] === 1"
                  prop="call_in_cls"
                  label="调入班级"
                  width="200"
                ></el-table-column>
                <el-table-column
                  v-if="+cloList[12] === 1"
                  prop="call_in_tch"
                  label="辅导老师"
                  width="200"
                ></el-table-column>
                <el-table-column
                  v-if="+cloList[13] === 1"
                  prop="refund_time"
                  label="退费时间"
                  width="200"
                ></el-table-column>
              </el-table>
            </div>
            <div class="grade-info-bottom">
              <span class="info-title">已选择{{ selectedPeopleArr.length }}项</span>
              <el-button size="mini" @click.native="exportExcel">列表导出</el-button>
              <!--英语不显示转班按钮-->
              <el-button
                size="mini"
                @click.native="convertClass"
                v-if="classType == 1 && !isCloseStatus"
              >批量转班</el-button>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <learning-report
        :isShow="learningReportVisible"
        :updateShow="updateReportShow"
        :path="reportUrl"
      ></learning-report>
      <praise :priseInfo="priseInfo" v-if="priseInfo" ref="praise" />
      <iframe ref="iframe" class="info-frame"></iframe>
    </div>

    <el-dialog
      title="请选择转入班级"
      :visible.sync="convertClassDialogShow"
      width="30%"
      :before-close="handleConvertDialogClose"
    >
      <el-radio-group v-model="convertIntoClass">
        <el-radio
          v-for="(item) in convertIntoClassList"
          v-bind:key="item.biz_cls_id"
          :label="item.biz_cls_id"
          :class="[block]"
        >{{item.cls_name}}({{item.stu_num}}人)</el-radio>
      </el-radio-group>
      <span slot="footer" class="dialog-footer">
        <el-button @click="convertClassDialogShow = false">取 消</el-button>
        <el-button type="primary" @click="comfirmConvertClass">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="学员备注修改提示"
      :visible.sync="showModifyBackupDialog"
      width="30%"
      center
      :before-close="handleConvertDialogClose"
    >
      <div class="dialog-container">
        <div>该批转班学员关联微信备注将会同步修改</div>
        <div>注：此段时间请不要操作矩阵手机。</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showModifyBackupDialog = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import services from "services";
const {
  getGradeInfo,
  getGradeStusListDetail,
  getGradeChangeStuListDetail,
  getClassStudentMobile,
  ExportGradeInfo,
  ExportLearningInfo,
  getLessonDate,
  getLessonList,
  getPraiseList,
  getMathPraiseList,
  getConvertClassList,
  comfirmConvertClass
} = services;
import RateBlock from "components/RateBlock";
import Praise from "components/Praise";
import Selector from "./Components/Selector";
import LearningReport from "components/LearningReport.vue";
import api from "api";
import OutboundItem from "components/OutboundItem.vue";
import IframeDialog from "components/IframeDialog.vue";
import { stuTypeClo, getToken } from "utils";
const { proxyResourceAPI } = api;
// import mockData from "./mockData"
// NOTE  default select type
const NORMAL = 1;
// test 73c0cfe504eb4be683ff6f55033f7add
export default {
  name: "gradeInfo",
  data() {
    return {
      cls_plan_url: "", //今日学习计划的链接
      iframeVisible: false, //查看学习计划
      activeTab: "curList",
      loading: false,
      course_type: null, //课程类型
      subject_id: null, //学科id
      className: "", // 班级姓名
      class_status: 0, // 班级状态
      totalNum: null, // 总人数
      addFriendRate: null, // 加v率
      addFriendNum: null, // 加v人数
      addGroupRate: null, // 加群率
      addGroupNum: null, // 加群人数
      transferRate: null, // 转化率
      transferNum: null, // 转化人数
      transferTotal: null, // 转化总人数
      finishRate: null, // 完课率
      remarkRate: null, //点评率
      remarkNum: null, //点评总数
      finishRemarkNum: null, //已点评的数量
      commentRate: null, //点评率
      finishNum: null, // 完课人数
      allLesson: null, // 总人数
      searchInput: "",
      tableData: [],
      tableDataStore: {},
      noBind: 0,
      noGroup: 0,
      noTransfer: 0,
      selectedPeopleArr: [], //已经选择的项
      selectedLessons: [],
      currentPhoneNumber: null, //  the phone number of current mouse touch contact
      lessonDate: [],
      lessonList: [],
      lessonListBase: [],
      finish_rate: "", //讲次列表下的完课率
      remark_rate: "", //讲次列表下的点评率
      noFinishList: [], //未完课的数组
      noCommentList: [], //未点评数据的数组
      priseInfo: null,
      searchStuList: "",
      dateVal: [],
      lessonLoading: false,
      stuLstLoading: false,
      reportUrl: "",
      learningReportVisible: false,
      planImgUrl: require("../../assets/plan@2x.png"),
      stuType: NORMAL,
      cloList: stuTypeClo[NORMAL].split(""),
      convertClassDialogShow: false,
      convertIntoClass: -1,
      convertIntoClassList: [],
      showModifyBackupDialog: false,
      block: "block",
      classType: 0, // 为1的时候，则表示班级处于近期将开状态
      isCloseStatus: false
    };
  },
  watch: {
    stuType: {
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.cloList = stuTypeClo[this.stuType].split("");
          if (Object.keys(this.tableDataStore).length > 0) {
            this.tableData = Object.freeze(this.tableDataStore[this.stuType]);
            this.selectedPeopleArr = "";
            this.filterList("name");
          }
        }
      }
    },
    lessonDate(newValue) {}
  },
  created() {
    this.init();
    this.classType = this.$route.query.type;
    if (this.classType === 1) this.activeTab = "stuList";
    else {
      this.activeTab = "curList";
    }
  },
  methods: {
    /**
     * @description 初始化数据
     */
    init() {
      this.setGradeInfo();
      this.setGradeList();
      this.setLessonDate();
    },

    goBack() {
      this.$router.go(-1);
    },

    /**
     * @description 获取班级数据
     * @returns {Object} 班级数据
     */
    async setGradeInfo() {
      try {
        this.loading = true;
        // this.time = this.$route.query.time;
        this.subject_id = this.$MX.bus.getUserInfo().subject_id;
        // 73c0cfe504eb4be683ff6f55033f7add
        let result = await getGradeInfo({
          biz_cls_id: this.$route.query.biz_cls_id,
          subject_id: this.subject_id
        });
        this.loading = false;
        this.time = result.display_time;
        this.className = result.class_name;
        this.totalNum = result.total_num;
        this.addFriendRate = result.add_friend_rate;
        this.addFriendNum = result.add_friend_num;
        this.addGroupRate = result.add_group_rate;
        this.addGroupNum = result.add_group_num;
        this.finishRate = result.finish_rate;
        this.remarkRate = result.remark_rate;
        this.remarkNum = result.remark_num;
        this.finishRemarkNum = result.finish_remark_num;
        this.finishNum = result.finish_num;
        this.allLesson = result.all_lesson;
        this.transferRate = result.transfer_rate;
        // this.commentRate = result.
        this.transferNum = result.transfer_num;
        this.transferTotal = result.transfer_total;
        this.class_status = result.class_status;
        this.course_type = result.course_type;
        this.cls_plan_url = result.hasOwnProperty("cls_plan_url")
          ? result.cls_plan_url
          : "";
        this.isCloseStatus = result.cls_close_type === 1;
      } catch (e) {
        console.error(e);
        this.loading = false;
      }
    },

    /**
     * @description 获取列表
     */
    async setGradeList() {
      try {
        this.stuLstLoading = true;
        const { biz_wx, biz_tch_id } = this.$MX.bus.getUserInfo();
        let result = await getGradeChangeStuListDetail({
          biz_wx,
          biz_tch_id,
          biz_cls_id: this.$route.query.biz_cls_id,
          subject_id: this.subject_id
        });
        let noBind = 0;
        let noGroup = 0;
        let noTransfer = 0;
        let std_num = 0;
        let std_in = 0;
        let std_out = 0;
        let std_refund = 0;
        let formatTableData = {};
        if (Array.isArray(result.student_list)) {
          result.student_list.forEach((item, index) => {
            if (+item.stu_type === 1 || +item.stu_type === 2) {
              noBind = Number(item.is_friend) === 0 ? noBind + 1 : noBind;
              noGroup = Number(item.is_group) === 0 ? noGroup + 1 : noGroup;
              noTransfer =
                Number(item.is_transfer) === 0 ? noTransfer + 1 : noTransfer;
            }
            const itemObj = {
              index,
              id: item.biz_stu_id,
              name: item.stu_name,
              hide_mobile: item.hide_mobile,
              bind: Number(item.is_friend),
              wxid: item.stu_wechat_no,
              group: Number(item.is_group),
              translate: Number(item.is_transfer),
              stu_wechat_no: item.stu_wechat_no,
              biz_stu_id: item.biz_stu_id,
              stu_name: item.stu_name,
              finish: `${item.finish_rate}% (${item.schedule_den}/${item.schedule_num})`,
              // 新增 NOTE  针对调入
              stu_type: item.stu_type,
              call_in_time: item.call_in_time,
              call_out_cls: item.call_out_cls,
              call_out_tch: item.call_out_tch,
              //  新增 NOTE  针对调出
              call_out_time: item.call_out_time,
              call_in_cls: item.call_in_cls,
              call_in_tch: item.call_in_tch,
              //  新增 NOTE  针对退费
              refund_time: item.refund_time,
              // 点评
              remark_num: item.remark_num,
              finish_remark_num: item.finish_remark_num,
              remark_rate: item.remark_rate,
              wait_remark_num: item.wait_remark_num
            };
            // "stu_type" 学员所在班级的状态（1-正常，2-调入，3-调出，4-退费）
            formatTableData[item.stu_type] =
              formatTableData[item.stu_type] || [];
            formatTableData[item.stu_type].push(itemObj);
            // 将属性为调入也放入在读
            if (+item.stu_type === 2) {
              formatTableData["1"] = formatTableData["1"] || [];
              formatTableData["1"].push(itemObj);
            }
          });
          this.tableDataStore = Object.freeze(formatTableData);
          this.tableData = Object.freeze(this.tableDataStore[this.stuType]);
          this.noBind = noBind;
          this.noGroup = noGroup;
          this.noTransfer = noTransfer;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.stuLstLoading = false;
      }
    },

    // 课次详情-周天list
    async setLessonDate() {
      try {
        const result = await getLessonDate({
          biz_cls_id: this.$route.query.biz_cls_id,
          subject_id: this.subject_id
        });
        if (!result) {
          return;
        }
        this.lessonDate = result;
      } catch (e) {
        console.error(e);
      }
    },

    // 获取课程日期选择值
    handleDateVal(val) {
      this.dateVal = val;
      this.setLessonList(val);
    },

    // 搜索班次信息中学员
    filterStuList() {
      const value = this.searchStuList;
      this.lessonList = this.lessonListBase.filter(item => {
        // 截取手机后四位
        let phone = item.mobile.toString();
        let phoneLastFour = phone.substr(phone.length - 4);
        return (
          item.name.toString().indexOf(value) !== -1 ||
          phoneLastFour.indexOf(value) !== -1
        );
      });
    },

    // 班级详情讲次列表
    async setLessonList([week, day]) {
      try {
        this.lessonLoading = true;
        const result = await getLessonList({
          biz_cls_id: this.$route.query.biz_cls_id,
          subject_id: this.subject_id,
          week,
          day
        });
        if (!result) return;
        let { student_list, finish_rate, remark_rate } = result;
        if (!student_list) student_list = [];
        // 保存一份noFinishList
        let noFinishList = [];
        let noCommentList = [];
        // 数据展示转换
        const list = student_list.map(stu => {
          let {
            biz_stu_id,
            stu_name,
            schedule_num,
            schedule_den,
            finish,
            score,
            report,
            hide_mobile,
            is_remark
          } = stu;
          // 语文/数学 的1 是完课
          // 英语的3 是完课

          const target = +this.subject_id === 3 ? 3 : 1;
          const stuItem = {
            id: biz_stu_id,
            name: stu_name || hide_mobile,
            process: `${schedule_den}/${schedule_num}`,
            finish:
              +finish === target
                ? "完课"
                : +finish !== target && +schedule_den === 0
                ? "-"
                : "未完课",
            score: +score > 0 ? score : "-",
            report: +finish === target ? report : "",
            mobile: hide_mobile,
            is_remark: is_remark
          };
          if (+finish !== target) {
            noFinishList.push(stuItem);
          }
          if (stuItem.finish === "完课" && is_remark !== 1) {
            noCommentList.push(stuItem);
          }

          return stuItem;
        });
        this.lessonList = this.lessonListBase = Object.freeze(list);
        this.finish_rate = finish_rate;
        this.remark_rate = remark_rate;
        this.noFinishList = Object.freeze(noFinishList);
        this.noCommentList = Object.freeze(noCommentList);

        this.filterStuList();
      } catch (e) {
        this.lessonList = [];
        this.finish_rate = "";
        this.noFinishList = [];
        this.noCommentList = [];
        this.$message({
          type: "error",
          message: e
        });
        console.warn(e);
      } finally {
        this.lessonLoading = false;
      }
    },

    // 查询表扬榜单数据
    async handleExportPraiseList(subject) {
      console.log(subject);
      const loading = this.$loading({
        lock: true,
        text: "请求数据中,请稍等",
        spinner: "el-icon-loading",
        background: "rgba(f, 0, 0, 0.3)"
      });
      try {
        // const suffix = process.env.VUE_APP_APPID;
        const token = getToken();
        const [week, day] = this.dateVal;
        if (subject === "math") {
          const result = await getMathPraiseList({
            biz_cls_id: this.$route.query.biz_cls_id,
            subject_id: this.subject_id,
            week,
            day
          });
          // const result = mockData;
          loading.text = "正在生成榜单,请稍等";
          if (
            (!result.prefect_list || result.prefect_list.length === 0) &&
            (!result.potential_list || result.potential_list.length === 0)
          ) {
            loading.close();
            return this.$message({
              type: "warning",
              message: "当前暂无上榜学员，请稍后导出"
            });
          }
          result.prefect_list &&
            result.prefect_list.forEach(item => {
              if (item.headimg_url) {
                item.headimg_url = `${proxyResourceAPI}?url=${item.headimg_url}&token=${token}&compress=1`;
              }
            });
          result.potential_list &&
            result.potential_list.forEach(item => {
              if (item.headimg_url) {
                item.headimg_url = `${proxyResourceAPI}?url=${item.headimg_url}&token=${token}&compress=1`;
              }
            });
          this.priseInfo = result;
        } else {
          const result = await getPraiseList({
            biz_cls_id: this.$route.query.biz_cls_id,
            subject_id: this.subject_id,
            week,
            day
          });
          loading.text = "正在生成榜单,请稍等";
          if (!result.student_list || result.student_list.length === 0) {
            loading.close();
            return this.$message({
              type: "warning",
              message: "导出人数为空"
            });
          }
          result.student_list.forEach(item => {
            if (item.headimg_url) {
              item.headimg_url = `${proxyResourceAPI}?url=${item.headimg_url}&token=${token}&compress=1`;
            }
          });
          this.priseInfo = result;
        }

        // 清理iframe中的状态
        this.$refs.iframe.src = "";
        this.$nextTick(() => {
          // console.log(this.$refs.praise);
          this.$refs.praise.genList().then(() => {
            loading.close();
          });
        });
      } catch (e) {
        console.log(e);
        loading.close();
      }
    },

    /**
     * @description 实时查看已选择的列
     */
    handleSelectionChange(val) {
      this.selectedPeopleArr = val;
    },

    handleLessonSelectionChange(val) {
      this.selectedLessons = val;
    },

    updateReportShow(val) {
      this.learningReportVisible = val;
    },

    handleJump(biz_stu_id, stu_name) {
      const { wechat_no } = this.$MX.bus.getUserInfo();
      this.$router.push({
        path: "/studentInfo",
        query: {
          subject_id: this.subject_id,
          teacherChaNo: wechat_no,
          biz_stu_id,
          stu_name
        }
      });
    },

    /**
     * @description 配置表头颜色
     */
    getRowClass({ rowIndex }) {
      if (rowIndex === 0) {
        return "background: #F6F7F8";
      } else {
        return "";
      }
    },

    /**
     * @desprition 搜索
     * @param {String} field 字段名
     * @param {String|Number} value 值
     */
    filterList(field, value) {
      if (field === "name" && !value) {
        value = this.searchInput;
      }
      const tableDataCopy =
        this.tableDataStore &&
        Object.freeze(this.tableDataStore[this.stuType]).slice();
      if (value === "") {
        if (field === "reset") this.searchInput = "";
        return (this.tableData = tableDataCopy);
      }
      this.tableData = tableDataCopy.filter(item => {
        let res = false;
        if (field == "name") {
          // 截取手机后四位
          let phone = item["hide_mobile"].toString();
          let phoneLastFour = phone.substr(phone.length - 4);
          res =
            item[field].toString().indexOf(value) !== -1 ||
            phoneLastFour.indexOf(value) !== -1;
        } else {
          res = item[field].toString().indexOf(value) !== -1;
        }

        return res;
      });
    },

    /**
     * @description 深拷贝
     * @param {Obj} 源值
     */
    deepClone(obj) {
      if (obj == null) return obj; // null == undefined
      if (obj instanceof Date) return new Date(obj);
      if (obj instanceof RegExp) return new RegExp(obj);
      if (typeof obj != "object") return obj;
      let newObj = new obj.constructor();
      for (let key in obj) {
        newObj[key] = this.deepClone(obj[key]);
      }
      return newObj;
    },

    /**
     * @description 查看当前用户的电话
     */
    scanPhone(index) {
      this.tableData.forEach(item => {
        if (item.index === index) {
          item.visible = !item.visible;
        }
      });
    },

    /**
     * 获取手机号
     * @params {Number} id 留言id
     */
    async getPhoneNumber(id) {
      try {
        const { biz_wx, subject_id } = this.$MX.bus.getUserInfo();
        let result = await getClassStudentMobile({
          biz_stu_id: id, //item.biz_stu_id,
          subject_id,
          biz_wx,
          operate_type: 2
        });
        let phone = (result && result.mobile) || "无号码";
        this.currentPhoneNumber = phone;
      } catch (e) {
        console.error(e);
      }
    },

    /**
     * @method removePhoneNumber remove currentPhoneNumber
     */
    removePhoneNumber() {
      this.currentPhoneNumber = null;
    },
    /**
     * @description 点评查看学习报告
     * item 讲次下学生对象
     * isEdit  报告是查看还是去点评的状态
     */
    handleCheckReport(item, isEdit) {
      //去点评的路由的跳转  待修改
      const [week, day] = this.dateVal;
      this.$router.push({
        path: "/commentDetail",
        query: {
          isEdit: isEdit,
          params: JSON.stringify({
            biz_stu_id: item.id,
            class_id: this.$route.query.biz_cls_id,
            week: week,
            day: day,
            is_service: 2
          })
        }
      });
      // 原来的处理逻辑暂时先不用
      // this.reportUrl = reportUrl;
      // this.learningReportVisible = true;
    },
    /**
     * @description 处理查看今日计划
     */
    handleCheckLearningPlan(val) {
      this.iframeVisible = val;
    },
    /**
     * @description 列表导出
     */
    async exportExcel() {
      let obj = {
        stu_type: this.stuType,
        subject_id: this.subject_id,
        biz_cls_id: this.$route.query.biz_cls_id
      };
      if (this.selectedPeopleArr.length <= 0) {
        return this.$message({
          type: "error",
          message: "请选择数据"
        });
      } else {
        this.selectedPeopleArr.map((item, index) => {
          let key = `biz_stu_ids[${index}]`;
          obj[key] = item.biz_stu_id;
        });
        // multipleTable 中的 ref 待修改
        // this.$refs.multipleTable.clearSelection();
        await ExportGradeInfo(obj, this.$refs.iframe);
      }
    },
    async exportLessonExcel() {
      const [week, day] = this.dateVal;
      let obj = {
        subject_id: this.subject_id,
        biz_cls_id: this.$route.query.biz_cls_id,
        week,
        day
      };
      if (this.selectedLessons.length <= 0) {
        return this.$message({
          type: "error",
          message: "请选择数据"
        });
      } else {
        this.selectedLessons.map((item, index) => {
          let key = `biz_stu_ids[${index}]`;
          obj[key] = item.id;
        });
        // multipleTable 中的 ref 待修改
        // this.$refs.multipleTable.clearSelection();
        await ExportLearningInfo(obj, this.$refs.iframe);
      }
    },
    // 处理学生的页面跳转
    handleJumpComment(item) {
      this.$router.push({
        path: "/commentDetail",
        query: {
          isEdit: true,
          params: JSON.stringify({
            biz_stu_id: item.biz_stu_id,
            class_id: this.$route.query.biz_cls_id,
            is_service: 2
          })
        }
      });
    },
    convertClass() {
      if (this.selectedPeopleArr && this.selectedPeopleArr.length > 0) {
        const studsID = this.selectedPeopleArr.map(item => item.id);
        this.convertClassDialogShow = true;
        const userInfo = this.$MX.bus.getUserInfo();
        getConvertClassList({
          biz_wx: userInfo.biz_wx,
          subject_id: userInfo.subject_id,
          old_cls_id: this.$route.query.biz_cls_id
        })
          .then(res => {
            this.convertIntoClassList = res.list;
          })
          .catch(err => console.error(err));
      } else {
        this.$message({
          type: "error",
          message: "请先选择学员"
        });
      }
    },
    comfirmConvertClass() {
      if (this.convertIntoClass === -1) {
        this.$message({
          message: "请选择转入班级"
        });
        return;
      }
      const userInfo = this.$MX.bus.getUserInfo();
      comfirmConvertClass({
        stu_ids: this.selectedPeopleArr.map(item => item.id),
        biz_wx: userInfo.biz_wx,
        subject_id: userInfo.subject_id,
        old_cls_id: this.$route.query.biz_cls_id,
        new_cls_id: this.convertIntoClass
      }).then(res => {
        if (res.status) {
          // success
          this.$message({
            message: "转班成功"
          });
          this.convertClassDialogShow = false;
          this.init();
        } 
        if (res.type === 1) {
          // -需要更新备注
          this.showModifyBackupDialog = true;
        }
      });
    },
    handleConvertDialogClose(done) {
      done();
    }
  },
  components: {
    RateBlock,
    Selector,
    Praise,
    LearningReport,
    OutboundItem,
    IframeDialog
  }
};
</script>

<style lang="scss">
.grade-info-wrapper {
  display: flex;
  flex-direction: column;
  // width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  padding: 30px;

  // 气泡
  .el-table__body-wrapper {
    position: relative;
  }
  .bubble-wrapper {
    position: relative;
  }
  .bubble-wrapper:hover .bubble {
    visibility: visible;
  }
  .bubble {
    visibility: hidden;
    position: absolute;
    width: 100px;
    line-height: 20px;
    height: 20px;
    top: 10px;
    left: 33px;
    text-align: center;
    color: #fff;
    background: #4c5675;
    border-radius: 3px;
  }
  .bubble::after {
    content: "";
    width: 0;
    height: 0;
    display: block;
    border-style: solid;
    border-width: 6px;
    border-color: transparent #4c5675 transparent transparent;
    position: absolute;
    z-index: 0;
    bottom: 4px;
    left: -10px;
  }

  .grade-info-title {
    font-size: 22px;
    color: #222;
    font-weight: 500;
    .el-icon-back {
      cursor: pointer;
    }
  }
  // 班级信息
  .grade-info-top {
    width: 100%;
    height: 90px;
    border-radius: 4px;
    background-color: #fff;
    display: flex;
    align-items: center;
    margin-top: 30px;
    .grade-info-content {
      display: flex;
      flex-direction: column;
      min-width: 326px;
      max-width: 356px;
      word-break: break-all;
      padding: 26px 20px 25px 20px;
      .info-top {
        font-size: 14px;
        color: black;
      }
      .info-bottom {
        width: 100%;
        display: flex;
        // justify-content: space-between;
        font-size: 12px;
        color: #666;
        margin-top: 18px;
        .info-bottom-progress {
          margin-right: 19px;
        }
        .info-bottom-total {
          span {
            margin-left: 4px;
            // font-size: 14px;
            color: #000;
          }
        }
        .info-bottom-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          img {
            width: 14px;
            height: 14px;
          }
          .el-button--text {
            padding: 0;
            margin-right: 2px;
          }
        }
      }
    }
  }
  //学员列表
  .color-span {
    color: #639bff;
    cursor: pointer;
  }
  .grade-info-list-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    // width: 100%;
    padding: 20px 20px 15px 20px;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 4px;
    .grade-info_tab-container {
      height: 58vh;
      display: flex;
      flex-direction: column;
      .grade-info_cur_title-container {
        display: flex;
        justify-content: space-between;
        .grade-info_cur_sel-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .grade-info_cur_sel-finish-rate {
            width: 100px;
            height: 34px;
            line-height: 34px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(102, 102, 102, 1);
            text-align: center;
            background: rgba(243, 243, 243, 1);
            border-radius: 4px;
            margin-left: 20px;
          }
        }
        .grade-info_cur_sel-finish-icon {
          display: inline-block;
          background: url("~@/assets/finish_icon@2x.png") no-repeat;
          background-size: contain;
          width: 19px;
          height: 16px;
          vertical-align: middle;
        }
      }
      // .list-title {
      //   font-size: 14px;
      //   font-weight: 500;
      //   color: #000;
      // }
      .list-search {
        width: 100%;
        margin: 15px 0 15px;
        .list-input {
          width: 280px;
          margin-right: 20px;
        }
        .list-button {
          margin-right: 10px;
        }
      }
      .list-table-wrapper {
        flex-grow: 1;
        height: 0;
        overflow: auto;
        .table-scan {
          font-size: 12px;
          color: #639bff;
          margin-left: 4px;
          cursor: pointer;
        }
        .cell {
          overflow: hidden;
        }
      }
    }
    .phone-class {
      display: flex;
      align-items: center;
    }
    // 底部导出
    .grade-info-bottom {
      width: 100%;
      // height: 78px;
      padding: 10px 0 0 10px;
      span.info-title {
        font-size: 12px;
        color: #666;
        margin-right: 20px;
      }
    }
  }
  .info-frame {
    display: none;
  }

  .block {
    display: block;
    padding: 10px 20px;
  }

  .dialog-container {
    padding: 0 15%;
    font-size: 18px;
    line-height: 20px;
    :last-child {
      margin-top: 20px;
    }
  }
}
</style>
