import { toast } from 'sonner';

/**
 * 复制文本到剪贴板。
 * @param text - 要复制到剪贴板的文本。
 */
export function copyTextToClipboard(text: string) {
	if (navigator.clipboard) {
		navigator.clipboard
			.writeText(text)
			.then(() => {
				// Optional: Show a success message
				toast.success('复制成功', {
					richColors: true,
					position: 'top-center'
				});
			})
			.catch((err) => {
				console.error('Failed to copy: ', err);
			});
	} else {
		// Fallback for older browsers
		const textArea = document.createElement('textarea');
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.select();
		document.execCommand('copy');
		document.body.removeChild(textArea);
	}
}