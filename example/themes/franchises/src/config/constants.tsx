export const USER_TYPE = {
	BUSINESS: 'business',
	CUSTOMER: 'customer',
	DRIVER: 'driver'
}

export const ORDER_TYPES = [
	{
		value: 1,
		content: 'DELIVERY',
		description: 'DELIVERY_DESCRIPTION'
	},
	{
		value: 2,
		content: 'PICKUP',
		description: 'PICKUP_DESCRIPTION',
	},
	{
		value: 3,
		content: 'EAT_IN',
		description: 'EAT_IN_DESCRIPTION',
	},
	{
		value: 4,
		content: 'CURBSIDE',
		description: 'CURBSIDE_DESCRIPTION',
	},
	{
		value: 5,
		content: 'DRIVE_THRU',
		description: 'DRIVE_THRU_DESCRIPTION',
	}
]

export const REVIEW_ORDER_COMMENTS = [
	{ key: 'IT_WASNT_TASTY', value: 'It wasn\'t tasty' },
	{ key: 'IT_DOESNT_PACK_WELL', value: 'It doesn\'t pack well' },
	{ key: 'IT_ISNT_WORTH_WHAT_IT_COASTS', value: 'It isn\'t worth what it coasts' },
	{ key: 'TO_SLOW', value: 'To slow' },
	{ key: 'SUSTAINABLE_PACKAGING_WASNT_USED', value: 'Sustainable packaging wasn\'t used' },
	{ key: 'THEY_DID_NOT_FOLLOW_THE_ORDER_NOTES', value: 'They didn\'t follow the order notes' }
]

export const REVIEW_PRODUCT_COMMENTS = [
	{ key: 'IT_WASNT_TASTY', value: 'It wasn\'t tasty'},
	{ key: 'SMALL_PORTION', value: 'Small portion'},
	{ key: 'WET_OR_LEAKY', value: 'Wet or leaky'},
	{ key: 'SLOPPY_PRESENTATION', value: 'Sloppy presentation'},
	{ key: 'COLD_OR_MELTED', value: 'Cold or melted'}
]

export const REVIEW_DRIVER_COMMENTS = [
	{ key: 'FAST_AND_EFFICIENT', value: 'Fast and efficient'},
	{ key: 'DELIVERY_PERFECT', value: 'Delivery perfect'},
	{ key: 'EXCELLENT_COMMUNICATION', value: 'Excellent communication'},
	{ key: 'CORDIAL_SERVICE', value: 'Cordial service'},
]