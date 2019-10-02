import { ActionType, createStandardAction, getType } from "typesafe-actions";
import { RootAction, RootState, screens } from "../../containers";
import { logout } from "../Auth";

/* ACTIONS */
export const navigate = createStandardAction("navigation/CHANGE_NAVIGATION")<
  NavigationScreen
>();

/* SELECTORS */
export const getScreen = (state: RootState): NavigationScreen =>
  state.navigation.screen;
export const getModal = (state: RootState): NavigationModal =>
  state.navigation.modal;

/* INTERFACES */
export type NavigationScreen = keyof typeof screens;

export enum NavigationModal {
  None,
  CantHurtMeProfile,
  CantHurtMeConfigs
}

export interface Navigation {
  modal: NavigationModal;
  screen: NavigationScreen;
}

export type NavigationActions = ActionType<typeof navigate>;

/* REDUCERS */
export const navigationInitialState: Navigation = {
  modal: NavigationModal.None,
  screen: "portfolioLanding"
};
export function navigationReducer(
  state: Navigation = navigationInitialState,
  action: RootAction
): Navigation {
  switch (action.type) {
    case getType(navigate):
      return {
        ...state,
        screen: action.payload
      };
    case getType(logout):
      return navigationInitialState;
    default:
      return state;
  }
}
