<script setup>
import AppLayout from "@/components/layout/AppLayout.vue";
import MainContentWarp from "@/components/MainContentWarp.vue";
import { onMounted, ref } from "vue";
import { useApp } from "@/stores/app.js";

const storeApp = useApp();
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
onMounted(() => {
  storeApp.setActivePage("dashboard");
  storeApp.setActiveChild("");
  storeApp.setPageTitle(
    "ระบบบันทึกบัญชีโครงการประชารัฐและระบบริหารร้านค้าชุมชนตามแนวทางโครงการประชารัฐของกองทุนหมู่บ้านฯ"
  );
});
</script>

<template>
  <AppLayout>
    <MainContentWarp>
      <div class="text-white h-full w-full">
        <img
          src="/images/manual/photoanddoc/vf.png"
          alt="test"
          style="width: 100%"
        />
      </div>
    </MainContentWarp>
  </AppLayout>
</template>
<style>
.bg-container {
  width: 100%;
  height: 100%;
}
</style>
