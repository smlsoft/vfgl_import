<script setup>
import { useApp } from "@/stores/app.js";
const storeApp = useApp();
function toggle() {
  storeApp.setToggle(true);
  if (storeApp.setToggle == true) {
    storeApp.setToggle(true);
  } else {
    storeApp.setToggle(true);
  }
}
</script>

<template>
  <div
    class="flex justify-content-start align-items-center px-3 surface-section shadow-2 relative lg:static border-bottom-1 surface-border animation-duration-200 animation-ease-in-out py-3"
  >
    <a
      class="cursor-pointer block text-700 p-ripple"
      @click="storeApp.sethoverActivedToggle()"
    >
      <i class="pi pi-bars"></i>
    </a>
    <span class="mb-1 ml-4 text-gray-600 text-sm font-normal"> {{ storeApp.PageTitle }} </span>
  </div>
  <div class="content-header flex p-2">

  </div>
</template>
