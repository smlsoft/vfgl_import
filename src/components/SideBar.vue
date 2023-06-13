<script setup>
import { defineComponent } from "@vue/runtime-core";
import { RouterLink } from "vue-router";
import { menus } from "@/api/menu";
import { useApp } from "@/stores/app.js";
import { ref, onMounted } from "vue";
const shopname = ref("");
const storeApp = useApp();
const userName = localStorage._usercode;
const isSidebarOpen = ref(true);
const lock = ref(true);
onMounted(() => {
  // console.log(localStorage.lock);
  storeApp.showToggle = isSidebarOpen.value;
  toggleSidebar();
  checklock();
  //console.log(window.innerWidth);
  // console.log(localStorage.shop_name);
  shopname.value = localStorage.shop_name;
  // console.log(localStorage.shop_name);
  shopname.value = localStorage.shop_name;
  isSidebarOpen.value == true;
  // console.log(shopname);
  if (window.innerWidth <= 1200) {
    storeApp.showToggle = false;
  }
});
function toggle() {
  console.log(storeApp.setToggle);
}

function toggleSidebar() {
  if (isSidebarOpen.value == true) {
    isSidebarOpen.value = false;
  }
}
function checklock() {
  // console.log("lock is " + localStorage.lock);
}
function unlock() {
  console.log("lock is " + lock.value + "42");
  if (lock.value == true) {
    localStorage.lock = false;

    lock.value = false;
    localStorage.lock = lock.value;
    console.log("lock is " + localStorage.lock + lock.value);
  } else {
    localStorage.lock = true;

    lock.value = true;
    localStorage.lock = lock.value;
    console.log("lock is " + localStorage.lock + lock.value);
  }
}
function toggleSidebarof() {
  if (isSidebarOpen.value == true || lock.value == true) {
    isSidebarOpen.value = false;
  } else {
    isSidebarOpen.value = true;
  }
}
</script>
<template>
  <div
    id="app-sidebar-11 h-screen"
    class="bg- lg:block flex-shrink-0 left-0 top-0 z-1 border-gray-800 select-none"
    style="background-color: #343a40"
  >
    <div class="">
      <div
        class="wrapper"
        @mouseover="toggleSidebar"
        @mouseleave="toggleSidebarof"
        :class="storeApp.showToggle == false ? 'hidden ' : '  '"
      >
        <aside :vue:is-open="isSidebarOpen">
          <div class="p-2 border-bottom-1">
            <img
              src="@/assets/logo.jpg"
              alt="Image"
              height="27"
              class="mr-3 lg:mr-3 rounded-full"
              :class="isSidebarOpen == false ? 'pl-6' : 'pl-3'"
            />
            <span class="text-3xl text-white" v-show="isSidebarOpen == false"
              >VFGL</span
            >
            <!-- <hr
              v-show="isSidebarOpen == false"
              class="border-top-1 border-none surface-border"
            /> -->
          </div>
          <div class="pb-3 my-3 border-bottom-1 px-2">
            <div class="">
              <span
                class="text-md text-white ml-3"
                v-show="isSidebarOpen == false"
              >
                ผู้ใช้งาน : {{ userName }}</span
              >
            </div>
          </div>

          <div class="px-2">
            <ul class="list-none p-0 m-0" v-show="isSidebarOpen == false">

              <li v-for="menu in menus" :key="menu.title" class="p-0 m-0">
                <!-- header title -->
                <RouterLink
                  v-if="menu.children.length == 0"
                  :to="menu.to"
                  :class="
                    storeApp.pageActive == menu.name ? 'text-indigo-500 ' : ''
                  "
                  @click="
                    storeApp.setActivePage(menu.name);
                    storeApp.setActiveChild('');
                  "
                  v-ripple
                  style="border-radius: 0.25rem"
                  class="flex align-items-center cursor-pointer py-2 px-3 text-100 border-transparent hover:border-300 hover:bg-white-alpha-10 transition-duration-150 transition-colors p-ripple text-white"
                >
                  <a
                    ><i
                      :class="menu.icon + ' ' + menu.color + ' text-white'"
                      class=""
                    ></i>
                    <span class="">{{ menu.title }}</span>
                  </a>
                </RouterLink>
                <!-- <i :class="menu.icon + ' ' + menu.color" class="mr-2"></i> -->
                <!-- <span class="font-medium">{{ menu.title }}</span> -->

                <!-- <a
                  v-if="menu.children.length > 0"
                  v-ripple
                  class="flex align-items-center cursor-pointer py-2 px-3 text-100 border-transparent hover:border-300 hover:bg-white-alpha-10 transition-duration-150 transition-colors p-ripple text-white"
                  style="border-radius: 0.25rem"
                  v-styleclass="{
                    selector: '@next',
                    enterClass: 'hidden',
                    enterActiveClass: 'slidedown',
                    leaveToClass: 'hidden',
                    leaveActiveClass: 'slideup',
                  }"
                  ><i
                    :class="menu.icon + ' ' + menu.color + ' text-white'"
                    class=""
                  ></i>
                  <span class="">{{ menu.title }}</span>
                  <i
                    class="pi pi-chevron-down ml-auto"
                    v-if="menu.children.length > 0"
                  ></i>
                </a>

                <ul
                  v-if="menu.children.length > 0"
                  :class="storeApp.pageActive != menu.name ? 'hidden' : ''"
                  class="list-none overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out text-white p-0 m-0"
                >
                  <li
                    v-for="child in menu.children"
                    :key="child.title"
                    class="p-0"
                  >
                    <RouterLink
                      :to="child.to"
                      @click="
                        storeApp.setActivePage(menu.name);
                        storeApp.setActiveChild(child.name);
                      "
                      :class="
                        storeApp.childActive == child.name
                          ? 'text-indigo-500 '
                          : ''
                      "
                      v-ripple
                      class="flex align-items-center cursor-pointer text-700 border-transparent hover:border-300 hover:bg-white-alpha-10 transition-duration-150 transition-colors p-ripple text-white"
                      style="border-radius: 0.25rem"
                    >
                      <div class="">
                        <i
                          :class="child.icon + ' ' + child.color"
                          class="pi pi-circle py-2 px-3"
                        ></i>
                        <span class="ml-auto">{{ child.title }}</span>
                      </div>
                    </RouterLink>
                  </li>
                </ul> -->
              </li>
            </ul>
          </div>

          <div class="mt-auto border-top-1">
            <RouterLink
              to=""
              v-ripple
              class="flex align-items-center cursor-pointer py-3 px-2 text-700 border-transparent hover:border-300 transition-duration-150 transition-colors p-ripple"
              style="border-radius: 12px"
            >
              <i
                :class="
                  lock == true
                    ? 'pi pi-lock mx-3 text-danger'
                    : 'pi pi-unlock mx-3 text-white'
                "
                @click="unlock()"
              >
              </i>
              <span
                class="font-medium text-white"
                v-show="isSidebarOpen == false"
              >
                {{ lock == true ? "lock " : "unlock" }}</span
              >
            </RouterLink>
            <RouterLink
              to="/logout"
              v-ripple
              class="flex align-items-center cursor-pointer py-3 px-2 text-700 border-transparent hover:border-300 transition-duration-150 transition-colors p-ripple"
              style="border-radius: 12px"
            >
              <i class="pi pi-sign-in mx-3 text-white"></i>
              <span
                class="font-medium text-white"
                v-show="isSidebarOpen == false"
                >ออกจากระบบ</span
              >
            </RouterLink>
          </div>
          <!-- <ul>
            <li>
              <router-link to="/">
                <IconHome />
                <Transition name="fade">
                  <span v-show="isSidebarOpen">Home</span>
                </Transition>
              </router-link>
            </li>
            <li>
              <router-link to="/about">
                <IconExclamation />
                <Transition name="fade">
                  <span v-show="isSidebarOpen">About</span>
                </Transition>
              </router-link>
            </li>
            <li>
              <router-link to="/team">
                <IconEmployeeGroup />
                <Transition name="fade">
                  <span v-show="isSidebarOpen">Team</span>
                </Transition>
              </router-link>
            </li>
            <li>
              <router-link to="/contact">
                <IconEmail />
                <Transition name="fade">
                  <span v-show="isSidebarOpen">Contact</span>
                </Transition>
              </router-link>
            </li>
          </ul> -->
        </aside>
      </div>
      <!-- <div class="flex flex-column h-full" style="background-color: #343a40">
        <div
          class="flex align-items-center px-6 flex-shrink-0"
          style="height: 4vh"
        >
          <h3 class="text-red-500">{{ shopname }}</h3>
        </div>
        <div class="overflow-y-auto">
          
        </div>
        <div class="mt-auto">
          <hr class="mb-3 mx-3 border-top-1 border-none surface-border" />
          <RouterLink
            to="/logout"
            v-ripple
            class="flex align-items-center cursor-pointer p-3 text-700 border-transparent hover:border-300 transition-duration-150 transition-colors p-ripple"
            style="border-radius: 12px"
          >
            <i class="pi pi-sign-in mx-auto text-white"> ออกจากระบบ</i>
          </RouterLink>
        </div>
      </div> -->
    </div>
    <!-- <div
      @mouseover="storeApp.setActivedToggle(true)"
      @mouseleave="storeApp.setActivedToggle(false)"
      id="app-sidebar-11"
      :class="storeApp.showToggle == true ? 'hidden' : ''"
      class="surface-overlay h-screen flex-shrink-0 animation-duration-200 animation-ease-in-out static left-0 top-0 z-1 border-right-1 surface-border select-none"
      style="width: 80px"
    >
      <div
        class="flex flex-column h-full"
        style="width: 80px; background-color: #343a40"
      >
       <div
          class="flex align-items-center px-5 flex-shrink-0"
          style="height: 5vh"
        >
          <h3>{{ shopname }}</h3>
        </div> 
        <div class="overflow-y-auto">
          <ul class="list-none p-3 m-0">
            <li v-for="menu in menus" :key="menu.title">
              <RouterLink
                v-if="menu.children.length == 0"
                :to="menu.to"
                :class="
                  storeApp.pageActive == menu.name ? 'text-indigo-500 ' : ''
                "
                @click="
                  storeApp.setActivePage(menu.name);
                  storeApp.setActiveChild('');
                "
                v-ripple
                class="flex align-items-center cursor-pointer p-3 text-700 border-transparent hover:border-300 transition-duration-150 transition-colors p-ripple"
                style="border-radius: 12px"
              >
                <i :class="menu.icon + ' ' + menu.color" class="mr-2"></i>
                <span class="font-medium">{{ menu.title }}</span>
              </RouterLink> 
              <a
                v-if="menu.children.length >= 0"
                v-ripple
                class="flex align-items-center cursor-pointer p-3 text-700 border-transparent hover:border-300 transition-duration-150 transition-colors p-ripple"
                style="border-radius: 12px"
                v-styleclass="{
                  selector: '@next',
                  enterClass: 'hidden',
                  enterActiveClass: 'slidedown',
                  leaveToClass: 'hidden',
                  leaveActiveClass: 'slideup',
                }"
                ><i
                  :class="menu.icon + ' ' + menu.color + ' text-white'"
                  class="mr-2"
                ></i>
              <span class="font-medium">{{ menu.title }}</span>
                <i class="pi pi-chevron-down ml-auto"></i> 
              </a>
              <ul
                v-if="menu.children.length > 0"
                :class="storeApp.pageActive != menu.name ? 'hidden' : ''"
                class="list-none py-0 pl-3 pr-0 m-0 overflow-y-hidden transition-all transition-duration-400 transition-ease-in-out"
              >
                <li v-for="child in menu.children" :key="child.title">
                  <RouterLink
                    :to="child.to"
                    @click="
                      storeApp.setActivePage(menu.name);
                      storeApp.setActiveChild(child.name);
                    "
                    :class="
                      storeApp.childActive == child.name
                        ? 'text-indigo-500 '
                        : ''
                    "
                    v-ripple
                    class="flex align-items-center cursor-pointer p-3 text-700 border-transparent hover:border-300 transition-duration-150 transition-colors p-ripple"
                    style="border-radius: 12px"
                  >
                    <i :class="child.icon + ' ' + child.color" class="mr-2"></i>
                    <span class="font-medium">{{ child.title }}</span>
                  </RouterLink>
                </li>
              </ul>
            </li>
          </ul>
        </div>
        <div class="mt-auto">
          <hr class="mb-3 mx-3 border-top-1 border-none surface-border" />
          <RouterLink
            to="/logout"
            v-ripple
            class="flex align-items-center cursor-pointer p-3 text-700 border-transparent hover:border-300 transition-duration-150 transition-colors p-ripple"
            style="border-radius: 12px"
          >
            <i class="pi pi-sign-in mx-auto text-white"></i>
            <span class="font-medium text-white">ออกจากระบบ</span> 
          </RouterLink>
        </div>
      </div>
    </div> -->
  </div>
</template>

<style lang="scss">
@import "../assets/styles/app/layout.scss";

$sidebar-width: 4rem;
$toggle-duration: 300ms;
$sidebar-padding-inline-start: 1rem;

#app-sidebar-11 {
  background: #343a40;
}

aside {
  background: #343a40;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /*padding-block: 1rem;*/
  transition: all $toggle-duration;
  width: 230px;
}

aside[vue\:is-open="true"] {
  width: 1 * $sidebar-width;
}

.ullist {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding-block-end: 1rem;
}

img {
  object-fit: contain;
}

li {
  min-width: fit-content;
  cursor: pointer;
  padding-inline-start: $sidebar-padding-inline-start;

  &:hover {
    color: darkgoldenrod;
  }

  & a {
    // border-right: 0.25rem solid white;
    display: flex;
    align-items: center;
    column-gap: 0.75rem;
    position: relative;
    padding-block: 0.5rem;
  }

  a.router-link-exact-active::after {
    content: "";
    position: absolute;
    right: 0;
    width: 0.25rem;
    height: 100%;
  }
}
.sidebar-head {
  position: relative;
  // padding-block-end: 4rem;
}

.sidebar-toggle {
  padding-inline-start: $sidebar-padding-inline-start;
}

h4 {
  padding-block-end: 1rem;
  padding-inline-start: $sidebar-padding-inline-start;
  user-select: none;
  pointer-events: none;
  opacity: 0.5;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.125ch;
  transition: opacity $toggle-duration;
}

h4[transparent="true"] {
  opacity: 0;
}

// button {
//   cursor: pointer;
//   position: absolute;
//   transition-duration: $toggle-duration;
//   transition-property: transform, left, top;
//   left: 0;
//   top: 1rem;
//   transform: translateX(0%) translateY(2rem) rotateZ(0deg);

//   &.toggle-button {
//     left: 100%;
//     top: 0;
//     transform: translateX(-100%) translateY(0rem) rotateZ(180deg);
//   }
// }

.fade-enter-active,
.fade-leave-active {
  transition-property: opacity, transform;
  transition-duration: $toggle-duration;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateX(-100%);
}
</style>
<!-- .surface-overlay {
  transition: transform 0.2s ease-out;
  transform: translateX(-100%);
}

.show {
  transform: translateX(0%);
} -->
<!-- <template>
  <div class="bg-gray-900 h-screen lg:block flex-shrink-0 static left-0 top-0 z-1 border-gray-800 select-none">
    <div
      @mouseover="storeApp.setActivedToggle(true)"
      @mouseleave="storeApp.setActivedToggle(false)"
      :class="['surface-overlay', storeApp.showToggle ? 'show' : '']"
      class="h-screen flex-shrink-0 animation-duration-200 static left-0 top-0 z-1 border-right-1 surface-border select-none"
      style="width: 280px; background-color: #343a40"
    >
      <div class="flex flex-column h-full" style="background-color: #343a40">
        <div class="flex align-items-center px-6 flex-shrink-0" style="height: 4vh">
          <h3 class="text-red-500">{{ shopname }}</h3>
        </div>
        <div class="mt-auto">
          <hr class="mb-3 mx-3 border-top-1 border-none surface-border" />
          <RouterLink
            to="/logout"
            v-ripple
            class="flex align-items-center cursor-pointer p-3 text-700 border-transparent hover:border-300 transition-duration-150 transition-colors p-ripple"
            style="border-radius: 12px"
          >
            <i class="pi pi-sign-in mx-auto text-white"> ออกจากระบบ</i>
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template> -->
