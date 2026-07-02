import { Outlet } from "react-router-dom";
import Navbar from "../../components/Navbar";
import axios, { AxiosError } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../context/toastContext";

type ApiErrorData = { message?: string; success?: boolean };

interface CartProduct {
  id: string;
  title?: string;
  price?: number;
  imageUrl?: string;
  description?: string;
  [key: string]: unknown;
}

interface CartItem {
  id: string;
  product_id: string;
  qty: number;
  total: number;
  product: CartProduct;
  [key: string]: unknown;
}

export interface CartData {
  carts: CartItem[];
  total: number;
  final_total: number;
  [key: string]: unknown;
}

type CartApiResponse = {
  data?: Partial<CartData>;
  success?: boolean;
  message?: string;
};

const getErrMsg = (err: unknown, fallback = "請稍後再試"): string => {
  const axErr = err as AxiosError<ApiErrorData>;
  return axErr.response?.data?.message || axErr.message || fallback;
};

export default function FrontLayout(): JSX.Element {
  const [cartData, setCartData] = useState<CartData>({
    carts: [],
    total: 0,
    final_total: 0,
  });

  const toast = useToast();

  const getCart = useCallback(async (): Promise<void> => {
    try {
      const res = await axios.get<CartApiResponse>(
        `/v2/api/${process.env.REACT_APP_API_PATH}/cart`
      );

      const rawData = res.data?.data ?? {};

      const cleanedData: CartData = {
        carts: (rawData.carts as CartItem[]) ?? [],
        total: Number(rawData.total ?? 0),
        final_total: Math.ceil(Number(rawData.final_total ?? 0)),
        ...rawData,
      };

      setCartData(cleanedData);
    } catch (error: unknown) {
      toast.error(getErrMsg(error));
    }
  }, [toast]);

  useEffect(() => {
    void getCart();
  }, [getCart]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar cartData={cartData} />
      <main className="flex-grow-1">
        <Outlet context={{ getCart, cartData }} />
      </main>

      <footer className="bg-dark">
        <div className="container">
          <div
            className="d-flex align-items-center justify-content-center text-white"
            style={{ height: "48px" }}
          >
            <p className="mb-0">© 2025 ANSWER All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
