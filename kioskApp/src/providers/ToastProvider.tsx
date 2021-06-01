import * as React from "react";

// Defines the three kinds of message that are displayed
export enum ToastType {
    Info = "INFO",
    Error = "ERROR",
    Success = "SUCCESS",
}

// Defines the parameters required to display the toast
type ToastConfigType = { type: ToastType; message: string | Array<string>; duration: number };

// The toast context exposes this object throughout the app
type ToastContextType = {
    toastConfig: ToastConfigType | null;
    showToast: (type: ToastType, message: string | Array<string>, duration?: number) => void;
    hideToast: () => void;
};

// Creates the toast context
export const ToastContext = React.createContext<ToastContextType | null>(null);

export const ToastProvider: React.FC = ({ children }) => {
    // Calls setToastConfig in order to control the toast
    // toastConfig is null by default so the toast is hidden
    const [
        toastConfig,
        setToastConfig,
    ] = React.useState<ToastConfigType | null>(null);

    function showToast(type: ToastType, message: string | Array<string>, duration = 4000) {
        // Calls setToastConfig to show the toast
        setToastConfig({ type, message, duration });
    }

    function hideToast() {
        // Sets toast config to null in order to hide the toast
        setToastConfig(null);
    }

    return (
        <ToastContext.Provider value={{ toastConfig, showToast, hideToast }}>
            {children}
        </ToastContext.Provider>
    );
};

// hook context

export function useToast() {
    return React.useContext(ToastContext)!;
}
