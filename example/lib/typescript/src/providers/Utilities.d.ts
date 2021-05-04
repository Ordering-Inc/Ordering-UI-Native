export declare const getOrderStatus: (status_num: number) => "Pending" | "Rejected" | "Rejected by business" | "Accepted by business" | "Accepted by driver" | "Delivery completed by driver" | "Complete" | "Driver arrived to business" | "Ready for pickup" | "Cancelled by driver" | "Pickup completed by driver" | "Pickup failed by driver" | "Delivery failed by driver" | "None";
export declare const getStatusColor: (status_num: number) => "white" | "#000000" | "#194690" | "#238938" | "#610619" | "#530973" | "#438053" | "#110619" | "#119469" | "#146018" | "#199115" | "#323009" | "#349557" | "#615044";
export declare const parsePrice: (number: number, currency?: string | undefined) => string;
export declare const accessToken: () => Promise<any>;
