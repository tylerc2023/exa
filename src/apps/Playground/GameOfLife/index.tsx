import {useNavigation} from '@react-navigation/native';
import React, {memo, useCallback, useEffect, useRef, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Button, Screen, Slider, Text} from '../../../components';
import {useColor} from '../../../hooks';
import {getSmallestDimension} from '../../../models';
import {useRootSelector} from '../../../utils';
import {Cell} from './Cell';
import {Board, determineBoardItem, generateBoard, swapBoardItem} from './utils';

export const GameOfLife = memo(function PlaygroundGameOfLife() {
  const color = useColor();
  const [form, setForm] = useState({
    run: false,
    delay: 16,
    count: 20,
  });
  const [loading, setLoading] = useState(true);
  const [board, setBoard] = useState<Board>(generateBoard(form.count, 0.5));
  const runRef = useRef(form.run);
  const delayRef = useRef(form.delay);
  const timeoutRef = useRef<number | null>(null);
  const smallest = useRootSelector(getSmallestDimension);
  const size = smallest / form.count;
  const {goBack} = useNavigation();
  const styles = StyleSheet.create({
    container: {
      backgroundColor: color.background,
    },
  });

  const onClear = useCallback(() => setBoard(generateBoard(form.count)), [
    form.count,
  ]);

  const onItemPress = useCallback(
    (x: number, y: number) => () => {
      setBoard(state =>
        state.map((rows, i) =>
          rows.map((item, j) => swapBoardItem(item, x, y, i, j)),
        ),
      );
    },
    [],
  );

  const onRandom = useCallback(() => setBoard(generateBoard(form.count, 0.5)), [
    form.count,
  ]);

  const loop = useCallback(() => {
    if (!runRef.current) return;

    setBoard(state =>
      state.map((rows, i) =>
        rows.map((_, j) => determineBoardItem(state, i, j)),
      ),
    );

    timeoutRef.current = setTimeout(loop, delayRef.current);
  }, []);

  const onStart = useCallback(() => {
    setForm(state => ({...state, run: !state.run}));
    runRef.current = !runRef.current;
    loop();
  }, [loop]);

  const onCountSlide = useCallback((value: number) => {
    setForm(state => ({...state, count: value}));
    setBoard(generateBoard(value, 0.5));
  }, []);

  const onDelaySlide = useCallback((value: number) => {
    setForm(state => ({...state, delay: value}));
    delayRef.current = value;
  }, []);

  useEffect(() => {
    setLoading(false);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [timeoutRef]);
  const navBack = useCallback(() => goBack(), [goBack]);

  return (
    <Screen dropShadow onLeftPress={navBack} title="Game of life">
      {loading ? (
        <Text emphasis="medium" title="loading..." type="h5" />
      ) : (
        <>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{alignSelf: 'center'}}
              title={`count: ${form.count}`}
              type="h4"
            />
            <Slider
              maximumValue={100}
              minimumValue={1}
              onSlidingComplete={onCountSlide}
              step={1}
              style={{flex: 1}}
              value={10}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{alignSelf: 'center'}}
              title={`delay: ${Math.floor(form.delay)}`}
              type="h4"
            />
            <Slider
              maximumValue={100}
              minimumValue={1}
              onSlidingComplete={onDelaySlide}
              step={1}
              style={{flex: 1}}
              value={10}
            />
          </View>
          <View style={styles.container}>
            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Button onPress={onStart} title={form.run ? 'stop' : 'start'} />
              <Button onPress={onRandom} title="random" />
              <Button onPress={onClear} title="clear" />
            </View>
            {board.map((rows, x) => (
              <View
                key={`${x}`}
                style={{flexDirection: 'row', justifyContent: 'center'}}>
                {rows.map((row, y) => (
                  <Cell
                    key={`${x}-${y}`}
                    onItemPress={onItemPress}
                    row={row}
                    size={size}
                    x={x}
                    y={y}
                  />
                ))}
              </View>
            ))}
          </View>
        </>
      )}
    </Screen>
  );
});
