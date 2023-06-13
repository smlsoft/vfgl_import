<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { ref, onMounted } from "vue";
import Utils from "@/utils/";
import { useApp } from "@/stores/app.js";
import XLSX from "xlsx";
import DialogForm from "@/components/form/DialogForm.vue";
const storeApp = useApp();

const router = useRouter();
const toast = useToast();
const myFiles = ref();
const confirmSaveDialog = ref(false);
const textContent = ref("ต้องการนำเข้าข้อมูลรายวัน");
const import_form = ref([]);
const error_message = ref([]);

const is_loading = ref(false);

onMounted(() => {
  storeApp.setPageTitle("นำเข้าข้อมูลกองทุน");
  storeApp.setActivePage("shopimport");
  storeApp.setActiveChild("");
});

async function confirmSave() {
  console.log(import_form.value);

  MasterdataService.ImportShop(import_form.value)
    .then((res) => {
      console.log(res);
      if (res.success) {
        toast.add({
          severity: "success",
          summary: "ทำรายการสำเร็จ",
          detail: "บันทึกรายการสำเร็จ",
          life: 3000,
        });
        setTimeout(() => {
          import_form.value = [];
          confirmSaveDialog.value = false;
        }, 1500);
      }
    })
    .catch((err) => {
      console.log(err);
      toast.add({
        severity: "error",
        summary: "ทำรายการล้มเหลว",
        detail: "บันทึกรายการไม่สำเร็จ error : " + err,
        life: 3000,
      });
    });
}

async function onSave() {
  // var isPass = await verifyData();
  // var isTaxPass = await verifyTax();
  // var isVatPass = await verifyVat();
  // if (isPass && isTaxPass && isVatPass) {
  //   confirmSaveDialog.value = true;
  // }
  if (error_message.value.length == 0) {
    confirmSaveDialog.value = true;
  }
}

function ImportFile() {
  is_loading.value = true;
  import_form.value = [];
  var config = { raw: true, type: "string" };
  var reader = new FileReader();
  reader.readAsArrayBuffer(myFiles.value.files[0]);
  reader.onload = function (e) {
    var data = new Uint8Array(reader.result);
    var wb = XLSX.read(data, { type: "array" });
    var firstSheetName = wb.SheetNames[0];
    var worksheet = wb.Sheets[firstSheetName];
    var results = XLSX.utils.sheet_to_json(worksheet, config);
    // console.log(worksheet);

    console.log(results);
    var error_msg = [];

    for (let index = 0; index < results.length; index++) {
      console.log(results[index]);

      var shop_model = {
        guidfixed: "",
        name1: "",
        address: "",
        telephone: "",
        branchcode: "",
      };

      JSON.parse(JSON.stringify(results[index]), (key, value) => {
        // console.log("key " + key);
        // console.log("value " + value);
        if (key.toLowerCase() == "code") {
          shop_model.guidfixed = value.toString();
        }
        if (key.toLowerCase() == "name") {
          shop_model.name1 = value.toString();
        }
        if (key.toLowerCase() == "address") {
          shop_model.address = value.toString();
        }
        if (key.toLowerCase() == "telephone") {
          shop_model.telephone = value.toString();
        }
        if (key.toLowerCase() == "branch") {
          shop_model.branchcode = value.toString();
        }
      });

      import_form.value.push(shop_model);

      //  if()
      // details.push({
      //   index: index,
      //   accountcode: val_1,
      //   accountname: val_2,
      //   debitamount: val_3,
      //   creditamount: val_4,
      // });
    }

    setTimeout(() => {
      console.log(import_form.value);
      is_loading.value = false;
    }, 500);
    //account_detail.value = details;
    // generateIndex();
  };
  reader.onerror = function (e) {
    is_loading.value = false;
    // console.log(e);
  };
}

function onClose() {
  confirmSaveDialog.value = false;
}
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div class="surface-ground px-2 py-2">
        <div class="py-1 flex">
          <div class="flex">
            <FileUpload
              mode="basic"
              name="input file"
              accept=".xls,.xlsx"
              ref="myFiles"
              :customUpload="true"
              @change="ImportFile()"
              class="p-button-plain p-button-primary p-button-sm"
              chooseLabel="นำเข้าไฟล์"
            >
            </FileUpload>
          </div>
          <div class="flex ml-2">
            <Button
              v-if="import_form.length > 0 && error_message.length == 0"
              @click="onSave"
              label="บันทึกรายวัน"
              icon="pi pi-save"
              class="w-auto p-button-succes p-button-sm"
            ></Button>
          </div>
        </div>
        <div class="py-0 flex" v-if="import_form.length > 0">
          <div class="flex">
            <p>จำนวน {{ import_form.length }} รายการ</p>
          </div>
        </div>
        <div class="surface-card p-4 shadow-2 border-round p-fluid my-2">
          <div v-if="is_loading">กำลังประมวลผล....</div>
          <div v-if="import_form.length > 0">
            <DataTable
              :value="import_form"
              class="editable-cells-table"
              responsiveLayout="scroll"
            >
              <Column field="guidfixed" header="code"></Column>
              <Column field="name1" header="name"> </Column>
              <Column field="address" header="address"> </Column>
              <Column field="telephone" header="telephone"> </Column>
              <Column field="branchcode" header="branchcode"> </Column>
            </DataTable>
          </div>
        </div>
      </div>
      <DialogForm
        :confirmDialog="confirmSaveDialog"
        :textContent="textContent"
        v-on:close="onClose"
        v-on:confirm="confirmSave"
      ></DialogForm>
    </MainContentWarp>
  </AppLayout>
</template>
