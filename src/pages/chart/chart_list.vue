<script setup>
import DialogForm from "@/components/form/DialogForm.vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import { useRouter, useRoute } from "vue-router";
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useToast } from "primevue/usetoast";
import { useApp } from "@/stores/app.js";
import "primeicons/primeicons.css";
import XLSX from "xlsx";
const texthead = ref("ต้องการลบข้อมูลผังบัญชี รหัสผังบัญชี");
const chartlistcode = ref("");
const storeApp = useApp();
const router = useRouter();
const route = useRoute();
const toast = useToast();
const detail = ref();
const myFiles = ref();
const data_list = ref([]);
const deleteDetailDialog = ref(false);
const sortField = ref("accountcode");
const sortOrder = ref(1);
const totalItemsCount = ref(0);
const limitPage = ref(20);
const accountcode = ref("");
const filters = ref(null);
const loading = ref(true);
const activePage = ref(1);
const typingTimer = ref(null);
const doneTypingInterval = ref(1000);
const firstPage = ref(1);
const import_data = ref([]);
const confirmDeleteDialog = ref(false);
const pagerow = ref();
const props = defineProps({
  chartlistcode: Object,
});

const accountCategoryList = ref([
  { name: "สินทรัพย์", code: 1 },
  { name: "หนี้สิน", code: 2 },
  { name: "ทุน", code: 3 },
  { name: "รายได้", code: 4 },
  { name: "ค่าใช้จ่าย", code: 5 },
]);

const accountbalancetypeList = ref([
  { name: "เดบิต", code: 1 },
  { name: "เครดิต", code: 2 },
]);
const groupAccount_detail = ref([]);

onUnmounted(() => {
  // localStorage.removeItem("activePage");
  // localStorage.removeItem("rowpage");
  // localStorage.removeItem("firstPage");
});

onMounted(() => {
  console.log("localStorage.activePage :" + localStorage.activePage);
  console.log("localStorage.rowpage :" + localStorage.rowpage);
  console.log("localStorage.firstPage : " + localStorage.firstPage);

  getAccountChartList();

  groupAccount_detail.value.push(
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
  getAccountGroup();

  storeApp.setPageTitle("กำหนดค่าผังบัญชี");
  storeApp.setActivePage("master");
  storeApp.setActiveChild("chart_list");
});

function newResultCategory(data) {
  var result = [];
  result = accountCategoryList.value.filter((val) => val.code == data);
  return result.length > 0 ? result[0].name : "ไม่พบข้อมูล";
}

function newResultBalance(data) {
  var result = [];
  result = accountbalancetypeList.value.filter((val) => val.code == data);
  return result.length > 0 ? result[0].name : "ไม่พบข้อมูล";
}

function getAccountChartList() {
  // if (localStorage.activePage != null || localStorage.rowpage != null) {
  //   limitPage.value = parseInt(localStorage.rowpage);
  //   activePage.value = localStorage.activePage;
  //   firstPage.value = parseInt(localStorage.firstPage);
  // }

  loading.value = true;
  MasterdataService.getAccountChartList(
    limitPage.value,
    (accountcode.value = ""),
    // activePage.value,
    filters.value,
    sortField.value,
    sortOrder.value
  )
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_list.value = res.data;
        totalItemsCount.value = res.pagination.total;
        console.log(res.pagination);
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}

function getAccountGroup() {
  MasterdataService.getAccountGroup()
    .then((res) => {
      if (res.success) {
        groupAccount_detail.value.push(...res.data);
      }
      // console.log(groupAccount_detail.value);
    })
    .catch((err) => {
      console.log(err);
    });
}

function sortBy(data) {
  console.log(data);
  sortField.value = data.sortField;
  sortOrder.value = data.sortOrder;

  loading.value = true;
  MasterdataService.getAccountChartList(
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
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}

function goCreate() {
  router.push({ name: "chartCreate" });
}
function goImport() {
  router.push({ name: "importchart" });
}
function goEdit(data) {
  router.push({ name: "chartEdit", params: { id: data.guidfixed } });
}

function confirmDeleteDetail(data) {
  console.log(data);
  detail.value = data;
  console.log(detail.value.accountcode);
  chartlistcode.value = detail.value.accountcode;

  confirmDeleteDialog.value = true;
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
  MasterdataService.getAccountChartList(
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

function deleteDetail() {
  MasterdataService.deleteAccountChart(detail.value.guidfixed)
    .then((res) => {
      console.log(res);
      if (res.success) {
        getAccountChartList(activePage.value);
        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "Deleted",
          life: 3000,
        });
        confirmDeleteDialog.value = false;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
function onClose() {
  confirmDeleteDialog.value = false;
}

function onPage(event) {
  localStorage.rowpage = event.rows;
  localStorage.activePage = event.page + 1;
  localStorage.firstPage = event.first;

  console.log(localStorage.activePage);
  console.log(localStorage.rowpage);
  console.log(localStorage.firstPage);

  console.log(event);
  activePage.value = event.page + 1;
  limitPage.value = event.rows;
  loading.value = true;

  MasterdataService.getAccountChartList(
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
      console.log(results[index]);
      details.push({
        accountbalancetype:
          results[index].balance_mode != undefined0
            ? parseInt(results[index].balance_mode.toString().trim())
            : "",
        accountcategory:
          results[index].account_type != undefined
            ? parseInt(results[index].account_type.toString().trim())
            : "",
        accountcode:
          results[index].account_code != undefined
            ? results[index].account_code.toString().trim()
            : "",
        accountgroup:
          results[index].account_group != undefined
            ? results[index].account_group.toString().trim()
            : "",
        accountname:
          results[index].account_name != undefined
            ? results[index].account_name.toString().trim()
            : "",
        consolidateaccountcode:
          results[index].main_account != undefined
            ? results[index].main_account.toString()
            : "",
        accountlevel:
          results[index].account_level != undefined
            ? parseInt(results[index].account_level.toString().trim())
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

// async function confirmSave() {
//   console.log(import_data.value);
//   MasterdataService.importChart(import_data.value)
//     .then((res) => {
//       console.log(res);
//       if (res.success) {
//         toast.add({
//           severity: "success",
//           summary: "ทำรายการสำเร็จ",
//           detail: "บันทึกรายการนำเข้าผังบัญชีสำเร็จ",
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
// }
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
function rowClass(data) {
  let level = "level";
  let weghtFo = "";
  if (data.accountcode === data.consolidateaccountcode) {
    weghtFo = 1;
  } else {
    weghtFo = 0;
  }
  // console.log(level + data.accountlevel + weghtFo);
  return level + data.accountlevel + weghtFo;
}

// function rowClass(data) {
//   var level = "";
//   if (data.accountlevel === 1) {
//     level = "level1";
//   } else if (data.accountlevel === 2) {
//     level = "level2";
//   } else if (data.accountlevel === 3) {
//     level = "level3";
//   } else if (data.accountlevel === 4) {
//     level = "level4";
//   } else {
//     level = "level5";
//   }
//    if (
//   (data.accountcode === data.consolidateaccountcode) &
//     (data.accountlevel === 2)
//   ) {
//     level = "fontWeight2";
//   } else if (
//     (data.accountcode === data.consolidateaccountcode) &
//     (data.accountlevel === 3)
//   ) {
//     level = "fontWeight3";
//   } else if (
//     (data.accountcode === data.consolidateaccountcode) &
//     (data.accountlevel === 4)
//   ) {
//     level = "fontWeight4";
//   } else if (
//     (data.accountcode === data.consolidateaccountcode) &
//     (data.accountlevel === 5)
//   ) {
//     level = "fontWeight5";
//   } else if (data.accountcode === data.consolidateaccountcode) {
//     level = "fontWeight6";
//   }
//   return level;
// }
// function fontWeight(data) {
//   let fontWeight = " ";
//   if (data.accountcode === data.consolidateaccountcode) {
//     fontWeight = "fontWeight";
//   }
//   return fontWeight;
// }
// }
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div class="grid">
        <!-- <div class="p-2 surface-section flex-auto">
          <div class="field mb-12 col-12 md:col-12">
            <div class="pi pi-book" style="font-size: 2rem"></div>
            <i class="iHeader" style="font-size: 2rem"> กำหนดรหัสบัญชี</i>
            <Image
              src="/images/manual/photoanddoc/vf5.png"
              alt="test"
              align="right"
              width="800"
              class="align-items-center"
            />
          </div>
        </div> -->
        <div class="col-12" style="z-index: 20">
          <DataTable
            :value="data_list"
            dataKey="accountcode"
            class="p-datatable-sm"
            :loading="loading"
            stripedRows
            responsiveLayout="scroll"
            @sort="sortBy"
            :rowClass="rowClass"
            scrollHeight="69vh"
          >
            <template #header>
              <div class="flex">
                <div
                  class="flex-none flex align-items-center justify-content-start"
                >
                  <Button
                    label="เพิ่มผังบัญชี"
                    icon="pi pi-plus"
                    class="w-auto p-button-succes"
                    @click="goCreate()"
                  ></Button>
                  &nbsp;
                </div>
                <div
                  class="flex-mb-3 flex align-items-center justify-content-start"
                >
                  <Button
                    label="นำเข้าข้อมูล"
                    icon="pi pi-file"
                    class="w-auto p-button-primary"
                    @click="goImport()"
                  ></Button>
                </div>
                <div
                  class="flex-none flex align-items-right justify-content-end"
                ></div>
                <div
                  class="flex-none flex align-items-right justify-content-end"
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
              field="accountcode"
              header="รหัสผังบัญชี"
              :sortable="true"
              class="accountcode"
            ></Column>
            <Column
              field="accountname"
              header="ชื่อผังบัญชี"
              :sortable="true"
              class="accountname"
            ></Column>

            <Column field="accountcategory" header="หมวดบัญชี" :sortable="true">
              <template #body="{ data, field }">
                {{ newResultCategory(data[field]) }}
              </template>
            </Column>
            <Column
              field="accountbalancetype"
              header="ด้านบัญชี"
              :sortable="true"
            >
              <template #body="{ data, field }">
                {{ newResultBalance(data[field]) }}
              </template>
            </Column>
            <Column
              field="accountgroup"
              header="กลุ่มบัญชี"
              :sortable="true"
            ></Column>

            <Column
              field="accountlevel"
              header="ระดับบัญชี"
              :sortable="true"
            ></Column>
            <Column
              field="consolidateaccountcode"
              header="รหัสผังบัญชีกลาง"
              :sortable="true"
            ></Column>
            <Column bodyStyle="text-align:center" style="width: 5%">
              <template #body="slotProps">
                <!-- <Button
                  icon="pi pi-pencil"
                  class="p-button-rounded p-button-warning p-button-text"
                  @click="goEdit(slotProps.data)"
                /> -->

                <div class="flex gap-1">
                  <Button
                    label="Edit"
                    icon="pi pi-pencil"
                    size="small"
                    severity="info"
                    class="p-button-info px-2 py-1 text-sm"
                    @click="goEdit(slotProps.data)"
                    :disabled="slotProps.data.iscenterchart"
                  />
                  <Button
                    label="Delete"
                    icon="pi pi-trash "
                    size="small"
                    class="p-button-danger px-2 py-1 text-sm"
                    @click="confirmDeleteDetail(slotProps.data)"
                    :disabled="slotProps.data.iscenterchart"
                  />
                </div>
              </template>
            </Column>
            <!-- <Column bodyStyle="text-align:center" style="width: 5%">
              <template #body="slotProps">
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-text"
                  @click="confirmDeleteDetail(slotProps.data)"
                />
                <Button
                  label="Delete"
                  icon="pi pi-trash"
                  size="small"
                  class="p-button-danger"
                  @click="confirmDeleteDetail(slotProps.data)"
                />
              </template>
            </Column> -->
          </DataTable>
          <Paginator
            :rows="limitPage"
            v-model:first="firstPage"
            :totalRecords="totalItemsCount"
            @page="onPage($event)"
            :rowsPerPageOptions="[20, 50, 100]"
          >
          </Paginator>
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
            :scrollable="true"
            class="p-datatable-sm"
            scrollHeight="60vh"
          >
            <Column field="accountcode" header="รหัสฝังบัญชี"></Column>
            <Column field="accountname" header="ชื่อบัญชี"></Column>
            <Column field="accountcategory" header="หมวดบัญชี"></Column>
            <Column field="accountgroup" header="กลุ่มบัญชี"></Column>
            <Column field="accountlevel" header="ระดับบัญชี"></Column>
            <Column
              field="consolidateaccountcode"
              header="รหัสผังบัญชีกลาง"
            ></Column>
            <Column field="accountbalancetype" header="ด้านบัญชี"></Column>
          </DataTable>
        </div>
      </div>
      <div>
        <DialogForm
          :confirmDialog="confirmDeleteDialog"
          :textContent="texthead"
          :textContent2="chartlistcode"
          v-on:close="onClose"
          v-on:confirm="deleteDetail"
        ></DialogForm>
      </div>
    </MainContentWarp>
  </AppLayout>
</template>

<style>
.level10 .accountname {
  font-weight: 900;
}

.level10 .accountcode {
  font-weight: 900;
}

.level20 .accountname {
  padding-left: 20px !important;
}

.level30 .accountname {
  padding-left: 40px !important;
}

.level40 .accountname {
  padding-left: 60px !important;
}

.level50 .accountname {
  padding-left: 70px !important;
}

.level60 .accountname {
  padding-left: 80px !important;
}
.level11 .accountname {
  font-weight: 900;
}

.level11 .accountcode {
  font-weight: 900;
}

.level21 .accountname {
  padding-left: 20px !important;
  font-weight: 900;
}

.level31 .accountname {
  padding-left: 40px !important;
  font-weight: 900;
}

.level41 .accountname {
  font-weight: 900;
  padding-left: 60px !important;
}

.level51 .accountname {
  padding-left: 70px !important;
  font-weight: 900;
}

.level61 .accountname {
  padding-left: 80px !important;
  font-weight: 900;
}
.level11 .accountname {
  font-weight: 900;
}

.level11 .accountcode {
  font-weight: 900;
}

.level21 .accountcode {
  font-weight: 900;
}

.level31 .accountcode {
  font-weight: 900;
}

.level41 .accountcode {
  font-weight: 900;
}

.level51 .accountcode {
  font-weight: 900;
}

.level61 .accountcode {
  font-weight: 900;
}

.iclass {
  padding-left: 50px;
  color: #3f51b1;
  font-weight: bold;
}
.iHeader {
  color: #3f51b5;
  font-weight: bold;
}
</style>
