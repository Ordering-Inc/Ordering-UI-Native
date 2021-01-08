import { DECIMAL, ORDER_STATUS, STORAGE_KEY } from '../config/constants'
import { useLocalStorage, _retrieveStoreData } from './StoreUtil'

export const getOrderStatus = (status_num: number) => {
    if (status_num == ORDER_STATUS.PENDING) { return "Pending" }
    else if (status_num == ORDER_STATUS.COMPLETED) { return "Complete" }
    else if (status_num == ORDER_STATUS.REJECTED) { return "Rejected" }
    else if (status_num == ORDER_STATUS.DRIVER_ARRIVED_BUSINESS) { return "Driver arrived to business" }
    else if (status_num == ORDER_STATUS.READY_FOR_PICKUP) { return "Ready for pickup" }
    else if (status_num == ORDER_STATUS.REJECTED_BY_BUSINESS) { return "Rejected by business" }
    else if (status_num == ORDER_STATUS.CANCELLED_BY_DRIVER) { return "Cancelled by driver" }
    else if (status_num == ORDER_STATUS.ACCEPTED_BY_BUSINESS) { return "Accepted by business" }
    else if (status_num == ORDER_STATUS.ACCEPTED_BY_DRIVER) { return "Accepted by driver" }
    else if (status_num == ORDER_STATUS.PICKUP_COMPLETED_BY_DRIVER) { return "Pickup completed by driver" }
    else if (status_num == ORDER_STATUS.PICKUP_FAILED_BY_DRIVER) { return "Pickup failed by driver" }
    else if (status_num == ORDER_STATUS.DELIVERY_COMPLETED_BY_DRIVER) { return "Delivery completed by driver" }
    else if (status_num == ORDER_STATUS.DELIVERY_FAILED_BY_DRIVER) { return "Delivery failed by driver" }
    else { return "None" }
}

export const getStatusColor = (status_num: number) => {
    if (status_num == ORDER_STATUS.PENDING)                             { return '#194690' }
    else if (status_num == ORDER_STATUS.COMPLETED)                      { return '#238938' }
    else if (status_num == ORDER_STATUS.REJECTED)                       { return '#610619' }
    else if (status_num == ORDER_STATUS.DRIVER_ARRIVED_BUSINESS)        { return '#530973' }
    else if (status_num == ORDER_STATUS.READY_FOR_PICKUP)               { return '#438053' }
    else if (status_num == ORDER_STATUS.REJECTED_BY_BUSINESS)           { return '#110619' }
    else if (status_num == ORDER_STATUS.CANCELLED_BY_DRIVER)            { return '#000000' }
    else if (status_num == ORDER_STATUS.ACCEPTED_BY_BUSINESS)           { return '#119469' }
    else if (status_num == ORDER_STATUS.ACCEPTED_BY_DRIVER)             { return '#146018' }
    else if (status_num == ORDER_STATUS.PICKUP_COMPLETED_BY_DRIVER)     { return '#199115' }
    else if (status_num == ORDER_STATUS.PICKUP_FAILED_BY_DRIVER)        { return '#323009' }
    else if (status_num == ORDER_STATUS.DELIVERY_COMPLETED_BY_DRIVER)   { return '#349557' }
    else if (status_num == ORDER_STATUS.DELIVERY_FAILED_BY_DRIVER)      { return '#615044' }
    else { return "white" }
}

export const parsePrice = (number: number, currency?: string) => {
    var rate: number = 10 ** DECIMAL.length;
    var l = Math.floor(number);
    var r = Math.floor((number - l) * rate);
    return `${currency ? currency : DECIMAL.currency}${l}${DECIMAL.separator}${r == 0 ? '00' : r}`;
}

export const parseDateTime = (date_time_str: string) => {
    var date = new Date(date_time_str);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds}`;
}