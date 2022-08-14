import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import About from "../views/about/about.vue";
import Home from "../views/home/home.vue";
import Login from "../views/login/login.vue";
import Register from "../views/login/register.vue";
import Calendar from "../views/home/calendar.vue";
import Setting from "../views/home/setting.vue";

const routes: Array<RouteRecordRaw> = [
  { path: "/", name: "login", component: Login },
  {
    path: "/home",
    name: "home",
    component: Home,
    children: [{ path: "calendar", component: Calendar },{ path: "setting", component: Setting }],
  },
  { path: "/about", name: "about", component: About },
  { path: "/register", name: "register", component: Register },
];
const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
