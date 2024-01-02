import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Button, Pressable, ActivityIndicator, ViewStyle } from 'react-native';
import { MenuButton, CircleButton } from './ui/components/Buttons';
import { getLocationNumbers } from './api/Menu';
import { Fragment, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'
import { LOCATIONS_CACHE_INVALIDATION_SECONDS } from './api/Constants';

export const cacheKeys = {
  locations: 'locations',
}

async function storeCache(key, object) {
  try {        
    object['date'] = Date.now()
    const data = JSON.stringify(object)

    if (AsyncStorage.getItem(cacheKeys.locations) !== null) {
      await AsyncStorage.removeItem(cacheKeys.locations)
    }
    await AsyncStorage.setItem(key, data)
  }
  catch (error) {
    console.error(error.message)
    throw error
  }
}

async function getCache(key) {
  try {
    const data = await AsyncStorage.getItem(key)
    if (data === null) {
      return null
    }
    let json = JSON.parse(data)
    if (Math.abs(+Date.now() - (+json['date']))/1000 > LOCATIONS_CACHE_INVALIDATION_SECONDS) {
      await AsyncStorage.removeItem(key)
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

export default function App() {

  const [locations, setLocations] = useState(null)

  useEffect(() => { // Populate the location buttons with parsed data, with daily caching 
    const fetchData = async() => {
      try {
        let data = await getCache(cacheKeys.locations) // Try restoring from cache, otherwise reparse the location numbers data
        if (data == null) {
          data = await getLocationNumbers();
        }
        setLocations(data)
        await storeCache(cacheKeys.locations, data)
      }
      catch (error) {
        console.error('App(): Error fetching locations:', error);
        setLocations(null)
      }
    }

    fetchData()

  }, [])

  return (
    // <NavigationContainer>
      <SafeAreaView style={styles.container}>
        <View horizontal style={{flexDirection: 'row', paddingBottom: '2.5%', alignItems: 'center', justifyContent: 'space-evenly', borderBottomWidth: 5, borderRadius: 5, borderBottomColor: colors.gold}}>
            <Text style={{padding: 5, fontSize: 60, color: colors.gold, textAlign: 'center', fontWeight: '800'}}>Foodifier</Text>
            <CircleButton color={colors.gold} backgroundColor={colors.darkest} title='x' onClick={() => alert('Clicked on Settings button!')}></CircleButton>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} scrollEnabled bounces={false} contentContainerStyle={{...styles.scrollView, justifyContent: locations == null ? 'center' : 'flex-start'}}>{locations == null ? <ActivityIndicator style={styles.errorText} size='small' /> : Object.keys(locations).map((locationName) => {
            return <Fragment key={locations[locationName]}>
              <MenuButton backgroundColor={colors.darkest} color={colors.gold} title={locationName}></MenuButton>
            </Fragment>
          })}
        </ScrollView>
      </SafeAreaView>
    // </NavigationContainer>
  );
}

export const colors = StyleSheet.create({
  gold: '#fdc700', 
  dark: '#424549',
  darker: '#282b30',
  darkest: '#1e2124',
  black: '#000000' ,
  oled: '#999999'
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: colors.dark,
  },
  scrollView: {
    height: '20%',
    marginVertical: 10,
    // flex: 1,
    backgroundColor: '#36393e',
    flexDirection: 'row', 
    // justifyContent: 'space-between',
    // gap: 10,
    alignItems: 'center',
    shadowColor: '#1e2124',
    shadowRadius: 10,
    shadowOpacity: 0.5,
    overflow: 'hidden',
    paddingHorizontal: 5
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