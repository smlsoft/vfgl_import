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

          <div class="mb-2 col-12 md:col-12">
            <div class="flex flex-wrap card-container blue-container">
              <h1 for="selectedgroup" class="font-medium text-900"></h1>

              <div class="field col-4 md:col-3">
                <label class="col-6 md:col-6">สำหรับชุดบัญชี:</label>
                <Dropdown
                  class="col-12 md:col-12"
                  v-model="accountGroup"
                  :options="groups"
                  optionValue="code"
                  optionLabel="name1"
                  @change="selectAccount($event)"
                  placeholder="เลือกชุดบัญชี"
                />
                <!-- <RadioButton
                  :id="group.code"
                  name="group"
                  :value="group.code"
                  v-model="accountGroup"
                />
                <label :for="group.code"
                  >{{ group.code }} ~{{ group.name1 }}</label
                > -->
              </div>
            </div>
          </div>

          <div class="field mb-4 col-6 md:col-3">
            <label for="startDate" class="font-medium text-900 ml-3"
              >ช่วงระหว่างวันที่ :</label
            >
            <DatePicker
              class="field mb-12 col-12 md:col-12"
              dateFormat="d/m/yy"
              v-model="startDate"
              :modelValue="startDate"
              :showIcon="true"
              :buddhist="buddhistYear"
              :hideOnDateTimeSelect="true"
              :hiddenTime="true"
            />
          </div>
          <div class="field mb-4 col-6 md:col-3 ml-4">
            <label for="endDate" class="font-medium text-900"
              >ถึงวันที่ :</label
            >
            <DatePicker
              class="field mb-10 col-12 md:col-12"
              dateFormat="d/m/yy"
              v-model="endDate"
              :modelValue="endDate"
              :showIcon="true"
              :buddhist="buddhistYear"
              :hideOnDateTimeSelect="true"
              :hiddenTime="true"
            />
          </div>

          <div
            class="field-checkbox mb-1 col-1 md:col-2 p-button-outlined"
          ></div>
          <div class="field-checkbox mb-12 col-12 md:col-4">
            <Button
              class="field mb-12 col-xs-7 col-sm-7 col-lg-8 md:col-4 p-button-primary"
              label="จัดทำรายงาน"
              icon="pi pi-book"
              iconPos="left"
              @click="exreport()"
              :disabled="
                startDate === null ||
                endDate === null ||
                accountGroup.length == 0
              "
            />
          </div>
          <div class="field-checkbox mb-12 col-12 md:col-4"></div>
          <div class="field-checkbox mb-12 col-12 md:col-4"></div>
        </div>
        <div class="grid">
          <div class="col-12" v-if="isvisible">
            <div class="flex justify-content-between">
              <div>
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

            <DataTable
              :value="data_list"
              dataKey="docno"
              class="p-datatable-sm"
              :loading="loading"
              stripedRows
              responsiveLayout="scroll"
              @sort="sortBy"
              scrollHeight="69vh"
              v-model:expandedRows="expandedRows"
            >
              <template #header> </template>
              <template #empty> ไม่พบข้อมูล </template>
              <template #loading> กำลังประมวลผล กรุณารอซักครู่..</template>
              <Column :expander="true" headerStyle="width: 3rem" />
              <Column
                field="docno"
                header="เลขที่เอกสาร"
                :sortable="true"
              ></Column>
              <Column
                field="docdate"
                header="วันที่"
                dataType="date"
                :sortable="true"
              >
                <template #body="slotProps">
                  {{ Utils.getDateFormatDMY(slotProps.data.docdate) }}
                </template>
              </Column>
              <Column
                field="accountyear"
                header="ปีบัญชี"
                :sortable="true"
              ></Column>
              <Column
                field="accountperiod"
                header="งวดบัญชี"
                :sortable="true"
              ></Column>
              <Column
                field="accountgroup"
                header="กลุ่มบัญชี"
                :sortable="true"
              ></Column>
              <Column
                field="accountdescription"
                header="รายละเอียด"
                :sortable="true"
              ></Column>
              <Column
                field="amount"
                header="มูลค่า"
                class="text-header-right"
                headerStyle="text-align: right;"
                :sortable="true"
              >
                <template #body="{ data, field }">
                  {{ Utils.formatCurrency(data[field]) }}
                </template>
              </Column>
              <Column bodyStyle="text-align:center" style="width: 5%">
                <template #body>
                  <!-- <Button
                    icon="pi pi-eye"
                    class="p-button-rounded p-button-warning p-button-text"
                    @click="goDetail(slotProps.data)"
                  /> -->
                </template>
              </Column>
              <!-- <Column bodyStyle="text-align:center" style="width: 5%">
              <template #body="slotProps">
                <Button
                  icon="pi pi-trash"
                  class="p-button-rounded p-button-danger p-button-text"
                  @click="confirmDeleteDetail(slotProps.data)"
                />
              </template>
                </Column> -->
              <template #expansion="mainProps">
                <h5
                  class="my-1"
                  v-if="mainProps.data.journaldetail.length == 0"
                >
                  ไม่พบรายการตัวเลือก
                </h5>
                <div
                  class="orders-subtable"
                  v-if="mainProps.data.journaldetail.length > 0"
                >
                  <DataTable
                    :value="mainProps.data.journaldetail"
                    responsiveLayout="scroll"
                    dataKey="guidfixed"
                  >
                    <Column
                      field="accountcode"
                      header="รหัสบัญชี"
                      style="width: 20%"
                    ></Column>
                    <Column
                      field="accountname"
                      header="ชื่อบัญชี"
                      footerStyle="text-align: right "
                      footer="รวม"
                    ></Column>
                    <Column
                      field="debitamount"
                      header="เดบิต"
                      style="width: 20%"
                    >
                      <template #footer>
                        {{
                          Utils.formatCurrency(
                            getSumDebitAmount(mainProps.data.journaldetail)
                          )
                        }}
                      </template>
                      <template #body="{ data, field }">
                        {{ Utils.formatCurrency(data[field]) }}
                      </template>
                    </Column>
                    <Column
                      field="creditamount"
                      header="เครดิต"
                      style="width: 20%"
                    >
                      <template #footer>
                        {{
                          Utils.formatCurrency(
                            getSumCreditAmount(mainProps.data.journaldetail)
                          )
                        }}
                      </template>
                      <template #body="{ data, field }">
                        {{ Utils.formatCurrency(data[field]) }}
                      </template>
                    </Column>
                  </DataTable>
                </div>
              </template>
            </DataTable>
            <!-- <Paginator
              :rows="100"
              :totalRecords="totalItemsCount"
              @page="onPage($event)"
              :rowsPerPageOptions="[100]"
            >
            </Paginator> -->
          </div>
        </div>
      </div>
    </MainContentWarp>
  </AppLayout>
</template>

<script setup>
/* eslint-disable */
import ReportService from "@/services/ReportDataService";
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import { ref, onMounted } from "vue";
import pdfMake from "pdfmake/build/pdfmake";
import { useApp } from "@/stores/app.js";
import Utils from "@/utils/";
import DatePicker from "@/components/widget/DatePicker.vue";
import XLSX from "xlsx";
const detail = ref();
const textContent = ref("ต้องการลบข้อมูลรายวัน เลขที่เอกสาร");
const dailynum = ref("");
const head_example = ref([]);
const detail_example = ref([]);
const detail_examplenumbertwo = ref([]);

const deleteDetailDialog = ref(false);
const totalItemsCount = ref(0);
const filters = ref(null);
const loading = ref(true);
const activePage = ref(1);
const typingTimer = ref(null);
const doneTypingInterval = ref(1000);
const firstPage = ref(0);
const bottom = ref("");
const sortField = ref("docno");
const sortOrder = ref(1);
const searchItem = ref("");
const limitPage = ref(20);
const confirmDeleteDialog = ref(false);
const expandedRows = ref([]);

const storeApp = useApp();
const isvisible = ref(false);
const buddhistYear = ref(process.env.VUE_APP_DATE == "th");
const startDate = ref();
const endDate = ref();
const accountGroup = ref("");
const data_list = ref([]);
const data_list2 = ref([]);
const groups = ref([]);
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
  getAccountChartList();
  getAccountGroupList();
  getDate();
  getGLJournalList();
  storeApp.setPageTitle("รายงานข้อมูลรายวัน");
  storeApp.setActivePage("รายงาน");
  storeApp.setActiveChild("รายงาน");
});
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
async function expandAll() {
  expandedRows.value = data_list.value.filter();
  toast.add({ severity: "success", summary: "All Rows Expanded", life: 3000 });
}
async function getAccountGroup() {
  try {
    const res = await MasterdataService.getAccountGroup();
    //console.log(res);
    if (res.success) {
      groups.value.push(...res.data);
      setTimeout(() => {
        if (accountGroup.value == "") {
          accountGroup.value = groups.value[0].code;
        }
      }, 100);
    }
  } catch (err) {
    console.log(err);
  }
}
function selectAccount(event) {
  console.log(event);
}
function getAccountChartList() {
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
        data_list2.value = res.data;
        totalItemsCount.value = res.pagination.total;
      }
      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}
//output------
async function exportPDF() {
  var body = [];
  body = await buildFromJson();
  var docDefinition = pageSetup(body);
  pdfMake.createPdf(docDefinition).download();
}
function pageSetup(data) {
  var docDefinition = {
    content: [
      // {
      //   style: "tableExample",
      //   table: {
      //     widths: ["46%", "10%", "22%", "22%"],
      //     body: data,
      //   },
      //   layout: "lightHorizontalLines",
      // },
      {
        style: "tableExample",
        table: {
          width: ["100%"],
          body: data,
        },
        layout: "lightHorizontalLines",
      },
    ],
    pageOrientation: "portrait",
    pageMargins: [8, 8, 8, 8],
    defaultStyle: {
      font: "Sarabun",
    },
  };
  return docDefinition;
}
function buildFromJson() {
  var body = [];

  body.push([
    { text: "เลขที่เอกสาร", fillColor: "#81d4fa" },
    { text: "วันที่", fillColor: "#81d4fa" },
    { text: "ปีบัญชี", fillColor: "#81d4fa" },
    { text: "งวดบัญชี", fillColor: "#81d4fa" },
    { text: "กลุ่มบัญชี", fillColor: "#81d4fa" },
    { text: "รายละเอียด", fillColor: "#81d4fa" },
    { text: "มูลค่า", fillColor: "#81d4fa" },
  ]);

  data_list.value.forEach((data) => {
    body.push([
      { text: data.docno },

      { text: Utils.getDateFormatDMY(data.docdate) },
      {
        text: data.accountyear,
      },
      { text: data.accountperiod },
      { text: data.accountgroup },
      { text: data.accountdescription },
      { text: data.amount },
    ]);
    body.push([
      { text: "รหัสบัญชี", fillColor: "#d8eaf2" },
      { text: "ชื่อบัญชี", fillColor: "#d8eaf2" },
      { text: "", fillColor: "#d8eaf2" },
      { colSpan: 2, text: "เดบิต", fillColor: "#d8eaf2" },
      { text: "", fillColor: "#d8eaf2" },
      { colSpan: 2, text: "เครดิต", fillColor: "#d8eaf2" },
      { text: "", fillColor: "#d8eaf2" },
    ]);

    data.journaldetail.forEach((details) => {
      console.log(details);
      body.push([
        { text: details.accountcode },
        { text: details.accountname },
        { text: "" },
        { colSpan: 2, text: Utils.formatCurrency(details.debitamount) },
        { text: "" },
        { colSpan: 2, text: Utils.formatCurrency(details.creditamount) },
        { text: "" },
      ]);
    });

    body.push([
      { text: "", fillColor: "#d8eaf1" },
      { text: "", fillColor: "#d8eaf1" },
      {
        text: "รวม",
        style: ["header", "textdecoration"],
        fillColor: "#d8eaf1",
      },
      {
        colSpan: 2,
        text: Utils.formatCurrency(getSumDebitAmount(data.journaldetail)),
        fillColor: "#d8eaf1",
      },
      { text: "", fillColor: "#d8eaf1" },
      {
        colSpan: 2,
        text: Utils.formatCurrency(getSumCreditAmount(data.journaldetail)),
        fillColor: "#d8eaf1",

        // Utils.formatCurrency(
        //   getSumDebitAmount(data.journaldetail.debitamount)
        // ),
      },
      {},
    ]);

    body.push([
      { text: "เลขที่เอกสาร", fillColor: "#81d4fa" },
      { text: "วันที่", fillColor: "#81d4fa" },
      { text: "ปีบัญชี", fillColor: "#81d4fa" },
      { text: "งวดบัญชี", fillColor: "#81d4fa" },
      { text: "กลุ่มบัญชี", fillColor: "#81d4fa" },
      { text: "รายละเอียด", fillColor: "#81d4fa" },
      { text: "มูลค่า", fillColor: "#81d4fa" },
    ]);
  });

  return body;
}
function DownloadExampleExcel() {
  console.log("DownloadExampleExcel");

  data_list.value.forEach((data) => {
    detail_example.value.push(
      {
        เลขที่เอกสาร: data.docno,

        วันที่: Utils.getDateFormatDMY(data.docdate),
        ปีบัญชี: data.accountyear,
        งวดบัญชี: data.accountperiod,
        กลุ่มบัญชี: data.accountgroup,
        รายละเอียด: data.accountdescription,
        มูลค่า: data.amount,
      },
      {
        เลขที่เอกสาร: "รหัสบัญชี",

        วันที่: "ชื่อบัญชี",
        ปีบัญชี: "",
        งวดบัญชี: "",
        กลุ่มบัญชี: "",
        รายละเอียด: "เดบิต",
        มูลค่า: "เครดิต",
      }
    );

    data.journaldetail.forEach((details) => {
      // console.log(details);
      detail_example.value.push({
        เลขที่เอกสาร: details.accountcode,

        วันที่: details.accountname,
        ปีบัญชี: "",
        งวดบัญชี: "",
        กลุ่มบัญชี: "",
        รายละเอียด: Utils.formatCurrency(details.debitamount),
        มูลค่า: Utils.formatCurrency(details.creditamount),
      });
    });

    detail_example.value.push({
      เลขที่เอกสาร: data.accountname,

      วันที่: "",
      ปีบัญชี: "",
      งวดบัญชี: "",
      กลุ่มบัญชี: "รวม",
      รายละเอียด: Utils.formatCurrency(getSumDebitAmount(data.journaldetail)),
      มูลค่า: Utils.formatCurrency(getSumCreditAmount(data.journaldetail)),
    });
    detail_example.value.push({
      เลขที่เอกสาร: "เลขที่เอกสาร",

      วันที่: "วันที่",
      ปีบัญชี: "ปีบัญชี",
      งวดบัญชี: "งวดบัญชี",
      กลุ่มบัญชี: "กลุ่มบัญชี",
      รายละเอียด: "รายละเอียด",
      มูลค่า: "มูลค่า",
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
  XLSX.utils.book_append_sheet(wb, Example, "รายงานข้อมูลผังบัญชี");
  XLSX.writeFile(wb, "รายงานข้อมูลผังบัญชี.xlsx");
}
//output------
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
        if (data_list.value.length <= 1) {
          isvisible.value = true;
          console.log("<1");
        } else {
          console.log("มากกว่า");
          isvisible.value = true;
          scrollBottom();
        }

        // console.log(totalItemsCount.value);
      }

      loading.value = false;
    })
    .catch((err) => {
      loading.value = false;
      console.log(err);
    });
}
function scrollBottom() {
  console.log("succ");
  bottom.value = document.body.scrollHeight;
  window.scrollTo({
    top: bottom.value,
    behavior: "smooth",
  });
}
function exreport() {
  getGLJournalList();

  // expandAll();
}

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
<style>
.iclass {
  padding-left: 50px;
  color: #3f51b1;
  font-weight: bold;
}
.iHeader {
  /*font-family: "mitr";*/
  color: #3f51b5;
  font-weight: bold;
}
</style>
