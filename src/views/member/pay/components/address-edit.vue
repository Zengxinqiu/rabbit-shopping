<template>
  <XtxDialog
    :title="`${form.id ? '修改' : '添加'}收货地址`"
    v-model="dialogVisible"
  >
    <div class="address-edit">
      <div class="xtx-form">
        <div class="xtx-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input
              v-model="form.receiver"
              class="input"
              placeholder="请输入收货人"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input
              v-model="form.contact"
              class="input"
              placeholder="请输入手机号"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <XtxCity
              :fullLocation="form.fullLocation"
              @change="changeCity"
              placeholder="请选择所在地区"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input
              v-model="form.address"
              class="input"
              placeholder="请输入详细地址"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input
              v-model="form.postalCode"
              class="input"
              placeholder="请输入邮政编码"
            />
          </div>
        </div>
        <div class="xtx-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input
              v-model="form.addressTags"
              class="input"
              placeholder="请输入地址标签，逗号分隔"
            />
          </div>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <XtxButton type="gray" style="margin-right: 20px">取消</XtxButton>
      <XtxButton type="primary" @click="submit">确认</XtxButton>
    </template>
  </XtxDialog>
</template>
<script>
import { reactive, ref } from "vue";
import { addAddress, editAddress } from "@/api/order";
import { Message } from "@/components/library/Message";
export default {
  name: "AddressEdit",
  setup(props, { emit }) {
    const dialogVisible = ref(false);
    // 打开函数
    const open = (address) => {
      // 打开对话框
      dialogVisible.value = true;
      //   两种情况：1.修改 2 添加
      if (address) {
        console.log(address);
        for (const key in form) {
          form[key] = address[key];
        }
      } else {
        //   先清空数据-添加
        for (const key in form) {
          form[key] = "";
        }
        form.isDefault = 0;
      }
      console.log(address);
    };

    // 表单数据
    const form = reactive({
      id: "",
      receiver: "", // 测试 收货人姓名
      contact: "", //  联系方式
      provinceCode: "", //  所在省份编码
      cityCode: "", //  所在城市编码
      countyCode: "", //  所在区/县编码
      address: "", //  详细地址
      postalCode: "", //  邮政编码
      addressTags: "", //  地址标签,以英文逗号分割
      isDefault: 0, //  是否为默认，0为是，1为否
      // ----------
      fullLocation: "",
    });
    // 选择地区
    const changeCity = (address) => {
      form.provinceCode = address.provinceCode;
      form.cityCode = address.cityCode;
      form.countyCode = address.countyCode;
      form.fullLocation = address.fullLocation;
    };
    // 提交表单
    // 提交表单
    const submit = async () => {
      if (form.id) {
        // 情况1：修改 - 发送修改地址请求，需要 id
        await editAddress(form);
        console.log(form);
      } else {
        // 情况2：添加 - 发送添加地址请求，无需 id
        await addAddress(form);
      }
      // 公共部分：提示和隐藏对话框
      Message({
        type: "success",
        message: `${form.id ? "修改" : "添加"}收货地址成功`,
      });
      dialogVisible.value = false;
      // 通知父组件
      emit("on-success", form);
    };
    return { dialogVisible, open, form, changeCity, submit };
  },
};
</script>
<style scoped lang="less">
.address-edit {
  .xtx-dialog {
    :deep(.wrapper) {
      width: 780px;
      .body {
        font-size: 14px;
      }
    }
  }
  .xtx-form {
    padding: 0;
    input {
      outline: none;
      &::placeholder {
        color: #ccc;
      }
    }
  }
  .xtx-city {
    width: 320px;
    :deep(.select) {
      height: 50px;
      line-height: 48px;
      display: flex;
      padding: 0 10px;
      justify-content: space-between;
      .placeholder {
        color: #ccc;
      }
      i {
        color: #ccc;
        font-size: 18px;
      }
      .value {
        font-size: 14px;
      }
    }
    :deep(.option) {
      top: 49px;
    }
  }
}
</style>