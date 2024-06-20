import { StyleSheet, View, ImageBackground, Text } from 'react-native';
import { LedRGB } from '@/components/LedRGB';
import { Switch } from '@/components/Switch';
export default function HomeScreen() {

  return (
    <ImageBackground source={require('@/assets/images/iotbackground.webp')} style={styles.imageback}>
      <View style={styles.fullCenter}>
        <View style={styles.iotcontainer}>
          <Text style={styles.title}>IoT Control</Text>
          <Text style={styles.subtitle}>App</Text>
        </View>
        <View style={styles.row}>
          <LedRGB />
          <Switch />
        </View>
      </View>
    </ImageBackground >
  );
}

const styles = StyleSheet.create({
  imageback: {
    height: "100%",
    width: "100%"
  },
  fullCenter: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%"
  },
  title: {
    fontSize: 25,
    fontWeight: "bold"
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "400",
    alignSelf: "center"
  }, row: {
    flexDirection: "row"
  }, iotcontainer: { marginTop: 25, padding: 7, borderWidth: 1, borderColor: "black", borderRadius: 10, flexDirection: "row", gap: 5, justifyContent: "center", backgroundColor: "rgba(255, 255, 255, 0.5)" }
});
