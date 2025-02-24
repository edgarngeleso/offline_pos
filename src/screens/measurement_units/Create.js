import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';

import {AuthContext, ReloadAll, SettingsContext} from '../../contexts';
import {colors} from '../../utils';
import {Button, Input, Layout} from '@ui-kitten/components';
import {Header} from '../../components';
import Animated, {SlideInDown, FadeOutDown} from 'react-native-reanimated';
import {MeasurementUnit, User} from '../../models';
import {err} from 'react-native-svg/lib/typescript/xml';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const Create = ({navigation}) => {
  const [item, setItem] = useState({
    name: '',
    alias: '',
    has_decimals: false,
    created_at: new Date(Date.now()),
  });

  const [error, setError] = useState({
    state: false,
    message: '',
  });

  const [reloadAll, setReloadAll] = useContext(ReloadAll);
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

  const createItem = async () => {
    let query =
      'INSERT INTO measurement_units(name,alias,has_decimals,created_at) VALUES(?,?,?,?)';
    let response = await MeasurementUnit.insert(query, [
      item.name,
      item.alias,
      item.has_decimals,
      item.created_at,
    ]);

    if (!response.error) {
      setReloadAll({...reloadAll,measurement_units:!reloadAll?.measurement_units})
      navigation.navigate('measurement-units');
    }
  };
  return (
    <Layout
      style={{
        flex: 1,
        backgroundColor: app_colors.app_color,
      }}>
      <Header
        navigation={navigation}
        heading={'Add measurement unit'}
        is_drawer={false}
      />

      <Text
        style={{
          color: error.state ? app_colors.danger : app_colors.text_color,
          textAlign: 'center',
          margin: 20,
        }}>
        {error.state ? error.message : 'Add new measurement unit'}
      </Text>
      <ScrollView
        contentContainerStyle={{
          gap: 10,
        }}>
        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Name
        </Text>
        <Input
          onChangeText={text => setItem({...item, name: text})}
          placeholder="Name"
        />
        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Alias
        </Text>
        <Input
          onChangeText={text => setItem({...item, alias: text})}
          placeholder="Alias"
        />

        <View
          style={{
            flexDirection: 'row',
            gap: 20,
          }}>
          <Text
            style={{
              ...styles.text,
              color: app_colors.text_color,
            }}>
            Has decimals?
          </Text>
          <Switch
            value={item.has_decimals}
            trackColor={{true: app_colors.active, false: app_colors.in_active}}
            thumbColor={
              item.has_decimals ? app_colors.active : app_colors.in_active
            }
            onValueChange={() =>
              setItem({...item, has_decimals: !item.has_decimals})
            }
          />
        </View>

        <Button onPress={() => createItem()}>SAVE</Button>
      </ScrollView>
    </Layout>
  );
};

export default Create;

const styles = StyleSheet.create({
  text: {
    marginBottom: 10,
    fontSize: 20,
  },
});
