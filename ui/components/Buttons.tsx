import React, { useEffect } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { MEALS } from "../../api/Constants";
import { colors } from "../../App";

export const MenuButton: React.FC<MenuButtonProps> = ({
    title,
    backgroundColor = ButtonStyles.menuButton.backgroundColor,
    color = ButtonStyles.menuButton.color,
    onClick = () => {},
}) => {
    return (
        <Pressable style={{...ButtonStyles.menuButton, backgroundColor}} onPress={() => onClick()}>
            <Text style={{...ButtonStyles.buttonText, color}} adjustsFontSizeToFit>{title}</Text> 
        </Pressable>
    )
};

export const CircleButton: React.FC<CircleButtonProps> = ({
    title = '',
    backgroundColor = ButtonStyles.circleButton.backgroundColor,
    color = ButtonStyles.circleButton.color,
    onClick = () => {},
}) => {
    return (
        <Pressable style={{...ButtonStyles.circleButton, backgroundColor}} onPress={() => onClick()}>
            <Text style={{...ButtonStyles.buttonText, color, fontSize: 24}}>{title}</Text>
        </Pressable>
    )
}

export const MealSelectButton: React.FC<MealSelectButtonProps> = ({
    backgroundColor = ButtonStyles.mealSelectButton.backgroundColor,
    color = ButtonStyles.mealSelectButton.color,
    mealNames = MEALS,
    valueCallback = () => {},
}) => {
    useEffect(() => {
        console.log('mealNames', mealNames)
    }, [])
    // const [selectedMeal, setSelectedMeal] = React.useState(mealNames[0])
    return (
        mealNames.length > 0 && (
            <View style={{ backgroundColor: backgroundColor, ...ButtonStyles.mealSelectButton }}>
                {mealNames.map((mealName) => (
                    <Pressable style={{ width: `${100 / mealNames.length}%` }} onPress={() => valueCallback(mealName)}>
                        <Text style={{ color: color, alignSelf: 'center' }}>{mealName}</Text>
                    </Pressable>
                ))}
            </View>
        ) || 
        (
            <View>
                <Text>No meals found!</Text>
            </View>
        )
        
    )
}

export type MealSelectButtonProps = {
    backgroundColor?: string
    color?: string
    mealNames?: string[]
    valueCallback?: (value: string) => void
    onClick?: () => void;
}

export type CircleButtonProps = {
    title?: string
    backgroundColor?: string
    color?: string
    onClick?: () => void;
}

export type MenuButtonProps = {
    title: string
    backgroundColor?: string
    color?: string
    onClick?: () => void;
}

const ButtonStyles = StyleSheet.create({
    circleButton: {
        borderRadius: 100,
        backgroundColor: 'black', //colors.darker,
        width: 50,
        height: 50,
        color: 'white',
        alignItems: 'center',
        justifyContent: 'center'
    },
    menuButton: {
        color: 'black',
        backgroundColor: 'white',
        height: '90%',
        width: 150,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#141414',
        shadowOpacity: 0.45,
        shadowRadius: 15,
        // paddingVertical: '5%',
        flex: 1,
        paddingHorizontal: 5, //'10%',
        marginHorizontal: 2.5,
    },
    mealSelectButton: {
        // position: 'absolute',
        backgroundColor: '#1e2124',
        color: 'white',
        // height: 'vh',
        padding: 10,
        width: '100%',
        borderRadius: 10,
        // borderWidth: 1,
        // borderColor: 'black',
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    buttonText: {
        color: 'black', //colors.black,
        fontSize: 14,
        fontWeight: "bold",
    }
})

