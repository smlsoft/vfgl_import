<script setup>
import TopBar from "@/components/TopBar.vue";
import SideBar from "@/components/SideBar.vue";
import BottomBar from "@/components/BottomBar.vue";
</script>

<template>
  <div class="min-h-screen flex relative lg:static surface-ground">
    <SideBar />
    <div class="min-h-screen flex flex-column relative flex-auto">
      <TopBar />
      <Toast />
      <div class="shadow-1 bg-white m-2 p-0"><slot></slot></div>
    </div>
  </div>
</template>
