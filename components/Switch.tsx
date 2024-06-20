import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { controlarSwitch, getState, reconnect } from '@/services/devicecontrol';

export const Switch: React.FC = () => {
    const [switchState, setSwitchState] = useState(false);
    const [isSwitchAvailable, setIsSwitchAvailable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        const response = await controlarSwitch(!switchState);
        setSwitchState(response.state);
    };

    const handleState = async () => {
        const res = await getState({ type: "switch" });
        setIsSwitchAvailable(res.state === true);
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

    useEffect(() => {
        handleState();
        const interval = setInterval(() => handleState(), 15000);
        return () => clearInterval(interval);
    }, []);

    if (!isSwitchAvailable) {
        return (
            <View style={[styles.switchview]}>
                <Text style={styles.title}>Switch</Text>
                <Text style={styles.subtitle}>Disconnected</Text>
                {!isLoading ? (
                    <Pressable style={styles.reconnectButton} onPress={handleReconnect}>
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
    }

    return (
        <View style={[styles.switchview, isSwitchAvailable ? { height: 120 } : null]} >
            <Text style={styles.title}>Switch</Text>
            <Pressable style={switchState ? styles.buttonOn : styles.buttonOff} onPress={handleClick}>
                <Ionicons name="power" size={20} color={switchState ? "black" : "white"} />
            </Pressable>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 25,
        fontWeight: "bold"
    },
    subtitle: {
        fontSize: 20,
        fontWeight: "400",
        alignSelf: "center"
    },
    switchview: {
        padding: 15,
        borderWidth: 1,
        borderColor: "black",
        borderRadius: 10,
        maxWidth: 150,
        backgroundColor: "rgba(255, 255, 255, 0.7)",
        margin: 5
    },
    buttonOn: {
        justifyContent: "center",
        padding: 7,
        margin: 7,
        borderRadius: 10,
        backgroundColor: "rgba(0, 150, 200, 0.5)",
        alignItems: "center"
    },
    buttonOff: {
        justifyContent: "center",
        padding: 7,
        margin: 7,
        borderRadius: 10,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        alignItems: "center"
    },
    reconnectButton: { padding: 3, width: 100, borderRadius: 10, backgroundColor: "rgba(0, 175, 32, 0.7)", margin: 5 },
});
