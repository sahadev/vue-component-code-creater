<template>
  <div id="zCl4FgIRl9">
    <div id="+CRj/D0RC8">
      <div class="demonstration-element" id="4ceW3JOmRs">Radio 单选框</div>
      <el-radio-group v-model="radio" lc-mark id="DMj2/GoK7N">
        <el-radio :label="3" id="JrBcb85EaU">备选项</el-radio>
        <el-radio :label="6" id="5O5P7QlUYi">备选项</el-radio>
        <el-radio :label="9" lc-mark id="w7tJg6GgV7">备选项</el-radio>
      </el-radio-group>
    </div>
    <div id="d13At+cPIC">
      <div class="demonstration-element" id="z27BTxBIwt">Checkbox 多选框</div>
      <el-checkbox-group lc-mark v-model="checkList" id="zkxddgoQ6+">
        <el-checkbox label="复选框 A" id="S6r21W8/Xs"></el-checkbox>
        <el-checkbox label="复选框 B" id="Q1WcC01am0"></el-checkbox>
        <el-checkbox lc-mark label="复选框 C" id="hrGXBeyBDu"></el-checkbox>
      </el-checkbox-group>
    </div>
    <div id="1HjTAfv0uh">
      <div class="demonstration-element" id="Qs45R/LgrF">Input 输入框</div>
      <div style="display:inline-block;width:200px;" lc-mark id="lN8dmG/ztm">
        <el-input v-model="input" placeholder="请输入内容" id="Fw3s45j1XZ"></el-input>
      </div>
      <el-input v-model="input" placeholder="请输入内容" lc-mark id="tqZz/MoCoc"></el-input>
    </div>
    <div id="1HjTAfv0uh">
      <div class="demonstration-element" id="Qs45R/LgrF">InputNumber 计数器</div>
      <div style="display:inline-block;width:200px;" lc-mark id="lN8dmG/ztm">
        <el-input-number v-model="num" @change="handleChange" :min="1" :max="10" label="描述文字"></el-input-number>
      </div>
    </div>
    <div id="zbwOu2bRct">
      <div class="demonstration-element" id="oJjGK4yRpQ">Select 选择器</div>
      <el-select v-model="value" lc-mark placeholder="请选择" id="yhJlMNfb30">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" id="JJvJ1iFxYQ">
        </el-option>
      </el-select>
    </div>
    <div id="YTa6ZVkK2O">
      <div class="demonstration-element" id="9C1zqqjX5s">Cascader 级联选择器</div>
      <el-cascader lc-mark v-model="value2" :options="options2" @change="handleChange" id="pU1PzPdszq"></el-cascader>
    </div>
    <div id="8KaEHi1c6o">
      <div class="demonstration-element" id="C7c+xRjvGO">Switch 开关</div>
      <el-switch lc-mark v-model="value3" active-text="按月付费" inactive-text="按年付费" id="iq7ib7kTDA"></el-switch>
    </div>
    <div id="TQoMaqMEjD">
      <div class="demonstration-element" id="ekUPB1BM+Y">Slider 滑块</div>
      <el-slider lc-mark v-model="value4" id="WOshXsu9bj"></el-slider>
    </div>
    <div id="7KI5xjoR7o">
      <div class="demonstration-element" id="surSrBUlOa">TimePicker 时间选择器</div>
      <el-time-select v-model="value5" lc-mark :picker-options="{ start: '08:30', step: '00:15', end: '18:30' }"
        placeholder="选择时间" id="tqTb7tAHV+"></el-time-select>
    </div>
    <div id="RLf1n2FDPv">
      <div class="demonstration-element" id="yincHg7Y9a">DatePicker 日期选择器</div>
      <el-date-picker v-model="value6" lc-mark type="date" placeholder="选择日期" id="8JSaWCsEa4"></el-date-picker>
    </div>
    <div id="6Jf5RcS8fq">
      <div class="demonstration-element" id="Wa7wZ81NAt">Upload 上传</div>
      <el-upload action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview"
        :on-remove="handleRemove" :before-remove="beforeRemove" multiple lc-mark :limit="3" :on-exceed="handleExceed"
        :file-list="fileList" id="ge2lt0HYLd">
        <el-button size="small" type="primary" id="b6m1sb7O2x">点击上传</el-button>
        <div slot="tip" class="el-upload__tip" id="LWDRdD0K55">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
      <div lc-mark style="max-width:400px;font-size:12px;">用户头像上传:
        <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/" :show-file-list="false"
          :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar" /> <i v-else
            class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div lc-mark style="max-width:400px;font-size:12px;">图片列表缩略图:
        <el-upload class="upload-demo" action="https://jsonplaceholder.typicode.com/posts/" :on-preview="handlePreview"
          :on-remove="handleRemove" :file-list="fileList" list-type="picture">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </div>
      <el-upload class="upload-demo" lc-mark drag action="https://jsonplaceholder.typicode.com/posts/" multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或 <em>点击上传 </em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </div>
    <div id="jw86DSY6ad">
      <div class="demonstration-element" id="dcUniQFw32">Rate 评分</div>
      <el-rate v-model="value7" lc-mark show-text id="uahfpGzmNn"></el-rate>
    </div>
    <div id="/hnBVg18h5">
      <div class="demonstration-element" id="lTU7X3g7ba">ColorPicker 颜色选择器</div>
      <el-color-picker lc-mark v-model="color1" id="KSZuFYxYEA"></el-color-picker>
    </div>
  </div>
</template>

<script>
export default {
  props: [],
  components: {},
  data() {
    return {
      // 在此自动生成
      beforeAvatarUpload: '',
      beforeRemove: '',
      checkList: '',
      color1: '',
      end: '',
      fileList: '',
      handleAvatarSuccess: '',
      handleExceed: '',
      handlePreview: '',
      handleRemove: '',
      imageUrl: '',
      in: '',
      input: '',
      item: '',
      label: '',
      num: '',
      options: '',
      options2: '',
      radio: '',
      start: '',
      step: '',
      value: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      value7: ''
    };
  },
  watch: {},
  computed: {},
  beforeCreate() { },
  created() { },
  beforeMount() { },
  mounted() { },
  beforeUpdate() { },
  updated() { },
  destoried() { },
  methods: {
    // 在此自动生成
    request() {
      // 网络请求，可选
    },
    handleChange() { }
  },
  fillter: {},
};
</script>

<style scoped>
/*  在此自动生成 */
.avatar {
}
.avatar-uploader {
}
.avatar-uploader-icon {
}
.demonstration-element {
}
.el-icon-plus {
}
.el-icon-upload {
}
.el-upload__text {
}
.el-upload__tip {
}
.upload-demo {
}
</style>