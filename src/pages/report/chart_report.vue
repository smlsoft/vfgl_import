<script setup>
import DialogForm from "@/components/form/DialogForm.vue";
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useApp } from "@/stores/app.js";
import XLSX from "xlsx";
import pdfMake from "pdfmake/build/pdfmake";
pdfMake.fonts = {
  Sarabun: {
    normal:
      "https://fonts.gstatic.com/s/sarabun/v12/DtVjJx26TKEr37c9WBJDnlQN9gk.ttf",
    bold: "https://fonts.gstatic.com/s/sarabun/v12/DtVmJx26TKEr37c9YK5sulwm6gDXvwE.ttf",
    italics:
      "https://fonts.gstatic.com/s/sarabun/v12/DtVhJx26TKEr37c9aBBJmnYI5gnOpg.ttf",
    bolditalics:
      "https://fonts.gstatic.com/s/sarabun/v12/DtVkJx26TKEr37c9aBBxJlks7iLSrwFUlw.ttf",
  },
};
const detail = ref();
const textContent = ref("ต้องการลบข้อมูลรายวัน เลขที่เอกสาร");
const dailynum = ref("");
const head_example = ref([]);
const detail_example = ref([]);
const detail_examplenumbertwo = ref([]);
const textChart = ref("");
const toast = useToast();
const deleteDetailDialog = ref(false);
const totalItemsCount = ref(0);
const filters = ref(null);
const loading = ref(true);
const activePage = ref(1);
const bottom = ref("12");
const typingTimer = ref(null);
const doneTypingInterval = ref(1000);
const firstPage = ref(0);
const accDescript = ref("");
const sortField = ref("accountcode");
const sortOrder = ref(1);
const searchItem = ref("");
const limitPage = ref(1000);
const confirmDeleteDialog = ref(false);
const expandedRows = ref([]);
const filteredCountries = ref();
const storeApp = useApp();
const isvisible = ref(false);
const isvisible2 = ref(false);
const buddhistYear = ref(process.env.VUE_APP_DATE == "th");
const startDate = ref();
const endDate = ref();
const accountGroup = ref("");
const accountgroup = ref();
const consolidateaccountcode = ref();
const accountcode = ref([]);
const accountcode1 = ref([]);
const accountcode2 = ref([]);
const dataaccountcode = ref([]);
const state = ref(true);
const data_list = ref([]);
const data_list2 = ref([]);
const docno = ref();
const accountmaintypeList = ref([{ name: "0", code: 1 }]);
const accountCategoryList = ref([
  { name: "สินทรัพย์", code: 1 },
  { name: "หนี้สิน", code: 2 },
  { name: "ทุน", code: 3 },
  { name: "รายได้", code: 4 },
  { name: "ค่าใช้จ่าย", code: 5 },
]);
const props = defineProps({
  daily_form: Object,
  daily_form_valid: Object,
  isUpdate: Boolean,
  accountChart_detail: Array,
  accountBook_detail: Array,
  groupAccount_detail: Array,
  id: String,
});
const groups = ref([
  // { accountcode: "11000", accountname: "สินทรัพย์" },
  // { accountcode: "11001", accountname: "เงินสด" },
  // { accountcode: "11002", accountname: "หนี้สิน" },
]);
const ica = ref(false);

pdfMake.fonts = {
  Sarabun: {
    normal:
      "https://fonts.gstatic.com/s/sarabun/v12/DtVjJx26TKEr37c9WBJDnlQN9gk.ttf",
    bold: "https://fonts.gstatic.com/s/sarabun/v12/DtVmJx26TKEr37c9YK5sulwm6gDXvwE.ttf",
    italics:
      "https://fonts.gstatic.com/s/sarabun/v12/DtVhJx26TKEr37c9aBBJmnYI5gnOpg.ttf",
    bolditalics:
      "https://fonts.gstatic.com/s/sarabun/v12/DtVkJx26TKEr37c9aBBxJlks7iLSrwFUlw.ttf",
  },
};

onMounted(async () => {
  await getAccountChart();

  getDate();

  //   newResultdocno();
  console.log(data_list.value);
  // getAccountChartList();
  //   getAccountledger();
  // getGLJournalList();

  storeApp.setPageTitle("รายงานข้อมูลผังบัญชี");
  storeApp.setActivePage("รายงาน");
  storeApp.setActiveChild("รายงาน");
});
async function expandAll() {
  expandedRows.value = data_list.value.filter();
  toast.add({ severity: "success", summary: "All Rows Expanded", life: 3000 });
}

async function getAccountChart() {
  try {
    const res = await MasterdataService.getAccountChartList(
      limitPage.value,
      (accountcode.value = dataaccountcode.value),
      filters.value,
      sortField.value,
      sortOrder.value
    );
    console.log(res);
    if (res.success) {
      groups.value = res.data;
    }
  } catch (err) {
    console.log(err);
  }
}
function newResultCategory(data) {
  var result = [];
  result = accountCategoryList.value.filter((val) => val.code == data);
  return result.length > 0 ? result[0].name : "";
}

function searchCountry(event) {
  setTimeout(() => {
    if (!event.query.trim().length) {
      filteredCountries.value = groups.value;
    } else {
      filteredCountries.value = groups.value.filter((groups) => {
        if (
          groups.accountcode.toLowerCase().includes(event.query.toLowerCase())
        ) {
          // console.log(groups.accountcode);
          return groups.accountcode
            .toLowerCase()
            .includes(event.query.toLowerCase());
        }
      });
    }
  }, 250);
}

function currentDate() {
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${
    current.getFullYear() + 543
  }`;
  return date;
}

function switchOn() {
  if (state.value == true) {
    getAccountChartList();
  } else if (state.value == false) {
  }
}

function selectAccount(event) {
  accountcode1.value = event.value;
  console.log(state.value);
  console.log(event.value);
  console.log(event.value);
  accountcode1.value = event.value;
  dataaccountcode.value = accountcode1.value + ":" + accountcode1.value;
  // else if ((state.value = true)) {
  //   dataaccountcode.value = event.value + ":" + event.value;
  // }

  console.log(dataaccountcode.value);
}
function selectAccount2(event) {
  console.log(event.value);
  state.value == false;
  dataaccountcode.value = accountcode1.value + ":" + accountcode2.value;
  console.log(dataaccountcode.value);
  // if ((state.value = false)) {
  //   accountcode2.value = event.value;

  //   dataaccountcode.value = accountcode1.value + ":" + accountcode1.value;
  // } else if ((state.value = true)) {
  //   dataaccountcode.value = accountcode1.value + ":" + accountcode2.value;
  // }
  // accountcode2.value = event.value;
  // dataaccountcode.value = accountcode1.value + ":" + accountcode2.value;
}
function scrollBottom() {
  bottom.value = document.body.scrollHeight;

  window.scrollTo({
    top: bottom.value,
    behavior: "smooth",
  });
}
function exreport2() {
  scrollBottom();
  if (state.value == true) {
    getAccountChartList();
  } else if (state.value == false) {
    loading.value = true;

    loading.value = true;
    MasterdataService.getAccountChartListwithaccountcode(
      limitPage.value,
      (accountcode.value = dataaccountcode.value),
      activePage.value,
      filters.value,
      sortField.value,
      sortOrder.value
    )
      .then((res) => {
        console.log(res);
        if (res.success) {
          isvisible.value = true;
          data_list.value = res.data;
          data_list.value.forEach((ele) => {
            ele.isUpdate = false;
          });

          totalItemsCount.value = res.pagination.total;
        }
        loading.value = false;
      })
      .catch((err) => {
        loading.value = false;
        console.log(err);
      });
  }

  //   newResultCategory();
  //   getGLJournalList();
  // expandAll();
}

// const searchCountry = (event) => {
//   setTimeout(() => {
//     if (!event.query.trim().length) {
//       filteredCountries.value = [...data_list.value];
//     } else {
//       filteredCountries.value = data_list.value.filter((account) => {
//         return data_list.name
//           .toLowerCase()
//           .startsWith(event.query.toLowerCase());
//       });
//     }
//   }, 250);
// };
async function exportPDF() {
  isvisible.value = true;
  var body = [];
  var enddate = "";
  var startdate = "";
  body = await buildFromJson();

  startdate = Utils.getYearBuddhist(startDate.value);
  enddate = Utils.getYearBuddhist(endDate.value);

  var docDefinition = pageSetup(body, startdate, enddate);

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.getDataUrl((dataUrl) => {
    const targetElement = document.querySelector("#iframeContainer");
    // targetElement.src = dataUrl;
  });
}

// function newResultdocno(data) {
//   var result = [];
//   loading.value = true;
//   console.log(data_list.value);
//   MasterdataService.getGLledger((docno.value = "JO-202209069972C3"))
//     .then((res) => {
//       console.log(res);
//       if (res.success) {
//         console.log(res);
//         data_list.value = res.data;
//         console.log(data.docno);
//         docno.value = data_list.value.accountdescription;
//         console.log(data_list.value.accountdescription);
//         // totalItemsCount.value = res.pagination.total;

//         // result = docno.value.filter((val) => val.code == data);
//         // return result.length > 0 ? result[0].name : "ไม่พบข้อมูล";
//       }
//       loading.value = false;
//     })
//     .catch((err) => {
//       loading.value = false;
//       console.log(err);
//     });
// }
function getGLJournalList() {
  let startdate = Utils.getDateFromYear(startDate.value);
  let enddate = Utils.getDateFromYear(endDate.value);

  loading.value = true;
  MasterdataService.getdailyreport(
    accountGroup.value,
    startdate,
    enddate,
    limitPage.value,
    activePage.value,
    searchItem.value,
    sortField.value,
    sortOrder.value
  )
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_list.value = res.data;
        totalItemsCount.value = res.pagination.total;
        // console.log(totalItemsCount.value);
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}
function getAccountChartList() {
  loading.value = true;
  MasterdataService.getAccountChartList(
    limitPage.value,
    (accountcode.value = ""),
    filters.value,
    sortField.value,
    sortOrder.value
  )
    .then((res) => {
      console.log(res);
      if (res.success) {
        isvisible.value = true;
        data_list.value = res.data;
        scrollBottom();
        data_list.value.forEach((ele) => {
          scrollBottom();
          ele.isUpdate = false;
        });

        // totalPage.value = res.pagination.totalPage;
        totalItemsCount.value = res.pagination.total;
        //onsole.log(totalItemsCount.value);
        // getAllSelectImage();
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}
//output------
async function exportdowloadPDF() {
  var body = [];
  var enddate = "";
  var startdate = "";
  body = await buildFromJson();

  // startdate = Utils.getYearBuddhist(startDate.value);
  // enddate = Utils.getYearBuddhist(endDate.value);

  var docDefinition = pageSetup(body, startdate, enddate);
  pdfMake.createPdf(docDefinition).download("รายงานรหัสบัญชี.pdf");
}
function pageSetup(data, startdate, enddate) {
  var docDefinition = {
    content: [
      {
        text: localStorage.shop_name + "\n" + "รายงานรหัสบัญชี",
        // Utils.getDateShowText(enddate) +
        // "\n" +
        style: "header",
        bold: true,
        alignment: "left",
      },
      {
        text: "วันที่พิมพ์   " + currentDate(),
        // Utils.getDateShowText(enddate) +
        // "\n" +
        style: "header",
        bold: true,
        alignment: "right",
      },

      {
        style: "tableExample",
        table: {
          widths: ["10%", "20%", "30%", "20%", "20%"],
          body: data,
        },
      },

      {
        style: "tableExample",

        table: {
          widths: "auto",
          body: data,
        },
        // layout: "noBorders",
      },
    ],
    pageOrientation: "lightHorizontalLines",
    pageMargins: [20, 20, 20, 20],
    defaultStyle: {
      font: "Sarabun",
      fontSize: 12,
      columnGap: 20,
      color: "#0A065D",
    },
    styles: {
      header: {
        bold: true,
        alignment: "center",
      },
    },
  };
  return docDefinition;
}

function buildFromJson() {
  var body = [];

  body.push([
    { text: "ลำดับ" },
    { text: "รหัสผังบัญชี" },
    { text: "ชื่อผังบัญชี" },
    { text: "หมวดบัญชี" },
    { text: "สถานะ" },
  ]);
  data_list.value.forEach((data, index) => {
    body.push([
      { text: index + 1, alignment: "center" },
      { text: data.accountcode },
      { text: data.accountname },
      { text: newResultCategory(data.accountcategory) },
      { text: newResultmainClose(data.accountgroup) },
    ]);
  });

  return body;
}
function DownloadExampleExcel() {
  console.log("DownloadExampleExcel");

  data_list.value.forEach((data, index) => {
    // console.log(details);

    detail_example.value.push({
      ลำดับ: index + 1,
      รหัสบัญชี: data.accountcode,

      ชื่อผังบัญชี: data.accountname,
      รหัสผังบัญชีคุม: data.consolidateaccountcode,
      สถานะ: newResultmainClose(data.accountgroup),
    });
  });

  var config = { raw: true, type: "string" };
  var Example = XLSX.utils.json_to_sheet(
    detail_example.value,
    detail_examplenumbertwo.value,
    head_example.value,
    config
  );

  var wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, Example, "รายงานรหัสบัญชี");
  XLSX.writeFile(wb, "รายงานรหัสบัญชี.xlsx");
}

function getDate() {
  var date = new Date();
  startDate.value = new Date(date.getFullYear(), date.getMonth(), 1);
  endDate.value = new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function getAccountGroupList() {
  MasterdataService.getAccountGroup()
    .then((res) => {
      console.log(res);
      if (res.success) {
        data_list.value = res.data.sort(function (obj1, obj2) {
          return obj1.code - obj2.code;
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
}
function getGLledger() {
  MasterdataService.getGLledger()
    .then((res) => {
      console.log(res);
      if (res.success) {
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}

function newResultmain(data) {
  console.log(data);
  var result = [];
  result = accountmaintypeList.value.filter((val) => (val.code = data));
  return (result = 0 ? "" : data);
}
function newResultmainClose(data) {
  // console.log(data);
  if (data == "0") {
    return (data = "ปิด");
  } else if ((data == 1, 2, 3, 4, 5)) {
    return (data = "ใช้งาน");
  }
}

function docnoCheck(data) {
  let accDes = "";
  MasterdataService.getGLledger(data)
    .then((res) => {
      if (res.success) {
        // console.log(data);
        // console.log(res.data.accountdescription);
        accDes = res.data.docno;
      }

      loading.value = false;
      console.log(accDes);
      return accDes;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}
function getAccountledger() {
  let startdate = Utils.getDateFromYear(startDate.value);
  let enddate = Utils.getDateFromYear(endDate.value);

  loading.value = true;
  MasterdataService.getAccountledger(
    startdate,
    enddate,
    (accountcode.value = 11),
    limitPage.value
  )
    .then((res) => {
      if (res.success) {
        console.log(res);
        data_list.value = res.data;

        // console.log(totalItemsCount.value);
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}

function exreport() {
  //   getAccountledger();
  //   getAccountChartList();
  //   newResultCategory();
  //   getGLJournalList();
  // expandAll();
  //   isvisible.value = false;
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
function goDetail(data) {
  router.push({ name: "dailyUpdate", params: { id: data.guidfixed } });
}

function confirmDeleteDetail(data) {
  detail.value = data;
  dailynum.value = data.docno;

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
  //MasterdataService.getGLJournalList(activePage.value, filters.value)
  MasterdataService.getAccountGroup(
    accountGroup.value,
    startDate.value,
    endDate.value,
    limitPage.value,
    activePage.value,
    searchItem.value,
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

function onPage(event) {
  activePage.value = event.page + 1;
  limitPage.value = event.rows;
  loading.value = true;

  MasterdataService.getdailyreport(
    accountGroup.value,
    startDate.value,
    endDate.value,
    limitPage.value,
    activePage.value,
    searchItem.value,
    sortField.value,
    sortOrder.value
  )
    .then((res) => {
      console.log(res);
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
  MasterdataService.getdailyreport(
    accountGroup.value,
    startDate.value,
    endDate.value,
    limitPage.value,
    activePage.value,
    searchItem.value,
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

function getSumDebitAmount(data) {
  console.log(data);
  var sum = 0;
  if (data != null && data.length >= 0) {
    data.forEach((element) => {
      sum += element.debitamount;
    });
  }
  return sum;
}

function getSumCreditAmount(data) {
  console.log(data);
  var sum = 0;
  if (data != null && data.length >= 0) {
    data.forEach((element) => {
      sum += element.creditamount;
    });
  }
  return sum;
}
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div class="p-2 surface-section flex-auto">
        <div class="grid p-fluid">
          <!--
                <div class="field mb-4 col-6 md:col-3">
                  <label for="accountGroup" class="font-medium text-900">กลุ่มบัญชี</label>
                  <Dropdown v-model="accountGroup" autofocus :options="data_list" :filter="true"
                    :filterFields="['code', 'name1']" filterPlaceholder="ค้นหา" placeholder="เลือก">
                    <template #value="slotProps">
                      <div v-if="slotProps.value">
                        <div>{{ slotProps.value.code }} ~ {{ slotProps.value.name1 }}</div>
                      </div>
                      <span v-else>
                        {{ slotProps.placeholder }}
                      </span>
                    </template>
                    <template #option="slotProps">
                      <div>{{ slotProps.option.code }} ~ {{ slotProps.option.name1 }}</div>
                    </template>
                  </Dropdown>
                </div>
                -->

          <div class="mb-2 col-12 md:col-12"></div>

          <div class="field mb-4 col-6 md:col-3 ml-2">
            <label for="startDate" class="font-medium text-900"
              >ผังบัญชีที่
            </label>

            <Dropdown
              class="field mb-12 col-12 md:col-12"
              v-model="accountcode1"
              :options="groups"
              :editable="true"
              @change="selectAccount($event)"
              optionLabel="accountcode"
              optionValue="accountcode"
              placeholder="เลือกผังบัญชี"
              :disabled="state == true"
            />
          </div>
          <div class="field mb-4 col-xs-7 col-sm-6 col-lg-8 md:col-3 ml-4">
            <label for="endDate" class="font-medium text-900"
              >ถึงผังบัญชีที่
            </label>
            <Dropdown
              class="field mb-10 col-12 md:col-12"
              v-model="accountcode2"
              field="accountcode"
              :options="groups"
              :editable="true"
              @change="selectAccount2($event)"
              optionLabel="accountcode"
              optionValue="accountcode"
              placeholder="เลือกผังบัญชี"
              :disabled="state == true"
            />
          </div>
          <div class="field-checkbox mb-12 col-12 md:col-3">
            <Checkbox v-model="state" :binary="true" />
            <label>รวมทุกรหัสผังบัญชี</label>
          </div>
          <div
            class="field-checkbox mb-1 col-xs-7 col-sm-6 col-lg-8 md:col-2 p-button-outlined"
          ></div>

          <div class="field-checkbox mb-12 col-12 md:col-4">
            <Button
              class="field mb-12 col-xs-7 col-sm-7 col-lg-8 md:col-4 p-button-primary"
              label="จัดทำรายงาน"
              icon="pi pi-book"
              iconPos="left"
              @click="exreport2()"
            />
          </div>
          <div class="field-checkbox mb-12 col-12 md:col-4"></div>
          <div class="field-checkbox mb-12 col-12 md:col-4"></div>
        </div>
        <div class="col-xs-12 col-sm-12 col-lg-12">
          <div class="overflow-auto surface-overlay">
            <div class="flex" v-if="isvisible">
              <div class="flex">
                <Button
                  label="ส่งออก Excel"
                  class="p-button-primary"
                  icon="pi pi-file-excel"
                  @click="DownloadExampleExcel()"
                  :disabled="isvisible === false"
                />
              </div>
              <div class="flex ml-2">
                <Button
                  label="ส่งออก PDF"
                  icon="pi pi-file-pdf"
                  class="p-button-primary"
                  @click="exportdowloadPDF()"
                  :disabled="isvisible === false"
                />
              </div>
            </div>
            <DataTable
              v-if="isvisible"
              id="section"
              :value="data_list"
              dataKey="accountcode"
              class="p-datatable-sm"
              stripedRows
              responsiveLayout="scroll"
              @sort="sortBy"
            >
              <template #header>
                <div class="flex justify-content-between">
                  <div>
                    <div class="flex">
                      <div class="flex">
                        <!-- <Button
                          label="ส่งออก Excel"
                          class="p-button-primary"
                          icon="pi pi-file-excel"
                          @click="DownloadExampleExcel()"
                        />
                      </div>
                      <div class="flex ml-2">
                        <Button
                          label="ส่งออก PDF"
                          icon="pi pi-file-pdf"
                          class="p-button-primary"
                          @click="exportPDF()"
                        /> -->
                      </div>
                    </div>
                  </div>
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
              </template>
              <template #loading :loading="loading"> กำลังประมวลผล </template>

              <Column
                field="accountcode"
                header="รหัสผังบัญชี"
                :sortable="true"
              ></Column>
              <Column
                field="accountname"
                header="ชื่อผังบัญชี"
                class="accountname"
                :sortable="true"
              ></Column>
              <Column
                field="accountcategory"
                header="หมวดบัญชี"
                :sortable="true"
              >
                <template #body="{ data, field }">
                  {{ newResultCategory(data[field]) }}
                </template>
              </Column>
              <Column field="consolidateaccountcode" header="รหัสผังบัญชีคุม">
              </Column>

              <Column field="accountgroup" header="สถานะ" :sortable="true">
                <template #body="{ data, field }">
                  {{ newResultmainClose(data[field]) }}
                </template>
              </Column>
            </DataTable>
          </div>
        </div>
      </div>

      <!-- <iframe
          v-if="isvisible"
          style="height: 90vh"
          class="w-full"
          frameborder="0"
          scrolling="no"
          id="iframeContainer"
          type="application/pdf"
        /> -->

      <!-- <div>
          <div class="flex">
            <div class="flex">
              <Button
                label="ส่งออก Excel"
                class="p-button-primary"
                icon="pi pi-file-excel"
                @click="DownloadExampleExcel()"
              />
            </div>
            <div class="flex ml-2">
              <Button
                label="ส่งออก PDF"
                icon="pi pi-file-pdf"
                class="p-button-primary"
                @click="exportPDF()"
              />
            </div>
          </div>
        </div> -->
      <!-- <div class="grid">
          <div class="col-12" v-if="isvisible">
            <div class="flex justify-content-between">
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

            <DataTable
              :value="data_list"
              dataKey="accountcode"
              class="p-datatable-sm"
              :loading="loading"
              scrollHeight="69vh"
              v-model:expandedRows="expandedRows"
            >
              <DataTable>
                <Column header="วันที่" style="width: 8%"> </Column>
                <Column header="เลขที่เอกสาร" style="width: 10%"> </Column>
                <Column header="รายละเอียด" style="width: 10%"> </Column>
                <Column header="เดบิต" style="width: 10%"> </Column>
                <Column header="เครดิต" style="width: 10%"> </Column>
                <Column header="มูลค่าคงเหลือ" style="width: 10%"> </Column>
              </DataTable>
              <Column field="accountcode" header="รหัสบัญชี" style="width: 10%">
              </Column>
              <Column field="accountname" header="ชื่อบัญชี" style="width: 10%">
              </Column>
              <Column style="width: 10%"> </Column>
              <Column style="width: 10%"> </Column>
              <Column style="width: 10%"> </Column>
              <Column style="width: 10%"> </Column>
              <Column
                :expander="true"
                headerStyle="width: 3rem"
                style="width: 10%"
              />
            </DataTable>
            <DataTable
              :value="data_list"
              dataKey="accountcode"
              class="p-datatable-sm"
              :loading="loading"
              scrollHeight="69vh"
              v-model:expandedRows="expandedRows"
            >
              <Column style="width: 15%"></Column>
              <Column style="width: 10%">
                <template #body>ยกมา</template>
              </Column>
              <Column style="width: 10%"> </Column>
              <Column style="width: 10%"> </Column>
              <Column style="width: 10%"> </Column>
              <Column style="width: 30%"></Column>
              <Column field="balance" style="width: 8%"> </Column>

              <Column> </Column>

              <template #expansion="mainProps">
                <div class="orders-subtable">
                  <DataTable
                    :value="mainProps.data.details"
                    responsiveLayout="scroll"
                    dataKey="accountcode"
                  >
                    <template #empty> รหัสบัญชีนี้ไม่มีข้อมูล </template>
                    <template #loading>
                      กำลังประมวลผล กรุณารอซักครู่..</template
                    >
                    <Column field="docdate" style="width: 15%">
                      <template #body="slotProps">
                        {{ Utils.getDateFormatDMY(slotProps.data.docdate) }}
                      </template>
                    </Column>
                    <Column field="docno" style="width: 18%"> </Column>
                    <Column field="accountdescription" style="width: 17%">
                    </Column>
                    <Column field="debit" style="width: 17%"> </Column>
                    <Column field="credit" style="width: 18%">
                      <template #body="{ data, field }">
                        {{ checkzero(data[field]) }}
                      </template>
                    </Column>
                    <Column field="amount"> </Column>
                  </DataTable>
                </div>
              </template>
            </DataTable>
            <DataTable
              :value="data_list"
              dataKey="accountcode"
              class="p-datatable-sm"
              :loading="loading"
              scrollHeight="69vh"
              v-model:expandedRows="expandedRows"
            >
              <Column style="width: 15%"></Column>
              <Column style="width: 10%">
                <template #body>ยกไป</template>
              </Column>
              <Column style="width: 10%"> </Column>
              <Column style="width: 10%"> </Column>
              <Column style="width: 10%"> </Column>
              <Column style="width: 30%"></Column>
              <Column field="balance" style="width: 5%"> </Column>

              <Column> </Column
            ></DataTable>
          </div>
        </div> -->
      <div><p></p></div>
    </MainContentWarp>
  </AppLayout>
</template>
