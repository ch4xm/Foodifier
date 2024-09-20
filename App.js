import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Button, Pressable, ActivityIndicator, ViewStyle } from 'react-native';
import { MenuButton, CircleButton } from './ui/components/Buttons';
import { getAllMeals, Meal, Menu } from './api/ShortMenu';
import { Fragment, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LOCATIONS_CACHE_INVALIDATION_SECONDS, LOCATION_NUMBERS } from './api/Constants';
import { SettingsModal } from './ui/components/Modals'
import { Ionicons } from 'react-native-vector-icons/Ionicons';
import { MenuPage } from './ui/components/MenuPage';

export default function App() {

	// const [useCurrentLocations, setUseCurrentLocations] = useState<Boolean>(() => Settings.get('useCurrentLocations') || true);
	
	const [modalVisible, setModalVisible] = useState(false);
	const [locations, setLocations] = useState(LOCATION_NUMBERS)
	const [menu, setMenu] = useState(null)
	const [selectedLocationName, setSelectedLocationName] = useState(null)
	useEffect(() => { // Populate the location buttons with parsed data, with daily caching
		const FetchLocations = async () => {
			let locationNumbers = LOCATION_NUMBERS
			// if (false) {
			//   console.log('App(): Using currently open locations')
			//   locationNumbers = await getCache(cacheKeys.locations) // Try restoring from cache, otherwise reparse the location numbers data

			//   if (!locationNumbers) {
			//     locationNumbers = await getLocationNumbers();
			//     console.log('App(): Fetched locations:', locationNumbers)
			//   }
			//   console.log(locationNumbers)
			//   await storeCache(cacheKeys.locations, locationNumbers)
			//   console.log('App(): Stored locations:', locationNumbers)
			// }
			console.log('App(): Setting locations:', locationNumbers)
			setLocations(locationNumbers)
		}
		
		const FetchMenu = async () => {
			// await AsyncStorage.clear()

			let menuCache = await getMenuCache()
			if (menuCache) {
				// console.log('App(): Menu cache found', menuCache)
				setMenu(menuCache)
				return
			}
			menuCache = {}
			for (let location of Object.keys(locations)) {
				menuCache[locations[location]] = await getAllMeals(locations[location])
			}
			// console.log('App(): Fetched menu:', menuCache)
			setMenu(menuCache)
			storeCache(cacheKeys.menu, menuCache)
		}

		FetchLocations().catch((error) => {
			console.error('App(): Error getting locations:', error)
			setLocations(null)
		})

		FetchMenu().catch((error) => {
			console.error('App(): Error getting meals:', error)
			setMenu(null)
		})
		console.log('App(): Finished fetching locations and meals')
	}, [])

	return (
		// <NavigationContainer>
			<SafeAreaView style={styles.container}>
				<SettingsModal visible={modalVisible}></SettingsModal>
				<View horizontal style={{flexDirection: 'row', paddingBottom: '2.5%', alignItems: 'center', justifyContent: 'space-evenly', borderBottomWidth: 5, borderRadius: 5, borderBottomColor: colors.gold}}>
						<Text style={{padding: 5, fontSize: 60, color: colors.gold, textAlign: 'center', fontWeight: '800'}}>Foodifier</Text>
						<CircleButton color={colors.gold} backgroundColor={colors.darkest} title='x' onClick={() => setModalVisible()}></CircleButton>
				</View>
				<View style={{...styles.scrollView}}>
					<ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled bounces={true} contentContainerStyle={{ alignItems: 'center', justifyContent: locations == null ? 'center' : 'flex-start'}}>{locations == null ? <ActivityIndicator style={styles.errorText} size='small' /> : Object.keys(locations).map((locationName) => {
							return <Fragment key={locations[locationName]}>
								<MenuButton style={{width: 150}} backgroundColor={colors.darkest} color={colors.gold} title={locationName} onClick={() => setSelectedLocationName(locationName)}></MenuButton>
							</Fragment>
						})}
					</ScrollView>
				</View>
				{selectedLocationName && locations && locations[selectedLocationName] && (
					<MenuPage locationMenu={menu[locations[selectedLocationName]]} locationName={selectedLocationName} locationNumber={locations[selectedLocationName]} />
				)}

			</SafeAreaView>
		// </NavigationContainer>
	);
}

export const cacheKeys = {
	locations: 'locations',
	menu: 'menu'
}

async function storeCache(key, object) {
	try {
		object.date = Date.now()
		const data = JSON.stringify(object)

		if (AsyncStorage.getItem(key) !== null) {
			console.log('storeCache(): Cache already exists, clearing key', key)
			await AsyncStorage.removeItem(key)
		}
		console.log('storeCache(): Storing key', key)
		await AsyncStorage.setItem(key, data)
		delete object.date
	}
	catch (error) {
		console.error(error.message)
		throw error
	}
}

async function getLocationsCache() {
	try {
		const data = await AsyncStorage.getItem(cacheKeys.locations)
		if (data === null) {
			return null
		}
		let locations = JSON.parse(data)
		if (!locations.date) {
			console.log('getLocationsCache(): Cache invalid for key', cacheKeys.locations)
			return null
		}
		const shouldInvalidateCache = Math.abs(Date.now() - Number(locations.date)) / 1000 > LOCATIONS_CACHE_INVALIDATION_SECONDS
		if (shouldInvalidateCache) {
			await AsyncStorage.removeItem(cacheKeys.locations)
			console.log('getLocationsCache(): Cache expired for key', cacheKeys.locations)
			return null
		}
		delete json.date
		return json
	}
	catch (error) {
		console.error('getCache():', error.message)
		throw error
	}
}


async function getMenuCache() {
	try {
		const data = await AsyncStorage.getItem(cacheKeys.menu)
		if (data === null) {
			console.log('getMenuCache(): Cache not found for key', cacheKeys.menu)
			return null
		}
		let menu = JSON.parse(data)
		if (!menu.date) {
			console.log('getMenuCache(): Cache invalid for key', cacheKeys.menu)
			return null
		}

		const cachedDate = new Date(menu.date);  // Assuming `menu.date` is in milliseconds
        const currentDate = new Date();

		const shouldInvalidateCache = cachedDate.getDate() !== currentDate.getDate() ||
                                      cachedDate.getMonth() !== currentDate.getMonth() ||
                                      cachedDate.getFullYear() !== currentDate.getFullYear();

		if (shouldInvalidateCache) {
			await AsyncStorage.removeItem(cacheKeys.menu)
			console.log('getMenuCache(): Cache expired for key', cacheKeys.menu)
			return null
		}
		delete menu.date
		return menu
	}
	catch (error) {
		console.error('getMenuCache():', error.message)
		throw error
	}
}

export const colors = {
	gold: '#fdc700', 
	dark: '#282b30',
	darker: '#1e2124',
	darkest: '#141414',
	black: '#000000' ,
	oled: '#999999'
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingTop: StatusBar.currentHeight,
		backgroundColor: colors.dark,
	},
	scrollView: {
		height: '22.5%',
		marginVertical: 10,
		// flex: 1,
		// width: '100%',
		backgroundColor: colors.darker,
		flexDirection: 'row',     
		// justifyContent: 'space-between',
		// gap: 10,
		// alignItems: 'center',
		shadowColor: '#1e2124',
		shadowRadius: 10,
		shadowOpacity: 0.5,
		overflow: 'hidden',
		paddingHorizontal: 0
	},
	spacing: {
		small: 10,
		medium: 20,
		large: 30
	},
	loadingCircle: {
		color: 'gold', //colors.black,
		fontSize: 20,
		fontWeight: "bold",
		justifyContent: 'center',
		textAlign: 'center',
		alignSelf: 'center'
}
});