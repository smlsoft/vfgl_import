<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import UsersDataService from "@/services/UsersDataService";
import { ref, onMounted, computed } from "vue";
import { useApp } from "@/stores/app.js";

const storeApp = useApp();
const data_list = ref([]);
const sortField = ref("");
const sortOrder = ref(1);
const totalItemsCount = ref(0);
const limitPage = ref(20);
const filters = ref(null);
const loading = ref(true);
const activePage = ref(1);

onMounted(() => {
  // getUserShop();
  storeApp.setPageTitle("All USER");
  storeApp.setActivePage("user_all_list");
});

function getUserShop() {
  loading.value = true;
  UsersDataService.getUserShop(
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
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div class="grid">
        <div class="col-12">
          <DataTable
            :value="data_list"
            editMode="row"
            dataKey="id"
            responsiveLayout="scroll"
            showGridlines
            stripedRows
          >
            <Column field="user" header="user" style="width: 20%">
            </Column>

            <template #empty> ไม่พบข้อมูล </template>
            <template #loading> กำลังประมวลผล กรุณารอซักครู่..</template>
          </DataTable>
        </div>
      </div>
    </MainContentWarp>
  </AppLayout>
</template>
