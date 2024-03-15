import type { ThemeableImage } from '../../typings'

export function shuffleArray(arr: any[]) {
  const array = [...arr]
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

export function formatDate(d: any, fmt = 'yyyy-MM-dd hh:mm:ss') {
  let data = d
  let fmts = fmt
  if (!(data instanceof Date)) {
    data = new Date(data)
  }
  const o: any = {
    'M+': data.getMonth() + 1, // 月份
    'd+': data.getDate(), // 日
    'h+': data.getHours(), // 小时
    'm+': data.getMinutes(), // 分
    's+': data.getSeconds(), // 秒
    'q+': Math.floor((data.getMonth() + 3) / 3), // 季度
    S: data.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmts)) {
    fmts = fmts.replace(RegExp.$1, `${data.getFullYear()}`.substr(4 - RegExp.$1.length))
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt))
      fmts = fmts.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length))
  }
  return fmts
}

export function isCurrentWeek(date: Date, target?: Date) {
  const now = target || new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const oneDay = 1000 * 60 * 60 * 24
  const nowWeek = today.getDay()
  // 本周一的时间
  const startWeek = today.getTime() - (nowWeek === 0 ? 6 : nowWeek - 1) * oneDay
  return Number(date) >= startWeek && Number(date) <= startWeek + 7 * oneDay
}

export function formatShowDate(date: Date | string) {
  const source = date ? Number(new Date(date)) : Number(new Date())
  const now = Number(new Date())
  const diff = now - source
  const oneSeconds = 1000
  const oneMinute = oneSeconds * 60
  const oneHour = oneMinute * 60
  const oneDay = oneHour * 24
  const oneWeek = oneDay * 7
  if (diff < oneMinute) {
    return `${Math.floor(diff / oneSeconds)}秒前`
  }
  if (diff < oneHour) {
    return `${Math.floor(diff / oneMinute)}分钟前`
  }
  if (diff < oneDay) {
    return `${Math.floor(diff / oneHour)}小时前`
  }
  if (diff < oneWeek) {
    return `${Math.floor(diff / oneDay)}天前`
  }

  return formatDate(new Date(date), 'yyyy-MM-dd')
}

export function getImageUrl(image: ThemeableImage, isDarkMode: boolean): string {
  if (typeof image === 'string') {
    // 如果 ThemeableImage 类型为 string，则直接返回字符串
    return image
  }
  if ('src' in image) {
    // 如果 ThemeableImage 类型是一个对象，并且对象有 src 属性，则返回 src 属性对应的字符串
    return image.src
  }
  if ('light' in image && 'dark' in image) {
    // 如果 ThemeableImage 类型是一个对象，并且对象同时有 light 和 dark 属性，则根据 isDarkMode 返回对应的 URL
    return isDarkMode ? image.dark : image.light
  } // 如果 ThemeableImage 类型不是上述情况，则返回空字符串
  return ''
}

const pattern =
  /[a-zA-Z0-9_\u0392-\u03C9\u00C0-\u00FF\u0600-\u06FF\u0400-\u04FF]+|[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF\u3040-\u309F\uAC00-\uD7AF]+/g

// copy from https://github.com/youngjuning/vscode-juejin-wordcount/blob/main/count-word.ts
export function countWord(data: string) {
  const m = data.match(pattern)
  let count = 0
  if (!m) {
    return 0
  }
  for (let i = 0; i < m.length; i += 1) {
    if (m[i].charCodeAt(0) >= 0x4e00) {
      count += m[i].length
    } else {
      count += 1
    }
  }
  return count
}
