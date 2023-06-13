<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import UsersDataService from "@/services/UsersDataService";
import AuthenService from "@/services/AuthenService";
import { useRoute } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { useToast } from "primevue/usetoast";
import { useApp } from "@/stores/app.js";
import DialogForm from "@/components/form/DialogForm.vue";
const storeApp = useApp();
const router = useRoute();
const toast = useToast();
const detail = ref();
const textContent = ref("ต้องการบันทึกข้อมูลกองทุน");
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
const typingTimer = ref(null);
const doneTypingInterval = ref(1000);
const firstPage = ref(0);
const showShopList = ref();
const listShop = ref();
const shopid = ref();
const shop_name = ref();
const branchcode = ref();
const telephone = ref();
const address = ref();
const role = ref();
const confirmDialog = ref(false);
const route = useRoute();
const roles = ref([
  { name: "USER", code: 0 },
  { name: "ADMIN", code: 1 },
  { name: "OWNER", code: 2 },
]);
const form_model = ref({
  shopid: "",
  shop_name: "",
  branchcode: "",
  address: "",
  telephone: "",
  role: "",
});

onMounted(() => {
  getDetail();
  //   getUserShop();

  //   selectShop;
  //   getListShop();
  storeApp.setPageTitle("กำหนดข้อมูลกองทุน");
  storeApp.setActivePage("shoplist");
});
async function getDetail() {
  shopid.value = localStorage.shopid;
  shop_name.value = localStorage.shopname;
  branchcode.value = localStorage.branchcode;
  role.value = localStorage.role;
  try {
    const res = await AuthenService.getListShop(
      (shopid.value = localStorage.shopid),
      (shop_name.value = localStorage.shop_name),
      (branchcode.value = localStorage.branchcode),
      (role.value = localStorage.role),
      (address.value = localStorage.address),
      (telephone.value = localStorage.telephone)
    );
    if (res.success) {
      //console.log(res);
      if (res.success) {
        console.log(res);
        console.log(shopid.value);
        console.log(shop_name.value);
        console.log(branchcode.value);
        console.log(role.value);
        form_model.value.shopid = shopid.value ?? "";
        form_model.value.shop_name = shop_name.value ?? "";
        form_model.value.branchcode = branchcode.value ?? "";
        form_model.value.address = address.value ?? "";
        form_model.value.telephone = telephone.value ?? "";
        form_model.value.role = role.value ?? "";
      }
      //console.log(form_model.value);
    }
  } catch (err) {
    console.log(err);
  }
}
function confirm() {
  confirmDialog.value = true;
}
function close() {
  confirmDialog.value = false;
}

function newResultRole(data) {
  var result = [];
  result = roles.value.filter((val) => val.code == data);
  return result.length > 0 ? result[0].name : "ไม่พบข้อมูล";
}

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

function sortBy(data) {
  //console.log(data);
  sortField.value = data.sortField;
  sortOrder.value = data.sortOrder;

  loading.value = true;
  UsersDataService.getUserShop(
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
  router.push({ name: "user_create" });
}
function goEdit(data) {
  router.push({ name: "user_edit", params: { id: data.id } });
}

function confirmDeleteDetail(data) {
  console.log(data);
  detail.value = data;
  console.log(detail.value.username);
  textContent2.value = detail.value.username;
  deleteDetailDialog.value = true;
}

function keyup() {
  clearTimeout(typingTimer.value);
  typingTimer.value = setTimeout(doneTyping, doneTypingInterval.value);
}
function keydown() {
  clearTimeout(typingTimer.value);
}
function getListShop() {
  AuthenService.getListShop()
    .then((res) => {
      //console.log(res);
      if (res.success) {
        showShopList.value = true;
        listShop.value = res.data;
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

function selectShop(item) {
  localStorage.shopid = item.shopid;
  localStorage.branchcode = item.branchcode;
  localStorage.shop_name = item.name;
  localStorage.shop_role = item.role;
  AuthenService.getListShop().then((res) => {
    if (res.success) {
      // this.showSnackBar("เข้าสู่ระบบสำเร็จ", "success");
      //   setTimeout(async () => {
      //     router.push({ name: "dashboard" });
      //   }, 1000);
      console.log(localStorage.shopid);
      console.log(localStorage.branchcode);
      console.log(localStorage.name);
      console.log(localStorage.role);
    } else {
      // this.showSnackBar(
      //   " ไม่สามารถเชื่อมต่อได้ เนื่องจากฐานข้อมูลมีปัญหา",
      //   "error"
      // );
    }
  });
}
function doneTyping() {
  activePage.value = 1;
  firstPage.value = 0;
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

function onSave() {



  let shop = {
    name1: form_model.value.shop_name,
    branchcode: form_model.value.branchcode,
    address: form_model.value.address,
    telephone: form_model.value.telephone,
  }

  AuthenService.updateShop( localStorage.shopid, shop)
    .then((res) => {
      console.log(res);
      if (res.success) {
        
        localStorage.shop_name = form_model.value.shop_name;
  localStorage.branchcode = form_model.value.branchcode;
  localStorage.address = form_model.value.address;
  localStorage.telephone = form_model.value.telephone;


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
        detail: "ไม่สามารถบัันทึกได้ : " + err.response.data.message,
        life: 5000,
      });
    });

  confirmDialog.value = false;
}

function onPage(event) {
  activePage.value = event.page + 1;
  limitPage.value = event.rows;
  loading.value = true;

  UsersDataService.getUserShop(
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
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <!-- <div class="p-2 surface-section">
        <div class="field mb-12 col-12 md:col-12">
          <div class="pi pi-book" style="font-size: 2rem"></div>
          <i class="iHeader" style="font-size: 2rem"> กำหนดข้อมูลกองทุน</i>
          <Image
            src="/images/manual/photoanddoc/vf5.png"
            alt="test"
            align="right"
            width="800"
            class="align-items-center"
          />
        </div>
      </div> -->
      <div class="surface-card p-4 shadow-2 border-round p-fluid">
        <div class="grid formgrid p-fluid">
          <div class="field mb-6 col-6 md:col-6"></div>

          <div class="field mb-12 col-12 md:col-12">
            <div class="grid formgrid p-fluid">
              <div class="field mb-6 col-6 md:col-6">
                <label for="shopid" class="font-medium">id : </label>
                <InputText
                  id="shopid"
                  type="text"
                  disabled
                  v-model="form_model.shopid"
                />
              </div>
              <div class="field mb-6 col-6 md:col-6">
                <label for="shop_name" class="font-meshop_nameium"
                  >ชื่อ :</label
                >
                <InputText
                  id="shop_name"
                  type="text"
                  v-model="form_model.shop_name"
                />
              </div>
              <div class="field mb-6 col-6 md:col-6">
                <label for="branchcode" class="font-medium"
                  >รหัสกองทุนหมู่บ้านหรือชุมชนเมือง :</label
                >
                <InputText
                  id="branchcode"
                  type="text"
                  v-model="form_model.branchcode"
                />
              </div>
              <div class="field mb-6 col-6 md:col-6">
                <label for="address" class="font-medium">ที่อยู่ : </label>
                <InputText
                  id="address"
                  type="text"
                  v-model="form_model.address"
                />
              </div>
              <div class="field mb-6 col-6 md:col-6">
                <label for="telephone" class="font-medium">เบอร์โทร : </label>
                <InputText
                  id="telephone"
                  type="text"
                  v-model="form_model.telephone"
                />
              </div>
            </div>
          </div>
        </div>
        <div class="mt-2">
          <Button
            @click="confirm"
            label="บันทึกข้อมูลร้านค้า"
            icon="pi pi-save"
            class="w-auto p-button-succes"
          ></Button>
        </div>
      </div>
      <DialogForm
        :confirmDialog="confirmDialog"
        :textContent="textContent"
        v-on:close="close"
        v-on:confirm="onSave"
      ></DialogForm>
      <!-- <div class="grid mt-2">
        <div class="col-12">
          <DataTable
            :value="listShop"
            dataKey="guidfixed"
            class="p-datatable-sm"
            stripedRows
            responsiveLayout="scroll"
            @sort="sortBy"
          >
            <template #header>
              <div class="flex">
                <div
                  class="flex-none flex align-items-center justify-content-start"
                >
                  <Button
                    label="เพิ่มผู้ใช้งาน"
                    icon="pi pi-plus"
                    class="w-auto"
                    @click="goCreate()"
                  ></Button>
                </div>
                <div
                  class="flex-1 flex align-items-center justify-content-center"
                >
                  <Paginator
                    :rows="20"
                    v-model:first="firstPage"
                    :totalRecords="totalItemsCount"
                    @page="onPage($event)"
                    :rowsPerPageOptions="[20, 50, 100]"
                  >
                  </Paginator>
                </div>
                <div
                  class="flex-none flex align-items-center justify-content-end"
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
            </template> -->

      <!-- <div class="grid">
              <div
                class="col-12 md:col-12"
                v-for="shop in listShop"
                :key="guidfixed"
              ></div>

              <Column
                field="shopid"
                header="รหัสกองทุน"
                :sortable="true"
              ></Column
              ><Column field="" header=""></Column
              ><Column field="" header=""></Column>
              <Column field="name" header="ชื่อกองทุน" :sortable="true">
                 <template #body="{ data, field }">
                  {{ shop.name }}
                </template>
              </Column>
              <Column field="branchcode" header="รหัสกองทุน" :sortable="true">
             <template #body="{ data, field }">
                  {{ shop.name }}
                </template>
              </Column>
              <Column field="" header=""></Column>
              <Column field="telephone" header="เบอร์โทร" :sortable="true">
                <template #body="{ data, field }">
                  {{ shop.name }}
                </template> 
              </Column>
              <Column>
                <template #body="slotProps">
                  <Button
                    icon="pi pi-pencil"
                    class="p-button-rounded p-button-warning p-button-text"
                    @click="goEdit(slotProps.data)"
                  />
                </template>
              </Column>
              <Column>
                <template #body="slotProps">
                  <Button
                    icon="pi pi-trash"
                    class="p-button-rounded p-button-danger p-button-text"
                    @click="confirmDeleteDetail(slotProps.data)"
                  />
                </template>
              </Column>
            </div>
          </DataTable>
        </div>
      </div> -->
    </MainContentWarp>
  </AppLayout>
</template>
