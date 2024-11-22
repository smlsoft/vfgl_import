<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import MasterdataService from "@/services/MasterdataService";
import { useRouter } from "vue-router";
import { useToast } from "primevue/usetoast";
import { ref, onMounted } from "vue";
import Utils from "@/utils/";
import { useApp } from "@/stores/app.js";
import XLSX from "xlsx";
import DialogForm from "@/components/form/DialogForm.vue";
const storeApp = useApp();

const router = useRouter();
const toast = useToast();
const myFiles = ref();
const confirmSaveDialog = ref(false);
const textContent = ref("ต้องการนำเข้าข้อมูลร้านค้า");
const import_form = ref([]);
const error_message = ref([]);

const is_loading = ref(false);

onMounted(() => {
    storeApp.setPageTitle("แก้ไขข้อมูลกองทุน");
    storeApp.setActivePage("updateshopimport");
    storeApp.setActiveChild("");
});

async function confirmSave() {
    console.log(import_form.value);

    if (import_form.value.length === 0) {
        toast.add({
            severity: "warn",
            summary: "ไม่มีข้อมูล",
            detail: "กรุณาเพิ่มข้อมูลก่อนบันทึก",
            life: 3000,
        });
        return;
    }

    const promises = import_form.value.map((item) =>
        MasterdataService.ImportUpdateShop(item).then((res) => ({
            status: "fulfilled",
            item,
            response: res,
        })).catch((err) => ({
            status: "rejected",
            item,
            error: err,
        }))
    );
    const results = await Promise.allSettled(promises);

    const successes = results.filter((result) => result.value.status === "fulfilled" );
    const failures = results.filter((result) => result.value.status === "rejected" );

    if (successes.length > 0) {
        toast.add({
            severity: "success",
            summary: "บันทึกข้อมูลสำเร็จ",
            detail: `สำเร็จ ${successes.length} รายการ`,
            life: 3000,
        });
    }
    if (failures.length > 0) {
        toast.add({
            severity: "error",
            summary: "เกิดข้อผิดพลาด",
            detail: `ล้มเหลว ${failures.length} รายการ`,
            life: 3000,
        });
        console.error("Failed items:", failures.map((f) => f.value?.item || f.item));
    }


    setTimeout(() => {
        import_form.value = [];
        confirmSaveDialog.value = false;
    }, 1500);
}


async function onSave() {

    // var isTaxPass = await verifyTax();
    // var isVatPass = await verifyVat();
    // if (isPass && isTaxPass && isVatPass) {
    //   confirmSaveDialog.value = true;
    // }
    if (error_message.value.length == 0) {
        confirmSaveDialog.value = true;
    }
}

async function verifyData() {

    var error_msg = [];
    for (let index = 0; index < import_form.value.length; index++) {
        const element = import_form.value[index];
        if (element.branchcode == "") {
            error_msg.push("ไม่พบรหัสกองทุน รายการที่ " + (index + 1) + " \n");
        }
    }
    error_message.value = error_msg;
    console.log(error_message.value);

    if (error_message.value.length > 0) {
        toast.add({
            severity: "error",
            summary: "ข้อมูลไม่ถูกต้อง",
            detail: error_message.value.join("\n"),
            life: 5000,
        });
    }
}

function ImportFile() {
    is_loading.value = true;
    import_form.value = [];
    var config = { raw: true, type: "string" };
    var reader = new FileReader();
    reader.readAsArrayBuffer(myFiles.value.files[0]);
    reader.onload = function (e) {
        var data = new Uint8Array(reader.result);
        var wb = XLSX.read(data, { type: "array" });
        var firstSheetName = wb.SheetNames[0];
        var worksheet = wb.Sheets[firstSheetName];
        var results = XLSX.utils.sheet_to_json(worksheet, config);
        // console.log(worksheet);

        console.log(results);
        var error_msg = [];

        for (let index = 0; index < results.length; index++) {
            console.log(results[index]);

            var shop_model = {
                guidfixed: "",
                name1: "",
                address: "",
                telephone: "",
                branchcode: "",
            };

            JSON.parse(JSON.stringify(results[index]), (key, value) => {
                // console.log("key " + key);
                // console.log("value " + value);
                if (key.toLowerCase() == "code") {
                    shop_model.guidfixed = value.toString();
                }
                if (key.toLowerCase() == "name") {
                    shop_model.name1 = value.toString();
                }
                if (key.toLowerCase() == "address") {
                    shop_model.address = value.toString();
                }
                if (key.toLowerCase() == "telephone") {
                    shop_model.telephone = value.toString();
                }
                if (key.toLowerCase() == "branch") {
                    shop_model.branchcode = value.toString();
                }
            });

            import_form.value.push(shop_model);

            //  if()
            // details.push({
            //   index: index,
            //   accountcode: val_1,
            //   accountname: val_2,
            //   debitamount: val_3,
            //   creditamount: val_4,
            // });
        }

        setTimeout(() => {
            console.log(import_form.value);
            is_loading.value = false;
            verifyData();
        }, 500);
        //account_detail.value = details;
        // generateIndex();
    };
    reader.onerror = function (e) {
        is_loading.value = false;
        // console.log(e);
    };
}

function onClose() {
    confirmSaveDialog.value = false;
}
</script>

<template>
    <AppLayout>
        <MainContentWarp>
            <div class="surface-ground px-2 py-2">
                <div class="py-1 flex">
                    <div class="flex">
                        <FileUpload mode="basic" name="input file" accept=".xls,.xlsx" ref="myFiles" :customUpload="true" @change="ImportFile()"
                            class="p-button-plain p-button-primary p-button-sm" chooseLabel="นำเข้าไฟล์">
                        </FileUpload>
                    </div>
                    <div class="flex ml-2">
                        <Button v-if="import_form.length > 0 && error_message.length == 0" @click="onSave" label="บันทึกรายวัน" icon="pi pi-save"
                            class="w-auto p-button-succes p-button-sm"></Button>
                    </div>
                </div>

                <div class="py-0 flex" v-if="import_form.length > 0">
                    <div class="flex">
                        <p>จำนวน {{ import_form.length }} รายการ</p>
                    </div>
                </div>
                <div class="py-0" v-if="error_message.length > 0">
                    <div v-for="(msg, index) in error_message" :key="index">
                        <p style="color:red;font-size: 18px;padding: 0;margin: 0;">{{ msg }}</p>
                    </div>
                </div>
                <div class="surface-card p-4 shadow-2 border-round p-fluid my-2">
                    <div v-if="is_loading">กำลังประมวลผล....</div>
                    <div v-if="import_form.length > 0">
                        <DataTable :value="import_form" class="editable-cells-table" responsiveLayout="scroll">

                            <Column header="#">
                                <template #body="{ index }">
                                    <div>{{ index + 1 }}</div>
                                </template>
                            </Column>
                            <Column field="branchcode" header="รหัสกองทุน">

                            </Column>
                            <Column field="name1" header="ชื่อ"> </Column>
                            <Column field="address" header="ที่อยู่"> </Column>
                            <Column field="telephone" header="เบอร์โทรศัพท์"> </Column>
                        </DataTable>
                    </div>
                </div>
            </div>
            <DialogForm :confirmDialog="confirmSaveDialog" :textContent="textContent" v-on:close="onClose" v-on:confirm="confirmSave"></DialogForm>
        </MainContentWarp>
    </AppLayout>
</template>
