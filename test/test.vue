<template>
  <div>
    <div id="bHLJCzFC">This is a draggable view! Please drag me!</div>
    <el-radio-group v-model="radio" id="stalEH2J">
      <el-radio :label="3">备选项 T1</el-radio>
      <el-radio :label="6">备选项 T1</el-radio>
    </el-radio-group>
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="活动名称">
        <el-input v-model="form.name"></el-input>
      <el-radio :label="6">备选项 T1</el-radio>
      </el-form-item>
    </el-form>
  </div>
</template>
