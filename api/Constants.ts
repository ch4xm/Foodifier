
export const BASE_URL = 'https://nutrition.sa.ucsc.edu/'
export const SHORT_MENU_URL = 'shortmenu.aspx?naFlag=1&'
export const LONG_MENU_URL = 'longmenu.aspx?'
export const LOCATION_URL = 'locationNum='
export const MEAL_URL = '&mealName='
export const DATE_URL = '&dtdate='
export const LOCATION_NUM_BEFORE_DELIMITER = '&locationNum='
export const LOCATION_NUM_AFTER_DELIMITER = '&locationName='
export const LOCATIONS_CACHE_INVALIDATION_SECONDS = 24 * 60 * 60 * 7 // Every week, invalidate location numbers cache to reduce load on the network
export const MEALS_CACHE_INVALIDATION_SECONDS = 24 * 60 * 60 // Every day, invalidate meals cache to reduce load on the network
export const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Late Night']

export const LOCATION_NUMBERS : Record<string,string> = {
    'Cowell/Stevenson': '05',
	'Crown/Merrill': '20',
	'Nine/Ten': '40',
	'Porter/Kresge': '25',
    'Rachel Carson/Oakes': '30',
    'Oakes Cafe': '23',
    'Global Village Cafe': '46',
    'UCen Coffee Bar': '45',
    'Stevenson Coffee House': '26',
    'Porter Market': '50',
    'Perk Coffee Bars': '22',
}