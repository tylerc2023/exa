import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback, useState} from 'react';
import {Keyboard, View} from 'react-native';
import {Button, Modal, Text} from '../../../../components';
import {useColor} from '../../../../hooks';
import {Theme, useRootDispatch, useRootSelector} from '../../../../utils';
import {Card, DeleteModal, ItemContext, ItemEdit} from '../../components';
import {removeItem, updateItem, updateListRemoveItem} from '../../models';

// TODO: update does not go to previous screen

export const ItemDetail = memo(function ItemDetail() {
  const dispatch = useRootDispatch();
  const {goBack} = useNavigation();
  const color = useColor();
  const navBack = useCallback(() => goBack(), [goBack]);
  const itemId = useRootSelector((s) => s.completeItem.active);
  const listId = useRootSelector((s) => s.completeList.active);
  const item = useRootSelector((s) => s.completeItem.items[itemId || '']);
  const [deleteModal, setDeleteModal] = useState(false);

  const onItemDelete = useCallback(() => {
    if (!itemId || !listId)
      throw new Error('missing listId or itemId on item detail screen');
    dispatch(removeItem(itemId));
    dispatch(updateListRemoveItem({listId, itemId}));
    setDeleteModal(false);
    goBack();
  }, [dispatch, goBack, itemId, listId]);

  const onItemSubmit = useCallback(
    (type: string) => (text: string) => {
      dispatch(updateItem({...item, [type]: text}));
      Keyboard.dismiss();
    },
    [dispatch, item],
  );

  const onDeletePress = useCallback(() => setDeleteModal(true), []);
  const onDeleteClose = useCallback(() => setDeleteModal(false), []);

  return !item ? null : (
    <>
      <Modal backgroundColor={color.surface} onBackgroundPress={navBack}>
        {!item ? (
          <Text title="missing item" />
        ) : (
          <View>
            <ItemEdit
              description={item.description}
              onSubmit={onItemSubmit}
              placeholder="Item"
              title={item.title}
            />
            <Card margin="bottom">
              <Text title="Reminders" />
            </Card>
            <Card margin="bottom">
              <Text title="Tags" />
            </Card>
            <Card margin="bottom">
              <Text title="Comments" />
            </Card>
            <ItemContext
              createdAt={item.createdAt}
              updatedAt={item.updatedAt}
              userId={item.userId}
            />
            <View
              style={{
                flexDirection: 'row',
                flex: 1,
                justifyContent: 'space-between',
              }}>
              <Card flex>
                <Button center onPress={navBack} title="close" />
              </Card>
              <View style={{padding: Theme.padding.p02}} />
              <Card flex>
                <Button
                  center
                  color="danger"
                  onPress={onDeletePress}
                  title="delete"
                />
              </Card>
            </View>
          </View>
        )}
      </Modal>
      {!deleteModal ? null : (
        <DeleteModal onCancel={onDeleteClose} onDelete={onItemDelete} />
      )}
    </>
  );
});
