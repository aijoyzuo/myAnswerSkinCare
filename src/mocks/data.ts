export interface Product {
  id: string;
  title: string;
  category: string;
  origin_price: number;
  price: number;
  unit: string;
  description: string;
  content: string;
  is_enabled: 0 | 1;
  imageUrl: string;
  imagesUrl: string[];
}

export interface Coupon {
  id: string;
  title: string;
  is_enabled: 0 | 1;
  percent: number;
  due_date: number;
  code: string;
}

export interface OrderProduct {
  id: string;
  qty: number;
  final_total: number;
  product: Pick<Product, 'title' | 'imageUrl' | 'price'>;
}

export interface Order {
  id: string;
  user: { email: string; name: string; tel: string; address: string };
  message?: string;
  products: Record<string, OrderProduct>;
  total: number;
  final_total: number;
  is_paid: boolean;
  status: 0 | 1 | 2 | 3;
  create_at: number;
}

export const PRODUCTS: Product[] = [
  {
    id: 'p001',
    title: '乳酸煥膚安瓶精華',
    category: 'CREEKHEAL',
    origin_price: 2200,
    price: 1800,
    unit: '瓶',
    description: '適用於暗沉、粗糙肌膚，有效改善膚色不均',
    content: '主要成分：乳酸、玻尿酸、積雪草萃取\n使用方式：早晚潔臉後取適量輕拍全臉，待吸收後再進行後續保養。',
    is_enabled: 1,
    imageUrl: 'https://images.plurk.com/6XWOiDfQBBwxb6YZhlK7ci.jpg',
    imagesUrl: ['https://images.plurk.com/29tUBlaDuMWLswLO8BCIRB.jpg'],
  },
  {
    id: 'p002',
    title: '積雪草修護屏障霜',
    category: 'CREEKHEAL',
    origin_price: 1500,
    price: 1200,
    unit: '瓶',
    description: '適用於敏感、泛紅及術後修護肌膚',
    content: '主要成分：積雪草苷、神經醯胺、角鯊烷\n使用方式：取適量乳霜輕柔按摩於全臉，每日早晚使用。',
    is_enabled: 1,
    imageUrl: 'https://images.plurk.com/5HNo3sS0bTA2cNikyXwou5.jpg',
    imagesUrl: ['https://images.plurk.com/29tUBlaDuMWLswLO8BCIRB.jpg'],
  },
  {
    id: 'p003',
    title: '菸鹼醯胺 10% 美白精華',
    category: 'CREEKHEAL',
    origin_price: 1800,
    price: 1500,
    unit: '瓶',
    description: '高濃度菸鹼醯胺，縮毛孔、均膚色、抗氧化',
    content: '主要成分：菸鹼醯胺 10%、穿透型玻尿酸、維生素 E\n使用方式：化妝水後，取 2-3 滴按摩全臉，避開眼周。',
    is_enabled: 1,
    imageUrl: 'https://images.plurk.com/2rtSp3UorER1PK6XfLavOc.jpg',
    imagesUrl: ['https://images.plurk.com/29tUBlaDuMWLswLO8BCIRB.jpg','https://images.plurk.com/4ZQEgNXQBBn2VVU5X9c660.jpg'],
  },
  {
    id: 'p004',
    title: '玻尿酸深層保濕瓶',
    category: 'CW',
    origin_price: 1200,
    price: 980,
    unit: '盒（5片）',
    description: '三分子玻尿酸複合配方，一次補水直達角質層',
    content: '主要成分：大中小分子玻尿酸、B5 泛醇、蘆薈萃取\n使用方式：潔臉後敷上面膜 15-20 分鐘，取下後輕拍吸收，無需沖洗。',
    is_enabled: 1,
    imageUrl: 'https://images.plurk.com/6IxxShbueSPyHztJKH85F4.jpg',
    imagesUrl: ['https://images.plurk.com/29tUBlaDuMWLswLO8BCIRB.jpg','https://images.plurk.com/4ZQEgNXQBBn2VVU5X9c660.jpg'],
  },
  {
    id: 'p005',
    title: '神經醯胺屏障修護乳霜',
    category: 'CW',
    origin_price: 2800,
    price: 2200,
    unit: '罐',
    description: '強化角質屏障，改善乾燥脫屑與敏感泛紅',
    content: '主要成分：神經醯胺 1/3/6-II、膽固醇、游離脂肪酸\n使用方式：晚間潔臉後厚敷或日常薄塗均可。',
    is_enabled: 1,
    imageUrl: 'https://images.plurk.com/5Yhu2Hvax0Me9kNYR8v4Sl.jpg',
    imagesUrl: ['https://images.plurk.com/29tUBlaDuMWLswLO8BCIRB.jpg','https://images.plurk.com/4ZQEgNXQBBn2VVU5X9c660.jpg'],
  },
  {
    id: 'p006',
    title: 'A 醇 0.3% 煥膚夜間精華',
    category: 'CW',
    origin_price: 3500,
    price: 2800,
    unit: '瓶',
    description: '促進細胞更新、淡化細紋、改善膚質',
    content: '主要成分：視黃醇（A醇）0.3%、角鯊烷、生育醇\n使用方式：僅限夜間使用，初次使用建議隔週漸進，使用後請確實防曬。',
    is_enabled: 1,
    imageUrl: 'https://images.plurk.com/2KI4msI9AxeMYl5X7XcXw0.jpg',
    imagesUrl: ['https://images.plurk.com/29tUBlaDuMWLswLO8BCIRB.jpg','https://images.plurk.com/4ZQEgNXQBBn2VVU5X9c660.jpg','https://images.plurk.com/57hF5T6LBBozvkN2PsPgRP.jpg'],
  },
  {
    id: 'p007',
    title: '水楊酸 2% 毛孔調理化妝水',
    category: '安若淨',
    origin_price: 1100,
    price: 890,
    unit: '瓶',
    description: '深層清潔毛孔、軟化角栓、改善痘痘肌',
    content: '主要成分：水楊酸 2%、茶樹萃取、金縷梅\n使用方式：潔臉後以化妝棉沾取輕敷全臉，避開眼周，無需沖洗。',
    is_enabled: 1,
    imageUrl: 'https://images.plurk.com/77KCfsG6xojUw3J3woif5J.jpg',
    imagesUrl: ['https://images.plurk.com/29tUBlaDuMWLswLO8BCIRB.jpg'],
  },
  {
    id: 'p008',
    title: '杜鵑花酸 10% 抗痘精華',
    category: '安若淨',
    origin_price: 1400,
    price: 1100,
    unit: '瓶',
    description: '抗菌、調理油脂分泌、淡化痘疤色沉',
    content: '主要成分：杜鵑花酸 10%、菸鹼醯胺、積雪草\n使用方式：局部點塗於痘痘或痘疤部位，每日早晚各一次。',
    is_enabled: 1,
    imageUrl: 'https://images.plurk.com/6yLkqrUVtOumSWKl3zEimI.jpg',
    imagesUrl: ['https://images.plurk.com/29tUBlaDuMWLswLO8BCIRB.jpg'],
  },
  {
    id: 'p009',
    title: '胺基酸溫和淨膚潔顏慕斯',
    category: '安若淨',
    origin_price: 850,
    price: 680,
    unit: '瓶',
    description: '低刺激胺基酸界面活性劑，洗後不緊繃',
    content: '主要成分：椰油醯甘胺酸鈉、PCA 保濕因子、蘆薈\n使用方式：取適量泡沫於濕潤臉部輕柔按摩，以清水沖淨。',
    is_enabled: 1,
    imageUrl: 'https://images.plurk.com/3LlExupCEzoAcB3a3u1U7H.jpg',
    imagesUrl: ['https://images.plurk.com/4ZQEgNXQBBn2VVU5X9c660.jpg',' https://images.plurk.com/57hF5T6LBBozvkN2PsPgRP.jpg'],
  },
  {
    id: 'p010',
    title: '醫美級玻尿酸修護精華',
    category: 'TEOXANE',
    origin_price: 5200,
    price: 3800,
    unit: '瓶',
    description: '醫美療程後修護首選，密集補水並鞏固肌膚',
    content: '主要成分：TEOSYAL RHA 玻尿酸複合體、肽類、胺基酸\n使用方式：療程後立即使用，取適量均勻塗抹，每日早晚持續使用。',
    is_enabled: 1,
    imageUrl: 'https://images.plurk.com/1ganHsczmBNptktSIoIGhy.jpg',
    imagesUrl: ['https://images.plurk.com/1ganHsczmBNptktSIoIGhy.jpg'],
  },
  {
    id: 'p011',
    title: '抗老緊緻提拉乳霜',
    category: 'TEOXANE',
    origin_price: 5800,
    price: 4200,
    unit: '罐',
    description: '針對鬆弛、細紋、肌膚老化的全效抗老乳霜',
    content: '主要成分：RHA 玻尿酸、視黃醇衍生物、多胜肽複合物\n使用方式：晚間取適量乳霜以由下往上手法按摩全臉及頸部。',
    is_enabled: 1,
    imageUrl: 'https://images.plurk.com/45zyMIqTcAbaokuhgZlYh5.jpg',
    imagesUrl: ['https://images.plurk.com/4ZQEgNXQBBn2VVU5X9c660.jpg',' https://images.plurk.com/57hF5T6LBBozvkN2PsPgRP.jpg'],
  },
  {
    id: 'p012',
    title: '敏感肌舒緩修護精華',
    category: 'TEOXANE',
    origin_price: 4000,
    price: 2900,
    unit: '瓶',
    description: '專為敏感、雷射術後設計，快速舒緩泛紅不適',
    content: '主要成分：低分子玻尿酸、β-葡聚糖、馬齒莧萃取\n使用方式：早晚各一次，取適量輕拍於全臉，可作為急救保養。',
    is_enabled: 1,
    imageUrl: 'https://images.plurk.com/48FGzs274NrleAAeZJDLHj.jpg',
    imagesUrl: ['https://images.plurk.com/4ZQEgNXQBBn2VVU5X9c660.jpg',' https://images.plurk.com/57hF5T6LBBozvkN2PsPgRP.jpg'],
  },
  {
    id: 'p013',
    title: '敏感肌舒緩防曬',
    category: 'TEOXANE',
    origin_price: 4000,
    price: 2900,
    unit: '瓶',
    description: '專為敏感、雷射術後設計，快速舒緩泛紅不適',
    content: '主要成分：低分子玻尿酸、β-葡聚糖、馬齒莧萃取\n使用方式：早晚各一次，取適量輕拍於全臉，可作為急救保養。',
    is_enabled: 1,
    imageUrl: 'https://images.plurk.com/5sJ1d23zOhoJuOTiGtEPX6.jpg',
    imagesUrl: ['https://images.plurk.com/2VaKa2bIigwpwsD0xqzYXw.jpg','https://images.plurk.com/29tUBlaDuMWLswLO8BCIRB.jpg'],
  },
];

export const COUPONS: Coupon[] = [
  {
    id: 'c001',
    title: '新戶 9 折優惠',
    is_enabled: 1,
    percent: 90,
    due_date: Math.floor(new Date('2026-12-31').getTime() / 1000),
    code: 'happy99',
  },
  {
    id: 'c002',
    title: '夏日 8 折特惠',
    is_enabled: 1,
    percent: 80,
    due_date: Math.floor(new Date('2026-09-30').getTime() / 1000),
    code: 'SUMMER80',
  },
];

export const SAMPLE_ORDERS: Order[] = [
  {
    id: 'order-001',
    user: { email: 'alice@example.com', name: '王小美', tel: '0912345678', address: '台北市信義區松仁路100號' },
    message: '請盡快出貨，謝謝',
    products: {
      op001: { id: 'op001', qty: 2, final_total: 3600, product: { title: '乳酸煥膚安瓶精華', imageUrl: 'https://images.plurk.com/52b9CUh5PAv7UT3ScyjoTk.jpg', price: 1800 } },
    },
    total: 3600,
    final_total: 3600,
    is_paid: true,
    status: 2,
    create_at: Math.floor(Date.now() / 1000) - 86400,
  },
  {
    id: 'order-002',
    user: { email: 'bob@example.com', name: '林大偉', tel: '0987654321', address: '台中市西屯區台灣大道三段500號' },
    products: {
      op002: { id: 'op002', qty: 1, final_total: 980, product: { title: '玻尿酸深層保濕面膜', imageUrl: 'https://images.plurk.com/1veIPKryoFI4q7hdnsf805.png', price: 980 } },
      op003: { id: 'op003', qty: 1, final_total: 890, product: { title: '水楊酸 2% 毛孔調理化妝水', imageUrl: 'https://images.plurk.com/40qerbg5Oa6tDpZGTfO7zb.png', price: 890 } },
    },
    total: 1870,
    final_total: 1683,
    is_paid: false,
    status: 0,
    create_at: Math.floor(Date.now() / 1000) - 3600,
  },
];
