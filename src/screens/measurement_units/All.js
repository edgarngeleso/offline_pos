import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {AuthContext, ReloadAll, SettingsContext} from '../../contexts';
import {colors} from '../../utils';
import {Button, Icon, Layout} from '@ui-kitten/components';
import {Header} from '../../components';
import Animated, {SlideInDown, FadeOutDown} from 'react-native-reanimated';
import {MeasurementUnit, User} from '../../models';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const All = ({navigation}) => {
  const [refresh, setRefresh] = useState(false);
  const [users, setUsers] = useState({});

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

  async function load() {
    let response = await MeasurementUnit.selectAll();
    setUsers(response);
    setRefresh(false);
  }

  const deleteItem = async item => {
    let query = 'DELETE FROM measurement_units WHERE id=?';
    let response = await MeasurementUnit.remove(query, [item.id]);
    if (!response.error) {
      setRefresh(true);
      load();
    }
  };
  useEffect(() => {
    load();
  }, [reloadAll?.measurement_units]);

  return (
    <Layout
      style={{
        flex: 1,
        backgroundColor: app_colors.app_color,
      }}>
      <Header navigation={navigation} heading={'All'} is_drawer={false} />
      <Text
        style={{
          color: app_colors.text_color,
          textAlign: 'center',
          margin: 20,
        }}>
        Measurement units
      </Text>
      <Button
        onPress={() => navigation.navigate('create-measurement-unit')}
        style={{
          width: 200,
          margin: 10,
        }}>
        Add Measurement unit
      </Button>
      <ScrollView
        contentContainerStyle={{
          gap: 10,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              setRefresh(true);
              load();
            }}
          />
        }>
        {users?.data &&
          users?.data.map((item, index) => {
            return (
              <AnimatedTouchableOpacity
                onPress={() =>
                  navigation.navigate('edit-measurement-unit', {...item})
                }
                entering={_entering}
                key={index}
                style={{
                  ...styles.vehicle,
                  backgroundColor: app_colors.box_color,
                  borderWidth: 1,
                  borderColor: app_colors.border_color,
                }}>
                <Text
                  style={{
                    color: app_colors.text_color,
                    fontWeight: 'bold',
                    fontSize: 20,
                  }}>
                  {item.name}
                </Text>
                <Text style={{color: app_colors.text_color}}>{item.alias}</Text>
                <Text style={{color: app_colors.text_color}}>
                  {item.has_decimals ? 'Has decimals' : ''}
                </Text>

                <Button
                  onPress={() =>
                    navigation.navigate('edit-measurement-unit', {...item})
                  }
                  status="warning"
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 10,
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  }}
                  accessoryLeft={props => (
                    <Icon
                      {...props}
                      name={'edit'}
                      size={40}
                      fill={app_colors.icon_color}
                    />
                  )}
                />

                <Button
                  onPress={() => deleteItem(item)}
                  status="danger"
                  style={{
                    position: 'absolute',
                    top: 40,
                    right: 10,
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  }}
                  accessoryLeft={props => (
                    <Icon
                      {...props}
                      name={'trash'}
                      size={40}
                      fill={app_colors.danger}
                    />
                  )}
                />
              </AnimatedTouchableOpacity>
            );
          })}
      </ScrollView>
    </Layout>
  );
};

export default All;

const styles = StyleSheet.create({
  vehicle: {
    padding: 10,
    gap: 10,
    borderRadius: 20,
    width:"98%",
    margin:"1%",
    marginBottom:0,
  },
});
