import { defineStore } from "pinia";
export const useApp = defineStore("app", {
  state: () => ({
    PageTitle: "Dashboard",
    breadcrumb: [],
    pageActive: "dashboard",
    childActive: "",
    showToggle: true,
    Togset: true,
  }),
  actions: {
    async setPageTitle(title) {
      this.PageTitle = title;
      document.title = title + " - " + process.env.VUE_APP_TITLE;
    },
    async setActivePage(page) {
      console.log(page);
      this.pageActive = page;
    },
    async setActiveChild(page) {
      this.childActive = page;
    },
    async setActivedToggle(data) {
      this.showToggle = data;

      // if (this.showToggle == true) {
      //   this.showToggle = false;
      // } else {
      //   this.showToggle = true;
      // }
    },
    async sethoverActivedToggle() {
      if (this.showToggle == true) {
        this.showToggle = false;
      } else {
        this.showToggle = true;
      }
    },
    async setToggle(data) {
      if (this.Togset == data) {
        if (this.showToggle == data) {
          this.showToggle = true;
        } else {
          this.showToggle = true;
        }
      } else {
        this.showToggle = false;
      }
    },
  },
});
