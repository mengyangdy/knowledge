import { Toast } from "@douyinfe/semi-ui"

/**
 * 复制文本到剪贴板。
 * @param text - 要复制到剪贴板的文本。
 */
export function copyTextToClipboard(text: string) {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(text).then(() => {
			Toast.success({
				content: "Hi, Bytedance dance dance",
				duration: 3,
				theme: "light",
			})
		})
	} else {
		// Fallback for older browsers
		const textArea = document.createElement("textarea")
		textArea.value = text
		document.body.appendChild(textArea)
		textArea.select()
		document.execCommand("copy")
		document.body.removeChild(textArea)
	}
}
