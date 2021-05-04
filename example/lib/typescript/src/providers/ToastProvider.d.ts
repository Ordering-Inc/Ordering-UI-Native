import * as React from "react";
export declare enum ToastType {
    Info = "INFO",
    Error = "ERROR",
    Success = "SUCCESS"
}
declare type ToastConfigType = {
    type: ToastType;
    message: string | Array<string>;
    duration: number;
};
declare type ToastContextType = {
    toastConfig: ToastConfigType | null;
    showToast: (type: ToastType, message: string | Array<string>, duration?: number) => void;
    hideToast: () => void;
};
export declare const ToastContext: React.Context<ToastContextType | null>;
export declare const ToastProvider: React.FC;
export declare function useToast(): ToastContextType;
export {};
