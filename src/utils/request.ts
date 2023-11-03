import axios from "axios";
import {
  ElLoading,
  ElMessage,
  ElMessageBox,
  ElNotification,
} from "element-plus";
import { saveAs } from "file-saver";
import { getToken } from "@/utils/auth";
import errorCode from "@/utils/errorCode";
import { blobValidate, tansParams } from "@/utils/ruoyi";
import cache from "@/plugins/cache";
import useUserStore from "@/store/modules/user";

let downloadLoadingInstance: ReturnType<typeof ElLoading.service>;

// 是否显示重新登录
export const isRelogin = { show: false };

// 创建axios实例
const service = axios.create({
  // axios中请求配置有baseURL选项，表示请求URL公共部分
  baseURL: import.meta.env.VITE_APP_BASE_API,
  // 超时
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

// request拦截器
service.interceptors.request.use(
  (config) => {
    // 是否需要设置 token
    const isToken = (config.headers || {}).isToken === false;
    // 是否需要防止数据重复提交
    const isRepeatSubmit = (config.headers || {}).repeatSubmit === false;
    if (getToken() && !isToken && config.headers) {
      config.headers["Authorization"] = getToken(); // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    // get请求映射params参数
    if (config.method === "get" && config.params) {
      let url = `${config.url}?${tansParams(config.params)}`;
      url = url.slice(0, -1);
      config.params = {};
      config.url = url;
    }
    if (
      !isRepeatSubmit &&
      (config.method === "post" || config.method === "put")
    ) {
      const requestObject = {
        url: config.url,
        data:
          typeof config.data === "object"
            ? JSON.stringify(config.data)
            : config.data,
        time: Date.now(),
      };
      const sessionObject = cache.session.getJSON("sessionObj");
      if (
        sessionObject === undefined ||
        sessionObject === null ||
        sessionObject === ""
      ) {
        cache.session.setJSON("sessionObj", requestObject);
      } else {
        const s_url = sessionObject.url; // 请求地址
        const s_data = sessionObject.data; // 请求数据
        const s_time = sessionObject.time; // 请求时间
        const interval = 1000; // 间隔时间(ms)，小于此时间视为重复提交
        if (
          s_data === requestObject.data &&
          requestObject.time - s_time < interval &&
          s_url === requestObject.url
        ) {
          const message = "数据正在处理，请勿重复提交";
          console.warn(`[${s_url}]: ${message}`);
          return Promise.reject(new Error(message));
        } else {
          cache.session.setJSON("sessionObj", requestObject);
        }
      }
    }
    return config;
  },
  (error) => {
    console.log(error);
    Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  (res) => {
    // 未设置状态码则默认成功状态
    const code = res.data.code || 200;
    // 获取错误信息
    const message = errorCode[code] || res.data.msg || errorCode["default"];
    // 二进制数据则直接返回
    if (
      res.request.responseType === "blob" ||
      res.request.responseType === "arraybuffer"
    ) {
      return res.data;
    }
    switch (code) {
      case 401: {
        if (!isRelogin.show) {
          isRelogin.show = true;
          ElMessageBox.confirm(
            "登录状态已过期，您可以继续留在该页面，或者重新登录",
            "系统提示",
            {
              confirmButtonText: "重新登录",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              isRelogin.show = false;
              useUserStore()
                .logOut()
                .then(() => {
                  location.href = "/index";
                });
            })
            .catch(() => {
              isRelogin.show = false;
            });
        }
        return Promise.reject("无效的会话，或者会话已过期，请重新登录。");
      }
      case 500: {
        ElMessage({
          message,
          type: "error",
        });
        return Promise.reject(new Error(message));
      }
      case 601: {
        ElMessage({
          message,
          type: "warning",
        });
        return Promise.reject(new Error(message));
      }
      default: {
        return code === 200 ? Promise.resolve(res.data) : res.data;
        //  else {
        //   ElNotification.error({
        //     title: message,
        //   });
        //   return Promise.reject("error");
        // }
      }
    }
  },
  (error) => {
    console.log(`err${error}`);
    let { message } = error;
    if (message === "Network Error") {
      message = "后端接口连接异常";
    } else if (message.includes("timeout")) {
      message = "系统接口请求超时";
    } else if (message.includes("Request failed with status code")) {
      message = `系统接口${message.slice(-3)}异常`;
    }
    ElMessage({
      message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

// 通用下载方法
export function download(
  url: string,
  parameters: any,
  filename: string,
  config: any = {}
) {
  downloadLoadingInstance = ElLoading.service({
    text: "正在下载数据，请稍候",
    background: "rgba(0, 0, 0, 0.7)",
  });
  return service
    .post(url, parameters, {
      transformRequest: [
        (parameters) => {
          return tansParams(parameters);
        },
      ],
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      responseType: "blob",
      ...config,
    })
    .then(async (data: any) => {
      const isBlob = blobValidate(data);
      if (isBlob) {
        const blob = new Blob([data]);
        saveAs(blob, filename);
      } else {
        const resText = await data.text();
        const rspObject = JSON.parse(resText);
        const errorMessage =
          errorCode[rspObject.code] || rspObject.msg || errorCode["default"];
        ElMessage.error(errorMessage);
      }
      downloadLoadingInstance.close();
    })
    .catch((error) => {
      console.error(error);
      ElMessage.error("下载文件出现错误，请联系管理员！");
      downloadLoadingInstance.close();
    });
}

export default service;
