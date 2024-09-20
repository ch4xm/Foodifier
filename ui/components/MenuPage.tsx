import React, { Fragment, useEffect } from "react";
import { colors } from '../../App.js';
import { FoodGroup } from "../../api/Menu";
import { Pressable, SectionList, StyleSheet, Text, View, ScrollView } from "react-native";
import { MealSelectButton } from "./Buttons";

export const MenuPage: React.FC<MenuPageProps> = ({
    locationName,
    locationNumber,
    locationMenu,
}) => {
    useEffect(() => {
        console.log('test')
        console.log('locationName', locationName)
        // console.log('menu', locationMenu['Breakfast'])
        // Object.entries(locationMenu).map(([mealName, foodGroups]) => (
        //     Object.entries(locationMenu).map(([groupName, foodItems]) => (
        //         console.log('', foodItems)
    }, [])
    const [selectedMeal, setSelectedMeal] = React.useState<string>(Object.keys(locationMenu)[0])
    return (
        <View>
            {/* <View style={styles.menuHeader}>
                <Text style={styles.menuHeaderTitle}>{locationName}</Text>
            </View> */}
            <ScrollView contentContainerStyle={{...styles.menuPage }}>
                <MealSelectButton valueCallback={(value) => setSelectedMeal(value)} mealNames={Object.keys(locationMenu)} />
                <Fragment key={selectedMeal}>
                    <View style={{ margin: 0 }}>
                        <SectionList
                            scrollEnabled={false}
                            scrollsToTop={true}
                            sections={Object.entries(locationMenu[selectedMeal]).map(([groupName, foodGroup]) =>
                            ({ title: groupName, data: Object.keys(foodGroup) }))}
                            renderItem={({item}) => (
                                <Text style={styles.menuPageText}>{item}</Text>
                            )}
                            renderSectionHeader={({section}) => (
                                <Text style={{ ...styles.menuPageSectionHeader, marginTop: 15, marginBottom: 10, alignSelf: 'center', color: colors.gold }}>{section.title}</Text>
                            )}
                            ItemSeparatorComponent={() => <View style={{height: 1, backgroundColor: colors.darker, width: '90%'}} />}
                        />
                    </View>
                </Fragment>
            </ScrollView>
            
        </View>
    )
}

export type MenuPageProps = {
    locationName: string,
    locationNumber: string,
    locationMenu: Record<string, Record<string, FoodGroup>>
}

const styles = StyleSheet.create({
    menuHeader: {
        backgroundColor: '#181818',
        // height: '10%',
        width: '95%',
        borderRadius: 50,
        alignItems: 'center',
        alignContent: 'center',
        alignSelf: 'center',
        paddingVertical: 15,
        // margin: 0,
        justifyContent: 'center',
    },
    menuHeaderTitle: {
        fontSize: 35,
        fontWeight: 'bold',
        color: 'gold',
    },
    menuPage: {
        // margin: 7.5,
        backgroundColor: '#181818',
        borderRadius: 20,
        padding: 35,
        alignSelf: 'center',
        alignItems: 'center',
        // height: '100%',
        width: '95%',
        elevation: 5,
    },
    menuPageText: {
        color: 'white',
        fontSize: 20,
    },
    menuPageSectionHeader: {
        color: 'white',
        fontSize: 32,
    }

})