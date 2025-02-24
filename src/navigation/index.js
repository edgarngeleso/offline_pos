import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import {
  Backup,
  Home,
  HRM,
  MeasurementUnits,
  Pos,
  Products,
  Reports,
  Sales,
  Suppliers,
  Users,
  Vehicles,
} from '../screens';
import {Alert, Linking, Share, StyleSheet, Text, useColorScheme, View} from 'react-native';
import {Button, Drawer, DrawerItem, Icon} from '@ui-kitten/components';
import {useContext} from 'react';
import {AuthContext, SettingsContext} from '../contexts';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {colors, Constants} from '../utils';

const {Navigator, Screen} = createDrawerNavigator();

const screens = [
  {
    title: 'Home',
    name: 'home1',
    icon: "home",
    component: Home,
  },
  {
    title: 'Sales',
    name: 'sales',
    icon: "credit-card",
    component: Sales.All,
  },
  {
    title: 'Suppliers',
    name: 'suppliers',
    icon: "people",
    component: Suppliers.All,
  },
  {
    title: 'Measurement units',
    name: 'measurement-units',
    icon: "layers",
    component: MeasurementUnits.All,
  },
  {
    title: 'Stock',
    name: 'stock',
    icon: "award",
    component: Products.All,
  },
  {
    title: 'Pos',
    name: 'pos',
    icon: "shopping-bag",
    component: Pos,
  },
  {
    title: 'Users',
    name: 'users',
    icon: "people-outline",
    component: Users.All,
  },
  {
    title: 'HRM',
    name: 'hrm',
    icon: "droplet",
    component: HRM.Home,
  },
  {
    title: 'Reports',
    name: 'reports',
    icon: "bar-chart",
    component: Reports.Sales,
  },
  {
    title: 'Database',
    name: 'database',
    icon: "hard-drive",
    component: Backup.DbBackup,
  },
  {
    title:"Settings",
    name: 'settings',
    icon: null,
    component: Vehicles.All,
  },

  // {
  //   title: 'sett',
  //   name: 'sett',
  //   icon: null,
  //   component: Vehicles.All,
  // },
];

const DrawerContent = ({...props}) => {
  const [auth, setAuth] = useContext(AuthContext);
  const [app_settings, setAppSettings] = useContext(SettingsContext);
  const isDark = useColorScheme() == 'dark';

  let app_colors = colors.light;
  if (app_settings.dark_theme) {
    app_colors = colors.dark;
  }

  if (app_settings.system_theme) {
    app_colors = isDark ? colors.dark : colors.light;
  }

  const openLink = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert(
        'Contact us',
        `Please email us on ${Constants.CONTACT_EMAIL}`,
      );
      //ToastAndroid.show(`No app can open this url.`, ToastAndroid.LONG);
    }
  };

  const shareApp = async () => {
    try {
      let response = Share.share(
        {title: Constants.APP_NAME, message: Constants.APP_LINK},
        {tintColor: colors.APP_SECONDARY_COLOR,dialogTitle:Constants.APP_NAME},
      );
    } catch (error) {
      console.log(error);
      
    }
  };

  const logout = async () => {
    await AsyncStorage.clear();
    setAuth({logged_in: false, user: {}});
  };

  return (
    <View
      style={{
        height: '101%',
        marginTop: '-2%',
        backgroundColor: app_colors.box_color,
      }}>
      <DrawerContentScrollView
        style={{
          height: '101%',
          marginTop: '-2%',
          backgroundColor: app_colors.box_color,
        }}>
        <View
          style={{
            height: '20%',
            backgroundColor: app_colors.box_color,
            padding: 10,
            paddingTop: 25,
            borderBottomColor: colors.APP_SECONDARY_COLOR,
            borderWidth: 1,
            gap: 5,
          }}>
          <Text
            style={{
              color: app_colors.text_color,
              fontSize: 25,
            }}>
            {auth.user.name}
          </Text>
          <Text
            style={{
              color: app_colors.text_color,
              fontSize: 18,
            }}>
            {auth.user.email}
          </Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View
        style={{
          height: 'auto',
        }}>
        <View style={{...styles.bottom_items_container}}>
          <Button
            onPress={() => {
              openLink(`mailto:${Constants.CONTACT_EMAIL}`);
            }}
            status="warning"
            style={{
              backgroundColor:"transparent",
              borderColor:"transparent"
              }}
            accessoryLeft={props => (
              <Icon {...props} name={'email'} size={50} fill={app_colors.icon_color}/>
            )}
          />
          <Button
            onPress={() => {
              shareApp();
            }}
            status="warning"
            style={{
              backgroundColor:"transparent",
              borderColor:"transparent"
              }}
            accessoryLeft={props => (
              <Icon {...props} name={'share'} size={50} fill={app_colors.icon_color}/>
            )}
          />
          <Button
            onPress={() => {
              setAppSettings({
                ...app_settings,
                dark_theme: !app_settings.dark_theme,
                system_theme: false,
              });
            }}
            status="warning"

            style={{
            backgroundColor:"transparent",
            borderColor:"transparent"
            }}
            accessoryLeft={props => (
              <Icon
                {...props}
                name={app_settings.dark_theme ? 'sun' : 'moon'}
                size={50}
                fill={app_colors.icon_color}
              />
            )}
          />
        </View>
        <Button
          status="danger"
          onPress={() => logout()}
          style={{...styles.logout
          }}
          accessoryRight={props => (
            <Icon {...props} name={'log-out'} size={50} />
          )}>
          {props => <Text style={{color: colors.dark.text_color}}>Logout</Text>}
        </Button>
      </View>
    </View>
  );
};

export const AppNavigator = () => {
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
    <Navigator
      drawerContent={props => (
        <DrawerContent {...props} app_colors={app_colors} />
      )}>
      {screens.map((s, index) => {
        return (
          <Screen
            key={index}
            name={s.name}
            component={s.component}
            options={{
              headerShown: false,
              drawerLabel: () => null,
              drawerItemStyle: {backgroundColor: 'transparent'},
              drawerIcon: ({focused}) => {
                return (
                  <View
                    style={{
                      width: '100%',
                      minHeight: 30,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap:10
                    }}>
                      <Icon 
                      style={{
                        width:25,
                        height:25,

                      }}
                      name={s.icon??'hash'} fill={app_colors.icon_color}/>
                    <Text
                      style={{
                        color: app_colors.icon_color,
                        fontWeight: focused ? 'bold' : null,
                        fontSize: focused ? 24 : 18,
                      }}>
                      {s.title}
                    </Text>
                  </View>
                );
              },
            }}
          />
        );
      })}
    </Navigator>
  );
};

const styles = StyleSheet.create({
  bottom_items_container: {
    width: '100%',
    padding: 10,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  logout: {
    margin: 10,
  },
});
