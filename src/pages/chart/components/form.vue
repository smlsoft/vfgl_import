<script setup>
import MasterdataService from "@/services/MasterdataService";
import UsersDataService from "@/services/UsersDataService";

import DialogForm from "@/components/form/DialogForm.vue";
import { useToast } from "primevue/usetoast";
import { ref, onMounted } from "vue";
import Utils from "@/utils/";

const textContent = ref("ต้องการบันทึกข้อมูลผังบัญชี รหัสผังบัญชี");
const toast = useToast();
const confirmSaveDialog = ref(false);
const formcode = ref("");
const form_model = ref({
  guidfixed: "",
  accountbalancetype: 1,
  accountcategory: 1,
  accountcode: "",
  accountgroup: "",
  accountlevel: 1,
  accountname: "",
  consolidateaccountcode: "",
});
const form_valid = ref({
  accountcode: true,
  accountname: true,
  consolidateaccountcode: true,
});
const props = defineProps({
  form_model: Object,
  user_role: Number,
});
const user_role = ref(null);
const disabledForm = ref(false);

const emit = defineEmits(["save", "back"]);

const categorys = ref([
  { name: "1 ~ สินทรัพย์", code: 1 },
  { name: "2 ~ หนี้สิน", code: 2 },
  { name: "3 ~ ทุน", code: 3 },
  { name: "4 ~ รายได้", code: 4 },
  { name: "5 ~ ค่าใช้จ่าย", code: 5 },
]);
const selectedcategory = ref();

const groups = ref([]);
const selectedgroup = ref();

const balances = ref([
  { name: "1 ~ เดบิต", code: 1 },
  { name: "2 ~ เครดิต", code: 2 },
]);
const selectedbalance = ref();

const levels = ref([
  { name: "ระดับ 1", code: 1, isDisabled: false },
  { name: "ระดับ 2", code: 2, isDisabled: false },
  { name: "ระดับ 3", code: 3, isDisabled: false },
  { name: "ระดับ 4", code: 4, isDisabled: false },
  { name: "ระดับ 5", code: 5, isDisabled: false },
]);
const selectedlevel = ref();

onMounted(async () => {
  groups.value.push(
    {
      code: "1",
      guidfixed: "",
      label: "1~เงินทุนที่ได้การสนับสนุนจากรัฐบาล (เงินล้าน)",
      name1: " เงินทุนที่ได้การสนับสนุนจากรัฐบาล (เงินล้าน)",
      name2: "",
      name3: "",
      name4: "",
      name5: "",
    },
    {
      code: "2",
      guidfixed: "",
      label: "2~เงินทุนจาก เงินออม เงินสัจจะ และ เงินหุ้น",
      name1: " เงินทุนจาก เงินออม เงินสัจจะ และ เงินหุ้น",
      name2: "",
      name3: "",
      name4: "",
      name5: "",
    },
    {
      code: "3",
      guidfixed: "",
      label: "3~เงินทุนจากการกู้ยืมธนาคารพาณิชย์",
      name1: " เงินทุนจากการกู้ยืมธนาคารพาณิชย์",
      name2: "",
      name3: "",
      name4: "",
      name5: "",
    },
    {
      code: "4",
      guidfixed: "",
      label: "4~เงินทุนจากกิจกรรมสถาบันการเงินชุมชนและเงินอื่นๆ",
      name1: " เงินทุนจากกิจกรรมสถาบันการเงินชุมชนและเงินอื่นๆ",
      name2: "",
      name3: "",
      name4: "",
      name5: "",
    },
    {
      code: "5",
      guidfixed: "",
      label: "5~ร้านค้าชุมชนตามโครงการประชารัฐ",
      name1: " ร้านค้าชุมชนตามโครงการประชารัฐ",
      name2: "",
      name3: "",
      name4: "",
      name5: "",
    }
  );
  await getAccountGroup();
  await loadDataUser(localStorage._usercode);
  console.log(user_role.value);

  if (props.form_model.guidfixed == "") {
    if (user_role.value == 0) {
      form_model.value.accountlevel = 3;
      levels.value[0].isDisabled = true;
      levels.value[1].isDisabled = true;
    }
  } else {
    form_model.value = props.form_model;
    if (user_role.value == 0) {
      if (
        form_model.value.accountlevel == 1 ||
        form_model.value.accountlevel == 2
      ) {
        disabledForm.value = true;
        levels.value.forEach((element) => {
          element.isDisabled = true;
        });
      } else {
        levels.value[0].isDisabled = true;
        levels.value[1].isDisabled = true;
      }
    }
  }
});

async function loadDataUser(userName) {
  try {
    const res = await UsersDataService.getUserShopByUsername(userName);
    if (res.success) {
      console.log(res);
      if (res.success) {
        user_role.value = res.data.role;
      }
    }
  } catch (err) {
    console.log(err);
  }
}

function isDisabled(level) {
  return level.isDisabled;
}

async function onSave() {
  var isPass = await verifyData();
  if (isPass) {
    console.log(form_model.value.accountcode);
    formcode.value = form_model.value.accountcode;
    confirmSaveDialog.value = true;
  }
}

function onBack() {
  emit("back");
}

function confirmSave() {
  confirmSaveDialog.value = false;
  emit("save", form_model.value);
}

function onClose() {
  confirmSaveDialog.value = false;
}

async function getAccountGroup() {
  try {
    const res = await MasterdataService.getAccountGroup();
    if (res.success) {
      if (res.data.length > 0) {
        groups.value.push(...res.data);
        setTimeout(() => {
          if (form_model.value.accountgroup == "") {
            form_model.value.accountgroup = groups.value[0].code;
          }
        }, 100);
      }
    }
  } catch (err) {
    console.log(err);
  }
}

function verifyData() {
  let checkValid = 0;
  let err_msg = "";
  if (form_model.value.accountcode == "") {
    form_valid.value.accountcode = false;
    err_msg += "กรุณากรอบข้อมูล รหัสผังบัญชี ";
    checkValid += 1;
  } else {
    if (Utils.checkSpecialString(form_model.value.accountcode)) {
      form_valid.value.accountcode = false;
      err_msg += "รหัสผังบัญชีไม่สามารถใช้อักษรพิเศษได้ ";
      checkValid += 1;
    } else {
      form_valid.value.accountcode = true;
    }
  }
  if (form_model.value.accountname == "") {
    form_valid.value.accountname = false;
    err_msg += "กรุณากรอบข้อมูล ชื่อบัญชี ";
    checkValid += 1;
  } else {
    if (Utils.checkSpecialString(form_model.value.accountname)) {
      form_valid.value.accountname = false;
      err_msg += "ชื่อบัญชีไม่สามารถใช้อักษรพิเศษได้ ";
      checkValid += 1;
    } else {
      form_valid.value.accountname = true;
    }
  }
  if (form_model.value.consolidateaccountcode != "") {
    if (Utils.checkSpecialString(form_model.value.consolidateaccountcode)) {
      form_valid.value.consolidateaccountcode = false;
      err_msg += "รหัสผังบัญชีกลางไม่สามารถใช้อักษรพิเศษได้ ";
      checkValid += 1;
    } else {
      form_valid.value.consolidateaccountcode = true;
    }
  }

  if (checkValid == 0) {
    return true;
  } else {
    toast.add({
      severity: "error",
      summary: "ไม่สามารถทำรายการได้",
      detail: err_msg,
      life: 3000,
    });

    return false;
  }
}
</script>

<template>
  <Button
    label="กลับหน้ารายการ"
    icon="pi pi-arrow-left"
    class="p-button-text p-button-sm p-button-info"
    @click="onBack()"
  />
  <div class="surface-card p-4 shadow-2 border-round p-fluid">
    <div class="grid formgrid p-fluid">
      <div class="field mb-12 col-12 md:col-12">
        <label for="accountcode" class="font-medium text-900"
          ><span class="text-orange-500">* </span> รหัสผังบัญชี
        </label>
        <InputText
          :disabled="disabledForm"
          id="accountcode"
          type="text"
          v-model="form_model.accountcode"
          :class="!form_valid.accountcode ? 'p-invalid' : ''"
        />
      </div>
      <div class="field mb-12 col-12 md:col-12">
        <label for="accountname" class="font-medium text-900"
          ><span class="text-orange-500">* </span>ชื่อบัญชี</label
        >
        <InputText
          :disabled="disabledForm"
          id="accountname"
          type="text"
          v-model="form_model.accountname"
          :class="!form_valid.accountname ? 'p-invalid' : ''"
        />
      </div>
      <div class="field mb-12 col-12 md:col-12">
        <label for="accountcategory" class="font-medium text-900"
          >หมวดบัญชี</label
        >
        <div class="flex flex-wrap card-container blue-container">
          <div
            v-for="category of categorys"
            :key="category.code"
            class="field-radiobutton m-3"
          >
            <RadioButton
              :id="category.code"
              name="category"
              :value="category.code"
              v-model="form_model.accountcategory"
              :disabled="disabledForm"
            />
            <label :for="category.code">{{ category.name }}</label>
          </div>
        </div>
      </div>
      <div class="field mb-12 col-12 md:col-12">
        <label for="selectedgroup" class="font-medium text-900"
          >กลุ่มบัญชี</label
        >
        <div class="flex flex-wrap card-container blue-container">
          <div
            v-for="group of groups"
            :key="group.code"
            class="field-radiobutton m-3"
          >
            <RadioButton
              :id="group.code"
              name="group"
              :value="group.code"
              v-model="form_model.accountgroup"
              :disabled="disabledForm"
            />
            <label :for="group.code">{{ group.code }} ~{{ group.name1 }}</label>
          </div>
        </div>
      </div>
      <div class="field mb-12 col-12 md:col-12">
        <label for="accountlevel" class="font-medium text-900"
          >ระดับบัญชี</label
        >
        <div class="flex flex-wrap card-container blue-container">
          <div
            v-for="level of levels"
            :key="level.code"
            class="field-radiobutton m-3"
          >
            <RadioButton
              :id="level.code"
              name="level"
              :value="level.code"
              v-model="form_model.accountlevel"
              :disabled="isDisabled(level)"
            />
            <label :for="level.name">{{ level.name }}</label>
          </div>
        </div>
      </div>
      <div class="field mb-12 col-12 md:col-12">
        <label for="consolidateaccountcode" class="font-medium text-900"
          >รหัสผังบัญชีกลาง</label
        >
        <InputText
          type="text"
          :disabled="disabledForm"
          id="consolidateaccountcode"
          v-model="form_model.consolidateaccountcode"
          :class="!form_valid.consolidateaccountcode ? 'p-invalid' : ''"
        />
      </div>
      <div class="field mb-12 col-12 md:col-12">
        <label for="accountcategory" class="font-medium text-900"
          >ด้านบัญชี</label
        >
        <div class="flex flex-wrap card-container blue-container">
          <div
            v-for="balance of balances"
            :key="balance.code"
            class="field-radiobutton m-3"
          >
            <RadioButton
              :id="balance.code"
              name="balance"
              :value="balance.code"
              v-model="form_model.accountbalancetype"
              :disabled="disabledForm"
            />
            <label :for="balance.code">{{ balance.name }} </label>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-2 ml-2 m-4">
      <Button
        @click="onSave()"
        label="บันทึกผังบัญชี"
        icon="pi pi-save"
        class="w-auto p-button-succes"
      ></Button>
    </div>
  </div>
  <DialogForm
    :confirmDialog="confirmSaveDialog"
    :textContent="textContent"
    :textContent2="formcode"
    v-on:close="onClose"
    v-on:confirm="confirmSave"
  ></DialogForm>
</template>
