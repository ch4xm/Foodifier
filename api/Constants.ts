
export const BASE_URL = 'https://nutrition.sa.ucsc.edu/'
export const LOCATION_URL = 'longmenu.aspx?locationNum='
export const MEAL_URL = '&mealName='
export const DATE_URL = '&dtdate='
export const LOCATION_NUM_BEFORE_DELIMITER = '&locationNum='
export const LOCATION_NUM_AFTER_DELIMITER = '&locationName='
export const PREFERRED_LOCATION_NAMES = {} // Map location numbers to preferred names if they exist in this record, otherwise use the fallback name (the one parsed)
export const LOCATIONS_CACHE_INVALIDATION_SECONDS = 86400 // Every day, invalidate location numbers cache to reduce load on the network
export const MEALS = ['Breakfast', 'Lunch', 'Dinner', 'Late%20Night']