<template>
  <AppLayout>
    <MainContentWarp>
      <div class="p-2 surface-section flex-auto">
        <div class="grid p-fluid">
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
              </div>
            </div>
          </div>

          <div class="mb-4 col-6 md:col-3">
            <label for="startDate" class="font-medium text-900 ml-3"
              >ณ วันที่ :</label
            >
            <DatePicker
              class="field mb-12 col-12 md:col-12"
              dateFormat="d/m/yy"
              v-model="endDate"
              :modelValue="startDendDateate"
              :showIcon="true"
              :buddhist="buddhistYear"
              :hideOnDateTimeSelect="true"
              :hiddenTime="true"
            />
          </div>
          <div class="field-checkbox mb-1 col-5 md:col-3">
            <Checkbox :binary="true" v-model="ica" />
            <label>รวมรายการปิดบัญชีสิ้นปี</label>
          </div>
          <div class="field-checkbox mb-12 col-12 md:col-4"></div>
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
          <div class="col-12" v-if="isvisible">
            <div class="overflow-auto surface-overlay">
              <iframe
                style="height: 90vh"
                class="w-full"
                frameborder="0"
                scrolling="no"
                id="iframeContainer"
                type="application/pdf"
              />
            </div>
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
import { ref, onMounted } from "vue";
import MasterdataService from "@/services/MasterdataService";
import pdfMake, { CP } from "pdfmake/build/pdfmake";
import { useApp } from "@/stores/app.js";
import Utils from "@/utils/";
import DatePicker from "@/components/widget/DatePicker.vue";
import utils from "../../utils";

const storeApp = useApp();
const isvisible = ref(false);
const buddhistYear = ref(process.env.VUE_APP_DATE == "th");
const endDate = ref(null);
const accountGroup = ref("");
const groups = ref([]);
const data_list = ref([]);
const currentTime = ref("");
const Timezone = ref("+7");
const ica = ref(false);
const bottom = ref("");
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
  getDate();
  storeApp.setPageTitle("รายงานงบดุล");
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
    }
  } catch (err) {
    console.log(err);
  }
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

async function exportPDF() {
  isvisible.value = true;
  var body = [];
  var enddate = "";
  body = await buildFromJson();
  scrollBottom();
  enddate = Utils.getYearBuddhist(endDate.value);

  var docDefinition = pageSetup(body, enddate);

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);
  pdfDocGenerator.getDataUrl((dataUrl) => {
    const targetElement = document.querySelector("#iframeContainer");
    targetElement.src = dataUrl;
  });
}
function scrollBottom() {
  bottom.value = document.body.scrollHeight;

  window.scrollTo({
    top: bottom.value,
    behavior: "smooth",
  });
}
function selectAccount(event) {
  console.log(event);
}
function getDate() {
  var date = new Date();
  endDate.value = new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
function currentDate() {
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1}/${
    current.getFullYear() + 543
  }`;
  return date;
}
const updateTime = () => {
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  currentTime.value = timeString.replace(/ AM$/, "");
};

function pageSetup(data, enddate) {
  updateTime();
  var docDefinition = {
    info: {
      title: "รายงาน งบดุล " + currentDate(),
      author: "john doe",
      subject: "subject of document",
      keywords: "keywords for document",
    },
    pageMargins: [40, 150, 40, 50],
    header: [
      {
        text: "\n ชื่อกลุ่มบัญชี " + accountGroup.value,

        style: "header",
        alignment: "left",
        marginLeft: 160,
        layout: "lightHorizontalLines",
      },
      {
        text:
          "ชื่อกองทุนหมู่บ้าน: \t" +
          checknull(localStorage.shop_name) +
          "\t\t\t\t\t\t\t\t\t\t\t\t\tรหัสกองทุน: " +
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
        text: " งบแสดงฐานะการเงิน (งบดุล)  ",
        fontSize: 13,
        // marginLeft: 190,

        style: "header",
        alignment: "center",
      },
      {
        text: "สิ้นสุด  ณ วันที่  \t" + Utils.getDateShowText(enddate),

        style: "header",
        alignment: "center",
        marginLeft: 35,

        layout: "lightHorizontalLines",
      },
      {
        text: "สำหรับกิจกรรมกองทุน",
        style: "header",
        alignment: "center",
        marginLeft: -60,
        // marginLeft: 190,

        layout: "lightHorizontalLines",
      },
      {
        text: "หน่วย:บาท",
        style: "header",
        heights: "",
        marginRight: "40",
        alignment: "right",
      },
    ],

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
        // {
        //   text: currentPage.toString() + " of " + pageCount,
        //   alignment: "left",
        // },
      ];
    },
    content: [
      {
        style: "tableExample",
        table: {
          widths: ["35%", "40%", "20%"],
          body: [
            [
              { text: "", style: "" },
              {
                text: "",
                bold: true,
                alignment: "right",
              },
              // { text: "" },
            ],
          ],
        },
        layout: "noBorders",
      },
      {
        style: "tableExample",
        table: {
          widths: ["35%", "30%", "35%"],
          body: data,
        },
        layout: "noBorders",
      },
      {
        alignment: "left",
        style: "",
        margin: [5, 2, 10, 20], // Adjust the margins for the text spacing
        text:
          "\nขอรับรองว่างบดุล" +
          // /งบการเงินประจำปี พ.ศ." +
          // Utils.getDateShowText(enddate) +
          "ของ  " +
          localStorage.shop_name +
          checknull("\t" + localStorage.address + "\t") +
          "ว่าเป็นงบดุลที่ถูกต้อง  จึงลงลายมือชื่อไว้เป็นหลักฐาน",
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
        text: "วันที่ …...../......../...........\n\n",
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
    pageBreakBefore: function (
      currentNode,
      followingNodesOnPage,
      nodesOnNextPage,
      previousNodesOnPage
    ) {
      return (
        currentNode.headlineLevel == 10 && followingNodesOnPage.length === 0
      );
    },
    pageOrientation: "portrait",
    // pageMargins: [0, 0, 0, 0],
    defaultStyle: {
      font: "Sarabun",
      fontSize: 10,
      columnGap: 20,
      color: "#0A065D",
    },
    styles: {
      Spacing: {
        lineHeight: 2,
      },
      header: {
        lineHeight: 1.3,
        fontsize: 16,
        bold: true,
      },
      textdecoration: {
        // alignment: "right",
        decoration: "underline",
      },
      textdecorationbeforeValue: {
        // alignment: "right",

        decoration: "underline",
      },
      textdecorationValue: {
        bold: true,
        // alignment: "right",
        decoration: "underline",
        decorationStyle: "double",
      },
      textdecorationValueAmount: {
        bold: true,
        // alignment: "right",
        decoration: "underline",
        decorationStyle: "double",
      },
      marginheader: {
        margin: [10, 0, 0, 0],
      },
      margindetail: {
        margin: [20, 0, 0, 0],
      },
      margintotal: {
        margin: [50, 0, 0, 0],
      },
    },
  };
  return docDefinition;
}

async function buildFromJson() {
  let body = [];
  let listBalanceSheet = [];
  let data = {};

  let totalAssetAmount = "";
  let totalLiabilityAmount = "";
  let totalOwnersequityAmount = "";
  let totalLiabilityAndOwnersequityAmount = "";
  let accountgroup = accountGroup.value;
  let enddate = Utils.getDateFromYear(endDate.value);
  let timezone = "%2B07";
  console.log("ica", Timezone.value);

  let icax = "0";
  if (ica.value) {
    icax = "1";
  }
  try {
    const res = await ReportService.getBalanceSheetGroup(
      accountgroup,
      enddate,
      icax,
      (timezone = "%2B07")
    );

    if (res.success) {
      console.log(res.data);
      data = res.data;

      scrollBottom();
    }
  } catch (err) {
    console.log(err);
  }

  body.push([
    { text: "สินทรัพย์:", style: ["header", "textdecoration"] },
    { text: "", style: "" },
    { text: "", style: ["header", "textdecoration"] },
  ]);
  body.push([
    { text: "สินทรัพย์หมุนเวียน", style: "" },
    { text: "", style: "" },
    { text: "", style: "header" },
  ]);
  // data.acc_11000 == 0
  //   ? body.shift
  //   :
  body.push([
    { text: " เงินสด", style: "marginheader" },
    { text: "", style: "" },
    {
      text: Utils.formatNumber(data.acc_11000),
      style: "",
      alignment: "right",
    },
  ]);
  //   data.acc_12100 == 0
  // ? body.shift
  // :
  body.push([
    { text: "เงินฝากธนาคาร", style: "marginheader" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_12100), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "ลูกหนี้เงินกู้ยืม", style: "marginheader" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_13000), style: "", alignment: "right" },
  ]);
  body.push([
    {
      text: "ค่าเผื่อหนี้สงสัยจะสูญ-ลูกหนี้เงินกู้",
      style: "marginheader",
    },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_13100), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "ลูกหนี้การค้า", style: "marginheader" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_14000), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "ลูกหนี้อื่น", style: "marginheader" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_14020), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "สินค้าคงเหลือ", style: "marginheader" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_15000), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "วัตถุดิบเพื่อการผลิต", style: "marginheader" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_15020), style: "", alignment: "right" },
  ]);
  body.push([
    { text: " สินทรัพย์หมุนเวียนอื่น", style: "marginheader" },
    { text: "", style: "" },
    {
      text: Utils.formatNumber(data.acc_16000),
      style: "textdecorationbeforeValue",
      alignment: "right",
    },
  ]);
  body.push([
    { text: "", style: "margindetail" },
    { text: "รวมสินทรัพย์หมุนเวียน", style: "header", alignment: "left" },
    {
      text: Utils.formatNumber(data.totalcurrentasset),
      style: ["textdecorationValue"],
      alignment: "right",
    },
  ]);
  body.push([
    { text: "สินทรัพย์ไม่หมุนเวียน", style: "" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_17000), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "ที่ดิน อาคาร และอุปกรณ์(สุทธิ)", style: "" },
    { text: "", style: "" },
    {
      text: Utils.formatNumber(data.acc_18000),
      style: "",
      alignment: "right",
    },
  ]);
  body.push([
    { text: "รวมสินทรัพย์ไม่หมุนเวียนอื่น", style: "" },
    { text: "", style: "" },
    {
      text: Utils.formatNumber(data.acc_19000),
      style: "textdecorationbeforeValue",
      alignment: "right",
    },
  ]);
  body.push([
    { text: "", style: "" },
    {
      text: "รวมสินทรัพย์ไม่หมุนเวียน",
      style: "header",
      alignment: "left",
    },
    {
      text: Utils.formatNumber(data.totalnoncurrentasset),
      style: "textdecorationValue",
      alignment: "right",
    },
  ]);
  body.push([
    { text: "", style: "" },
    {
      text: "รวมสินทรัพย์",

      style: "header",
      alignment: "center",
    },
    {
      text: Utils.formatNumber(data.totalassetamount),
      style: "textdecorationValueAmount",
      alignment: "right",
      fontSize: 12,
    },
  ]);
  body.push([
    { text: "หนี้สิน:", style: ["header", "textdecoration"] },
    { text: "", style: "" },
    { text: "", style: ["header", "textdecoration"], alignment: "right" },
  ]);
  body.push([
    { text: "หนี้สิน", style: "" },
    { text: "", style: "" },
    { text: "", style: "", alignment: "right" },
  ]);
  body.push([
    { text: "\t หนี้สินหมุนเวียน", style: "marginheader" },
    { text: "", style: "" },
    { text: "", style: "", alignment: "right" },
  ]);
  body.push([
    { text: "เจ้าหนี้ - เงินรับฝาก", style: "margindetail" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_20000), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "เงินกู้ยืมระยะสั้น", style: "margindetail" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_22000), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "หนี้สินหมุนเวียนอื่น", style: "margindetail" },
    { text: "", style: "" },
    {
      text: Utils.formatNumber(data.acc_23000),
      style: "textdecoration",
      alignment: "right",
    },
  ]);
  body.push([
    { text: "", style: "" },
    { text: "รวมหนี้สินหมุนเวียน", style: "header", alignment: "left" },
    {
      text: Utils.formatNumber(data.totalcurrentliability),
      style: "textdecorationValueAmount",
      alignment: "right",
    },
  ]);
  body.push([
    { text: "หนี้สินระยะยาว", style: "marginheader" },
    { text: "", style: "" },
    {
      text: Utils.formatNumber(data.acc_24000),
      style: "textdecoration",
      alignment: "right",
    },
  ]);
  body.push([
    { text: "", style: "" },
    { text: "รวมหนี้สิน", style: "header", alignment: "center" },
    {
      text: Utils.formatNumber(data.totalliabilityamount),
      style: "textdecorationValueAmount",
      bold: true,
      alignment: "right",
    },
  ]);
  body.push([
    { text: "ทุน:", style: ["header", "textdecoration"] },
    { text: "", style: "" },
    { text: "", style: ["header", "textdecoration"] },
  ]);
  body.push([
    { text: "ทุน - หุ้นสมาชิก", style: "marginheader" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_31000), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "ทุน - เงินออมสัจจะ", style: "marginheader" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_31020), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "ทุน - เงินจัดสรรจากรัฐบาล", style: "marginheader" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_32000), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "ทุน - อื่น", style: "marginheader" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_32060), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "กำไรจัดสรร", style: "marginheader" },
    { text: "", style: "" },
    { text: "", style: "text", alignment: "right" },
  ]);
  body.push([
    { text: "ทุนสำรองตามกฎหมาย", style: "margindetail" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_34000), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "เงินสมทบกองทุน", style: "margindetail" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_34200), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "เงินเฉลี่ยคืน", style: "margindetail" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_34300), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "เงินปันผล", style: "margindetail" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_34400), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "ค่าตอบแทนคณะกรรมการ", style: "margindetail" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_34500), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "ทุนสาธารณะประโยชน์", style: "margindetail" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_34510), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "เงินประกันความเสี่ยง", style: "margindetail" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_34520), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "เงินสวัสดิการกองทุน", style: "margindetail" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_34530), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "เงินสมทบเพื่อการศึกษา", style: "margindetail" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_34540), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "ค่าดำเนินงาน/ค่าบริหารจัดการ", style: "margindetail" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_34550), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "เงินฌาปณกิจ", style: "margindetail" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_34560), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "จัดสรรอื่น", style: "margindetail" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_34570), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "กำไร (ขาดทุน) สะสม", style: "marginheader" },
    { text: "", style: "" },
    { text: Utils.formatNumber(data.acc_33000), style: "", alignment: "right" },
  ]);
  body.push([
    { text: "กำไร (ขาดทุน) ", style: "marginheader" },
    { text: "", style: "" },
    {
      text: Utils.formatNumber(data.acc_40000),
      style: "textdecorationbeforeValue",
      alignment: "right",
    },
  ]);
  body.push([
    { text: "", style: "" },
    { text: "รวมทุน", style: "header", alignment: "center" },
    {
      text: Utils.formatNumber(data.totalownersequityamount),
      style: "textdecorationValueAmount",
      bold: true,
      alignment: "right",
    },
  ]);
  body.push([
    { text: "", style: "" },
    {
      text: "\n\n" + "รวมหนี้สินและทุน",
      style: "header",
      alignment: "center",
      marginLeft: 75,
    },
    {
      text:
        "\n\n" + Utils.formatNumber(data.totalliabilityandownersequityamount),
      alignment: "right",
      style: "textdecorationValueAmount",
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
