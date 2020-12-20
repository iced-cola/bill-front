<template>
  <div>
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
    >
      <el-menu-item style="margin-left: 90px">理性消费 健康生活</el-menu-item>
      <el-menu-item index="1">账单一览</el-menu-item>
      <el-menu-item index="2">账单统计</el-menu-item>
      <el-submenu index="3" style="float: right; margin-right: 90px">
        <template slot="title">个人中心</template>
        <el-menu-item index="3-1" style="width: 30px">安全退出</el-menu-item>
      </el-submenu>
    </el-menu>

    <el-row class="tac" style="margin-top: 20px">
      <el-col :span="1">&nbsp;</el-col>
      <el-col :span="3">
        <el-menu
          default-active="1"
          class="el-menu-vertical-demo"
          @open="handleOpen"
          @close="handleClose"
        >
          <el-menu-item index="1" @click="addBill">
            <i class="el-icon-plus"></i>
            <span slot="title">新增账单</span>
          </el-menu-item>
          <el-menu-item index="2">
            <i class="el-icon-edit"></i>
            <span slot="title">修改账单</span>
          </el-menu-item>
          <el-menu-item index="3">
            <i class="el-icon-delete"></i>
            <span slot="title">删除账单</span>
          </el-menu-item>
          <el-menu-item index="4">
            <i class="el-icon-search"></i>
            <span slot="title">账单检索</span>
          </el-menu-item>
        </el-menu>
      </el-col>
      <!-- 
      <el-form :inline="true" :model="formParam" class="demo-form-inline">
        <el-form-item label="日期区间">
          <el-date-picker
            v-model="formParam.billDateFrom"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="formParam.detail"></el-input>
        </el-form-item>
        <el-form-item label="收支分类">
          <el-select v-model="inOutList" placeholder="收支分类">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select v-model="payWayList" placeholder="支付方式">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用途">
          <el-select v-model="usageTypeList" placeholder="用途区分">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form> -->

      <el-col :span="18">
        <el-table
          ref="multipleTable"
          :data="billDataList"
          tooltip-effect="dark"
          style="width: 100%; margin-left: 20px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="billId" label="id" width="150">
          </el-table-column>
          <el-table-column prop="billDate" label="账单日期" width="120">
          </el-table-column>
          <el-table-column prop="amountString" label="账单金额" width="130">
          </el-table-column>
          <el-table-column prop="inOutName" label="收支分类" width="120">
          </el-table-column>
          <el-table-column prop="payWayName" label="支付方式" width="140">
          </el-table-column>
          <el-table-column prop="usageTypeName" label="用途" width="120">
          </el-table-column>
          <el-table-column prop="detail" label="备注" width="250">
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="1">&nbsp;</el-col>
    </el-row>

    <el-dialog
      title="新增账单"
      :visible.sync="showBillForm"
      width="30%"
      :show-close="false"
    >
      <el-form ref="billForm" :model="billForm" label-width="80px">
        <el-form-item label="收支分类">
          <el-radio-group v-model="billForm.inOut" @change="inOutChange">
            <el-radio label="支出"></el-radio>
            <el-radio label="收入"></el-radio>
            <el-radio label="借出"></el-radio>
            <el-radio label="借入"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="账单日期">
          <el-date-picker
            type="date"
            placeholder="选择日期"
            v-model="billForm.billDate"
            format="yyyy-MM-dd"
            style="width: 100%"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="账单金额">
          <el-input-number
            v-model="billForm.amount"
            :min="0"
            style="width: 100%"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="支付方式">
          <el-select
            v-model="billForm.payWay"
            placeholder="请选择支付方式"
            style="width: 100%"
          >
            <el-option
              :label="item.wayName"
              :value="item.id"
              :key="item.id"
              v-for="item in payWayList"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用途区分" id="usage">
          <el-select
            v-model="billForm.usageType"
            placeholder="请选择用途区分"
            style="width: 100%"
          >
            <el-option
              :label="item.typeName"
              :value="item.id"
              :key="item.id"
              v-for="item in usageTypeList"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注详情">
          <el-input type="textarea" v-model="billForm.detail"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="createBill">立即创建</el-button>
          <el-button @click="closeBillForm">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import axios from "axios";
// axios.defaults.baseURL = '/api'

export default {
  inject: ["reload"],

  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
      billDataList: [],
      formParam: {
        billDateFrom: "",
        billDateTo: "",
        detail: "",
        inOutList: [],
        payWayList: [],
        usageTypeList: [],
      },
      inOutList: [
        { id: 1, type: "支出" },
        { id: 2, type: "收入" },
        { id: 3, type: "借出" },
        { id: 4, type: "借入" },
      ],
      payWayList: [],
      usageTypeList: [],
      pageNum: 0,
      pageSize: 20,
      selectedRows: [],
      showBillForm: false,
      billForm: {
        inOut: "支出",
        billDate: "",
        amount: "",
        payWay: "",
        usageType: "",
        detail: "",
      },
      showUsage: true,
    };
  },
  created() {
    // 初始化页面值填充
    axios
      .get("/api/payWay/list")
      .then((res) => {
        if (res.data.code === 0) {
          this.payWayList = res.data.data;
        }
      })
      .catch((err) => {
        this.openMessageError(err);
      });
    axios
      .get("/api/usage/list")
      .then((res) => {
        if (res.data.code === 0) {
          this.usageTypeList = res.data.data;
        }
      })
      .catch((err) => {
        this.openMessageError(err);
      });

    let param = {
      conditionDto: this.formParam,
    };
    axios
      .post(
        "/api/list?pageNum=" + this.pageNum + "&pageSize=" + this.pageSize,
        param
      )
      .then((res) => {
        if (res.data.code === 0) {
          this.billDataList = res.data.data.dataList;
        }
      })
      .catch((err) => {
        this.openMessageError(err);
      });
  },
  methods: {
    openMessageSuccess(message) {
      this.$message({
        message: message,
        type: "success",
      });
    },
    openMessageError(message) {
      this.$message({
        message: message,
        type: "error",
      });
    },
    openMessageWarn(message) {
      this.$message({
        message: message,
        type: "warning",
      });
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
    handleSelectionChange(val) {
      this.selectedRows = val;
    },
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    onSubmit() {
      console.log("请求参数: ", this.formParam);
    },
    closeBillForm() {
      this.showBillForm = false;
      this.billForm.amount = 0;
    },
    addBill() {
      this.showBillForm = true;
      this.getNowTime();
      this.billForm.payWay = this.payWayList[0].id;
      this.billForm.usageType = this.usageTypeList[0].id;
    },
    createBill() {
      let inOut = "";
      if (this.billForm.inOut === "支出") {
        inOut = 1;
      } else if (this.billForm.inOut === "收入") {
        inOut = 2;
      } else if (this.billForm.inOut === "借出") {
        inOut = 3;
      } else {
        inOut = 4;
      }
      let param = {
        billDate: this.billForm.billDate,
        amount: this.billForm.amount,
        inOut: inOut,
        payWay: this.billForm.payWay,
        usageType: this.billForm.usageType,
        detail: this.billForm.detail,
      };
      console.log("参数: ", param);
      axios
        .post("/api/create", param)
        .then((res) => {
          console.log("res: ", res);
          if (res.data.code === 400) {
            this.openMessageError(res.data.message);
          } else {
            this.openMessageSuccess(res.data.message);
          }
        })
        .catch((err) => {
          this.openMessageError(err);
        });
      this.billForm.amount = 0;
      this.showBillForm = false;
    },
    getNowTime() {
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth(); //得到月份
      var date = now.getDate(); //得到日期
      month = month + 1;
      month = month.toString().padStart(2, "0");
      date = date.toString().padStart(2, "0");
      var defaultDate = `${year}-${month}-${date}`;
      this.billForm.billDate = defaultDate;
    },
    inOutChange(val) {
      if (val !== "支出") {
        document.getElementById("usage").style.display = "none";
      } else {
        document.getElementById("usage").style.display = "";
      }
    },
  },
};
</script>