# 面試作品集：ANSWER 肌膚管理中心

> 此文件供 Claude.ai 面試準備 Project 使用。記錄專案技術決策、解決過的問題、與可在面試中展開說明的亮點。

---

## 專案概要

**專案名稱：** ANSWER 肌膚管理中心  
**類型：** 電商購物網站（前台 + 後台管理）  
**Live Demo：** https://aijoyzuo.github.io/myAnswerSkinCare  
**GitHub：** https://github.com/aijoyzuo/myAnswerSkinCare  
**完成時間：** 2026 年 7 月（持續維護）

**一句話介紹：**  
以 React 19 + TypeScript 建立的全端電商作品，使用 MSW (Mock Service Worker) 完全取代真實後端 API，讓作品集可在無後端環境下完整 demo 所有功能。

---

## 技術棧

| 類別 | 技術 |
|------|------|
| 框架 | React 19、TypeScript |
| 建置工具 | Create React App (react-scripts 5) |
| 路由 | React Router v7（HashRouter，適配 GitHub Pages） |
| 狀態管理 | Redux Toolkit（messageSlice、wishListSlice） |
| API Mock | MSW v2（Mock Service Worker） |
| 表單驗證 | React Hook Form |
| 動畫 | Motion v12（`motion/react`，即 Framer Motion 新版） |
| UI 框架 | Bootstrap 5、React Bootstrap |
| 提示訊息 | SweetAlert2（以 Context 封裝） |
| 部署 | GitHub Pages（`gh-pages`） |

---

## 功能清單

### 前台
- 首頁：品牌介紹、醫師團隊輪播、分類導覽、熱門商品
- 產品列表：關鍵字搜尋、品牌篩選、分頁、加入購物車、心動清單
- 產品詳情：圖片輪播、相關商品、數量選擇
- 購物車：數量調整、刪除、套用優惠碼
- 結帳：React Hook Form 表單驗證、訂單送出
- 心動清單：localStorage 持久化（重整仍保留）

### 後台（需登入）
- 產品管理：新增 / 編輯 / 刪除、圖片上傳
- 優惠券管理：新增 / 編輯 / 刪除、啟用狀態切換
- 訂單管理：查看列表、編輯付款狀態

---

## 技術決策說明（面試口答重點）

### 1. 為什麼用 MSW？

**背景：** 原本串接六角學院的教學 API，課程結束後 API 停用，作品集無法正常展示。

**決策：** 改用 MSW v2，在瀏覽器端以 Service Worker 攔截所有 fetch/XHR 請求，回傳 in-memory 假資料，React 元件完全不需要修改，因為回應格式與真實 API 完全相同。

**優點：**
- 無需後端，作品集可 100% 離線 demo
- 假資料與真實 API 格式一致，未來要切回真實 API 只需改環境變數
- `onUnhandledRequest: 'bypass'` 設定讓未攔截的請求直接放行，不會干擾其他功能

**口答範例：**  
「因為原本的教學 API 停用了，我選擇用 MSW 在瀏覽器端模擬整個後端。MSW 的設計很優雅，它是用 Service Worker 攔截請求，React 元件根本不知道回應來自假資料還是真實後端，這讓我未來可以隨時切換到真實 API，只要改一行環境變數就好。」

---

### 2. 為什麼從 Context 遷移到 Redux Toolkit？

**背景：** 初期用 React Context + useReducer 管理 toast 訊息與心動清單，隨頁面增多，跨層傳遞 dispatch 越來越繁瑣，且 Context 每次狀態更新會重新渲染整個 Provider 樹。

**決策：** 將 `messageContext` 與 `wishListContext` 改用 Redux Toolkit 管理。

| 面向 | Context | Redux Toolkit |
|------|---------|---------------|
| 狀態定義 | `createContext` + `useReducer` | `createSlice` 自動產生 actions |
| 取值 | `useContext(XxxContext)` | `useAppSelector(state => state.xxx)` |
| 更新 | `dispatch({ type: 'ACTION', payload })` | `dispatch(actionCreator(payload))` |
| 持久化 | 手動實作 | wishListSlice 搭配 localStorage subscriber |

**保留 Context 的地方：**  
Toast（SweetAlert2）這種「只需要在 UI 層觸發、不需要跨頁共享」的功能，Context 更輕量，因此 `toastContext.tsx` 保留。

**口答範例：**  
「我這個專案一開始全部用 Context，後來頁面越來越多，發現每次更新 Context 都會導致整個 Provider 樹重渲染，而且要在很深的子元件拿 dispatch 很麻煩。我把需要跨頁共享的狀態改成 Redux Toolkit，但像 Toast 這種只在同一層觸發的，就保留 Context，選擇適合的工具。」

---

### 3. 解決了什麼坑？（展現 debug 能力）

#### MSW Service Worker Scope 問題（最有說服力的亮點）

**症狀：** 本機開發時商品列表空白，console 出現：
```
[MSW] Cannot intercept requests on this page because it's outside of the worker's scope
```

**根本原因（需理解整條因果鏈）：**
```
package.json → "homepage": "https://aijoyzuo.github.io/myAnswerSkinCare"
    ↓
CRA 讀取 homepage → 設定 PUBLIC_URL = /myAnswerSkinCare（連開發環境也一起套用）
    ↓
mockServiceWorker.js 掛在 /myAnswerSkinCare/mockServiceWorker.js
    ↓
Service Worker 的 scope 預設為腳本所在路徑 → scope = /myAnswerSkinCare/
    ↓
本機 App 跑在 localhost:3000/（根路徑）→ 在 scope 之外，無法攔截任何請求
```

**解法：兩個檔案協作**

1. `src/setupProxy.js`（CRA 的 Express middleware hook）：
   - 讓 dev server 把 SW 腳本暴露在根路徑 `/mockServiceWorker.js`
   - 加上 `Service-Worker-Allowed: /` header，允許 scope 超出腳本實際位置

2. `src/index.tsx`：
   - 開發環境用 `/mockServiceWorker.js`（根路徑）
   - 生產環境用 `${PUBLIC_URL}/mockServiceWorker.js`（維持 GitHub Pages 正確路徑）

**口答範例：**  
「我遇到一個很有趣的 bug，商品列表空白，但資料明明有設定 MSW 假資料。後來追蹤到根本原因是：CRA 在有設 homepage 欄位的時候，連開發環境也會把 PUBLIC_URL 設成子路徑，導致 Service Worker 的 scope 不包含 localhost 根路徑，MSW 就攔截不到任何請求。我用 CRA 的 setupProxy.js 機制，讓 dev server 自己把 SW 腳本轉發到根路徑，並且加上 Service-Worker-Allowed header 放寬 scope，才把問題完全解決。這讓我對 Service Worker scope 的運作機制理解更深。」

---

## 動畫實作細節

### 頁面切換 fade 轉場
- 使用 `AnimatePresence` + `motion.main`，`key={location.pathname}`
- `mode="wait"` 確保舊頁面完全淡出後新頁面才進入

### 商品列表 stagger 動畫
- 每張卡片直接設 `delay: index * 0.07`（**不用** variant 繼承）
- 原因：products 是非同步載入，若用 parent motion.div 的 variant 傳遞，parent 在資料為空時就已執行動畫，資料載入後子元件不會重新觸發 initial hidden 狀態

---

## 可展示的測試資料

| 項目 | 內容 |
|------|------|
| 後台帳號 | 任意 email + 任意非空密碼 |
| 優惠碼 | `happy99`（9折）、`SUMMER80`（8折） |
| 商品數量 | 12 件（CREEKHEAL、CW、安若淨、TEOXANE 各 3 件） |

> 購物車、訂單等狀態頁面重整後重置（in-memory）；心動清單重整後保留（localStorage）。

---

## 這個專案展現的能力

1. **前後台完整流程**：不只有前台 CRUD，後台管理功能也完整實作
2. **狀態管理選型判斷**：Context vs Redux 根據需求選擇，不一刀切
3. **Debug 能力**：能從症狀追到 CRA + Service Worker + scope 的底層機制
4. **部署經驗**：GitHub Pages + HashRouter + PUBLIC_URL 的 SPA 部署完整流程
5. **動畫細節**：理解非同步資料與動畫 timing 的交互問題，選擇正確解法
