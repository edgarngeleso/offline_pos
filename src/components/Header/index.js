import {StyleSheet, Text, useColorScheme, View} from 'react-native';
import React, {useContext, useState} from 'react';
import {
  Icon,
  Menu,
  MenuItem,
  OverflowMenu,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {colors, Constants} from '../../utils';
import Animated, {
  FadeInUp,
  FadeOutUp,
  SlideInDown,
  SlideInUp,
  SlideOutDown,
  SlideOutUp,
} from 'react-native-reanimated';

import {AuthContext, SettingsContext} from '../../contexts';

const _entering = SlideInUp.springify().damping(20);
const _exiting = FadeOutUp.springify().damping(20);

const Header = ({navigation, heading,is_drawer=true}) => {
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
    <Animated.View entering={_entering} exiting={_exiting}>
      <TopNavigation
        style={{
          backgroundColor: 'transparent',
          marginBottom: 10,
        }}
        accessoryLeft={props => (
          <React.Fragment>
            <TopNavigationAction
                onPress={() => {
                  is_drawer?navigation.openDrawer():navigation.goBack();
                }}
                icon={props => (
                  <Icon {...props} name={is_drawer?'menu':'arrow-back'} fill={app_colors.icon_color} />
                )}
              />
            <Text
            style={{
              color: app_colors.text_color,
              fontSize: 20,
              fontWeight: 'bold',
            }}>
            {heading??auth.user.name ?? Constants.APP_NAME}
          </Text>
          </React.Fragment>
        )}
        accessoryRight={() => {
          return (
            <React.Fragment>
              

              <TopNavigationAction
                onPress={() => navigation.navigate('notifications')}
                icon={props => (
                  <Icon {...props} name={'bell'} fill={app_colors.icon_color} />
                )}
              />

              <TopNavigationAction
                onPress={() => navigation.navigate('profile')}
                icon={props => (
                  <Icon
                    {...props}
                    name={'person'}
                    fill={app_colors.icon_color}
                  />
                )}
              />

              <TopNavigationAction
                onPress={() => navigation.navigate('settings')}
                icon={props => (
                  <Icon
                    {...props}
                    name={'settings'}
                    fill={app_colors.icon_color}
                  />
                )}
              />
            </React.Fragment>
          );
        }}></TopNavigation>
    </Animated.View>
  );
};



export default Header;

const styles = StyleSheet.create({});
