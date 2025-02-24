import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Animated, {
  FadeInDown,
  SlideInDown,
  SlideOutLeft,
} from 'react-native-reanimated';
import {colors} from '../../utils';
import { app_logo } from '../../assets';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const _entering = FadeInDown.springify().damping(20);
const _exiting = SlideOutLeft.springify().damping(20);

const Splash = () => {
  return (
    <Animated.View
      entering={_entering}
      exiting={_exiting}
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.APP_SECONDARY_COLOR,
        gap:10
      }}>
      <AnimatedImage
        source={app_logo}
        entering={_entering}
        style={{
          width: 120,
          height: 120,
          objectFit: 'cover',
        }}
      />
      <Animated.Text
        entering={_entering}
        style={{
          fontSize: 33,
          color: colors.APP_DARK_COLOR,
          fontWeight: 'bold',
        }}>
        pos
      </Animated.Text>
    </Animated.View>
  );
};

export default Splash;

const styles = StyleSheet.create({});
