import * as React from "react";

type CartBottomSheetContextType = {
    bottomSheetVisibility: boolean;
    showCartBottomSheet: () => void;
    hideCartBottomSheet: () => void;
};

// Creates the cart bottom sheet context
export const CartBottomSheetContext = React.createContext<CartBottomSheetContextType | null>(null);

export const CartBottomSheetProvider: React.FC = ({ children }) => {
    const [
        bottomSheetVisibility,
        setBottomSheetVisibility,
    ] = React.useState(false);

    function showCartBottomSheet() {
        setBottomSheetVisibility(true);
    }

    function hideCartBottomSheet() {
        setBottomSheetVisibility(false);
    }

    return (
        <CartBottomSheetContext.Provider value={{ bottomSheetVisibility, showCartBottomSheet, hideCartBottomSheet }}>
            {children}
        </CartBottomSheetContext.Provider>
    );
};

// hook context

export function useCartBottomSheet() {
    return React.useContext(CartBottomSheetContext)!;
}
