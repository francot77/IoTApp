import React, { useState } from 'react';
import { Button, Modal, StyleSheet, View } from 'react-native';

import ColorPicker, { Panel3, Swatches, Preview, OpacitySlider, HueSlider, colorKit } from 'reanimated-color-picker';
export default function App() {
  const [showModal, setShowModal] = useState(false);


  function hslToHexString(hslString: string) {
    // Extraer los valores de HSL del string
    const hslRegex = /hsl\((\d+),\s*(\d+)%\s*,\s*(\d+)%\)/;
    const matches = hslString.match(hslRegex);

    if (!matches) {
      throw new Error("Invalid HSL string format");
    }

    const hue = parseInt(matches[1], 10);
    const saturation = parseInt(matches[2], 10);
    const lightness = parseInt(matches[3], 10);

    // Convertir los valores a hexadecimal
    const hueHex = hue.toString(16).padStart(4, '0'); // 4 dígitos hexadecimales para el ángulo
    const saturationHex = Math.round(saturation * 10).toString(16).padStart(4, '0'); // 4 dígitos hexadecimales para la saturación
    const lightnessHex = Math.round(lightness * 10).toString(16).padStart(4, '0'); // 4 dígitos hexadecimales para la luminosidad

    // Combinar los valores hexadecimales en un único string
    const hexString = `${hueHex}${saturationHex}${lightnessHex}`;

    return hexString;
  }



  // Output: 007902ce0168


  // Note: 👇 This can be a `worklet` function.
  const onSelectColor = ({ hex }: { hex: any }) => {
    // do something with the selected color.
    let hsl = colorKit.HSL(hex).string()
    const hexString = hslToHexString(hsl);
    console.log("HSL STRING: " + hsl);
    console.log("HEX STRING: " + hexString);
  };

  return (
    <View style={styles.container}>
      <Button title='Color Picker' onPress={() => setShowModal(true)} />

      <Modal visible={showModal} animationType='slide'>
        <ColorPicker style={{ width: '70%' }} value='red' onComplete={onSelectColor}>
          <Panel3 />
        </ColorPicker>

        <Button title='Ok' onPress={() => setShowModal(false)} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});