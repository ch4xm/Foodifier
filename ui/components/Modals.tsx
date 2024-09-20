import { useState } from "react";
import { Modal, Pressable, View, ViewStyle, Text, StyleSheet } from "react-native";


export const SettingsModal: React.FC<SettingsModalProps> = ({
    visible = false,
}) => {

    return (
        <Modal animationType="slide" transparent={true} visible={visible}>
            <View style={styles.settingsModal}>
                <Text>Settings</Text>
                <Pressable>
                    <Text>Show Locations</Text>

                </Pressable>
                <Pressable>
                    <Text>Close</Text>
                </Pressable>
            </View>
        </Modal>
    )
}

export type SettingsModalProps = {
    visible?: boolean
    style?: ViewStyle 
}

const styles = StyleSheet.create({
    settingsModal: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',

        elevation: 5,
    }
})