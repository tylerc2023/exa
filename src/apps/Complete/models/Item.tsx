import {createSelector} from 'reselect';
import {RootAction, RootState} from 'root-types';
import {createAction, getType} from 'typesafe-actions';
import {removeUser} from './User';

/* ACTIONS */
export const createItem = createAction('complete/item/create')<Item>();
export const updateItem = createAction('complete/item/update')<Item>();
export const removeItem = createAction('complete/item/remove')<string>();
export const setActiveItem = createAction('complete/item/setActive')<string>();
export const completeItemActions = {
  createItem,
  removeItem,
  updateItem,
  setActiveItem,
};

/* SELECTORS */
export const getItems = (state: RootState): Items => state.completeItem.items;
export const getCurrentItem = (state: RootState): Item => {
  const active = state.completeItem.active;
  if (!active) throw new Error('missing current item');

  return state.completeItem.items[active];
};
export const getActiveItemOrderByCreatedAt = createSelector(
  [getItems],
  (items) =>
    Object.values(items)
      .filter((item) => item.active)
      .sort((a, b) => a.createdAt - b.createdAt),
);

/* INTERFACES */
export type CompleteItemReducer = {
  active: string | undefined;
  items: Items;
};
export type Item = {
  id: string;
  title: string;
  description?: string;
  active: boolean;
  createdAt: number;
  updatedAt: number;
  board?: string;
  tags?: ReadonlyArray<string>;
};
export type Items = {[key: string]: Item};

/* REDUCER */
const initialState: CompleteItemReducer = {
  active: undefined,
  items: {},
};
export const completeItemReducer = (
  state: CompleteItemReducer = initialState,
  action: RootAction,
): CompleteItemReducer => {
  switch (action.type) {
    case getType(setActiveItem):
      return {...state, active: action.payload};
    case getType(createItem):
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: action.payload,
        },
      };
    case getType(updateItem):
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: {
            ...state.items[action.payload.id],
            ...action.payload,
            updatedAt: Date.now(),
          },
        },
      };
    case getType(removeItem):
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload]: {
            ...state.items[action.payload],
            active: false,
            updatedAt: Date.now(),
          },
        },
      };
    case getType(removeUser):
      return initialState;
    default:
      return state;
  }
};
