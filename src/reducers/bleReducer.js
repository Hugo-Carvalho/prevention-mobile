import { SAVE_BLE, REMOVE_BLE, STATUS_BLE } from '../actions';

export default function bleReducer(state = {
    ble: {},
    statusBle: 'disconnected'
}, action) {
    switch (action.type) {
        case SAVE_BLE:
            return { ...state, ble: action.ble };
        case REMOVE_BLE:
            return { ...state, ble: action.ble };
        case STATUS_BLE:
            return { ...state, statusBle: action.statusBle };
        default:
            return state;
    }
};