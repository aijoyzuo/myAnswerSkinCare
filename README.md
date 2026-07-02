# ANSWER 肌膚管理中心

電商購物網站，模擬肌膚管理中心的線上商城，涵蓋前台購物流程與後台管理功能。  
使用 **MSW (Mock Service Worker)** 攔截 API 請求並回傳假資料，無需後端即可完整 demo 所有功能。

**Live Demo：** https://aijoyzuo.github.io/myAnswerSkinCare

---

## 功能介紹

### 前台

- **首頁**：品牌介紹、醫師團隊輪播、分類導覽、熱門商品、訂閱電子報
- **產品列表**：關鍵字搜尋、品牌分類篩選、分頁、加入購物車、心動清單
- **產品詳情**：圖片輪播、相關商品推薦、數量選擇、加入購物車
- **購物車**：商品數量調整、刪除、套用優惠券
- **結帳**：訂單填寫（React Hook Form 表單驗證）、訂單送出
- **心動清單**：本地端收藏，重整頁面仍保留（localStorage + Redux）
- **服務項目**：診所服務介紹頁

### 後台（需登入）

- **產品管理**：新增 / 編輯 / 刪除產品、圖片上傳
- **優惠券管理**：新增 / 編輯 / 刪除優惠券、啟用狀態切換
- **訂單管理**：查看訂單列表、編輯付款狀態

---

## Demo 帳號與測試資料

> 以下資料由 MSW 提供，頁面重整後恢復預設（購物車、訂單），心動清單除外（localStorage 持久化）。

### 後台登入

| 欄位 | 值 |
|------|----|
| Email | 任意格式皆可（例如 `admin@answer.com`） |
| 密碼 | 任意非空白字串（例如 `admin123`） |

### 優惠碼

| 代碼 | 折扣 | 說明 |
|------|------|------|
| `happy99` | 9 折 | 新戶優惠（對應首頁跑馬燈） |
| `SUMMER80` | 8 折 | 夏日特惠 |

### 預設商品（共 12 件）

| 品牌 | 商品數 |
|------|--------|
| CREEKHEAL | 3 件 |
| CW | 3 件 |
| 安若淨 | 3 件 |
| TEOXANE | 3 件 |

---

## 技術棧

| 類別 | 套件 |
|------|------|
| 框架 | React 19、TypeScript |
| 路由 | React Router v7 |
| 狀態管理 | Redux Toolkit、React Redux |
| 表單驗證 | React Hook Form |
| HTTP | Axios |
| API Mock | MSW (Mock Service Worker) v2 |
| UI 框架 | Bootstrap 5、React Bootstrap |
| 動畫 | Motion (Framer Motion v12) |
| 提示訊息 | SweetAlert2 |
| 圖片輪播 | Swiper |
| 樣式 | SCSS |
| 部署 | GitHub Pages |

---

## 專案結構

```
src/
├── assets/          # 全域 SCSS、靜態資源
├── components/      # 共用元件（Navbar、Modal、Pagination 等）
├── context/         # Toast Context（SweetAlert2 封裝）
├── hook/            # 自訂 Hook（useWishList 封裝 Redux）
├── store/           # Redux store（messageSlice、wishListSlice）
├── mocks/           # MSW 假資料層
│   ├── data.ts      # 靜態假資料（商品、優惠券、訂單）
│   ├── handlers.ts  # API handler（覆蓋所有前後台 endpoint）
│   └── browser.ts   # Service Worker 啟動設定
├── pages/
│   ├── front/       # 前台頁面
│   └── admin/       # 後台頁面
├── setupProxy.js    # CRA 開發伺服器 proxy（修正 MSW scope 問題）
└── types/           # TypeScript 型別定義
```

---

## 本地啟動

### 前置需求

- Node.js 18+

### 安裝與執行

```bash
# 1. Clone 專案
git clone https://github.com/aijoyzuo/myAnswerSkinCare.git
cd myAnswerSkinCare

# 2. 安裝依賴
npm install

# 3. 複製環境變數範本
cp .env.example .env

# 4. 啟動開發伺服器（MSW 會自動攔截所有 API 請求）
npm start
```

啟動後開啟 `http://localhost:3000`，瀏覽器 console 會顯示：

```
[MSW] Mocking enabled.
```

代表假資料層已成功啟動。

### 切換為真實 API（選用）

若有六角學院的 API 帳號，可將 `.env` 改為以下設定：

```env
REACT_APP_API_URL=https://ec-course-api.hexschool.io
REACT_APP_API_PATH=你的專屬路徑
```

修改後重新啟動即可切換至真實後端，MSW 設定 `onUnhandledRequest: 'bypass'` 會自動放行未被攔截的請求。

### 部署至 GitHub Pages

```bash
npm run deploy
```

---

## 環境變數說明

參考 `.env.example`：

| 變數名稱 | 預設值（MSW 模式） | 說明 |
|----------|-------------------|------|
| `REACT_APP_API_URL` | 空字串 | API 伺服器位址，空字串表示使用相對路徑 |
| `REACT_APP_API_PATH` | `mock-demo` | API Path，MSW handler 以萬用符號 `:apiPath` 匹配，任意值均可 |

---

## 開發筆記

### 1. Context → Redux Toolkit 遷移

**為什麼遷移？**  
專案初期用 React Context + useReducer 管理 toast 訊息與心動清單，隨著頁面增多，跨層傳遞 dispatch 的程式碼變得繁瑣，且 Context 每次更新會重新渲染整個 Provider 樹。

**遷移重點：**

| 面向 | Context 做法 | Redux Toolkit 做法 |
|------|-------------|-------------------|
| 狀態定義 | `createContext` + `useReducer` | `createSlice` 自動產生 actions |
| 取值 | `useContext(XxxContext)` | `useAppSelector(state => state.xxx)` |
| 更新 | `dispatch({ type: 'ACTION', payload })` | `dispatch(actionCreator(payload))` |
| 副作用（自動清除） | `useEffect` 在 Provider 內 | slice 外的 helper function 搭配 `setTimeout` |
| 持久化 | 手動實作 | `wishListSlice` 搭配 localStorage，在 subscriber 自動同步 |

**保留 Context 的時機：**  
Toast（SweetAlert2）這類「不需要跨頁共享、只需要在當前 UI 層觸發」的功能，用 Context 反而更輕量，因此 `toastContext.tsx` 保留下來。

---

### 2. MSW (Mock Service Worker) 使用說明

**架構：**

```
瀏覽器 fetch/XHR
    ↓
Service Worker（攔截）
    ↓
src/mocks/handlers.ts（比對 URL → 回傳假資料）
    ↓
React 元件收到回應（與真實 API 格式相同）
```

**設定流程：**

1. `npx msw init public/` — 產生 `public/mockServiceWorker.js`
2. `src/mocks/browser.ts` — `setupWorker(...handlers)` 組合所有 handler
3. `src/index.tsx` — `enableMocking().then(() => root.render(...))` 確保 SW 啟動後才渲染 App
4. `src/mocks/handlers.ts` — 用 `http.get / post / put / delete` 定義每個 endpoint 的假回應
5. `src/mocks/data.ts` — 假資料常數，handlers 使用 in-memory 陣列，每次重整重置

**Handler 撰寫範例：**

```typescript
http.get('/v2/api/:apiPath/products', ({ request, params }) => {
  const page = Number(new URL(request.url).searchParams.get('page') ?? 1);
  const { items, pagination } = paginate(products, page);
  return HttpResponse.json({ success: true, products: items, pagination });
}),
```

---

### 3. MSW Service Worker Scope 問題

**問題描述：**  
本機開發時商品列表空白，瀏覽器 console 出現：

```
[MSW] Cannot intercept requests on this page because it's outside of the worker's scope ("http://localhost:3000/myAnswerSkinCare/")
```

**根本原因：**

```
package.json → "homepage": "https://aijoyzuo.github.io/myAnswerSkinCare"
                        ↓
CRA 讀取 homepage 設定 PUBLIC_URL = /myAnswerSkinCare
                        ↓
public/ 靜態檔案掛在 /myAnswerSkinCare/ 路徑（含 mockServiceWorker.js）
                        ↓
SW 的 scope 預設為腳本所在路徑 → scope = /myAnswerSkinCare/
                        ↓
本機 App 跑在 localhost:3000/（根路徑）→ 在 scope 之外，無法攔截
```

**解法（兩個檔案）：**

`src/setupProxy.js`（讓 CRA dev server 將 SW 腳本暴露在根路徑並給予更寬 scope 權限）：
```js
module.exports = function (app) {
  app.get('/mockServiceWorker.js', (req, res) => {
    const swPath = path.join(__dirname, '..', 'public', 'mockServiceWorker.js');
    res.set('Content-Type', 'application/javascript');
    res.set('Service-Worker-Allowed', '/');  // 允許 scope 超出腳本路徑
    res.sendFile(swPath);
  });
};
```

`src/index.tsx`（開發環境用根路徑，生產環境維持 PUBLIC_URL）：
```ts
const swUrl = process.env.NODE_ENV === 'development'
  ? '/mockServiceWorker.js'
  : `${process.env.PUBLIC_URL}/mockServiceWorker.js`;
```

**下次遇到類似問題的排查步驟：**

1. 打開瀏覽器 DevTools → Application → Service Workers，確認 SW 是否已啟動
2. 看 console 有無 `[MSW] Mocking enabled` 或 `[MSW] Cannot intercept` 錯誤
3. 若有 scope 錯誤，確認 `PUBLIC_URL` 的值（`console.log(process.env.PUBLIC_URL)`）
4. 若 `PUBLIC_URL` 非空，需同時調整 SW 腳本路徑與 scope（setupProxy + Service-Worker-Allowed header）
5. 部署到子路徑的 SPA（GitHub Pages / Nginx 子目錄）都可能遇到此問題

---

## 作者

**aijoyzuo**  
GitHub：[@aijoyzuo](https://github.com/aijoyzuo)
