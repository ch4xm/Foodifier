import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export const MenuButton: React.FC<MenuButtonProps> = ({
    title,
    backgroundColor = ButtonStyles.menuButton.backgroundColor,
    textColor = ButtonStyles.menuButton.color,
    onClick = () => {},
}) => {
    return (
        <Pressable style={{...ButtonStyles.menuButton, backgroundColor}} onPress={() => onClick()}>
            <Text style={{...ButtonStyles.buttonText, color: textColor}}>{title}</Text> 
        </Pressable>
    )
};

export const CircleButton: React.FC<CircleButtonProps> = ({
    title = '',
    backgroundColor = ButtonStyles.circleButton.backgroundColor,
    textColor = ButtonStyles.circleButton.color,
    onClick = () => {},
}) => {
    return (
        <Pressable style={{...ButtonStyles.circleButton, backgroundColor}} onPress={() => onClick()}>
            <Text style={{...ButtonStyles.buttonText, color: textColor}}>{title}</Text>
        </Pressable>
    )
}

export type CircleButtonProps = {
    title?: string
    backgroundColor?: string
    textColor?: string
    onClick?: () => void;
}

export type MenuButtonProps = {
    title: string
    backgroundColor?: string
    textColor?: string
    onClick?: () => void;
}

const ButtonStyles = StyleSheet.create({
    circleButton: {
        borderRadius: 100,
        backgroundColor: 'black',
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
        width: '40%',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: '5%',
        paddingHorizontal: '10%',
        marginLeft: 7.5,

    },
    buttonText: {
        color: 'black',
        fontSize: 30,
        fontWeight: "bold",
    }
})

