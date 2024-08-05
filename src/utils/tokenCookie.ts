/*
Date 物件本身的設計，我們無法直接修改它的內部值，因此，想要對一個日期進行修改或計算時，通常會：
1. 複製一個新的 Date 物件： 這樣就可以在不影響原始資料的情況下進行操作
2. 使用 setTime()： 將新的 Date 物件的時間設置為我們想要的數值
這個數值可以是：
另一個 Date 物件的時間戳：直接複製另一個日期的時間
計算得到的新的時間戳：通過加减毫秒數來實現對日期的加減操作

const originalDate = new Date(); // 當前時間格式 "2024-08-05T02:40:14.028Z"
const newDate = new Date(originalDate.getTime()); // 複製一個新的日期 = new Date(當前時間的毫秒數)
newDate.setTime(newDate.getTime() + 24 * 60 * 60 * 1000); // 當前時間的毫秒數 + 一天的毫秒數

時間戳：自世界協調時間（Coordinated Universal Time) 1970年1月1日00:00:00.000起的毫秒數
new Date() 如不指定時間，自動獲取系統的當前時間
new Date(milliseconds) 傳入 Timestamp 建立特定時間點的 Date 物件
getTime() 返回當前時間累積的毫秒數
setTime(毫秒數) 用指定的毫秒數來設定 Date 物件內部儲存的時間戳(毫秒數)
*/
// path=/: 指定 cookie 對整個網站有效
// HttpOnly: 防止通過 JavaScript 訪問 cookie，增加安全性
// Secure: 只在 HTTPS 連接中傳輸 cookie
// SameSite=Strict: 防止跨站請求攜帶 cookie，增加安全性
import axios from 'axios'

export function setTokenCookie(token: string, days: number): void {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = 'expires=' + date.toUTCString()
  document.cookie = `myToken=${token}; ${expires}`
}

export function getTokenCookie(): string {
  const token: string = document.cookie.replace(
    /(?:(?:^|.*;\s*)myToken\s*=\s*([^;]*).*$)|^.*$/,
    '$1'
  )
  if (token) {
    axios.defaults.headers.common['Authorization'] = token
  }
  return token
}

export function deleteTokenCookie(): void {
  document.cookie = `myToken=; expires=`
}
