import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';

import {AuthContext, SettingsContext} from '../../contexts';
import {colors} from '../../utils';
import {Layout} from '@ui-kitten/components';
import {Header} from '../../components';
import Animated,{ SlideInDown, FadeOutDown } from 'react-native-reanimated';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

const VehiclesOnMap = ({navigation}) => {
  const [auth, setAuth] = useContext(AuthContext);

  const [isVisible, setIsVisible] = useState(false);

  const [app_settings, _] = useContext(SettingsContext);
  const isDark = useColorScheme() == 'dark';

  let app_colors = colors.light;
  if (app_settings.dark_theme) {
    app_colors = colors.dark;
  }

  if (app_settings.system_theme) {
    app_colors = isDark ? colors.dark : colors.light;
  }
  return (
    <Layout
      style={{
        flex: 1,
        backgroundColor: app_colors.app_color,
      }}>
      <Header navigation={navigation} />
      <Text
        style={{
          color: app_colors.text_color,
        }}>
        VehiclesOnMap
      </Text>
      

      <View
      style={{
        position: 'absolute',
        bottom: 0,
        height: 100,
        backgroundColor:"transparent",
      }}
      >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
          gap: 10,
          padding: 20,
          backgroundColor:"transparent",
        }}>
        {Array.from({length: 10}).map((_, index) => {
          return (
            <AnimatedTouchableOpacity
              entering={_entering}
              key={index}
              style={{
                ...styles.vehicle,
                backgroundColor: app_colors.box_color,
                borderWidth: 1,
                borderColor: app_colors.border_color,
              }}>
              <Text style={{color: app_colors.text_color}}>
                Vehicle {index + 1}
              </Text>
              <Text style={{color: app_colors.text_color}}>
                Vehicle {index + 1} REG
              </Text>
            </AnimatedTouchableOpacity>
          );
        })}
      </ScrollView>
      </View>
    </Layout>
  );
};

export default VehiclesOnMap;

const styles = StyleSheet.create({
  vehicle: {
    padding: 10,
    borderRadius: 20,
  },
});
