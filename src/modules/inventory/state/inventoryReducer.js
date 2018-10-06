import uuid from 'uuid/v4';
import {
  INVENTORY_GLOBAL_REQUEST,
  INVENTORY_GLOBAL_SUCCESS,
  INVENTORY_GLOBAL_FAILURE,
  INVENTORY_CHANGE_RECEIVED,
  INVENTORY_CHANGE_LOG_REMOVE_NEW_FLAG,
  INVENTORY_CHANGE_LOG_SUCCESS,
  INVENTORY_CHANGE_LOG_REQUEST,
  INVENTORY_CHANGE_LOG_FAILURE,
} from './inventoryActions';

const initialState = {
  items: {},
  changeLog: [],
  isGlobalLoading: false,
  isGlobalLoaded: false,
  hasGlobalLoadingError: false,
  isChangeLogLoading: false,
  isChangeLogLoaded: false,
  hasChangeLogLoadingError: false,
};

const inventoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case INVENTORY_GLOBAL_REQUEST:
      return {
        ...state,
        isGlobalLoading: true,
        hasGlobalLoadingError: false,
      };

    case INVENTORY_GLOBAL_SUCCESS:
      return {
        ...state,
        items: action.payload.inventory.reduce(
          (itemsCarry, storeInventory) => ({
            ...itemsCarry,
            [storeInventory.storeId]: {
              ...storeInventory,
              inventory: storeInventory.inventory.reduce(
                (inventoryCarry, shoeInventory) => ({
                  ...inventoryCarry,
                  [shoeInventory.shoeId]: shoeInventory,
                }),
                {},
              ),
            },
          }),
          state.items,
        ),
        isGlobalLoading: false,
        isGlobalLoaded: true,
        hasGlobalLoadingError: false,
      };

    case INVENTORY_GLOBAL_FAILURE:
      return {
        ...state,
        isGlobalLoading: false,
        hasGlobalLoadingError: true,
      };

    case INVENTORY_CHANGE_LOG_REQUEST:
      return {
        ...state,
        isChangeLogLoading: true,
        hasChangeLogLoadingError: false,
      };

    case INVENTORY_CHANGE_LOG_SUCCESS:
      return {
        ...state,
        changeLog: action.payload.changeLog,
        isChangeLogLoading: false,
        isChangeLogLoaded: true,
        hasChangeLogLoadingError: false,
      };

    case INVENTORY_CHANGE_LOG_FAILURE:
      return {
        ...state,
        isChangeLogLoading: false,
        hasChangeLogLoadingError: true,
      };

    case INVENTORY_CHANGE_LOG_REMOVE_NEW_FLAG:
      return {
        ...state,
        changeLog: state.changeLog.map(x => ({ ...x, isNew: false })),
      };

    case INVENTORY_CHANGE_RECEIVED:
      return {
        ...state,
        changeLog: [
          { ...action.payload, id: uuid(), isNew: true },
          ...state.changeLog,
        ],
        items: {
          ...state.items,
          [action.payload.store]: {
            ...state.items[action.payload.store],
            inventory: {
              ...state.items[action.payload.store].inventory,
              [action.payload.model]: {
                ...state.items[action.payload.store].inventory[
                  action.payload.model
                ],
                sold:
                  state.items[action.payload.store].inventory[
                    action.payload.model
                  ].sold + 1,
                quantity: action.payload.inventory,
              },
            },
          },
        },
      };
    default:
      return state;
  }
};

export default inventoryReducer;
