import { BASE_URL, LOCATION_NUM_BEFORE_DELIMITER, LOCATION_NUM_AFTER_DELIMITER, LOCATION_URL, MEAL_URL, DATE_URL, MEALS, LOCATION_NUMBERS, SHORT_MENU_URL, LONG_MENU_URL } from "./Constants"
import { jsdom } from 'jsdom-jscore-rn';

export interface NutritionFacts {
    calories: string
    totalFat: string
    saturatedFat: string
    transFat: string
    cholesterol: string
    sodium: string
    totalCarbohydrates: string
    dietaryFiber: string
    sugar: string
    protein: string
    ingredients: string
    allergens: string[] // Parse allergens from nutrition facts website since they have alt text
}

export interface FoodItem {
    name: string
    portion?: string
    price?: string
    nutritionUrl?: string
}

export interface FoodGroup {
    [key: string]: FoodItem
}

export type MealName = keyof typeof MEALS
export type Meal = Record<string, FoodGroup>

export type Menu = {
    [key in keyof typeof LOCATION_NUMBERS]: Record<MealName, Meal>
}

export async function getLocationNumbers(): Promise<Record<string, string>> { // parse the base url to get the cookie number for each dining location
    try {
        const response = await fetch(BASE_URL)
        if (!response.ok) {
            throw new Error('Failed to fetch HTML: ' + response.status)
        }
        const html = await response.text()
        const parser = new jsdom(html)
        const locations: Record<string, string> = {}
        
        Array.from(parser.querySelectorAll('ul > li')).forEach((ul: HTMLElement) => {
            let url = ul.querySelector('a').href
            let a = url.slice(url.indexOf(LOCATION_NUM_BEFORE_DELIMITER) + LOCATION_NUM_BEFORE_DELIMITER.length, url.indexOf(LOCATION_NUM_AFTER_DELIMITER))
            locations[ul.textContent.replace('Dining Hall', '').trim()] = a
        })
        return locations
    } catch(error) {
        console.error('getLocationNumbers(): ', error.message)
        return null
    }
}

export async function fetchMenuHTML(locationNumber: string, mealName: string, date: Date, useShortMenu: boolean = false): Promise<string> {
    let url: string = BASE_URL + (useShortMenu ? SHORT_MENU_URL : LONG_MENU_URL) + LOCATION_URL + locationNumber + (useShortMenu || mealName == '' ? '' : MEAL_URL + mealName) + DATE_URL + `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` // why is month zero-indexed...
    let encodedUrl = encodeURI(url)
    let cookie = { 'Cookie': Object.entries({ // UCSC menu website is weird and quirky and needs this specific cookie to work
        'WebInaCartLocation': locationNumber,
        'WebInaCartDates': '',
        'WebInaCartMeals': '',
        'WebInaCartQtys': '',
        'WebInaCartRecipes': ''
    }).map(c => c.join('=')).join('; ') }
    return (await fetch(encodedUrl, { headers: cookie })).text() 
}

export async function getNutritionFacts(fullUrl: string): Promise<NutritionFacts> { // Parse nutrition facts of each item from its corresponding href
    let html = await (await fetch(fullUrl)).text()
    let parser = new jsdom(html)
    let elements: Array<HTMLElement> = Array.from(parser.querySelectorAll('font'))
    
    let calories
    let totalFat
    let saturatedFat
    let transFat
    let cholesterol
    let sodium
    let totalCarbohydrates
    let dietaryFiber
    let sugar
    let protein
    let ingredients
    let allergens

    try { calories = elements.find(element => element.textContent.includes('Calories')).textContent.split(/\s/)[1] } catch (error) { calories = '--' }
    try { totalFat = elements.find(element => element.textContent.trim() === 'Total Fat').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { totalFat = '--' }
    try { saturatedFat = elements.find(element => element.textContent.trim() === 'Sat. Fat').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { saturatedFat = '--' }
    try { transFat = elements.find(element => element.textContent.trim() === 'Trans Fat').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { transFat = '--' }
    try { cholesterol = elements.find(element => element.textContent.trim() === 'Cholesterol').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) {cholesterol = '--' }
    try { sodium = elements.find(element => element.textContent.trim() === 'Sodium').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { sodium = '--' }
    try { totalCarbohydrates = elements.find(element => element.textContent.trim() === 'Tot. Carb.').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { totalCarbohydrates = '--' }
    try { dietaryFiber = elements.find(element => element.textContent.trim() === 'Dietary Fiber').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { dietaryFiber = '--' }
    try { sugar = elements.find(element => element.textContent.trim() === 'Sugars').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { sugar = '--' }
    try { protein = elements.find(element => element.textContent.trim() === 'Protein').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { protein = '--' }
    try { ingredients = parser.querySelector('span.labelingredientsvalue').textContent.trim() } catch (error) { ingredients = '--' }
    try { allergens = Array.from(parser.querySelector('span.labelwebcodesvalue').querySelectorAll('img'), (image: HTMLImageElement) => image.alt) } catch (error) { allergens = [] }

    let nutrition: NutritionFacts = {
        calories: calories,
        totalFat: totalFat,
        saturatedFat: saturatedFat,
        transFat: transFat,
        cholesterol: cholesterol,
        sodium: sodium,
        totalCarbohydrates: totalCarbohydrates,
        dietaryFiber: dietaryFiber,
        sugar: sugar,
        protein: protein,
        ingredients: ingredients,
        allergens: allergens,
    }
    return nutrition
}

