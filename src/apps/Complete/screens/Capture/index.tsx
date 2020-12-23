import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback, useState} from 'react';
import {LayoutChangeEvent, Platform, View} from 'react-native';
import {Screen, Text} from '../../../../components';
import {useColor} from '../../../../hooks';
import {useRootSelector} from '../../../../utils';
import {
  HandleKeyboard,
  ListAdd,
  ListContainer,
  ListHeader2,
  ListItems,
  OrganizeButton,
} from '../../components';
import {config} from '../../configs';

export const Capture = memo(function Capture() {
  const color = useColor();
  const {navigate} = useNavigation();
  const navBack = useCallback(() => navigate('admin'), [navigate]);
  const keyboardHeight = useRootSelector(
    (state) => state.device.keyboardHeight,
  );
  const [dimensions, setDimensions] = useState({container: 0, button: 0});
  const android = Platform.OS === 'android';

  const listHeight =
    keyboardHeight === 0
      ? dimensions.container -
        dimensions.button -
        (android ? config.padding * 8 : config.padding * 13)
      : dimensions.container -
        keyboardHeight -
        (android ? config.padding * 3 : config.padding * 8);

  const listId = useRootSelector((s) => s.completeUser?.inbox);

  const onOrganize = useCallback(() => undefined, []);

  const onLayout = useCallback(
    (key: string) => (event: LayoutChangeEvent) => {
      const {height} = event.nativeEvent.layout;
      const preventMultipleUpdates =
        key === 'container' && dimensions.container > 0;
      if (preventMultipleUpdates) {
        return;
      }
      setDimensions((p) => ({...p, [key]: height}));
    },
    [dimensions.container],
  );

  const navToAccount = useCallback(() => navigate('account'), [navigate]);

  return (
    <Screen
      onLeftPress={navBack}
      onRightPress={navToAccount}
      rightIcon="account"
      title="Capture">
      <HandleKeyboard
        backgroundColor={color.surface}
        onLayout={onLayout('container')}
        render={dimensions.container > 0}>
        {listId ? (
          <View>
            <ListContainer>
              <ListHeader2 listId={listId} />
              <ListItems listId={listId} maxHeight={listHeight} />
              <ListAdd
                buttonTitle="Add item"
                inputPlaceholder="Item title..."
                listId={listId}
              />
            </ListContainer>
            <OrganizeButton
              listId={listId}
              onLayout={onLayout('button')}
              onPress={onOrganize}
            />
          </View>
        ) : (
          <Text title="missing account" />
        )}
      </HandleKeyboard>
    </Screen>
  );
});
