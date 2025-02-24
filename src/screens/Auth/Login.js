import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  NativeModules,
  useColorScheme,
  TouchableOpacity,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {Header} from '../../components';
import {
  Button,
  Icon,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {AuthContext, NotesContext, SettingsContext} from '../../contexts';

import {colors} from '../../utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {User} from '../../models';

const {SQLiteModule} = NativeModules;

const Login = ({navigation, route}) => {
  const [auth, setAuth] = useContext(AuthContext);
  const [user, setUser] = useState({email: '', password: ''});

  const [note, setNote] = useState({
    category_id: 1,
    message: '',
    created_at: new Date(Date.now()),
  });

  const [app_settings, _] = useContext(SettingsContext);
  const isDark = useColorScheme() == 'dark';

  let app_colors = colors.light;
  if (app_settings.dark_theme) {
    app_colors = colors.dark;
  }

  if (app_settings.system_theme && !app_settings.dark_theme) {
    app_colors = isDark ? colors.dark : colors.light;
  }

  const [addedNotes, setAddedNotes] = useContext(NotesContext);

  const create = () => {
    if (note.message.length < 1) {
      Alert.alert('Please add some content then save');
      return;
    }

    SQLiteModule.insertData('notes', `category_id,note,created_at`, `?,?,?`, [
      note.category_id,
      note.message,
      note.created_at,
    ])
      .then(response => {
        console.log(response);
        navigation.goBack();
        setAddedNotes([...addedNotes, note]);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const login_user = async () => {
    let query = 'SELECT * FROM users WHERE email=? LIMIT 1';
    let res = await User.selectAll(query, [user.email]);
    if (res?.data && res.data.length > 0) {
      if (res.data[0].password == user.password) {
        let auth = {
          logged_in: true,
          user: res.data[0],
        };
        await AsyncStorage.setItem('auth', JSON.stringify(auth));
        setAuth(auth);
      } else {
        Alert.alert('WRONG PASSWORD ERROR', `Wrong password. Try again later.`);
      }
    } else {
      Alert.alert(
        'NO USER EXISTS ERROR',
        `A user with email ${user.email} does not exists. Try again later.`,
      );
    }
  };

  return (
    <View
      style={{
        backgroundColor: app_colors.app_color,
      }}>
      <TopNavigation
        style={{
          backgroundColor: app_colors.app_color,
        }}
        accessoryLeft={props => {
          return (
            <React.Fragment>
              {/* <TopNavigationAction
                onPress={() => navigation.goBack()}
                icon={props => {
                  return (
                    <Icon
                      {...props}
                      name={'arrow-back'}
                      fill={app_colors.icon_color}
                    />
                  );
                }}
              /> */}
              <Text
                style={{
                  color: app_colors.text_color,
                  fontSize: 26,
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                SIGN IN
              </Text>
            </React.Fragment>
          );
        }}
        accessoryRight={props => {
          return (
            <React.Fragment>
              <TopNavigationAction
                onPress={() => create()}
                icon={props => {
                  return (
                    <Icon
                      {...props}
                      name={'log-in'}
                      fill={app_colors.icon_color}
                    />
                  );
                }}
              />
            </React.Fragment>
          );
        }}
      />

      {/* <Header/> */}

      <ScrollView
        style={{
          width: '98%',
          height: '100%',
          margin: '1%',
          borderWidth: 1,
          borderColor: 'transparent',
          position: 'relative',
          gap: 10,
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 26,
            marginTop: 80,
            marginBottom: 50,
            color: app_colors.text_color,
          }}>
          SIGN IN TO YOUR ACCOUNT
        </Text>
        <TextInput
          autoFocus
          underlineColorAndroid={'transparent'}
          placeholderTextColor={'rgba(0,0,0,0.4)'}
          value={user.email}
          style={{
            ...styles.input,
            borderColor: app_colors.link_color,
            color: app_colors.text_color,
          }}
          placeholder="Enter email"
          keyboardType="email-address"
          onChangeText={text => setUser({...user, email: text})}></TextInput>

        <TextInput
          underlineColorAndroid={'transparent'}
          placeholderTextColor={'rgba(0,0,0,0.4)'}
          value={user.password}
          secureTextEntry={true}
          style={{
            ...styles.input,
            borderColor: app_colors.link_color,
            color: app_colors.text_color,
          }}
          placeholder="password"
          onChangeText={text => setUser({...user, password: text})}></TextInput>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('forgot-password');
          }}>
          <Text
            style={{
              color: app_colors.link_color,
              fontSize: 20,
              marginTop: 10,
              marginBottom: 10,
            }}>
            Forgot password?
          </Text>
        </TouchableOpacity>

        <Button
          onPress={() => {
            login_user();
          }}
          style={{
            backgroundColor: app_colors.app_color,
            borderColor: app_colors.border_color,
          }}>
          {props => (
            <Text style={{color: app_colors.text_color, fontSize: 20}}>
              SIGN IN
            </Text>
          )}
        </Button>

        <TouchableOpacity
          onPress={() => {
            navigation.navigate('register');
          }}>
          <Text
            style={{
              color: app_colors.link_color,
              fontSize: 20,
              marginTop: 10,
              marginBottom: 10,
            }}>
            Don't have an account?Register.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  input: {
    width: '100%',
    borderWidth: 1,
    position: 'relative',
    fontSize: 20,
    lineHeight: 26,
    padding: 10,
    margin: 0,
    marginTop: 10,
    borderRadius: 10,
  },
});
