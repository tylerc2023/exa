import {createSelector} from 'reselect';
import {RootAction, RootState} from 'root-types';
import {createAction, getType} from 'typesafe-actions';
import {getUser, removeUser} from './User';

/* ACTIONS */
export const createBoard = createAction('complete/board/create')<Board>();
export const updateBoard = createAction('complete/board/update')<Board>();
export const removeBoard = createAction('complete/board/remove')<string>();
export const setActiveBoard = createAction('complete/board/setActive')<
  string | null
>();
export const updateBoardAddList = createAction('complete/board/addList')<{
  listId: string;
  boardId: string;
}>();
export const updateBoardRemoveList = createAction('complete/board/removeList')<{
  listId: string;
  boardId: string;
}>();
export const completeBoardActions = {
  createBoard,
  removeBoard,
  updateBoard,
  setActiveBoard,
  updateBoardAddList,
  updateBoardRemoveList,
};

/* SELECTORS */
export const getBoards = (state: RootState): Boards =>
  state.completeBoard.items;
export const getInboxBoardId = createSelector(
  [getUser, getBoards],
  (user, boards) => {
    const inboxBoardId = user?.boards.filter(
      (boardId) => boards[boardId].title === 'Inbox',
    )[0];
    if (!inboxBoardId) throw new Error('missing inbox board');

    return inboxBoardId;
  },
);
export const getCategoryBoardId = createSelector(
  [getUser, getBoards],
  (user, boards) => {
    const categoryBoardId = user?.boards.filter(
      (boardId) => boards[boardId].title !== 'Inbox',
    )[0];
    if (!categoryBoardId) throw new Error('missing category board');

    return categoryBoardId;
  },
);

/* INTERFACES */
export type CompleteBoardReducer = {
  active: string | null;
  items: Boards;
};
export type Board = {
  id: string;
  title: string;
  active: boolean;
  createdAt: number;
  updatedAt: number;
  lists: ReadonlyArray<string>;
};
export type Boards = {[key: string]: Board};

/* REDUCER */
const initialState: CompleteBoardReducer = {
  active: null,
  items: {},
};
export const completeBoardReducer = (
  state: CompleteBoardReducer = initialState,
  action: RootAction,
): CompleteBoardReducer => {
  switch (action.type) {
    case getType(setActiveBoard):
      return {...state, active: action.payload};
    case getType(createBoard):
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.id]: action.payload,
        },
      };
    case getType(updateBoard):
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
    case getType(removeBoard):
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
    case getType(updateBoardAddList):
      const addBoard = state.items[action.payload.boardId];
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.boardId]: {
            ...addBoard,
            lists: [...addBoard.lists, action.payload.listId],
            updatedAt: Date.now(),
          },
        },
      };
    case getType(updateBoardRemoveList):
      const deleteBoard = state.items[action.payload.boardId];
      return {
        ...state,
        items: {
          ...state.items,
          [action.payload.boardId]: {
            ...deleteBoard,
            lists: deleteBoard.lists.filter(
              (listId) => listId !== action.payload.listId,
            ),
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
