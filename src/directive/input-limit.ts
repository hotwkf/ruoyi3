import { type Directive, type DirectiveBinding } from "vue";

// 只能输入数字和英文的指令
export const onlyNumberAndLetter: Directive = {
  beforeMount(element: HTMLInputElement) {
    element.addEventListener("input", function (event_: any) {
      event_.target.value = event_.target.value.replaceAll(/[^\dA-Za-z]/g, "");
    });
  },
};

// 只能输入数字和-的指令
export const onlyNumberAndDash: Directive = {
  beforeMount(element: HTMLInputElement) {
    element.addEventListener("input", function (event_: any) {
      event_.target.value = event_.target.value.replaceAll(/[^\d-]/g, "");
    });
  },
};

// 只保留小数点后最多五位数字
export const limitNDigits: Directive = {
  beforeMount(element: HTMLInputElement, binding: DirectiveBinding<number>) {
    element.addEventListener("input", function (event_: any) {
      const regex = new RegExp(`^(.*\\..{${binding.value}}).*$`, "g");
      const newValue = event_.target.value.replace(regex, "$1");
      if (newValue !== event_.target.value) {
        event_.target.value = newValue;
        event_.target.dispatchEvent(new Event("input")); // 触发输入事件
      }
    });
  },
};
// 只能输入1~100之间的正整数，参数1位起始数字，参数2位结束数字
export const onlyNumberBetween: Directive = {
  beforeMount(
    element: HTMLInputElement,
    binding: DirectiveBinding<{ start: number; end: number }>,
  ) {
    element.addEventListener("input", function (event_: any) {
      const regex = new RegExp(`^(\\d{0,2})$`, "g");
      const newValue = event_.target.value.replaceAll(regex, "$1");
      if (newValue !== event_.target.value) {
        event_.target.value = newValue;
        event_.target.dispatchEvent(new Event("input")); // 触发输入事件
      }
      if (event_.target.value > binding.value.end) {
        event_.target.value = binding.value.end;
        event_.target.dispatchEvent(new Event("input")); // 触发输入事件
      }
      if (event_.target.value < binding.value.start) {
        event_.target.value = binding.value.start;
        event_.target.dispatchEvent(new Event("input")); // 触发输入事件
      }
    });
  },
};
