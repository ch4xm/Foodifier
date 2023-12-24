import { BASE_URL, LOCATION_NUM_BEFORE_DELIMITER, LOCATION_NUM_AFTER_DELIMITER, LOCATION_URL, MEAL_URL, DATE_URL } from "./URLS"
import { JSDOM } from 'jsdom';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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

interface FoodItem {
    portion: string
    price?: string
    nutrition: NutritionFacts
}

interface FoodGroup {
    [key: string]: FoodItem
}

export async function getLocationNumbers(): Promise<Record<string, string>> { // parse the base url to get the cookie number for each dining location
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
    for (const tr of parser.querySelectorAll('div > table > tbody > tr')) { // Iterate through all trs which contain food items and dividers
        let divider = tr.querySelector('div.longmenucolmenucat')
        if (divider) {
            groupName = divider.textContent.replaceAll('--', '').trim() // Logic to group all food items into their corresponding divider text
            foodItems[groupName] = {} // Initialize empty record whenever a new divider is found
        }
        else if (tr.querySelector('div.longmenucoldispname')) {
            let div = tr.querySelector('a')

            let price = tr.querySelector('div.longmenucolprice')?.textContent; // Cafe items will have price but DH items wont, so optional parameter
            let foodName = div.textContent.trim()
            let nutritionUrl: string = BASE_URL + div.href // Extract nutrition page url from each item
            let nutrition: NutritionFacts = await getNutritionFacts(nutritionUrl)
            let portion: string = tr.querySelector('div.longmenucolportions').textContent.trim() // Store portion size as well
            
            let foodItem: FoodItem = {
                price: price,
                nutrition: nutrition,
                portion: portion,
            }
            foodItems[groupName][foodName] = foodItem
        }
    }

    return foodItems
}

export async function getNutritionFacts(fullUrl: string): Promise<NutritionFacts> { // Parse nutrition facts of each item from its corresponding href
    let html = await (await fetch(fullUrl)).text()
    // console.log(html)
    let parser = new JSDOM(html).window.document
    let elements: Array<HTMLElement> = Array.from(parser.querySelectorAll('font')) //map(element => element.parentElement.closest('td').textContent)
    
    // console.log(elements)
    //.find(el => el.textContent === 'SomeText, text continues.');
      // function getElementByXpath(dom: JSDOM, path: string): HTMLElement | null {
    //     const element = document.evaluate(
    //       path,
    //       dom.window.document,
    //       null,
    //       XPathResult.FIRST_ORDERED_NODE_TYPE,
    //       null
    //     ).singleNodeValue as HTMLElement;
        
    //     return element;
    //   }
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
    try { allergens = Array.from(parser.querySelector('span.labelwebcodesvalue').querySelectorAll('img'), (image: HTMLImageElement) => image.alt) } catch (error) { allergens = ['--'] }

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
    console.log(nutrition)
    return nutrition
}

async function fetchMenuHTML(locationNumber: string, mealName: string, date: Date): Promise<string> {
    let url: string = BASE_URL + LOCATION_URL + locationNumber + (mealName != '' ? MEAL_URL : '') + mealName + DATE_URL + `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}` // why is month zero-indexed...

    let cookie = { 'Cookie': Object.entries({ // UCSC menu website is weird and quirky and needs this specific cookie to work
        'WebInaCartLocation': locationNumber,
        'WebInaCartDates': '',
        'WebInaCartMeals': '',
        'WebInaCartQtys': '',
        'WebInaCartRecipes': ''
    }).map(c => c.join('=')).join('; ') }
    return (await fetch(url, { headers: cookie })).text() 
}

getMenu('20', 'Lunch', new Date('10/23/2023')).then(response => {
    console.log(response)
})