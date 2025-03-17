import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * 合并tailwind css类名
 * @param inputs 
 * @returns 
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
