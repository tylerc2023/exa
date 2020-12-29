import React, {memo, useCallback} from 'react';
import {v4} from 'uuid';
import {useRootDispatch} from '../../../utils';
import {createList, List, updateBoardAddList} from '../models';
import {AddButton} from './AddButton';

type AddListProps = {
  boardId: string;
  placeholder: string;
  title: string;
  width: number;
};

export const AddList = memo(function AddList({
  placeholder,
  title,
  boardId,
  width,
}: AddListProps) {
  const dispatch = useRootDispatch();
  const onSubmit = useCallback(
    (value: string) => {
      const listId = v4();
      const date = Date.now();
      const list: List = {
        id: listId,
        active: true,
        title: value,
        createdAt: date,
        updatedAt: date,
        items: [],
      };
      dispatch(createList(list));
      dispatch(updateBoardAddList({boardId, listId}));
    },
    [boardId, dispatch],
  );

  return (
    <AddButton
      onSubmit={onSubmit}
      placeholder={placeholder}
      title={title}
      width={width}
    />
  );
});
