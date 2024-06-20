import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Slider from '@react-native-community/slider';
import ColorPicker, { Panel3, colorKit } from 'reanimated-color-picker';
import { controlarLEDRGB } from '@/services/devicecontrol';
export default function ColorPick(props: any) {
  const [color, setColor] = useState("0000")
  const [lightness, setLightness] = useState("03e8")
  function hslToHexString(hslString: string) {
    // Extraer los valores de HSL del string
    const hslRegex = /hsl\((\d+),\s*(\d+)%\s*,\s*(\d+)%\)/;
    const matches = hslString.match(hslRegex);

    if (!matches) {
      throw new Error("Invalid HSL string format");
    }

    const hue = parseInt(matches[1], 10);
    //const saturation = parseInt(matches[2], 10);
    //const lightness = parseInt(matches[3], 10);

    const hueHex = hue.toString(16).padStart(4, '0');
    //const saturationHex = Math.round(saturation * 10).toString(16).padStart(4, '0');  
    //const lightnessHex = Math.round(lightness * 10).toString(16).padStart(4, '0');  

    setColor(hueHex)
  }


  useEffect(() => {
    let func = async () => {
      await controlarLEDRGB({ options: { color: `${color}03e8${lightness}` } })
    }
    func()
  }, [color, lightness])



  const onSelectColor = ({ hex }: { hex: any }) => {

    let hsl = colorKit.HSL(hex).string()
    hslToHexString(hsl);
  };

  return (
    <View style={styles.container}>
      <ColorPicker style={{ width: '80%', padding: 7, margin: 3 }} value={"red"} onComplete={onSelectColor}>
        <Panel3 centerChannel='hsl-saturation' style={{ elevation: 20 }} thumbShape='circle' boundedThumb={true} />
      </ColorPicker>
      <Slider
        style={{ width: 200, height: 35, marginTop: 15 }}
        value={1000}
        disabled={props.disabled ? true : false}
        thumbTintColor='black'
        minimumValue={10}
        maximumValue={1000}
        maximumTrackTintColor="#7e7e7e"
        minimumTrackTintColor="#000000"
        onSlidingComplete={(value) => {
          setLightness(Math.round(value).toString(16).padStart(4, '0'))
        }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
    justifyContent: 'center',
  },
});