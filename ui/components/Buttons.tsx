import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

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
        // paddingVertical: '5%',
        flex: 1,
        paddingHorizontal: 5, //'10%',
        marginHorizontal: 2.5,
    },
    buttonText: {
        color: 'black', //colors.black,
        fontSize: 14,
        fontWeight: "bold",
    }
})

