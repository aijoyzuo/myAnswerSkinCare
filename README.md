# ANSWER 肌膚管理中心

電商購物網站，模擬肌膚管理中心的線上商城，涵蓋前台購物流程與後台管理功能。

**Live Demo：** https://aijoyzuo.github.io/myAnswerSkinCare

---

## 功能介紹

### 前台

- **首頁**：品牌介紹、醫師團隊輪播、分類導覽、熱門商品、訂閱電子報
- **產品列表**：關鍵字搜尋、品牌分類篩選、分頁、加入購物車、心動清單
- **產品詳情**：圖片輪播、相關商品推薦、數量選擇、加入購物車
- **購物車**：商品數量調整、刪除、套用優惠券
- **結帳**：訂單填寫（React Hook Form 表單驗證）、訂單送出
- **心動清單**：本地端收藏，重整頁面仍保留（localStorage）
- **服務項目**：診所服務介紹頁

### 後台（需登入）

- **產品管理**：新增 / 編輯 / 刪除產品、圖片上傳
- **優惠券管理**：新增 / 編輯 / 刪除優惠券、啟用狀態切換
- **訂單管理**：查看訂單列表、編輯付款狀態

---

## 技術棧

| 類別 | 套件 |
|------|------|
| 框架 | React 19、TypeScript |
| 路由 | React Router v7 |
| 狀態管理 | React Context + useReducer |
| 表單驗證 | React Hook Form |
| HTTP | Axios |
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
├── context/         # React Context（訊息通知、Toast、心動清單）
├── pages/
│   ├── front/       # 前台頁面
│   └── admin/       # 後台頁面
├── types/           # TypeScript 型別定義
└── hook/            # 自訂 Hook
```

---

## 本地啟動

### 前置需求

- Node.js 18+
- 串接 [六角學院 API](https://hexschool.github.io/ec-courses-api-swaggerDoc/) 或自行準備後端

### 安裝與執行

```bash
# 安裝依賴
npm install

# 建立環境變數檔
# 在根目錄新增 .env，填入以下內容：
REACT_APP_API_URL=https://ec-course-api.hexschool.io
REACT_APP_API_PATH=your_api_path

# 啟動開發伺服器
npm start
```

### 部署至 GitHub Pages

```bash
npm run deploy
```

---

## 環境變數說明

| 變數名稱 | 說明 |
|----------|------|
| `REACT_APP_API_URL` | API 伺服器位址 |
| `REACT_APP_API_PATH` | 個人 API Path（六角學院後台取得） |

---

## 作者

**aijoyzuo**  
GitHub：[@aijoyzuo](https://github.com/aijoyzuo)
