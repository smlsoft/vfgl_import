<template>
  <AppLayout>
    <MainContentWarp>
      <div class="p-2 surface-section flex-auto">
        <div class="grid p-fluid">
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
          <div
            class="field-checkbox mb-1 col-xs-7 col-sm-7 col-lg-8 md:col-2 p-button-outlined"
          ></div>
          <div class="field-checkbox mb-12 col-12 md:col-4">
            <Button
              class="field mb-12 col-xs-7 col-sm-7 col-lg-8 md:col-4 p-button-primary"
              label="จัดทำรายงาน"
              icon="pi pi-book "
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
          <div class="col-12" v-if="isvisible" ref="targetRef">
            <iframe
              class="w-full"
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
import { ref, onMounted, toRefs } from "vue";
import pdfMake from "pdfmake/build/pdfmake";
import { useApp } from "@/stores/app.js";
import Utils from "@/utils/";
import DatePicker from "@/components/widget/DatePicker.vue";
import utils from "../../utils";

const storeApp = useApp();
const currentTime = ref("");
const isvisible = ref(false);
const buddhistYear = ref(process.env.VUE_APP_DATE == "th");
const startDate = ref(null);
const count = ref(0);
const endDate = ref(null);
const accountGroup = ref("");
const targetRef = ref(null);
const groups = ref([]);
const data_list = ref([]);
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
  getAccountGroupList();
  getDate();
  storeApp.setPageTitle("งบกำไรขาดทุน");
  storeApp.setActivePage("รายงาน");
  storeApp.setActiveChild("รายงาน");
});

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
function scrollBottom() {
  bottom.value = document.body.scrollHeight;

  window.scrollTo({
    top: bottom.value,
    behavior: "smooth",
  });
}
function getAccountGroupList() {
  MasterdataService.getAccountGroup()
    .then((res) => {
      //console.log(res);
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
  var startdate = "";
  var enddate = "";
  body = await buildFromJson();
  startdate = Utils.getYearBuddhist(startDate.value);
  enddate = Utils.getYearBuddhist(endDate.value);

  var docDefinition = pageSetup(body, startdate, enddate);

  const pdfDocGenerator = pdfMake.createPdf(docDefinition);

  pdfDocGenerator.getDataUrl((dataUrl) => {
    const targetElement = document.querySelector("#iframeContainer");

    targetElement.src = dataUrl;
  });
}
function selectAccount(event) {
  console.log(event);
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
function getDate() {
  var date = new Date();
  startDate.value = new Date(date.getFullYear(), date.getMonth(), 1);
  endDate.value = new Date(date.getFullYear(), date.getMonth() + 1, 0);
}

function pageSetup(data, startdate, enddate) {
  updateTime();
  var docDefinition = {
    info: {
      title: "รายงาน งบกำไรขาดทุน " + currentDate(),
      author: "john doe",
      subject: "subject of document",
      keywords: "keywords for document",
    },
    pageMargins: [40, 140, 40, 40],
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
        text: " งบกำไรขาดทุน  ",
        fontSize: 13,
        // marginLeft: 190,
        // marginBottom: 2,
        style: "header",
        alignment: "center",
      },
      {
        text: "สำหรับปี สิ้นสุด  ณ วันที่  \t" + Utils.getDateShowText(enddate),

        style: "header",
        alignment: "center",
        // marginLeft: 150,

        layout: "lightHorizontalLines",
      },
      {
        text: "สำหรับกิจกรรมกองทุน",
        style: "header",
        alignment: "center",
        marginLeft: 15,

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
          widths: ["45%", "25%", "30%"],
          body: [
            [
              { text: "", style: "" },
              // {
              //   text: "หน่วย:บาท",
              //   bold: true,
              //   alignment: "right",
              // },
              { text: "" },
            ],
          ],
        },
        layout: "noBorders",
      },
      {
        style: "tableExample",
        table: {
          widths: ["45%", "35%", "20%"],
          body: data,
        },
        layout: "noBorders",
      },
      {
        alignment: "left",
        style: "",
        margin: [5, 2, 10, 20], // Adjust the margins for the text spacing
        text:
          "\nขอรับรองว่าตรวจสอบบัญชีงบดุล" +
          "/งบการเงินประจำปี พ.ศ. " +
          Utils.getDateShowText2(enddate) +
          " ของ  " +
          localStorage.shop_name +
          checknull("\t" + checknull(localStorage.address) + "\t") +
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
          // headers are automatically repeated if the table spans over multiple pages
          // you can declare how many rows should be treated as headers
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
            // [
            //   "",
            //   "▢  ผู้ตรวจสอบบัญชีอื่นๆ",
            //   "▢ กรรมการกองทุนหมู่บ้าน",
            //   "▢  อื่นๆ............................",
            //   "",
            // ],
            // ["Value 1", "Value 2", "Value 3"],
            // [{ text: "Bold value", bold: true }, "Val 2", "Val 3", "Val 4"],
          ],
        },
      },
    ],
    pageSize: "A4",
    pageOrientation: "portrait",
    // pageMargins: [40, 8, 40, 8],
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
      },
      textdecorationbeforeValue: {
        // alignment: "right",

        decoration: "underline",
      },
      textdecorationValue: {
        italics: true,
        bold: true,
        // alignment: "right",
        decoration: "underline",
        decorationStyle: "double",
      },
      textdecorationValueAmount: {
        fontSize: 14,
        italics: true,
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
      textdecoration: {
        italics: true,
        alignment: "right",
        decoration: "underline",
        decorationStyle: "double",
      },
      margindetail: {
        margin: [20, 0, 0, 0],
      },
      margintotal: {
        margin: [60, 0, 0, 0],
      },
    },
  };
  return docDefinition;
}

async function buildFromJson() {
  let body = [];
  let listProfitandloss = {};
  let totalIncomeAmount = "0.00";
  let totalExpenseAmount = "0.00";
  let percentNumber = "0.00";
  let profitAndLossAmount = "";
  let timezone = "%2B07";
  let accountgroup = accountGroup.value;
  let startdate = Utils.getDateFromYear(startDate.value);
  let enddate = Utils.getDateFromYear(endDate.value);
  console.log("ica", ica.value);

  let icax = "0";
  if (ica.value) {
    icax = "1";
  }
  try {
    const res = await ReportService.getProfitandlossGroup(
      accountgroup,
      startdate,
      enddate,
      icax,
      (timezone = "%2B07")
    );
    if (res.success) {
      console.log(res.data);
      listProfitandloss = res.data;
      totalIncomeAmount = res.data.totalincomeamount;
      totalExpenseAmount = res.data.totalexpenseamount;
      profitAndLossAmount = res.data.profitandlossamount;
      scrollBottom();
    }
  } catch (err) {
    console.log(err);
  }

  // รายได้
  body.push([
    { text: "รายได้:", style: ["textdecorationbeforeValue", "header"] },
    { text: "", style: "" },
    { text: "", style: "header", alignment: "right" },
    // { text: "%", style: "header", alignment: "right" },
  ]);
  body.push([
    { text: "รายได้ดอกเบี้ยจากการกู้ยืม", style: "margindetail" },
    {},
    {
      text: utils.formatNumber(listProfitandloss.acc_41000),
      alignment: "right",
    },
  ]);
  body.push([
    { text: "รายได้จากค่าปรับเงินให้กู้ยืม", style: "margindetail" },
    {},
    {
      text: utils.formatNumber(listProfitandloss.acc_42000),
      alignment: "right",
    },
  ]);
  body.push([
    { text: "รายได้ค่าธรรมเนียม", style: "margindetail" },
    {},
    {
      text: utils.formatNumber(listProfitandloss.acc_43000),
      alignment: "right",
    },
  ]);
  body.push([
    { text: "รายได้จากการขายและให้บริการ", style: "margindetail" },
    {},
    {
      text: utils.formatNumber(listProfitandloss.acc_44000),
      alignment: "right",
    },
  ]);
  body.push([
    { text: "รายได้ดอกเบี้ยธนาคารและผลประโยชน์อื่น", style: "margindetail" },
    {},
    {
      text: utils.formatNumber(listProfitandloss.acc_45000),
      alignment: "right",
    },
  ]);
  body.push([
    { text: "รายได้อื่น", style: "margindetail" },
    {},
    {
      text: utils.formatNumber(listProfitandloss.acc_46000),
      alignment: "right",
      style: "textdecorationbeforeValue",
    },
  ]);

  // if (listProfitandloss.value.incomes != null) {
  //   for (let detailIncome of listProfitandloss.value.incomes) {
  //     body.push([
  //       {
  //         text: detailIncome.accountname,
  //         style: "margindetail",
  //         alignment: "left",
  //       },
  //       { text: "", style: "" },
  //       {
  //         text: Utils.formatNumber(detailIncome.amount),
  //         style: "margindetail",
  //         alignment: "right",
  //       },
  //       // {
  //       //   text: Utils.formatNumber(
  //       //     (detailIncome.amount / totalIncomeAmount) * 100
  //       //   ),
  //       //   alignment: "right",
  //       // },
  //     ]);
  //   }
  // }
  body.push([
    {
      text: "",
      style: ["header", "textdecoration"],
    },
    {
      text: "รวมรายได้ ",
      alignment: "left",
      style: ["header", ""],
    },
    {
      text: utils.formatNumber(listProfitandloss.totalincomeamount),
      //  Utils.formatNumber(totalIncomeAmount),
      alignment: "right",
      style: ["header", "textdecoration"],
    },

    // {
    //   text: Utils.formatNumber((totalIncomeAmount / totalIncomeAmount) * 100),
    //   alignment: "right",
    //   style: ["header", "textdecoration"],
    //   bold: true,
    // },
  ]);
  body.push([
    { text: "ค่าใช้จ่าย:", style: ["textdecorationbeforeValue", "header"] },
    { text: "", style: "" },
    { text: "", style: "header", alignment: "right" },
    // { text: "%", style: "header", alignment: "right" },
  ]);
  body.push([
    { text: "ดอกเบี้ยจ่าย", style: "margindetail" },
    {},
    {
      text: utils.formatNumber(listProfitandloss.acc_50000),
      alignment: "right",
    },
  ]);
  body.push([
    { text: "ต้นทุนสินค้า", style: "margindetail" },
    {},
    {
      text: utils.formatNumber(listProfitandloss.acc_52000),
      alignment: "right",
    },
  ]);
  body.push([
    { text: "ค่าใช้จ่ายในการบริหาร", style: "margindetail" },
    {},
    {
      text: utils.formatNumber(listProfitandloss.acc_53000),
      alignment: "right",
    },
  ]);
  body.push([
    { text: "ค่าใช้จ่ายในการดำเนินการ", style: "margindetail" },
    {},
    {
      text: utils.formatNumber(listProfitandloss.acc_54000),
      alignment: "right",
    },
  ]);
  body.push([
    { text: "รายจ่ายดอกเบี้ย /ค่าธรรมเนียม/ภาษี", style: "margindetail" },
    {},
    {
      text: utils.formatNumber(listProfitandloss.acc_55000),
      alignment: "right",
    },
  ]);
  body.push([
    { text: "ค่าใช้จ่ายสวัสดิการ", style: "margindetail" },
    {},
    {
      text: utils.formatNumber(listProfitandloss.acc_56000),
      alignment: "right",
    },
  ]);
  body.push([
    { text: "ค่าเสื่อมราคา", style: "margindetail" },
    {},
    {
      text: utils.formatNumber(listProfitandloss.acc_57000),
      alignment: "right",
    },
  ]);
  body.push([
    { text: "ค่าใช้จ่ายอื่น", style: "margindetail" },
    {},
    {
      text: utils.formatNumber(listProfitandloss.acc_58000),
      alignment: "right",
      style: "textdecorationbeforeValue",
    },
  ]);
  // ค่าใช้จ่าย
  // body.push([{ text: "ค่าใช้จ่าย:", style: "header" }, {}, {}]);
  // if (listProfitandloss.value.expenses != null) {
  //   for (let detailExpenses of listProfitandloss.value.expenses) {
  //     body.push([
  //       { text: detailExpenses.accountname, style: "margindetail" },
  //       { text: "", style: "" },
  //       {
  //         text: Utils.formatNumber(detailExpenses.amount),
  //         style: "margindetail",
  //         alignment: "right",
  //       },
  //       // {
  //       //   text: Utils.formatNumber(
  //       //     (profitAndLossAmount / profitAndLossAmount) * 100
  //       //   ),
  //       //   alignment: "right",
  //       // },
  //     ]);
  //   }
  // }
  body.push(
    [
      {
        text: "",
        alignment: "right",
        style: ["header", "textdecoration"],
      },
      {
        text: "รวมค่าใข้จ่าย",
        alignment: "left",
        style: ["header", ""],
      },
      {
        text: utils.formatNumber(listProfitandloss.totalexpenseamount),
        //  Utils.formatNumber(totalExpenseAmount),
        alignment: "right",
        style: ["header", "textdecoration"],
      },
      // {
      //   text: Utils.formatNumber(
      //     (totalExpenseAmount / profitAndLossAmount) * 100
      //   ),
      //   alignment: "right",
      //   style: ["header", "textdecoration"],
      //   bold: true,
      // },
    ],
    [
      {
        text: "",
        alignment: "right",
        style: ["header", "textdecoration"],
      },
      {
        text: "\n กำไร (ขาดทุน) สุทธิ",
        style: "header",
        margin: [0, 0, 0, 0],
        alignment: "left",
      },
      {
        text: "\n" + utils.formatNumber(listProfitandloss.profitandlossamount),
        //  Utils.formatNumber(profitAndLossAmount),
        alignment: "right",
        style: ["header", "textdecoration"],
      },
      // {
      //   text: Utils.formatNumber(
      //     (profitAndLossAmount / profitAndLossAmount) * 100
      //   ),
      //   alignment: "right",
      //   style: ["header", "textdecoration"],
      //   bold: true,
      // },
    ]
  );

  return body;
}
function checknull(data) {
  if (data == null || data == "" || data == "undefined") {
    // data = " -";
    return (data = "");
  } else {
    return (data = data);
  }
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
