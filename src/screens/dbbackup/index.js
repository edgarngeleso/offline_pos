import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
  NativeModules,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {AuthContext, ReloadAll, SettingsContext} from '../../contexts';
import {colors} from '../../utils';
import {Button, Icon, Layout} from '@ui-kitten/components';
import {Header} from '../../components';
import Animated, {SlideInDown, FadeOutDown} from 'react-native-reanimated';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const {SQLiteModule} = NativeModules;

const tables = [
  'users',
  'measurement_units',
  'categories',
  'products',
  'sales',
  'sale_products',
  'suppliers',
  'companies',
  'tasks',
  'leaves',
  'settings',
  'cash_payments',
  'card_payments',
  'mpesa_payments',
  'paypal_payments',
];

const DbBackup = ({navigation}) => {
  const [leaves, setLeaves] = useState({});
  const [tasks, setTasks] = useState({});
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


  const getData = ()=>{
    return new Promise((resolve,reject)=>{
      var output = [];
        for (let index = 0; index < tables.length; index++) {
          let table_data = {name: tables[index], data: []};
          let query = `SELECT * FROM ${tables[index]} ORDER BY id DESC`;

          SQLiteModule.getData(query, [])
            .then(response => {
              // console.log(response);

              output[output.length] = tables[index];
              //console.log(output);
              
            })
            .catch(e => {
              console.log(e);
            });
        }

        resolve(output);
    })
  }
  const save = async () => {
    
    let output = await getData();
    console.log("=>",output);
    output = JSON.stringify(output);

    
  };

  const saveDatabase = async () => {
    Alert.alert(
      'INFO',
      `Your database file will be saved in 
      following location  documents/offline_pos/backup/db.pos`,
      [
        {
          text: 'OK',
          onPress: () => {
            save();
          },
        },
        {
          text: 'CANCEL',
          onPress: () => {
            return false;
          },
        },
      ],
    );
  };

  const loadDatabase = async () => {
    //Select file

    // Read file contents

    // Update databse

    let output = [];
    tables.forEach(table_name => {
      let table_data = {name: table_name, data: []};

      output.push(table_data);
    });

    output = JSON.stringify(output);
  };

  useEffect(() => {}, [reloadAll?.hrm]);
  return (
    <Layout
      style={{
        flex: 1,
        backgroundColor: app_colors.app_color,
      }}>
      <Header navigation={navigation} heading={'Database'} is_drawer={false} />
      <Text
        style={{
          color: app_colors.text_color,
          textAlign: 'center',
          margin: 20,
          fontSize: 26,
          fontWeight: 'bold',
        }}>
        Database backup
      </Text>
      <ScrollView
        contentContainerStyle={{
          gap: 10,
          margin: '1%',
        }}>
        <Button
          onPress={() => {
            saveDatabase();
          }}>
          {props => <Text>Save database</Text>}
        </Button>

        <Button
          onPress={() => {
            loadDatabase();
          }}>
          {props => <Text>Import database</Text>}
        </Button>
      </ScrollView>
    </Layout>
  );
};

const HomeItem = ({
  navigation,
  to,
  name,
  value,
  app_colors,
  width,
  icon = 'hash',
}) => {
  return (
    <View
      style={{
        width,
        backgroundColor: app_colors.app_color,
        borderRadius: 20,
        minHeight: 180,
        borderWidth: 1,
        borderColor: app_colors.gray,
      }}>
      <View
        style={{
          position: 'absolute',
          zIndex: -1,
          height: '20%',
          width: '40%',
          top: '50%',
          left: '60%',
          alignItems: 'center',
        }}>
        <Icon
          name={icon}
          fill={app_colors.icon_color}
          style={{
            height: 30,
            width: 30,
            color: app_colors.icon_color,
            opacity: 0.7,
          }}
        />
      </View>
      <Text
        style={{
          ...styles.text,
          color: app_colors.text_color,
        }}>
        {value}
      </Text>
      <Text
        style={{
          ...styles.text,
          color: app_colors.text_color,
          marginBottom: 35,
        }}>
        {name}
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate(to)}
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: 10,
          backgroundColor: app_colors.box_color,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
        }}>
        <Text
          style={{
            color: app_colors.text_color,
          }}>
          More info
        </Text>
        <Icon
          style={{height: 20, width: 20}}
          name={'arrow-forward'}
          fill={'red'}
        />
      </TouchableOpacity>
    </View>
  );
};

export {DbBackup};

const styles = StyleSheet.create({
  vehicle: {
    padding: 10,
    gap: 10,
    borderRadius: 20,
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    padding: 5,
    paddingLeft: 30,
  },
});
