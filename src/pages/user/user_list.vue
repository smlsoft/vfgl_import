<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import UsersDataService from "@/services/UsersDataService";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useApp } from "@/stores/app.js";
import DialogForm from "@/components/form/DialogForm.vue";
import Form from "./components/form.vue";

const storeApp = useApp();
const toast = useToast();
const detail = ref();
const textContent = ref("ต้องการลบผู้ใช้งาน");
const textContent2 = ref("");
const data_list = ref([]);
const deleteDetailDialog = ref(false);
const sortField = ref("accountcode");
const sortOrder = ref(1);
const totalItemsCount = ref(0);
const limitPage = ref(20);
const filters = ref(null);
const loading = ref(true);
const activePage = ref(1);
const displayModal = ref(false);
const openModal = () => {
  displayModal.value = true;
};
const userName = localStorage._usercode;

const roles = ref([
  { name: "USER", code: 0 },
  { name: "ADMIN", code: 1 },
  { name: "OWNER", code: 2 },
]);

const editingRows = ref([]);

const form_model = ref({
  shopid: localStorage.shopid,
  username: "",
  role: 0,
});
const form_valid = ref({
  username: true,
});

const getStatusLabel = (status) => {
  switch (status) {
    case 0:
      return "USER";

    case 1:
      return "ADMIN";

    case 2:
      return "OWNER";

    default:
      return "NA";
  }
};

onMounted(() => {
  getUserShop();
  console.log(userName);
  storeApp.setPageTitle("กำหนดผู้ใช้งาน");
  storeApp.setActivePage("user_list");
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

async function onRowEditSave(event) {
  if (event.data.username === userName) {
    toast.add({
      severity: "warn",
      summary: "แจ้งเตือน",
      detail: "ไม่สามารถแก้ไขข้อมูลผู้ใช้งานนี้ได้",
      life: 3000,
    });
  } else {
    let { newData, index } = event;
    data_list.value[index] = newData;
    try {
      const res = await UsersDataService.postUserShop(newData);
      console.log(res);
      if (res.success) {
        getUserShop();
        toast.add({
          severity: "success",
          summary: "success",
          detail: "บันทึกข้อมูลสำเร็จ",
          life: 3000,
        });
      }
    } catch (err) {
      console.log(err.response.data.message);
      toast.add({
        severity: "error",
        summary: "error",
        detail: "บันทึกไม่สำเร็จ " + err.response.data.message,
        life: 3000,
      });
    }
  }
}

function confirmDeleteDetail(data) {
  console.log(data);
  detail.value = data;
  console.log(detail.value.username);
  textContent2.value = detail.value.username;
  deleteDetailDialog.value = true;
}

function deleteDetail() {
  UsersDataService.deleteUserShop(detail.value.username)
    .then((res) => {
      console.log(res);
      if (res.success) {
        getUserShop(activePage.value);
        toast.add({
          severity: "success",
          summary: "Successful",
          detail: "Deleted",
          life: 3000,
        });
        deleteDetailDialog.value = false;
      }
    })
    .catch((err) => {
      deleteDetailDialog.value = false;
      console.log(err);
      toast.add({
        severity: "error",
        summary: "Error",
        detail: "ไม่สามารถลบได้ : " + err.response.data.message,
        life: 5000,
      });
    });
}

async function onSave(data) {
  console.log(data);
  try {
    const res = await UsersDataService.postUserShop(data);
    console.log(res);
    if (res.success) {
      getUserShop();

      toast.add({
        severity: "success",
        summary: "success",
        detail: "บันทึกข้อมูลสำเร็จ",
        life: 3000,
      });
    }
  } catch (err) {
    console.log(err.response.data.message);
    toast.add({
      severity: "error",
      summary: "error",
      detail: "บันทึกไม่สำเร็จ " + err.response.data.message,
      life: 3000,
    });
  }
}
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <!-- <div class="grid mt-2">
        <div class="p-2 surface-section flex-auto">
          <div class="field mb-12 col-12 md:col-12">
            <div class="pi pi-book" style="font-size: 2rem"></div>
            <i class="iHeader" style="font-size: 2rem"> กำหนดผู้ใช้งาน</i>
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
      <div class="grid">
        <div class="col-12">
          <Button
            label="เพิ่มผู้ใช้งาน "
            icon="pi pi-user"
            @click="openModal"
            class="m-2 p-button-primary"
          />
          <DataTable
            :value="data_list"
            editMode="row"
            dataKey="id"
            v-model:editingRows="editingRows"
            @row-edit-save="onRowEditSave($event)"
            responsiveLayout="scroll"
            showGridlines
            stripedRows
            selectionMode="single"
          >
            <!-- <Column field="id" header="Code" style="width: 20%"> </Column> -->
            <Column field="username" header="Username" style="width: 20%">
            </Column>
            <Column field="role" header="Status" style="width: 50%">
              <template #editor="{ data, field }">
                <Dropdown
                  v-model="data[field]"
                  :options="roles"
                  optionLabel="name"
                  optionValue="code"
                  placeholder="Select a Status"
                >
                  <template #option="slotProps">
                    <span
                      :class="'product-badge status-' + slotProps.option.code"
                      >{{ slotProps.option.name }}</span
                    >
                  </template>
                </Dropdown>
              </template>
              <template #body="slotProps">
                {{ getStatusLabel(slotProps.data.role) }}
              </template>
            </Column>
            <Column
              :rowEditor="true"
              style="width: 5%; min-width: 8rem"
              bodyStyle="text-align:center"
            >
            </Column>
            <Column
              bodyStyle="text-align:center"
              style="width: 5%; min-width: 8rem"
            >
              <template #body="slotProps">
                <div class="flex gap-1">
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

            <template #empty> ไม่พบข้อมูล </template>
            <template #loading> กำลังประมวลผล กรุณารอซักครู่..</template>
          </DataTable>
        </div>
      </div>
      <DialogForm
        :confirmDialog="deleteDetailDialog"
        :textContent="textContent"
        :textContent2="textContent2"
        v-on:close="deleteDetailDialog = false"
        v-on:confirm="deleteDetail"
      ></DialogForm>

      <Dialog
        header="Header"
        v-model:visible="displayModal"
        :breakpoints="{ '960px': '75vw', '640px': '90vw' }"
        :style="{ width: '50vw' }"
        :modal="true"
      >
        <Form
          :form_model="form_model"
          :form_valid="form_valid"
          v-on:save="onSave"
        />
        <!-- <template #footer>
          <Button
            label="No"
            icon="pi pi-times"
            @click="closeModal"
            class="p-button-text"
          />
          <Button
            label="Yes"
            icon="pi pi-check"
            @click="closeModal"
            autofocus
          />
        </template> -->
      </Dialog>
    </MainContentWarp>
  </AppLayout>
</template>
