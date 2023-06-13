<script setup>
import { ref, onMounted, computed, watch } from "vue";
import XLSX from "xlsx";
import Utils from "@/utils/";
import DatePicker from "@/components/widget/DatePicker.vue";

const myFiles = ref();
const deleteDetailDialog = ref(false);
const update_mode = ref(false);
const detail = ref();
const buddhistYear = ref(process.env.VUE_APP_DATE == "th");

const sumTableDebit = computed({
  get() {
    var sum = 0;
    props.daily_form.journaldetail.forEach((ele) => {
      if (ele.debitamount == null) {
        ele.debitamount = 0;
      }
      sum += parseFloat(ele.debitamount);
    });
    return sum.toFixed(2);
  },
});
const sumTableCredit = computed({
  get() {
    var sum = 0;
    props.daily_form.journaldetail.forEach((ele) => {
      if (ele.creditamount == null) {
        ele.creditamount = 0;
      }
      sum += parseFloat(ele.creditamount);
    });
    return sum.toFixed(2);
  },
});

const props = defineProps({
  daily_form: Object,
  daily_form_valid: Object,
  isUpdate: Boolean,
  accountChart_detail: Array,
  accountBook_detail: Array,
  groupAccount_detail: Array,
  id: String,
});

const emit = defineEmits([
  "ImportDaliy",
  "deleteDetail",
  "addColumn",
  "onRowReorder",
  "selectAccount",
]);

onMounted(async () => {});

function selectAccount(data, index) {
  emit("selectAccount", data, index);
}

function onRowReorder(event) {
  emit("onRowReorder", event.value);
}

function addColumn(index) {
  emit("addColumn", index);
}

function deleteDetail() {
  console.log(detail.value.index);
  emit("deleteDetail", detail.value.index);
  deleteDetailDialog.value = false;
}

function confirmDeleteDetail(data, index) {
  console.log(index);
  detail.value = data;
  detail.value.index = index;
  console.log(detail);
  deleteDetailDialog.value = true;
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
    console.log(worksheet);
    var col_1 = worksheet.A1.w;
    var col_2 = worksheet.B1.w;
    var col_3 = worksheet.C1.w;
    var col_4 = worksheet.D1.w;
    // console.log(results);
    var details = [];
    // for (let index = 0; index < results.length; index++) {
    //   console.log(results[index]);
    //   var val_1 = "";
    //   var val_2 = "";
    //   var val_3 = "";
    //   var val_4 = "";
    //   var i = 0;
    //   JSON.parse(JSON.stringify(results[index]), (key, value) => {
    //     if (key === col_1) {
    //       //console.log(key + " : " + value);
    //       val_1 = value;
    //     }
    //     if (key === col_2) {
    //       //console.log(key + " : " + value);
    //       val_2 = value;
    //     }
    //     if (key === col_3) {
    //       //console.log(key + " : " + value);
    //       val_3 = value;
    //     }
    //     if (key === col_4) {
    //       //console.log(key + " : " + value);
    //       val_4 = value;
    //     }
    //     //console.log(i);
    //     i++;
    //   });

    //   details.push({
    //     index: index,
    //     accountcode: val_1,
    //     accountname: val_2,
    //     debitamount: val_3 == "" ? 0 : val_3,
    //     creditamount: val_4 == "" ? 0 : val_4,
    //   });
    // }
    // emit("ImportDaliy", details);
  };
  reader.onerror = function (e) {
    console.log(e);
  };
}

function onCellEditComplete(event) {
  let { data, newValue, field } = event;
  data[field] = newValue;
}
</script>

<template>
  <div>
    <DataTable
      :value="props.daily_form"
      editMode="cell"
      @cell-edit-complete="onCellEditComplete"
      :reorderableColumns="true"
      @rowReorder="onRowReorder"
      class="editable-cells-table"
      responsiveLayout="scroll"
    >
      <Column field="shopid" header="villageprojectno"></Column>
      <Column field="docdate" header="date"> </Column>
      <Column field="accountgroup" header="accountgroups_code"> </Column>
      <Column field="bookcode" header="journalbooks_code"> </Column>
      <Column field="accountperiod" header="account_period"> </Column>
      <Column field="accountyear" header="account_year"> </Column>
      <Column field="accountdescription" header="description"> </Column>
      <Column field="debitamount" header="debit">
        <template #body="{ data, field }">
          {{ Utils.formatCurrency(data[field]) }}
        </template>
      </Column>
      <Column field="creditamount" header="credit">
        <template #body="{ data, field }">
          {{ Utils.formatCurrency(data[field]) }}
        </template>
      </Column>
    </DataTable>
  </div>
 
</template>
