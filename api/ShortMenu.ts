import { BASE_URL, LOCATION_NUM_BEFORE_DELIMITER, LOCATION_NUM_AFTER_DELIMITER, LOCATION_URL, MEAL_URL, DATE_URL, MEALS, LOCATION_NUMBERS, SHORT_MENU_URL } from "./Constants"
import { FoodGroup, FoodItem, NutritionFacts, Menu, MealName, Meal, fetchMenuHTML } from "./Menu"
import { jsdom } from 'jsdom-jscore-rn';

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

// export async function getMeal(locationNumber: string, mealName: string = '', date: Date = new Date()): Promise<Record<string, FoodGroup>> { // Gets the meal at location name and meal name, with optional date selection\
//     try {
//         let html = await fetchMenuHTML(locationNumber, mealName, date, true)
//         let foodItems: Record<string, FoodGroup> = {}

//         let parser = new jsdom(html)

//         let rows: HTMLElement[] = Array.from(parser.querySelectorAll("body > table > tr:nth-child(2) > td > div:nth-child(2) > table:nth-child(1) > form > tr"))    // Get all trs from the table containing food items and dividers
//         let groupName = ''

//         for (const tr of rows) { // Iterate through all trs which contain food items and dividers
//             let divider = tr.querySelector('div.longmenucolmenucat')
//             if (divider) {
//                 groupName = divider.textContent.replaceAll('--', '').trim() // Logic to group all food items into their corresponding divider text
//                 foodItems[groupName] = {} // Initialize empty record whenever anew divider is found
//             }
//             else if (tr.querySelector('div.longmenucoldispname')) {
//                 let div = tr.querySelector('a')

//                 let price = tr.querySelector('div.longmenucolprice')?.textContent; // Cafe items will have price but DH items wont, so optional parameter
//                 let foodName = div.textContent.trim()
//                 let nutritionUrl: string = BASE_URL + div.href // Extract nutrition page url from each item

//                 let portion: string = tr.querySelector('div.longmenucolportions').textContent.trim() // Store portion size as well
                
//                 let foodItem: FoodItem = {
//                     name: foodName,
//                     price: price,
//                     nutritionUrl: nutritionUrl,
//                     portion: portion,
//                 }
//                 foodItems[groupName][foodName] = foodItem
//             }
//         }
//         return foodItems
//     }
//     catch (error) {
//         console.error('getMeal():', error.message)
//         return {}
//     }
// }

export async function getAllMeals(locationNumber: string, date: Date = new Date()): Promise<Record<string, Record<string, FoodGroup>>> {
    try {
        let html = await fetchMenuHTML(locationNumber, '', date, true)
        // console.log(html)
        // return
        let menu: Record<string, Record<string, FoodGroup>> = {}
        let parser = new jsdom(html)
        
        let rows: HTMLElement[] = Array.from(parser.querySelectorAll('body > table > table:nth-of-type(1) > tr'))
        // document.querySelector("td > table > tbody > tr:nth-child(1)")
        for (const tr of rows) {
            let foodItems: Record<string, FoodGroup> = {}
            let meal = tr.querySelector('td > div')

            let mealName = meal.textContent
            // console.log(tr.querySelector('td > table > tr:nth-child(2) > td > table'))
            let foodList = Array.from(tr.querySelector('td > table > tr:nth-child(2) > td > table').children) // Corresponds to each meal (breakfast, lunch, dinner, late night)
            let groupName = ''

            for (const food of foodList) {
                let divider = food.querySelector('div.shortmenucats')
                if (divider) {
                    groupName = divider.textContent.replaceAll('--', '').trim()
                    foodItems[groupName] = {}   // If divider exists, then create a new category of food items
                    continue
                }
                let foodName = food.querySelector('div.shortmenurecipes')?.textContent.trim()
                if (!foodName) {
                    continue
                }
                let price: string = food.querySelector('div.shortmenuprices')?.textContent.trim()
                foodItems[groupName][foodName] = {
                    name: foodName,
                    price: price,
                    portion: '',
                    nutritionUrl: ''
                }

            }
            menu[mealName] = foodItems
        }
        return menu
    }
    catch (error) {
        console.error('getAllMeals():', error.message)
        return {}
    }
}

// getMeal('40').then(console.log) // Test the function with a sample location number

// getAllMeals('40').then(locationMenu => {
//     // console.log(locationMenu)

//     Object.entries(locationMenu).map(([mealName, foodGroups]) => (
//         Object.entries(foodGroups).map(([groupName, foodItems]) => (
//             Object.entries(foodItems).map(([foodName, foodData]) => (
//                 console.log('', foodName)
//             ))
//         ))
//     ))
// }) // Test the function with a sample location number and meal name
// let locationMenu = getAllMeals('40') // Test the function with a sample location number and meal name
