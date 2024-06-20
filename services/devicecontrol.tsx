// En tu componente React
import { Device, DeviceControl } from "@/types";
export const controlarLEDRGB = async ({ options }: { options: DeviceControl }) => {
    try {
        const response = await fetch('http://192.168.0.103:3001/controlar_dispositivo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ options }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al enviar solicitud al servidor:', error);
    }
};
export const controlarSwitch = async (switchControl: boolean) => {

    try {
        const response = await fetch('http://192.168.0.103:3001/controlar_switch', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ switchControl }),
        });

        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error al enviar solicitud al servidor:', error);
    }
};

export const getState = async (device: Device) => { // Modificada para recibir el tipo de dispositivo como parámetro
    try {
        const response = await fetch('http://192.168.0.103:3001/getState?' + new URLSearchParams({
            type: device.type,
        }))
        const data = await response.json();
        return data
    } catch (error) {
        console.error('Error al enviar solicitud al servidor:', error);
    }

}


export const reconnect = async ({ reconnect }: { reconnect: boolean }) => {
    try {
        const response = await fetch('http://192.168.0.103:3001/reconnect', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reconnect })
        })
        const data = await response.json()
        return data;

    } catch (error) {
        console.error('Error al enviar solicitud al servidor:', error);
    }
}


