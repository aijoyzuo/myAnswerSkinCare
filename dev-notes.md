# 開發筆記：ANSWER 肌膚管理中心

> 記錄開發過程中的技術決策與踩坑經驗，供面試準備與未來回顧使用。

---

## 1. Context → Redux Toolkit 遷移

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

## 2. MSW (Mock Service Worker) 使用說明

**為什麼用 MSW？**  
原本串接六角學院的教學 API，課程結束後 API 停用。改用 MSW 在瀏覽器端以 Service Worker 攔截所有請求，回傳 in-memory 假資料，React 元件完全不需修改，因為回應格式與真實 API 完全相同。

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

## 3. MSW Service Worker Scope 問題

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
