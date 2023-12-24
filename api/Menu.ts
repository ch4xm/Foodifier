import { BASE_URL, LOCATION_NUM_BEFORE_DELIMITER, LOCATION_NUM_AFTER_DELIMITER, LOCATION_URL, MEAL_URL, DATE_URL } from "./URLS"
import { JSDOM } from 'jsdom';
import axios from 'axios'

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

interface NutritionFacts {
    calories: Number
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
    allergens: []
}

interface FoodItem {
    nutrition: NutritionFacts
    price?: string
}

interface FoodGroup {
    [key: string]: FoodItem
}

export async function getLocationNumbers() {
    let locations = {}
    let html = await (await fetch(BASE_URL)).text()
    const parser = new JSDOM(html).window.document
    parser.querySelectorAll('ul > li').forEach((ul) => {
        let url = ul.querySelector('a').href
        let a = url.slice(url.indexOf(LOCATION_NUM_BEFORE_DELIMITER) + LOCATION_NUM_BEFORE_DELIMITER.length, url.indexOf(LOCATION_NUM_AFTER_DELIMITER))
        locations[ul.textContent.trim()] = a
    })
    return locations
}

export async function getMenu(locationNumber: string, mealName: string = '', date: Date = new Date()): Promise<Record<string, FoodGroup>> { // Gets the meal at location name and meal name, with optional date selection\
    let html = await fetchMenuHTML(locationNumber, mealName, date)
    let foodItems: Record<string, FoodGroup> = {}
    let parser = new JSDOM(html).window.document

    let groupName = ''
    for (const tr of parser.querySelectorAll('div > table > tbody > tr')) {
        let divider = tr.querySelector('div.longmenucolmenucat')
        if (divider) {
            groupName = divider.textContent.replaceAll('--', '').trim()
            foodItems[groupName] = {}
        }
        else if (tr.querySelector('div.longmenucoldispname')) {
            let div = tr.querySelector('a')
            let price = tr.querySelector('div.longmenucolprice')?.textContent;

            let foodName = div.textContent.trim()
            let fullUrl: string = BASE_URL + div.href
            let nutrition: NutritionFacts = await getNutritionFacts(fullUrl)

            let foodItem: FoodItem = {
                price: price,
                nutrition: nutrition
            }
            foodItems[groupName][foodName] = foodItem
            console.log(fullUrl, foodName)
        }
    }

    return foodItems
}

async function getNutritionFacts(fullUrl: string): Promise<NutritionFacts> {
    let nutrition: NutritionFacts = {
        calories: 0,
        totalFat: '0',
        saturatedFat: '0',
        transFat: '0',
        cholesterol: '0',
        sodium: '0',
        totalCarbohydrates: '0',
        dietaryFiber: '0',
        sugar: '0',
        protein: '0',
        ingredients: '0',
        allergens: []
    }
    
    return nutrition
}

async function fetchMenuHTML(locationNumber: string, mealName: string, date: Date): Promise<string> {
    let url: string = BASE_URL + LOCATION_URL + locationNumber + (mealName != '' ? MEAL_URL : '') + mealName + DATE_URL + `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` // why is month zero-indexed...

    let cookie = { 'Cookie': Object.entries({
        'WebInaCartLocation': locationNumber,
        'WebInaCartDates': '',
        'WebInaCartMeals': '',
        'WebInaCartQtys': '',
        'WebInaCartRecipes': ''
    }).map(c => c.join('=')).join('; ') }

    return (await fetch(url, { headers: cookie })).text() 
}

getLocationNumbers().then(response => {
    // console.log(response)
})

getMenu('20', 'Lunch', new Date('10/23/2023')).then(response => {
    console.log(response)
})