import { BASE_URL, LOCATION_NUM_BEFORE_DELIMITER, LOCATION_NUM_AFTER_DELIMITER, LOCATION_URL, MEAL_URL, DATE_URL, MEALS, LOCATION_NUMBERS, LONG_MENU_URL } from "./Constants"
import { FoodGroup, FoodItem, NutritionFacts, Menu, MealName, Meal, fetchMenuHTML } from "./Menu"
import { jsdom } from 'jsdom-jscore-rn';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

export async function getMeal(locationNumber: string, mealName: string = '', date: Date = new Date()): Promise<Record<string, FoodGroup>> { // Gets the meal at location name and meal name, with optional date selection\
    try {
        let html = await fetchMenuHTML(locationNumber, mealName, date, false)
        let foodItems: Record<string, FoodGroup> = {}
        let parser = new jsdom(html)

        let rows: HTMLElement[] = Array.from(parser.querySelectorAll("body > table > tr:nth-child(2) > td > div:nth-child(2) > table:nth-child(1) > form > tr"))    // Get all trs from the table containing food items and dividers
        let groupName = ''

        for (const tr of rows) { // Iterate through all trs which contain food items and dividers
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

                // await getNutritionFacts(nutritionUrl)
                let portion: string = tr.querySelector('div.longmenucolportions').textContent.trim() // Store portion size as well
                let foodItem: FoodItem = {
                    name: foodName,
                    price: price,
                    nutritionUrl: nutritionUrl,
                    portion: portion,
                }
                foodItems[groupName][foodName] = foodItem
            }
        }
        return foodItems
    }
    catch (error) {
        console.error('getMeal():', error.message)
        return {}
    }
}

export async function getAllMeals(locationNumber: string, date: Date = new Date()): Promise<Record<string, Record<string, FoodGroup>>> {
    try {
        let menu = {}
        for (let mealName of MEALS) {
            let meal: Meal = await getMeal(locationNumber, mealName, date)
            menu[mealName] = meal
        }
        return menu
    }
    catch (error) {
        console.error('getAllMeals():', error.message)
        return {}
    }
}

export async function getNutritionFacts(fullUrl: string): Promise<NutritionFacts> { // Parse nutrition facts of each item from its corresponding href
    let html = await (await fetch(fullUrl)).text()
    let parser = new jsdom(html)
    let elements: Array<HTMLElement> = Array.from(parser.querySelectorAll('font:nth-of-type(2)'))
    
    // let map = {'Calories': 'calories', 'Total Fat': 'totalFat', 'Sat. Fat': 'saturatedFat'}
    // let nutrition: NutritionFacts = {}
    // for (const element of elements) {
    //     let text = element.textContent.trim()
    //     console
    //     if (text in map) {
    //         nutrition[map[text]] = element.nextElementSibling.textContent.trim()
    //     }
    // }
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
    // try { totalFat = elements.find(element => element.textContent.trim() === 'Total Fat').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { totalFat = '--' }
    // try { saturatedFat = elements.find(element => element.textContent.trim() === 'Sat. Fat').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { saturatedFat = '--' }
    // try { transFat = elements.find(element => element.textContent.trim() === 'Trans Fat').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { transFat = '--' }
    // try { cholesterol = elements.find(element => element.textContent.trim() === 'Cholesterol').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) {cholesterol = '--' }
    // try { sodium = elements.find(element => element.textContent.trim() === 'Sodium').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { sodium = '--' }
    // try { totalCarbohydrates = elements.find(element => element.textContent.trim() === 'Tot. Carb.').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { totalCarbohydrates = '--' }
    // try { dietaryFiber = elements.find(element => element.textContent.trim() === 'Dietary Fiber').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { dietaryFiber = '--' }
    // try { sugar = elements.find(element => element.textContent.trim() === 'Sugars').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { sugar = '--' }
    // try { protein = elements.find(element => element.textContent.trim() === 'Protein').closest('td').querySelector('font:nth-of-type(2)').textContent } catch (error) { protein = '--' }
    // try { ingredients = parser.querySelector('span.labelingredientsvalue').textContent.trim() } catch (error) { ingredients = '--' }
    // try { allergens = Array.from(parser.querySelector('span.labelwebcodesvalue').querySelectorAll('img'), (image: HTMLImageElement) => image.alt) } catch (error) { allergens = [] }

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
    // console.log(nutrition)
    return nutrition
}

// getLocationNumbers().then(response => {
//     console.log(response)
// })

// fetchMenuHTML('40', 'Lunch', new Date()).then(response => {
//     console.log(response)
// })

getMeal('40', 'Lunch')
// .then(response => {
//     console.log(response)
// })
// getAllMeals('40').then(response => {
//     console.log(response)
// })