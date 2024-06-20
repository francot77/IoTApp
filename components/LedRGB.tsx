import { controlarLEDRGB, getState, reconnect } from "@/services/devicecontrol";
import { DeviceControl } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, ActivityIndicator, ScrollView } from "react-native"
import ColorPick from "./ColorPick";

const LedStatus: React.FC<{ switchLed: boolean; handleClick: ({ options }: { options: DeviceControl }) => void }> = ({ switchLed, handleClick }) => (
    <Pressable
        style={switchLed ? styles.ledstatuson : styles.ledstatusoff}
        onPress={() => handleClick({ options: { switchControl: !switchLed } })}
    >
        <Ionicons name="power" color={switchLed ? "black" : "white"} size={20} />
    </Pressable>
);

const ModeToggle: React.FC<{ mode: string; handleModeClick: () => void }> = ({ mode, handleModeClick }) => (
    <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={styles.fontbold15}>Toggle Mode</Text>
        <Pressable
            style={mode === "white" ? styles.ledmodewhite : styles.ledmodecolor}
            onPress={handleModeClick}
        >
            <Text style={styles.subtitle}>{mode === "white" ? "White" : "Color"}</Text>
        </Pressable>
    </View>
);

const LedControls: React.FC<{ mode: string; handleSliderRelease: (value: number) => void }> = ({ mode, handleSliderRelease }) => (
    <View>
        <Slider
            style={{ width: 200, height: 35, borderRadius: 10, backgroundColor: mode === "white" ? "rgba(255, 255, 255, 0.8)" : "rgba(200, 200, 200, 1)" }}
            value={1000}
            disabled={mode !== "white"}
            thumbTintColor='black'
            minimumValue={10}
            maximumValue={1000}
            maximumTrackTintColor="#7e7e7e"
            minimumTrackTintColor="#000000"
            onSlidingComplete={(value) => handleSliderRelease(parseInt(value.toFixed(0)))}
        />
        <ScrollView
            style={{ backgroundColor: mode !== "white" ? "rgba(255, 255, 255, 0.8)" : "transparent", borderRadius: 10, marginTop: 10 }}
        >
            <ColorPick disabled={mode !== "colour"} />
        </ScrollView>
    </View>
);

const ReconnectButton: React.FC<{ isLoading: boolean; handleReconnect: () => void }> = ({ isLoading, handleReconnect }) => (
    <View style={{ alignItems: "center" }}>
        <Text style={styles.subtitle}>The device is disconnected</Text>
        {!isLoading ? (
            <Pressable style={styles.ledreconnectbutton} onPress={handleReconnect}>
                <View style={{ flexDirection: "row", padding: 5, justifyContent: "center", gap: 5 }}>
                    <Text>Reconnect</Text>
                    <Ionicons size={20} name="log-in-outline" />
                </View>
            </Pressable>
        ) : (
            <View>
                <Text>Loading...</Text>
                <ActivityIndicator color={"black"} />
            </View>
        )}
    </View>
);

export const LedRGB: React.FC = () => {
    const [isLedAvaiable, setIsLedAvaiable] = useState(false);
    const [switchLed, setSwitchLed] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState("white");

    const handleModeClick = () => {
        const newMode = mode === "white" ? "colour" : "white";
        handleClick({ options: { mode: newMode } });
        setMode(newMode);
    };

    const handleState = async () => {
        const res = await getState({ type: "ledRGB" });
        setIsLedAvaiable(res.state === true);
        if (res.state === true) {
            setIsLoading(false);
        } else {
            setTimeout(() => {
                setIsLoading(false);
            }, 3000);
        }
    };

    const handleReconnect = async () => {
        setIsLoading(true);
        const response = await reconnect({ reconnect: true });
        if (response.status === true) {
            handleState();
        }
    };

    const handleClick = async ({ options }: { options: DeviceControl }) => {
        const data = await controlarLEDRGB({ options });
        if (data.switchControl !== undefined) setSwitchLed(data.switchControl);
        if (data.mode !== undefined) setMode(data.mode);
    };

    const handleSliderRelease = (value: number) => {
        controlarLEDRGB({ options: { bright: value } });
    };

    useEffect(() => {
        handleState();
        const interval = setInterval(() => handleState(), 15000);
        return () => clearInterval(interval);
    }, []);

    if (!isLedAvaiable) {
        return (
            <View style={styles.ledrgbcontainer}>
                <ReconnectButton isLoading={isLoading} handleReconnect={handleReconnect} />
            </View>
        )
    }

    return (
        <View style={styles.ledrgbcontainer}>
            <Text style={styles.title}>LedRGB</Text>
            <LedStatus switchLed={switchLed} handleClick={handleClick} />
            <ModeToggle mode={mode} handleModeClick={handleModeClick} />
            <LedControls mode={mode} handleSliderRelease={handleSliderRelease} />
        </View>
    );
};

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
    },
    fontbold15: {
        fontSize: 15,
        fontWeight: "bold",
        alignSelf: "center"
    },
    row: {
        flexDirection: "row"
    },
    ledrgbcontainer: { padding: 10, borderWidth: 1, borderColor: "black", borderRadius: 10, width: 230, backgroundColor: "rgba(255, 255, 255, 0.5)", margin: 5, justifyContent: "center" },
    ledstatuson: { padding: 7, width: 75, alignSelf: "center", borderRadius: 10, backgroundColor: "rgba(0, 150, 230, 0.5)", margin: 5, alignItems: "center" },
    ledstatusoff: { padding: 7, width: 75, alignSelf: "center", borderRadius: 10, backgroundColor: "rgba(0, 0, 0, 0.5)", margin: 5, alignItems: "center" },
    ledmodecolor: { padding: 7, paddingHorizontal: 10, borderRadius: 10, backgroundColor: "rgba(255, 255, 255, 0.7)", margin: 10, elevation: 20, alignItems: "center" },
    ledmodewhite: { padding: 7, justifyContent: "center", paddingHorizontal: 10, borderRadius: 10, backgroundColor: "rgba(255, 255, 255, 0.7)", elevation: 20, margin: 10, alignItems: "center" },
    ledreconnectbutton: { padding: 3, width: 100, borderRadius: 10, backgroundColor: "rgba(0, 175, 32, 0.7)", margin: 5 },
});