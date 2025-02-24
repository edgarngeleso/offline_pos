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
import {Button, Icon, Layout, Popover} from '@ui-kitten/components';
import {Header} from '../../components';
import Animated, {SlideInDown, FadeOutDown} from 'react-native-reanimated';
import {User} from '../../models';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const All = ({navigation, route}) => {
  const [activeButton, setActiveButton] = useState(
    route.params && route?.params.customers ? 2 : 0,
  );
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
    let query = `SELECT * FROM users`;
    let values = [];
    if (activeButton == 1) {
      query += `WHERE is_customer=?`;
      values = [1];
    } else if (activeButton == 2) {
      query += `WHERE is_customer=?`;
      values = [0];
    }
    query += ' ORDER BY id DESC';
    let response = await User.selectAll(query, values);
    setUsers(response);
    setRefresh(false);
  }

  const deleteItem = async item => {
    let query = 'DELETE FROM users WHERE id=?';
    let response = await User.remove(query, [item.id]);
    if (!response.error) {
      setRefresh(true);
      load();
    }
  };
  useEffect(() => {
    load();
  }, [reloadAll?.users]);

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
        Users
      </Text>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Button
          onPress={() => navigation.navigate('create-user')}
          style={{
            width: 100,
            margin: 10,
          }}>
          Add user
        </Button>

        <Popover
          visible={isVisible}
          onBackdropPress={() => setIsVisible(false)}
          anchor={props => (
            <Button
              {...props}
              onPress={() => setIsVisible(true)}
              style={{
                margin: 10,
                backgroundColor: 'transparent',
                borderColor: 'transparent',
              }}
              accessoryLeft={props => (
                <Icon
                  {...props}
                  name={'more-vertical'}
                  fill={app_colors.icon_color}
                  size={50}
                />
              )}
            />
          )}
          placement={'bottom'}>
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              flexWrap: 'wrap',
              margin: '1%',
              padding: 5,
            }}>
            <Button
              onPress={() => {
                setIsVisible(false);
                setActiveButton(0);
              }}
              style={{
                backgroundColor: app_colors.box_color,
                borderColor: 'transparent',
                marginTop: 5,
              }}>
              {props => (
                <Text {...props} style={{color: app_colors.text_color}}>
                  All
                </Text>
              )}
            </Button>
            <Button
              onPress={() => {
                setIsVisible(false);
                setActiveButton(1);
              }}
              style={{
                backgroundColor: app_colors.box_color,
                borderColor: 'transparent',
                marginTop: 5,
              }}>
              {props => (
                <Text {...props} style={{color: app_colors.text_color}}>
                  Users
                </Text>
              )}
            </Button>
            <Button
              onPress={() => {
                setIsVisible(false);
                setActiveButton(2);
              }}
              style={{
                backgroundColor: app_colors.box_color,
                borderColor: 'transparent',
                marginTop: 5,
              }}>
              {props => (
                <Text {...props} style={{color: app_colors.text_color}}>
                  Customers
                </Text>
              )}
            </Button>
          </View>
        </Popover>
      </View>

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
                onPress={() => navigation.navigate('edit-user', {...item})}
                entering={_entering}
                key={index}
                style={{
                  ...styles.vehicle,
                  backgroundColor: app_colors.box_color,
                  borderWidth: 1,
                  borderColor: app_colors.border_color,
                }}>
                <Text style={{color: app_colors.text_color}}>{item.name}</Text>
                <Text style={{color: app_colors.text_color}}>{item.email}</Text>
                <Text style={{color: app_colors.text_color}}>
                  {item.phone_number}
                </Text>

                <Button
                  onPress={() => navigation.navigate('edit-user', {...item})}
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
                <View
                  style={{
                    position: 'absolute',
                    bottom: 4,
                    right: 10,
                    borderRadius: 5,
                    zIndex: -1,
                    backgroundColor: app_colors.app_color,
                  }}>
                  <Text
                    style={{
                      color: app_colors.text_color,
                      padding: 2,
                      paddingLeft: 5,
                      paddingRight: 5,
                    }}>
                    {item.is_customer == 1 ? 'Customer' : 'User'}
                  </Text>
                </View>
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
    width: '98%',
    margin: '1%',
    marginBottom: 0,
  },
});
