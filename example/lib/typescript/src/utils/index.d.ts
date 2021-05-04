export declare const flatArray: (arr: any) => never[];
/**
 * Function to return the traduction depending of a key 't'
 * @param {string} key for traduction
 */
export declare const getTraduction: (key: string) => any;
/**
 * Function to convert delivery time in minutes
 * @param {string} time business delivery time
 */
export declare const convertHoursToMinutes: (time: any) => string;
export declare const getIconCard: (brand: string, size: number) => JSX.Element;
/**
 * Function to return a static google maps image based in location
 * @param {object} param object with latitude and logitude
 */
export declare const getGoogleMapImage: ({ lat, lng }: any, apiKey: string) => string;
/**
 * List of fields with correct order
 */
export declare const fieldsToSort: string[];
/**
 * Function to return a array sorted by certain fields
 * @param fields Array with right order
 * @param array Array to sort
 */
export declare const sortInputFields: ({ fields, values }: any) => any;
