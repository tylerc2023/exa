import {ActionType, createAction, getType} from 'typesafe-actions';
import {RootAction, RootState} from '../../../providers';

/* ACTIONS */
export const createUser = createAction('complete/user/create')<User>();
export const updateUser = createAction('complete/user/update')<User>();
export const removeUser = createAction('complete/user/remove')<string>();
export const setActiveUser = createAction('complete/user/setActive')<boolean>();

/* SELECTORS */
export const getUser = (state: RootState): CompleteUserReducer =>
  state.completeUser;

/* INTERFACES */
export type CompleteUserReducer = User | null;
export type User = {
  id: string;
  name: string;
  active: boolean;
  createdAt: number;
  updatedAt: number;
  boards: ReadonlyArray<string>;
};
export type CompleteUserActions = ActionType<
  | typeof createUser
  | typeof removeUser
  | typeof updateUser
  | typeof setActiveUser
>;

/* REDUCER */
const initialState: CompleteUserReducer = null;
export const completeUserReducer = (
  state: CompleteUserReducer = initialState,
  action: RootAction,
): CompleteUserReducer => {
  switch (action.type) {
    case getType(setActiveUser):
      if (!state) {
        throw new Error('cannot set active to no user');
      }
      return {...state, active: action.payload};
    case getType(createUser):
      return action.payload;
    case getType(updateUser):
      return {
        ...state,
        ...action.payload,
        updatedAt: Date.now(),
      };
    case getType(removeUser):
      return null;
    default:
      return state;
  }
};