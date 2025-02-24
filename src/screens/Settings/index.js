import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {Icon, TopNavigation, TopNavigationAction} from '@ui-kitten/components';
import {SettingsContext} from '../../contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {colors} from '../../utils';

const Settings = ({navigation}) => {
  const isDark = useColorScheme() == 'dark';
  const [app_settings, setSettings] = useContext(SettingsContext);
  const [changes, setChanges] = useState({
    dark_theme: app_settings.dark_theme,
    system_theme: app_settings.system_theme,
    auto_save: app_settings.auto_save,
    show_notifications: app_settings.show_notifications,
    auto_suggest: app_settings.auto_suggest,
    ads: app_settings.ads,
  });

  let app_colors = colors.light;
  if (app_settings.dark_theme) {
    app_colors = colors.dark;
  }

  if (app_settings.system_theme && !app_settings.dark_theme) {
    app_colors = isDark ? colors.dark : colors.light;
  }

  const save = async (values) => {
    setSettings(values);
    await AsyncStorage.setItem('settings', JSON.stringify(values));
  };

  return (
    <View
      style={{
        backgroundColor: app_colors.app_color,
        flex: 1,
      }}>
      <TopNavigation
        style={{
          backgroundColor: app_colors.app_color,
        }}
        accessoryLeft={props => (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}>
            <TopNavigationAction
              onPress={() => navigation.goBack()}
              icon={props => (
                <Icon
                  {...props}
                  name={'arrow-back'}
                  fill={app_colors.icon_color}
                />
              )}
            />
            <Text style={{color: app_colors.text_color}}>Settings</Text>
          </View>
        )}></TopNavigation>
      <Text
        style={{
          color: app_colors.text_color,
          textAlign: 'center',
          fontSize: 24,
          margin: 10,
        }}>
        Settings
      </Text>

      <ScrollView contentContainerStyle={{...styles.holder}}>
        <View
          style={{
            ...styles.container,
          }}>
          <Text style={{...styles.text, color: app_colors.text_color}}>
            Dark theme
          </Text>
          <Switch
            value={changes.dark_theme}
            trackColor={{true: app_colors.active, false: app_colors.in_active}}
            thumbColor={changes.dark_theme ? app_colors.active : app_colors.in_active}
            onValueChange={() => {
              let values = {...changes, dark_theme: !changes.dark_theme};
              setChanges(values);
              save(values);
            }}
          />
        </View>

        <View
          style={{
            ...styles.container,
          }}>
          <Text style={{...styles.text, color: app_colors.text_color}}>
            System theme
          </Text>
          <Switch
            value={changes.system_theme}
            trackColor={{true: app_colors.active, false: app_colors.in_active}}
            thumbColor={changes.system_theme ? app_colors.active : app_colors.in_active}
            onValueChange={() => {
              let values = {...changes, system_theme: !changes.system_theme};
              setChanges(values);
              save(values);
            }}
          />
        </View>

        <View
          style={{
            ...styles.container,
          }}>
          <Text style={{...styles.text, color: app_colors.text_color}}>
            Auto save notes
          </Text>
          <Switch
            value={changes.auto_save}
            trackColor={{true: app_colors.active, false: app_colors.in_active}}
            thumbColor={changes.auto_save ? app_colors.active : app_colors.in_active}
            onValueChange={() => {
              let values = {...changes, auto_save: !changes.auto_save};
              setChanges(values);
              save(values);
            }}
          />
        </View>

        <View
          style={{
            ...styles.container,
          }}>
          <Text style={{...styles.text, color: app_colors.text_color}}>
            Daily notifications
          </Text>
          <Switch
            value={changes.show_notifications}
            trackColor={{true: app_colors.active, false: app_colors.in_active}}
            thumbColor={changes.show_notifications ? app_colors.active : app_colors.in_active}
            onValueChange={() => {
              let values = {...changes, show_notifications: !changes.show_notifications};
              setChanges(values);
              save(values);
            }}
          />
        </View>

        <View
          style={{
            ...styles.container,
          }}>
          <Text style={{...styles.text, color: app_colors.text_color}}>
            Suggestions
          </Text>
          <Switch
            value={changes.auto_suggest}
            trackColor={{true: app_colors.active, false: app_colors.in_active}}
            thumbColor={changes.auto_suggest ? app_colors.active : app_colors.in_active}
            onValueChange={() => {
              let values = {...changes, auto_suggest: !changes.auto_suggest};
              setChanges(values);
              save(values);
            }}
          />
        </View>

        <View
          style={{
            ...styles.container,
          }}>
          <Text style={{...styles.text, color: app_colors.text_color}}>
            Ads
          </Text>
          <Switch
            value={changes.ads}
            trackColor={{true: app_colors.active, false: app_colors.in_active}}
            thumbColor={changes.ads ? app_colors.active : app_colors.in_active}
            onValueChange={() => {
              let values = {...changes, ads: !changes.ads};
              setChanges(values);
              save(values);
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  holder: {
    flexDirection: 'column',
    gap: 10,
  },
  container: {
    width: '98%',
    margin: '1%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  text: {
    color: '#000',
    fontSize: 20,
  },
});
