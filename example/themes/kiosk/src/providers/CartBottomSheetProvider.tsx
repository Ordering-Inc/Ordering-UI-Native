import React, { createContext, useContext, useState } from 'react'

type ICartBottom = any;

type ICartBottomContext = [ICartBottom, ICartBottom, ICartBottom];

const CartBottomSheetContext = createContext<ICartBottomContext>([[], () => null, () => null]);

export const CartBottomSheetProvider = ({ children }: any) => {
  const [bottomSheetVisibility, setBottomSheetVisibility] = useState<ICartBottom>(false);

  const showCartBottomSheet = () => {
    setBottomSheetVisibility(true);
  }

  const hideCartBottomSheet = () => {
    setBottomSheetVisibility(false);
  }

  return (
    <CartBottomSheetContext.Provider value={[bottomSheetVisibility, showCartBottomSheet, hideCartBottomSheet]}>
      {children}
    </CartBottomSheetContext.Provider>
  );
};

export function useCartBottomSheet() {
  const cartBottomManager = useContext(CartBottomSheetContext)
  return cartBottomManager || [{}]
}
