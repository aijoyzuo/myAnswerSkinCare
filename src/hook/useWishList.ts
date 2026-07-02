import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleWish } from '../store/wishListSlice';

export default function useWishList() {
  const wishList = useAppSelector((s) => s.wishList.ids) as string[];
  const dispatch = useAppDispatch();
  return {
    wishList,
    toggleWish: (id: string | number) => dispatch(toggleWish(id)),
  };
}
