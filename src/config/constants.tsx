export const ORDER_STATUS = {
    PENDING                       : 0,
    COMPLETED                     : 1,
    REJECTED                      : 2,
    DRIVER_ARRIVED_BUSINESS       : 3,
    READY_FOR_PICKUP              : 4,
    REJECTED_BY_BUSINESS          : 5,
    CANCELLED_BY_DRIVER           : 6,
    ACCEPTED_BY_BUSINESS          : 7,
    ACCEPTED_BY_DRIVER            : 8,
    PICKUP_COMPLETED_BY_DRIVER    : 9,
    PICKUP_FAILED_BY_DRIVER       : 10,
    DELIVERY_COMPLETED_BY_DRIVER  : 11,
    DELIVERY_FAILED_BY_DRIVER     : 12
}

export const DECIMAL = { // They are no longer configured from the builder, by default they are "Point" and "2"
    separator: '.',
    length: 2,
    currency: '$'
}

export const STORAGE_KEY = {
    ONLINE : 'app_is_online'
}

export const DIRECTION = {
    RIGHT : 'right',
    LEFT : 'left'
}

export const USER_TYPE = {
    BUSINESS : 'business',
    CUSTOMER : 'customer',
    DRIVER : 'driver'
}