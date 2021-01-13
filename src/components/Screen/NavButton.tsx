import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';
import {useColor} from '../../hooks';
import {Config} from '../../utils';
import {Icon} from '../Icon';

interface Props {
  icon: string;
  isRight?: boolean;
  onPress?(): void;
  testID: string;
}

export const NavButton = memo(
  ({onPress = undefined, icon, isRight = false, testID}: Props) => {
    const color = useColor();
    const styles = StyleSheet.create({
      button: {
        padding: Config.padding(3),
      },
      buttonRight: {
        alignSelf: 'flex-end',
      },
    });
    return (
      <View style={styles.button}>
        <Icon
          color={color.secondary}
          hidden={!onPress}
          name={icon}
          onPress={onPress}
          size={Config.padding(9)}
          style={isRight && styles.buttonRight}
          testID={testID}
        />
      </View>
    );
  },
);
