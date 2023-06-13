<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import { ref, onMounted, computed } from "vue";
import { useApp } from "@/stores/app.js";

const storeApp = useApp();
const data_list = ref([]);
const yearOptions = ref([]);
const selectedYear = ref(null);
const getDataPeriod = ref("04/2023");

onMounted(() => {
  storeApp.setPageTitle("กำหนดงวดบัญชี");
  storeApp.setActivePage("account_period");

  // Generate and add periods from 1 to 12
  for (let i = 1; i <= 12; i++) {
    data_list.value.push({
      period: i,
      year: "",
      account_period: "",
      status: null,
      isclose: true,
    });
  }
  // Generate and add year from getFullYear to 10 years
  for (let i = 0; i <= 10; i++) {
    var year = new Date().getFullYear() + i;
    yearOptions.value.push({ year });
  }

  selectedYear.value = yearOptions.value[0];

  data_list.value.forEach((item) => {
    const month = item.period.toString().padStart(2, "0");
    const year = selectedYear.value.year;
    item.year = year;
    item.account_period = `${month}/${year}`;
  });

  setStatusButton();
});

function onYearChange(event) {
  onYearChange.value = event.value;
  data_list.value.forEach((item) => {
    const month = item.period.toString().padStart(2, "0");
    const year = selectedYear.value.year;
    item.year = year;
    item.account_period = `${month}/${year}`;
  });
  setStatusButton();
}

function setStatusButton() {
  const [getMonth, getYear] = getDataPeriod.value.split("/");
  const getDate = new Date(parseInt(getYear), parseInt(getMonth) - 1);
  let nextIndex = null;

  data_list.value.forEach((item, index) => {
    const [dataMonth, dataYear] = item.account_period.split("/");
    const dataDate = new Date(parseInt(dataYear), parseInt(dataMonth) - 1);
    if (dataDate < getDate) {
      item.status = 1; // account_period < getDataPeriod
    } else if (dataDate > getDate) {
      item.status = 2; // account_period > getDataPeriod
      if (parseInt(getMonth) == 12 && (parseInt(getYear) + 1) == dataYear) {
        data_list.value[0].status = 0;
        data_list.value[0].isclose = false;
      }
    } else {
      item.status = 0; // account_period = getDataPeriod
      nextIndex = index + 1;
    }
  });

  if (nextIndex !== null && nextIndex < data_list.value.length) {
    data_list.value[nextIndex].status = 0;
    data_list.value[nextIndex].isclose = false;
    if (parseInt(getMonth) == 1) {
      data_list.value[0].status = 0;
      data_list.value[0].isclose = true;
    }
  }

  console.log(data_list.value);
}

function closePeriod(data) {
  data_list.value[data].isclose = !data_list.value[data].isclose;
}
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div class="grid">
        <div class="col-12 lg:col-10 p-4">
          <div class="grid formgrid p-fluid">
            <div class="field col-12 md:col-4">
              <label for="getDataPeriod" class="font-medium text-900"
                >getData Account Period</label
              >
              <InputText
                id="getDataPeriod"
                type="text"
                v-model="getDataPeriod"
                @change="setStatusButton()"
              />
            </div>
            <div class="field col-12 md:col-4">
              <label for="selectedYear" class="font-medium text-900"
                >ปีบัญชี</label
              >
              <Dropdown
                id="selectedYear"
                v-model="selectedYear"
                :options="yearOptions"
                optionLabel="year"
                @change="onYearChange($event)"
              />
            </div>
          </div>
        </div>
        <div class="col-12">
          <DataTable
            :value="data_list"
            responsiveLayout="scroll"
            showGridlines
            stripedRows
          >
            <Column field="period" header="งวดบัญชี"> </Column>
            <Column field="year" header="ปีบัญชี"> </Column>
            <!-- <Column field="account_period" header="account_period"> </Column> -->
            <Column bodyStyle="text-align:center" style="width: 20%">
              <template #body="slotProps">
                <Button
                  v-if="slotProps.data.status === 0"
                  :label="
                    slotProps.data.isclose ? 'ปิดงวดบัญชี' : 'เปิดงวดบัญชี'
                  "
                  :class="
                    slotProps.data.isclose
                      ? 'p-button-warning'
                      : 'p-button-success'
                  "
                  @click="closePeriod(slotProps.index)"
                />

                <Button
                  v-if="slotProps.data.status === 1"
                  label="ปิดงวดบัญชี"
                  class="p-button-button p-button-secondary"
                  :disabled="true"
                />
              </template>
            </Column>

            <template #empty> ไม่พบข้อมูล </template>
            <template #loading> กำลังประมวลผล กรุณารอซักครู่..</template>
          </DataTable>
        </div>
      </div>
    </MainContentWarp>
  </AppLayout>
</template>
