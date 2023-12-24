import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, Button, Pressable } from 'react-native';
import { MenuButton, CircleButton } from './ui/components/Buttons';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <View horizontal style={{flexDirection: 'row', gap: '25%', alignItems: 'center', justifyContent: 'space-evenly'}}>
        <Text style={{padding: 5, fontSize: 60, color: styles.colors.gold, textAlign: 'center', fontWeight: '800'}}>Foodifier</Text>
        <CircleButton title='x' onClick={() => alert('Clicked on Settings button!')}></CircleButton>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={true} scrollEnabled bounces={false} contentContainerStyle={styles.scrollView}>
        <MenuButton title='g' backgroundColor={styles.colors.darkest} textColor={styles.colors.gold}></MenuButton>
        <MenuButton title='a' backgroundColor={styles.colors.darkest} textColor={styles.colors.gold}></MenuButton>
        <MenuButton title='a' backgroundColor={styles.colors.darkest} textColor={styles.colors.gold}></MenuButton>
        <MenuButton title='a' backgroundColor={styles.colors.darkest} textColor={styles.colors.gold}></MenuButton>
        <MenuButton title='a' backgroundColor={styles.colors.darkest} textColor={styles.colors.gold}></MenuButton>
        <MenuButton title='a' backgroundColor={styles.colors.darkest} textColor={styles.colors.gold}></MenuButton>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    backgroundColor: '#424549'
  },
  scrollView: {
    height: '25%',
    marginVertical: 10,
    flex: 1,
    backgroundColor: '#36393e',
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignItems: 'center',
    shadowColor: '#1e2124',
    shadowRadius: 10,
    shadowOpacity: 1,
    overflow: 'hidden',
  },
  spacing: {
    small: 10,
    medium: 20,
    large: 30
  },
  colors: {
    gold: '#fdc700',
    dark: '#424549',
    darker: '#282b30', 
    darkest: '#1e2124',
  }
});