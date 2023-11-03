// import "default-passive-events";
import "@/assets/styles/index.scss"; // global css
// tailwindcss
import "./index.css";
// svg图标
// eslint-disable-next-line import/no-unresolved
import "virtual:svg-icons-register";
import "./permission"; // permission control
import { createApp } from "vue";
import Cookies from "js-cookie";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs"; // 中文语言
// import zhCn from "element-plus/lib/locale/lang/zh-cn"; // 中文语言
import "element-plus/dist/index.css";
import dayjs from "dayjs";
import Editor from "@/components/Editor/index.vue";
// 文件上传组件
import FileUpload from "@/components/FileUpload/index.vue";
// 图片预览组件
import ImagePreview from "@/components/ImagePreview/index.vue";
// 图片上传组件
import ImageUpload from "@/components/ImageUpload/index.vue";
// 分页组件
import Pagination from "@/components/Pagination/index.vue";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar/index.vue";
import SvgIcon from "@/components/SvgIcon/index.vue";
import elementIcons from "@/components/SvgIcon/svgicon";
// 自定义树选择组件
import TreeSelect from "@/components/TreeSelect/index.vue";
import { useDict } from "@/utils/dict";
import { download } from "@/utils/request";
import {
  addDateRange,
  handleTree,
  parseTime,
  resetForm,
  selectDictLabel,
  selectDictLabels,
} from "@/utils/ruoyi";

// 字典标签组件
import DictTag from "@/components/DictTag/index.vue";
import store from "./store";
import router from "./router";
import plugins from "./plugins"; // plugins
import directive from "./directive"; // directive
import App from "./app.vue";
import {
  limitNDigits,
  onlyNumberAndDash,
  onlyNumberAndLetter,
  onlyNumberBetween,
} from "./directive/input-limit";
// 富文本组件
// 注册指令

const app = createApp(App);

// 全局方法挂载
app.config.globalProperties.useDict = useDict;
app.config.globalProperties.download = download;
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.resetForm = resetForm;
app.config.globalProperties.handleTree = handleTree;
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.selectDictLabel = selectDictLabel;
app.config.globalProperties.selectDictLabels = selectDictLabels;
app.config.globalProperties.dayjs = dayjs;

// 全局组件挂载
app.component("DictTag", DictTag);
app.component("Pagination", Pagination);
app.component("TreeSelect", TreeSelect);
app.component("FileUpload", FileUpload);
app.component("ImageUpload", ImageUpload);
app.component("ImagePreview", ImagePreview);
app.component("RightToolbar", RightToolbar);
app.component("Editor", Editor);

app.use(router);
app.use(store);
app.use(plugins);
app.use(elementIcons);
app.component("SvgIcon", SvgIcon);

directive(app);
app.directive("only-number-and-letter", onlyNumberAndLetter);
app.directive("only-number-and-dash", onlyNumberAndDash);
app.directive("limit-n-digits", limitNDigits);
app.directive("only-mumber-between", onlyNumberBetween);

// 使用element-plus 并且设置全局的大小
app.use(ElementPlus, {
  locale: zhCn,
  // 支持 large、default、small
  size: (Cookies.get("size") || "default") as
    | ""
    | "default"
    | "small"
    | "large",
});

app.mount("#app");
