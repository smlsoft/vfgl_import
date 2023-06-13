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
          <!-- <div class="field mb-12 col-12 md:col-12">
            <i class="pi pi-book" style="font-size: 2rem"></i>
            <i class="iHeader" style="font-size: 2rem"> รายงานทางการเงิน </i>
            <Image
              src="/images/manual/photoanddoc/vf5.png"
              alt="test"
              align="right"
              width="800"
              class="align-items-center"
            />
          </div> -->
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
            <label for="startDate" class="font-medium text-900 ml-2"
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
          <div class="field-checkbox mb-12 col-12 md:col-3">
            <Checkbox :binary="true" v-model="ica" />

            <label>รวมรายการปิดบัญชีสิ้นปี</label>
          </div>

          <div class="field-checkbox mb-12 col-12 md:col-4">
            <Button
              class="field mb-12 col-xs-7 col-sm-7 col-lg-8 md:col-4 p-button-primary"
              label="จัดทำรายงาน"
              icon="pi pi-book"
              iconPos="left"
              @click="exportPDF()"
              :disabled="
                startDate === null ||
                endDate === null ||
                accountGroup.length == 0
              "
            />
          </div>
          <div class="field-checkbox mb-12 col-12 md:col-4"></div>
          <div class="field-checkbox mb-12 col-12 md:col-4"></div>
          <!-- <div class="card-container yellow-container overflow-hidden mx-auto">
            <div class="flex">
              <div
                class="flex-1 flex align-items-center justify-content-centerfont-bold text-gray-900 m-2 px-5 py-3 border-round"
              ></div>
              <div
                class="flex-1 flex align-items-center justify-content-center font-bold text-gray-900 border-round"
              >
               
              </div>
              <div
                class="flex-1 flex align-items-center justify-content-center font-bold text-gray-900 m-2 px-5 py-3 border-round"
              ></div>
            </div>
          </div> -->

          <div class="col-12" v-if="isvisible">
            <iframe
              class="w-full overflow-auto surface-overlay"
              style="height: 90vh"
              id="iframeContainer"
            ></iframe>
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
const pagerepeat = ref(false);
const pagetobreak = ref(false);
const storeApp = useApp();
const isvisible = ref(false);
const buddhistYear = ref(process.env.VUE_APP_DATE == "th");
const startDate = ref();
const endDate = ref();
const accountGroup = ref("");
const bottom = ref("");
const data_list = ref([]);
const currentTime = ref("");
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
  getAccountGroupList();
  getDate();
  console.log(accountGroup.value);
  storeApp.setPageTitle("งบทดลอง");
  storeApp.setActivePage("รายงาน");
  storeApp.setActivePage("รายงาน");
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
async function getAccountGroup() {
  try {
    const res = await MasterdataService.getAccountGroup();
    //console.log(res);
    if (res.success) {
      groups.value.push(...res.data);
      setTimeout(() => {
        if (accountGroup.value == "") {
          accountGroup.value = groups.value[0].name1;
        }
      }, 100);
      console.log(groups.value);
    }
  } catch (err) {
    console.log(err);
  }
}
function selectAccount(event) {
  console.log(event);

  console.log(data_list.value);
}
function scrollBottom() {
  bottom.value = document.body.scrollHeight;

  window.scrollTo({
    top: bottom.value,
    behavior: "smooth",
  });
}
async function exportPDF() {
  isvisible.value = true;

  var body = [];
  var startdate = "";
  var enddate = "";

  body = await buildFromJson();
  startdate = Utils.getYearBuddhist(startDate.value);
  enddate = Utils.getYearBuddhist(endDate.value);
  var docDefinition = pageSetup(body, startdate, enddate, pagerepeat.value);
  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.getDataUrl((dataUrl) => {
    const targetElement = document.querySelector("#iframeContainer");

    targetElement.src = dataUrl;
  });
}

function checklength(data) {
  console.log(data.length + "length");
  if (data.length > 34) {
    pagerepeat.value = true;
    console.log(pagerepeat.value + "pagerepeat");
  }
  return data;
}

function currentDate() {
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${
    current.getFullYear() + 543
  }`;
  return date;
}
function updateTime() {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  currentTime.value = timeString.replace(/ AM$/, "");
}
function getDate() {
  var date = new Date();
  startDate.value = new Date(date.getFullYear(), date.getMonth(), 1);
  endDate.value = new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function pageSetup(data, startdate, enddate, pagerepeat, currentPage) {
  console.log(pagerepeat);

  var docDefinition = {
    info: {
      title: "รายงาน งบทดลอง " + currentDate(),
      author: "john doe",
      subject: "subject of document",
      keywords: "keywords for document",
    },
    pageMargins: currentPage === 1 ? [40, 50, 40, 40] : [40, 49, 40, 40],
    if(condition) {},

    header: function (currentPage, pageCount) {
      if (currentPage === 1) {
        return null;
      }
      return [
        {
          margin: [40, 10, 40, 250],
          alignment: "center",
          table: {
            headerRows: 1,
            heights: ["100%"],
            widths: ["42%", "14%", "22%", "22%"],

            body: [
              [
                {
                  text: "ชื่อบัญชี",
                  style: "header",
                  border: [true, true, true, false],
                  margin: [10, 10, 10, 10],
                  alignment: "center",
                },
                {
                  text: "เลขที่บัญชี",
                  style: "header",
                  border: [true, true, true, false],
                  margin: [10, 10, 10, 10],
                  alignment: "center",
                },
                {
                  text:
                    "ยอดคงเหลือด้านบัญชี" + "\n" + "หมวดสินทรัพย์/ค่าใช้จ่าย",
                  style: "header",
                  alignment: "center",
                  border: [true, true, true, false],
                },
                {
                  text: "ยอดคงเหลือด้านบัญขี" + "\n" + "หมวดหนี้สิน/ทุน/รายได้",
                  style: "header",
                  border: [true, true, true, false],
                  alignment: "center",
                },
              ],
            ],
          },
          // pageBreak: "after", // or 'after' if you want to force a page break after the table
        },
      ]; // Define your header content here
    },
    footer: function (currentPage, pageCount) {
      return [
        {
          text:
            "วันที่พิมพ์ " +
            currentDate() +
            " เวลา " +
            currentTime.value +
            "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t" +
            currentPage.toString() +
            " of " +
            pageCount,
          alignment: "left",
          marginLeft: 15,
          fontSize: 8,
        },
      ];
    },

    content: [
      {
        text: "\n ชื่อกลุ่มบัญชี " + accountGroup.value,

        style: "header",
        alignment: "left",
        marginTop: -50,
        marginLeft: 160,
        layout: "lightHorizontalLines",
      },
      {
        text:
          "ชื่อกองทุนหมู่บ้าน: \t" +
          checknull(localStorage.shop_name) +
          "\t\t\t\t\t\t\t\t\t\t\t\t\t\tรหัสกองทุน: " +
          checknull(localStorage.branchcode) +
          "\n" +
          "ที่อยู่กองทุนหมู่บ้าน : " +
          checknull(localStorage.address),
        style: "header",
        marginLeft: 100,
        alignment: "left",
        layout: "lightHorizontalLines",
      },
      {
        text: " งบทดลอง  ",
        fontSize: 13,
        marginLeft: 190,
        marginBottom: 2,
        style: "header",
        alignment: "left",
      },
      {
        text:
          "สิ้นสุด  ณ วันที่  \t" +
          Utils.getDateShowText(enddate) +
          "\n สำหรับกิจกรรมกองทุน",
        style: "header",
        alignment: "left",
        marginLeft: 190,

        layout: "lightHorizontalLines",
      },
      {
        text: "หน่วย:บาท",
        style: "header",
        heights: "",
        marginRight: "3",
        alignment: "right",
      },
      {
        style: "tableExample",
        table: {
          heights: "auto",
          widths: ["42%", "14%", "22%", "22%"],
          body: checklength(data),
        },
      },

      [
        {
          alignment: "left",
          style: "",
          margin: pagetobreak.value == true ? [5, 50, 10, 20] : [5, 5, 10, 20], // Adjust the margins for the text spacing
          text:
            "\n\ขอรับรองว่าตรวจสอบบัญชีงบดุล" +
            "/งบการเงินประจำปี พ.ศ. " +
            Utils.getDateShowText2(enddate) +
            " ของ  " +
            localStorage.shop_name +
            checknull("\t" + localStorage.address + "\t") +
            "ว่าเป็นงบดุล/งบการเงินที่ถูกต้อง  จึงลงลายมือชื่อไว้เป็นหลักฐาน",
          lineHeight: 1.3,
        },
        {
          alignment: "right",
          style: "",
          text: "(ลงชื่อ) ….......................................",
          marginRight: 80,
        },
        {
          alignment: "right",
          style: "",
          text: " (…..............................................) ",
          marginRight: 80,
        },
        {
          alignment: "right",
          style: "",
          text: "วันที่ …...../......../........... \n\n",
          marginRight: 100,
        },

        {
          layout: "noBorders", // optional
          table: {
            style: "tableExample",
            alignment: "center",

            headerRows: 1,
            widths: [10, 5, 150, 5, 150, 5, 100, 10],
            fontSize: 20,
            body: [
              [
                "",

                {
                  svg: `<svg width="12" height="12">
                    <rect x="0" y="0" width="12" height="12" stroke="#000" fill="#fff"/>
                  </svg>`,
                  marginTop: 4,
                },
                { text: "ผู้ตรวจสอบภายใน", marginTop: 4, marginLeft: 5 },
                {
                  svg: `<svg width="12" height="12">
                    <rect x="0" y="0" width="12" height="12" stroke="#000" fill="#fff"/>
                  </svg>`,
                  marginTop: 4,
                },
                {
                  text: "ผู้ตรวจสอบบัญชีรับอนุญาต",
                  marginTop: 4,
                  marginLeft: 5,
                },
                {
                  svg: `<svg width="12" height="12">
                    <rect x="0" y="0" width="12" height="12" stroke="#000" fill="#fff"/>
                  </svg>`,
                  marginTop: 4,
                },
                { text: "เจ้าหน้าที่หน่วยงานรัฐ", marginTop: 4, marginLeft: 5 },

                "",
              ],
              [
                "",

                {
                  svg: `<svg width="12" height="12">
                    <rect x="0" y="0" width="12" height="12" stroke="#000" fill="#fff"/>
                  </svg>`,
                  marginTop: 4,
                },
                { text: "ผู้สอบบัญชีอื่นๆ", marginTop: 4, marginLeft: 5 },
                {
                  svg: `<svg width="12" height="12">
                    <rect x="0" y="0" width="12" height="12" stroke="#000" fill="#fff"/>
                  </svg>`,
                  marginTop: 4,
                },
                { text: "กรรมการกองทุนหมู่บ้าน", marginTop: 4, marginLeft: 5 },
                {
                  svg: `<svg width="12" height="12">
                    <rect x="0" y="0" width="12" height="12" stroke="#000" fill="#fff"/>
                  </svg>`,
                  marginTop: 4,
                },
                {
                  text: " อื่นๆ..........................",
                  marginTop: 4,
                  marginLeft: 5,
                },

                "",
              ],
            ],
          },
        },
      ],
    ],
    pageOrientation: "portrait",
    // pageMargins: [20, 20, 20, 20],
    defaultStyle: {
      font: "Sarabun",
      fontSize: 10,
      columnGap: 20,
      color: "#0A065D",
    },
    styles: {
      header: {
        lineHeight: 1.2,
        bold: true,
        alignment: "center",
      },
      pd: {
        margin: [2.5, 0, 0, 0],
      },
    },
  };

  if (pagerepeat == true) {
    console.log(pagerepeat.value + "pagerepeat2");
  } else {
    console.log(pagerepeat);
    console.log("its false");
  }

  return docDefinition;
}
function checknull(data) {
  if (data == null || data == "" || data == "undefined") {
    // data = " -";
    return (data = "");
  } else {
    return (data = data);
  }
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

async function buildFromJson() {
  let body = [];
  let listTrialBalanceSheet = [];

  let totalnextbalancedebit = "";
  let totalnextbalancecredit = "";

  let accountgroup = accountGroup.value;
  let startdate = Utils.getDateFromYear(startDate.value);
  let enddate = Utils.getDateFromYear(endDate.value);
  let timezone = "%2B07";
  updateTime();
  console.log("ica", ica.value);

  let icax = "0";
  if (ica.value) {
    icax = "1";
  }
  try {
    const res = await ReportService.getTrialBalanceSheet(
      accountgroup,
      startdate,
      enddate,

      icax,
      (timezone = "%2B07")
    );
    if (res.success) {
      console.log(res.data.accountdetails.length);
      if (res.data.accountdetails.length >= 34) {
        pagerepeat.value = true;
      } else {
        pagerepeat.value = false;
        console.log(pagerepeat.value);
      }
      if (res.data.accountdetails.length >= 24) {
        pagetobreak.value = true;
        console.log(pagetobreak.value);
      } else {
        pagetobreak.value = false;
        console.log(pagetobreak.value);
      }
      listTrialBalanceSheet.value = res.data;
      totalnextbalancedebit = res.data.totalnextbalancedebit;
      totalnextbalancecredit = res.data.totalnextbalancecredit;
      scrollBottom();
    }
  } catch (err) {
    console.log(err);
  }

  body.push([
    {
      text: "ชื่อบัญชี",
      style: "header",
      margin: [10, 10, 10, 10],
      alignment: "center",
    },
    {
      text: "เลขที่บัญชี",
      style: "header",
      alignment: "center",
      margin: [10, 10, 10, 10],
    },
    {
      text: "ยอดคงเหลือด้านบัญชี" + "\n" + "หมวดสินทรัพย์/ค่าใช้จ่าย",
      style: "header",
      alignment: "center",
    },
    {
      text: "ยอดคงเหลือด้านบัญขี" + "\n" + "หมวดหนี้สิน/ทุน/รายได้",
      style: "header",
      alignment: "center",
    },
  ]);

  for (let detailAccount of listTrialBalanceSheet.value.accountdetails) {
    body.push([
      { text: detailAccount.accountname },
      { text: detailAccount.accountcode, alignment: "center" },

      {
        text:
          detailAccount.accountcategory == 1 ||
          detailAccount.accountcategory == 5
            ? Utils.formatNumber(detailAccount.nextbalanceamount)
            : "",
        alignment: "right",
      },
      {
        text:
          detailAccount.accountcategory == 2 ||
          detailAccount.accountcategory == 3 ||
          detailAccount.accountcategory == 4
            ? Utils.formatNumber(detailAccount.nextbalanceamount)
            : "",
        alignment: "right",
      },
    ]);
  }

  body.push([
    { colSpan: 2, text: "รวม", bold: true, alignment: "center" },
    {},
    {
      text: Utils.formatNumber(totalnextbalancedebit),
      bold: true,
      alignment: "right",
    },
    {
      text: Utils.formatNumber(totalnextbalancecredit),
      bold: true,
      alignment: "right",
    },
  ]);

  return body;
}

function formatCurrency(value) {
  return value.toLocaleString("th-TH", { style: "currency", currency: "THB" });
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
