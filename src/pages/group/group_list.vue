<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import DialogForm from "@/components/form/DialogForm.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import { useRouter } from "vue-router";
import { ref, onMounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useApp } from "@/stores/app.js";
import XLSX from "xlsx";

const storeApp = useApp();
const router = useRouter();
const toast = useToast();
const detail = ref();
const data_list = ref([]);
const deleteDetailDialog = ref(false);
const totalItemsCount = ref(0);
const myFiles = ref();
const loading = ref(true);
const activePage = ref(1);
const typingTimer = ref(null);
const doneTypingInterval = ref(1000);
const firstPage = ref(0);
const import_data = ref([]);
const confirmSaveDialog = ref(false);
const textContent = ref("ต้องการลบกลุ่มบัญชี รหัสกลุ่มบัญชี");
const grouplistcode = ref("");
const filters = ref(null);
const sortField = ref("code");
const sortOrder = ref(1);
const limitPage = ref(20);

onMounted(() => {
  getAccountGroupList();
  storeApp.setPageTitle("กำหนดชุดบัญชี");
  storeApp.setActivePage("master");
  storeApp.setActiveChild("group_list");
});
function onClose() {
  confirmSaveDialog.value = false;
}
function ImportFile() {
  var config = { raw: true, type: "string" };
  var reader = new FileReader();
  reader.readAsArrayBuffer(myFiles.value.files[0]);
  reader.onload = function (e) {
    var data = new Uint8Array(reader.result);
    var wb = XLSX.read(data, { type: "array" });
    var firstSheetName = wb.SheetNames[0];
    var worksheet = wb.Sheets[firstSheetName];
    var results = XLSX.utils.sheet_to_json(worksheet, config);

    // console.log(results);
    var details = [];
    for (let index = 0; index < results.length; index++) {
      //console.log(results[index]);
      details.push({
        code: results[index].code.toString(),
        name1:
          results[index].name_1 != undefined
            ? results[index].name_1.toString()
            : "",
        name2:
          results[index].name_2 != undefined
            ? results[index].name_2.toString()
            : "",
        name3:
          results[index].name_3 != undefined
            ? results[index].name_3.toString()
            : "",
        name4:
          results[index].name_4 != undefined
            ? results[index].name_4.toString()
            : "",
        name5:
          results[index].name_5 != undefined
            ? results[index].name_5.toString()
            : "",
      });
    }

    setTimeout(() => {
      import_data.value = details;
    }, 500);
  };
  reader.onerror = function (e) {
    console.log(e);
  };
}

function getAccountGroupList() {
  loading.value = true;
  MasterdataService.getAccountGroupList(
    limitPage.value,
    activePage.value,
    filters.value,
    sortField.value,
    sortOrder.value
  )
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_list.value = res.data.sort(function (obj1, obj2) {
          return obj1.code - obj2.code;
        });
        totalItemsCount.value = res.pagination.total;
        console.log(totalItemsCount.value);
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}

function goForm() {
  router.push({ name: "groupCreate" });
}

function goDetail(data) {
  router.push({ name: "groupEdit", params: { id: data.guidfixed } });
}

function confirmDeleteDetail(data) {
  console.log(data);
  detail.value = data;

  console.log(detail.value.code);
  grouplistcode.value = detail.value.code;
  console.log(grouplistcode.value);
  confirmSaveDialog.value = true;
}

function keyup() {
  clearTimeout(typingTimer.value);
  typingTimer.value = setTimeout(doneTyping, doneTypingInterval.value);
}
function keydown() {
  clearTimeout(typingTimer.value);
}
function doneTyping() {
  activePage.value = 1;
  firstPage.value = 0;
  MasterdataService.getAccountGroupList(
    limitPage.value,
    activePage.value,
    filters.value,
    sortField.value,
    sortOrder.value
  )
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_list.value = res.data;
        totalItemsCount.value = res.pagination.total;
        console.log(totalItemsCount.value);
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}

async function confirmSave() {
  console.log(import_data.value);
  //   MasterdataService.importGroup(import_data.value)
  //     .then((res) => {
  //       console.log(res);
  //       if (res.success) {
  //         toast.add({
  //           severity: "success",
  //           summary: "ทำรายการสำเร็จ",
  //           detail: "บันทึกรายการนำเข้ากลุ่มบัญชีสำเร็จ",
  //           life: 3000,
  //         });
  //         setTimeout(() => {
  //           confirmSaveDialog.value = false;
  //           import_data.value = [];
  //         }, 1500);
  //       }
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
}

function deleteDetail() {
  console.log("DELECT " + detail.value.guidfixed);

  MasterdataService.deleteAccountGroup(detail.value.guidfixed)
    .then((res) => {
      console.log(res);
      if (res.success) {
        getAccountGroupList(activePage.value);
        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "Deleted",
          life: 3000,
        });
        confirmSaveDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function onPage(event) {
  activePage.value = event.page + 1;
  limitPage.value = event.rows;
  loading.value = true;

  MasterdataService.getAccountGroupList(
    limitPage.value,
    activePage.value,
    filters.value,
    sortField.value,
    sortOrder.value
  )
    .then((res) => {
      //console.log(res);
      if (res.success) {
        data_list.value = res.data;
      }
      loading.value = false;
    })
    .catch((err) => {
      console.log(err);
      loading.value = false;
    });
}

function sortBy(data) {
  //console.log(data);
  sortField.value = data.sortField;
  sortOrder.value = data.sortOrder;

  loading.value = true;
  MasterdataService.getAccountGroupList(
    limitPage.value,
    activePage.value,
    filters.value,
    sortField.value,
    sortOrder.value
  )
    .then((res) => {
      //console.log(res);
      if (res.success) {
        data_list.value = res.data;
        totalItemsCount.value = res.pagination.total;
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}
const imgWithbaseUrl = (uri) => {
  let baseUrl =
    process.env.NODE_ENV == "development"
      ? import.meta.url
      : process.env.VUE_APP_URL;
  console.log("Mode :", process.env.NODE_ENV, baseUrl);

  if (process.env.NODE_ENV != "development") {
    uri = uri.replace("@/", import.meta.env.BASE_URL);
  } else {
    uri = uri.replace("@/", import.meta.env.BASE_URL);
  }

  return new URL(uri, baseUrl).href;
};
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <!--
      <div class="grid">
        <div class="col-4 md:col-3">
          <Button label="เพิ่มกลุ่มบัญชี" icon="pi pi-plus" class="w-auto" @click="goForm()"></Button>
        </div>
        <div class="col-4 md:col-3">
          <FileUpload mode="basic" name="input file" accept=".xls,.xlsx" ref="myFiles" :customUpload="true"
            @change="ImportFile()" class="p-button-plain p-button-primary" chooseIcon="pi pi-upload"
            chooseLabel="นำเข้ากลุ่มบัญชี"></FileUpload>
        </div>
      </div>
-->
      <!-- <div class="grid mt-2">
        <div class="p-2 surface-section flex-auto">
          <div class="field mb-12 col-12 md:col-12">
            <div class="pi pi-book" style="font-size: 2rem"></div>
            <i class="iHeader" style="font-size: 2rem">
              กำหนดชุดบัญชีที่ใช้งาน</i
            >
            <Image
              src="/images/manual/photoanddoc/vf5.png"
              alt="test"
              align="right"
              width="800"
              class="align-items-center"
            />
          </div>
        </div>
      </div> -->
      <div class="grid" v-if="import_data.length != 0">
        <div class="col-12">
          <h4>นำเข้าผังบัญชี</h4>
        </div>
        <div class="col-12">
          <Button
            label="บันทึกนำเข้ากลุ่มบัญชี"
            icon="pi pi-save"
            class="w-auto p-button-success"
            @click="confirmSaveDialog = true"
          ></Button>
          <Button
            label="ยกเลิกนำเข้ากลุ่ม"
            icon="pi pi-minus"
            class="w-auto p-button-danger ml-2"
            @click="import_data = []"
          ></Button>
        </div>
      </div>
      <div class="grid">
        <div class="col-12" v-if="import_data.length == 0">
          <DataTable
            :value="data_list"
            dataKey="code"
            class="p-datatable-sm"
            :loading="loading"
            stripedRows
            responsiveLayout="scroll"
            @sort="sortBy"
          >
            <template #header>
              <div class="flex">
                <div
                  class="flex-none flex align-items-center justify-content-start"
                >
                  <Button
                    label="เพิ่มกลุ่มบัญชี"
                    icon="pi pi-plus"
                    class="w-auto p-button-primary"
                    @click="goForm()"
                  ></Button>
                </div>
                <div
                  class="flex-1 flex align-items-center justify-content-center"
                >
                  <Paginator
                    :rows="20"
                    v-model:first="firstPage"
                    :totalRecords="totalItemsCount"
                    @page="onPage($event)"
                    :rowsPerPageOptions="[20, 50, 100]"
                  >
                  </Paginator>
                </div>
                <div
                  class="flex-none flex align-items-center justify-content-end"
                >
                  <span class="p-input-icon-left">
                    <i class="pi pi-search" />
                    <InputText
                      v-model="filters"
                      placeholder="ค้นหา...."
                      @keyup="keyup()"
                      @keydown="keydown()"
                    />
                  </span>
                </div>
              </div>
            </template>
            <template #empty> ไม่พบข้อมูล </template>
            <template #loading> กำลังประมวลผล กรุณารอซักครู่..</template>
            <Column
              field="code"
              header="รหัสกลุ่มบัญชี"
              :sortable="true"
            ></Column>
            <Column
              field="name1"
              header="ชื่อกลุ่มบัญชี"
              :sortable="true"
            ></Column>

            <Column bodyStyle="text-align:center" style="width: 5%">
              <template #body="slotProps">
                <div class="flex gap-1">
                  <Button
                    label="Edit"
                    icon="pi pi-pencil"
                    size="small"
                    severity="info"
                    class="p-button-info px-2 py-1 text-sm"
                    @click="goDetail(slotProps.data)"
                  />
                  <Button
                    label="Delete"
                    icon="pi pi-trash"
                    size="small"
                    severity="info"
                    class="p-button-danger px-2 py-1 text-sm"
                    @click="confirmDeleteDetail(slotProps.data)"
                  />
                </div>
              </template>
            </Column>
          </DataTable>
        </div>
        <div class="col-12" v-if="import_data.length != 0">
          <DataTable
            :value="import_data"
            :paginator="true"
            :rows="10"
            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
            :rowsPerPageOptions="[10, 20, 50]"
            responsiveLayout="scroll"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
            stripedRows
          >
            <Column field="code" header="รหัสกลุ่ม"></Column>
            <Column field="name1" header="ชื่อ1"></Column>
            <Column field="name2" header="ชื่อ2"></Column>
            <Column field="name3" header="ชื่อ3"></Column>
            <Column field="name4" header="ชื่อ4"></Column>
            <Column field="name5" header="ชื่อ5"></Column>
          </DataTable>
        </div>
      </div>

      <DialogForm
        :confirmDialog="confirmSaveDialog"
        :textContent="textContent"
        :textContent2="grouplistcode"
        v-on:close="onClose"
        v-on:confirm="deleteDetail"
      ></DialogForm>
    </MainContentWarp>
  </AppLayout>
</template>
