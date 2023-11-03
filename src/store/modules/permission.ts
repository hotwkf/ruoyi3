import { defineStore } from "pinia";
import { type RouteRecordRaw } from "vue-router";
import auth from "@/plugins/auth";
import router, { constantRoutes, dynamicRoutes } from "@/router";
import { getRouters } from "@/api/menu";
import Layout from "@/layout/index.vue";
import ParentView from "@/components/ParentView/index.vue";
import InnerLink from "@/layout/components/InnerLink/index.vue";

// 匹配views里面所有的.vue文件
const modules = import.meta.glob("./../../views/**/*.vue");

const usePermissionStore = defineStore("permission", {
  state: (): {
    routes: RouteRecordRaw[];
    addRoutes: RouteRecordRaw[];
    defaultRoutes: RouteRecordRaw[];
    topbarRouters: RouteRecordRaw[];
    sidebarRouters: RouteRecordRaw[];
  } => ({
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: [],
  }),
  actions: {
    setRoutes(routes: RouteRecordRaw[]) {
      this.addRoutes = routes;
      this.routes = constantRoutes.concat(routes);
    },
    setDefaultRoutes(routes: RouteRecordRaw[]) {
      this.defaultRoutes = constantRoutes.concat(routes);
    },
    setTopbarRoutes(routes: RouteRecordRaw[]) {
      this.topbarRouters = routes;
    },
    setSidebarRouters(routes: RouteRecordRaw[]) {
      this.sidebarRouters = routes;
    },
    generateRoutes(routes?: RouteRecordRaw[]) {
      return new Promise<any[]>((resolve) => {
        // 向后端请求路由数据
        getRouters().then((res) => {
          const sdata = JSON.parse(JSON.stringify(res.data));
          const rdata = JSON.parse(JSON.stringify(res.data));
          const defaultData = JSON.parse(JSON.stringify(res.data));
          const sidebarRoutes = filterAsyncRouter(sdata);
          const rewriteRoutes = filterAsyncRouter(rdata, false, true);
          const defaultRoutes = filterAsyncRouter(defaultData);
          const asyncRoutes = filterDynamicRoutes(dynamicRoutes);
          for (const route of asyncRoutes) {
            router.addRoute(route);
          }
          this.setRoutes(rewriteRoutes);
          this.setSidebarRouters(constantRoutes.concat(sidebarRoutes));
          this.setDefaultRoutes(sidebarRoutes);
          this.setTopbarRoutes(defaultRoutes);
          resolve(rewriteRoutes);
        });
      });
    },
  },
});

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(
  asyncRouterMap: any[],
  lastRouter = false,
  type = false
) {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      switch (route.component) {
        case "Layout": {
          route.component = Layout;

          break;
        }
        case "ParentView": {
          route.component = ParentView;

          break;
        }
        case "InnerLink": {
          route.component = InnerLink;

          break;
        }
        default: {
          route.component = loadView(route.component);
        }
      }
    }
    if (
      route.children != undefined &&
      route.children &&
      route.children.length > 0
    ) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route["children"];
      delete route["redirect"];
    }
    return true;
  });
}

function filterChildren(childrenMap: any[], lastRouter: any = false) {
  let children: any[] = [];
  for (const [index, element] of childrenMap.entries()) {
    if (
      element.children &&
      element.children.length > 0 &&
      element.component === "ParentView" &&
      !lastRouter
    ) {
      element.children.forEach((c: any) => {
        c.path = `${element.path}/${c.path}`;
        if (c.children && c.children.length > 0) {
          children = children.concat(filterChildren(c.children, c));
          return;
        }
        children.push(c);
      });
      continue;
    }
    if (lastRouter) {
      element.path = `${lastRouter.path}/${element.path}`;
    }
    children = children.concat(element);
  }
  return children;
}

// 动态路由遍历，验证是否具备权限
export function filterDynamicRoutes(routes: any[]) {
  const res: any[] = [];
  for (const route of routes) {
    if (route.permissions) {
      if (auth.hasPermiOr(route.permissions)) {
        res.push(route);
      }
    } else if (route.roles && auth.hasRoleOr(route.roles)) {
      res.push(route);
    }
  }
  return res;
}

export const loadView = (view: any) => {
  let res;
  for (const path in modules) {
    const dir = path.split("views/")[1].split(".vue")[0];
    if (dir === view) {
      res = () => modules[path]();
    }
  }
  return res;
};

export default usePermissionStore;
