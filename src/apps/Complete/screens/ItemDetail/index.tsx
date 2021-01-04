import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback} from 'react';
import {Keyboard, View} from 'react-native';
import {Button, Modal, Text} from '../../../../components';
import {useColor} from '../../../../hooks';
import {Theme, useRootDispatch, useRootSelector} from '../../../../utils';
import {Card, TextInputWithIcons} from '../../components';
import {removeItem, updateItem, updateListRemoveItem} from '../../models';

// TODO: update does not go to previous screen
// TODO: delete does not go to previous screen
// TODO: delete needs confirmation alert

export const ItemDetail = memo(function ItemDetail() {
  const dispatch = useRootDispatch();
  const {goBack} = useNavigation();
  const color = useColor();
  const navBack = useCallback(() => {
    console.log('black');
    goBack();
  }, [goBack]);
  const itemId = useRootSelector((s) => s.completeItem.active);
  const listId = useRootSelector((s) => s.completeList.active);
  const item = useRootSelector((s) => s.completeItem.items[itemId || '']);

  const onItemDelete = useCallback(() => {
    if (!itemId || !listId)
      throw new Error('missing listId or itemId on item detail screen');
    dispatch(removeItem(itemId));
    dispatch(updateListRemoveItem({listId, itemId}));
  }, [dispatch, itemId, listId]);

  const onItemClose = useCallback(() => {
    console.log('here');
    Keyboard.dismiss();
  }, []);

  const onItemSubmit = useCallback(
    (type: string) => (text: string) => {
      console.log(type, text);
      dispatch(updateItem({...item, [type]: text}));
      Keyboard.dismiss();
    },
    [dispatch, item],
  );

  const icons = useCallback(
    (type: string) => [
      {name: 'close', onPress: onItemClose, focus: true},
      {
        name: 'send',
        onPress: onItemSubmit(type),
        color: color.primary,
        focus: true,
        required: true,
      },
    ],
    [color.primary, onItemClose, onItemSubmit],
  );

  return !item ? null : (
    <Modal backgroundColor={color.surface} onBackgroundPress={navBack}>
      {!item ? (
        <Text title="missing item" />
      ) : (
        <View>
          <Card>
            <TextInputWithIcons
              icons={icons('title')}
              onSubmit={onItemSubmit('title')}
              placeholder="item title..."
              type="h4"
              value={item.title}
            />
          </Card>
          <Card>
            <TextInputWithIcons
              icons={icons('description')}
              onSubmit={onItemSubmit('description')}
              placeholder="item details..."
              value={item.description || ''}
            />
          </Card>
          <Card>
            <Text
              style={{paddingBottom: Theme.padding.p04}}
              title="Reminders"
              type="h3"
            />
          </Card>
          <Card>
            <Button center onPress={onItemDelete} title="delete" />
          </Card>
        </View>
      )}
    </Modal>
  );
});
