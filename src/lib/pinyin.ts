import * as pinyin from "pinyin";

// 定义生成 slug 的函数
export function generateSlug(title: string): string {
  try {
    // 将中文转换为拼音
    const pinyinResult = pinyin.default(title, {
      style: pinyin.STYLE_NORMAL, // 不带声调
      heteronym: false, // 不启用多音字
    });

    // 将拼音数组转换为 URL 友好的字符串
    return pinyinResult
      .map((item) => item[0])
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-") // 将非字母数字字符替换为连字符
      .replace(/(^-|-$)/g, "");
  } catch (error) {
    return title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");
  }
  // 移除首尾连字符
}
