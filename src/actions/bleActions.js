export const SAVE_BLE = 'SAVE_BLE';
const saveBle = ble => ({
    type: SAVE_BLE,
    ble
});

export const REMOVE_BLE = 'REMOVE_BLE';
const removeBle = () => ({
    type: REMOVE_BLE,
    ble: null
});

export const STATUS_BLE = 'STATUS_BLE';
const statusBle = statusBle => ({
    type: STATUS_BLE,
    statusBle
});

export const saveBleToken = (ble) => dispatch => {
    dispatch(saveBle(ble));
}

export const removeBleToken = () => dispatch => {
    dispatch(removeBle());
}

export const setStatusBle = (status) => dispatch => {
    dispatch(statusBle(status));
}