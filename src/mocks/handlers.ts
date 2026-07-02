import { http, HttpResponse } from 'msw';
import { PRODUCTS, COUPONS, SAMPLE_ORDERS } from './data';
import type { Product, Coupon, Order } from './data';

// ── In-memory state（每次重整重置） ──────────────────────────
let products: Product[] = [...PRODUCTS];
let coupons: Coupon[] = [...COUPONS];
let orders: Order[] = [...SAMPLE_ORDERS];

interface CartItem {
  id: string;
  product_id: string;
  qty: number;
  total: number;
  final_total: number;
  product: Product;
}

let cart: CartItem[] = [];
let appliedCouponPercent = 100; // 100 = 無折扣

const calcCart = () => {
  const total = cart.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const final_total = Math.round(total * appliedCouponPercent / 100);
  cart = cart.map((item) => ({
    ...item,
    total: item.product.price * item.qty,
    final_total: Math.round(item.product.price * item.qty * appliedCouponPercent / 100),
  }));
  return { total, final_total };
};

const uuid = () => Math.random().toString(36).slice(2, 10);

const ITEMS_PER_PAGE = 5;
const paginate = <T>(list: T[], page: number) => {
  const total_pages = Math.max(1, Math.ceil(list.length / ITEMS_PER_PAGE));
  const current_page = Math.min(Math.max(1, page), total_pages);
  const start = (current_page - 1) * ITEMS_PER_PAGE;
  return {
    items: list.slice(start, start + ITEMS_PER_PAGE),
    pagination: {
      total_pages,
      current_page,
      has_pre: current_page > 1,
      has_next: current_page < total_pages,
      category: null,
    },
  };
};

// ── Handlers ─────────────────────────────────────────────────
export const handlers = [

  // ── 登入 ──
  http.post('/v2/admin/signin', async ({ request }) => {
    const body = await request.json() as { username?: string; password?: string };
    if (!body.username || !body.password) {
      return HttpResponse.json({ success: false, message: '帳號或密碼不得為空' }, { status: 400 });
    }
    const expires = Date.now() + 1000 * 60 * 60 * 8; // 8 小時
    return HttpResponse.json({
      success: true,
      message: '登入成功',
      token: `mock-token-${uuid()}`,
      expired: expires,
    });
  }),

  // ── 驗證 token ──
  http.post('/v2/api/user/check', () => {
    return HttpResponse.json({ success: true, message: 'Token 驗證成功' });
  }),

  // ── 前台：取得商品列表（分頁） ──
  http.get('/v2/api/:apiPath/products', ({ request, params }) => {
    if (String(params.apiPath).startsWith('admin')) return;
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const enabled = products.filter((p) => p.is_enabled === 1);
    const { items, pagination } = paginate(enabled, page);
    return HttpResponse.json({ success: true, products: items, pagination });
  }),

  // ── 前台：取得所有商品（不分頁） ──
  http.get('/v2/api/:apiPath/products/all', () => {
    const enabled = products.filter((p) => p.is_enabled === 1);
    return HttpResponse.json({ success: true, products: enabled });
  }),

  // ── 前台：取得單一商品 ──
  http.get('/v2/api/:apiPath/product/:id', ({ params }) => {
    const product = products.find((p) => p.id === params.id);
    if (!product) return HttpResponse.json({ success: false, message: '找不到商品' }, { status: 404 });
    return HttpResponse.json({ success: true, product });
  }),

  // ── 購物車：取得 ──
  http.get('/v2/api/:apiPath/cart', () => {
    const { total, final_total } = calcCart();
    return HttpResponse.json({ success: true, data: { carts: cart, total, final_total } });
  }),

  // ── 購物車：加入 ──
  http.post('/v2/api/:apiPath/cart', async ({ request }) => {
    const body = await request.json() as { data?: { product_id?: string; qty?: number } };
    const { product_id, qty = 1 } = body?.data ?? {};
    const product = products.find((p) => p.id === product_id);
    if (!product) return HttpResponse.json({ success: false, message: '商品不存在' }, { status: 404 });

    const existing = cart.find((c) => c.product_id === product_id);
    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        id: uuid(),
        product_id: product.id,
        qty,
        total: product.price * qty,
        final_total: product.price * qty,
        product,
      });
    }
    calcCart();
    return HttpResponse.json({ success: true, message: `已加入購物車：${product.title}` });
  }),

  // ── 購物車：更新數量 ──
  http.put('/v2/api/:apiPath/cart/:id', async ({ params, request }) => {
    const body = await request.json() as { data?: { product_id?: string; qty?: number } };
    const { qty = 1 } = body?.data ?? {};
    const item = cart.find((c) => c.id === params.id);
    if (!item) return HttpResponse.json({ success: false, message: '找不到購物車項目' }, { status: 404 });
    item.qty = qty;
    calcCart();
    return HttpResponse.json({ success: true, message: '已更新數量' });
  }),

  // ── 購物車：刪除單項 ──
  http.delete('/v2/api/:apiPath/cart/:id', ({ params }) => {
    const idx = cart.findIndex((c) => c.id === params.id);
    if (idx === -1) return HttpResponse.json({ success: false, message: '找不到項目' }, { status: 404 });
    cart.splice(idx, 1);
    if (cart.length === 0) appliedCouponPercent = 100;
    calcCart();
    return HttpResponse.json({ success: true, message: '已刪除' });
  }),

  // ── 套用優惠券 ──
  http.post('/v2/api/:apiPath/coupon', async ({ request }) => {
    const body = await request.json() as { data?: { code?: string } };
    const code = body?.data?.code?.trim() ?? '';
    const coupon = coupons.find((c) => c.code === code && c.is_enabled === 1);
    if (!coupon) return HttpResponse.json({ success: false, message: '優惠碼無效或已過期' }, { status: 404 });
    appliedCouponPercent = coupon.percent;
    calcCart();
    return HttpResponse.json({ success: true, message: `已套用「${coupon.title}」，享 ${coupon.percent} 折` });
  }),

  // ── 建立訂單 ──
  http.post('/v2/api/:apiPath/order', async ({ request }) => {
    const body = await request.json() as { data?: { user?: Order['user']; message?: string } };
    const { total, final_total } = calcCart();
    const newOrder: Order = {
      id: `order-${uuid()}`,
      user: body?.data?.user ?? { email: '', name: '', tel: '', address: '' },
      message: body?.data?.message,
      products: Object.fromEntries(
        cart.map((item) => [
          item.id,
          { id: item.id, qty: item.qty, final_total: item.final_total, product: { title: item.product.title, imageUrl: item.product.imageUrl, price: item.product.price } },
        ])
      ),
      total,
      final_total,
      is_paid: false,
      status: 0,
      create_at: Math.floor(Date.now() / 1000),
    };
    orders.unshift(newOrder);
    cart = [];
    appliedCouponPercent = 100;
    return HttpResponse.json({ success: true, orderId: newOrder.id, message: '訂單建立成功' });
  }),

  // ── 取得單一訂單 ──
  http.get('/v2/api/:apiPath/order/:orderId', ({ params }) => {
    const order = orders.find((o) => o.id === params.orderId);
    if (!order) return HttpResponse.json({ success: false, message: '找不到訂單' }, { status: 404 });
    return HttpResponse.json({ success: true, order });
  }),

  // ── 後台：產品列表（分頁） ──
  http.get('/v2/api/:apiPath/admin/products', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const { items, pagination } = paginate(products, page);
    return HttpResponse.json({ success: true, products: items, pagination });
  }),

  // ── 後台：新增產品 ──
  http.post('/v2/api/:apiPath/admin/product', async ({ request }) => {
    const body = await request.json() as { data?: Partial<Product> };
    const newProduct: Product = {
      id: uuid(),
      title: '', category: '', origin_price: 0, price: 0,
      unit: '個', description: '', content: '', is_enabled: 1,
      imageUrl: '', imagesUrl: [],
      ...body?.data,
    };
    products.unshift(newProduct);
    return HttpResponse.json({ success: true, message: '新增產品成功', product: newProduct });
  }),

  // ── 後台：編輯產品 ──
  http.put('/v2/api/:apiPath/admin/product/:id', async ({ params, request }) => {
    const body = await request.json() as { data?: Partial<Product> };
    const idx = products.findIndex((p) => p.id === params.id);
    if (idx === -1) return HttpResponse.json({ success: false, message: '找不到產品' }, { status: 404 });
    products[idx] = { ...products[idx], ...body?.data };
    return HttpResponse.json({ success: true, message: '更新產品成功', product: products[idx] });
  }),

  // ── 後台：刪除產品 ──
  http.delete('/v2/api/:apiPath/admin/product/:id', ({ params }) => {
    const idx = products.findIndex((p) => p.id === params.id);
    if (idx === -1) return HttpResponse.json({ success: false, message: '找不到產品' }, { status: 404 });
    products.splice(idx, 1);
    return HttpResponse.json({ success: true, message: '刪除產品成功' });
  }),

  // ── 後台：上傳圖片（回傳 placeholder） ──
  http.post('/v2/api/:apiPath/admin/upload', () => {
    return HttpResponse.json({
      success: true,
      imageUrl: `https://picsum.photos/seed/${uuid()}/400/400`,
    });
  }),

  // ── 後台：優惠券列表 ──
  http.get('/v2/api/:apiPath/admin/coupons', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const { items, pagination } = paginate(coupons, page);
    return HttpResponse.json({ success: true, coupons: items, pagination });
  }),

  // ── 後台：新增優惠券 ──
  http.post('/v2/api/:apiPath/admin/coupon', async ({ request }) => {
    const body = await request.json() as { data?: Partial<Coupon> };
    const newCoupon: Coupon = {
      id: uuid(),
      title: '', is_enabled: 1, percent: 90,
      due_date: Math.floor(Date.now() / 1000) + 86400 * 30,
      code: uuid(),
      ...body?.data,
    };
    coupons.unshift(newCoupon);
    return HttpResponse.json({ success: true, message: '新增優惠券成功' });
  }),

  // ── 後台：編輯優惠券 ──
  http.put('/v2/api/:apiPath/admin/coupon/:id', async ({ params, request }) => {
    const body = await request.json() as { data?: Partial<Coupon> };
    const idx = coupons.findIndex((c) => c.id === params.id);
    if (idx === -1) return HttpResponse.json({ success: false, message: '找不到優惠券' }, { status: 404 });
    coupons[idx] = { ...coupons[idx], ...body?.data };
    return HttpResponse.json({ success: true, message: '更新優惠券成功' });
  }),

  // ── 後台：刪除優惠券 ──
  http.delete('/v2/api/:apiPath/admin/coupon/:id', ({ params }) => {
    const idx = coupons.findIndex((c) => c.id === params.id);
    if (idx === -1) return HttpResponse.json({ success: false, message: '找不到優惠券' }, { status: 404 });
    coupons.splice(idx, 1);
    return HttpResponse.json({ success: true, message: '刪除優惠券成功' });
  }),

  // ── 後台：訂單列表 ──
  http.get('/v2/api/:apiPath/admin/orders', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? 1);
    const { items, pagination } = paginate(orders, page);
    return HttpResponse.json({ success: true, orders: items, pagination });
  }),

  // ── 後台：編輯訂單 ──
  http.put('/v2/api/:apiPath/admin/order/:id', async ({ params, request }) => {
    const body = await request.json() as { data?: Partial<Order> };
    const idx = orders.findIndex((o) => o.id === params.id);
    if (idx === -1) return HttpResponse.json({ success: false, message: '找不到訂單' }, { status: 404 });
    orders[idx] = { ...orders[idx], ...body?.data };
    return HttpResponse.json({ success: true, message: '更新訂單成功', order: orders[idx] });
  }),
];
