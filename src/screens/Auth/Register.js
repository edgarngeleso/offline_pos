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
  Dimensions,
} from 'react-native';
import React, {useContext, useRef, useState} from 'react';
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
import {Company, User} from '../../models';

const Register = ({navigation, route}) => {
  const [auth, setAuth] = useContext(AuthContext);
  const scrollRef = useRef(null);

  const [note, setNote] = useState({
    category_id: 1,
    message: '',
    created_at: new Date(Date.now()),
  });

  const [credentials, setCredentials] = useState({
    business: {
      name: '',
      currency: '',
      location: '',
      alias:"",
      currency_alias:"",
    },
    user: {
      name: '',
      email: '',
      password: '',
    },
  });

  const scrollTo = index => {
    if (
      (index == 1 && credentials.business.name.length == 0) ||
      credentials.business.currency == ''
    ) {
      Alert.alert('EMPTY FIELDS', 'Please fill all required fields');
      return;
    }
    const width = Dimensions.get('window').width * index;

    scrollRef.current.scrollTo({x: width, y: 0, animated: true});
  };

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

  const create = async () => {
    if (
      credentials.user.name.length == 0 ||
      credentials.user.email == '' ||
      credentials.user.password == ''
    ) {
      Alert.alert(
        'EMPTY FIELDS',
        'Please fill all required fields then click SIGN UP button',
      );
      return;
    }

    let checkUserQuery = 'SELECT * FROM users WHERE email=? LIMIT 1';
    let res = await User.selectAll(checkUserQuery, [credentials.user.email]);
    if(res?.data && res.data.length>0){
      Alert.alert(
        'USER EXISTS ERROR',
        `A user with email ${credentials.user.email} exists. Use another email.`,
      );
      return;
    }

    let query = `
        INSERT INTO users(name,email,password) VALUES(?,?,?)
      `;
    let response = await User.insert(query, [
      credentials.user.name,
      credentials.user.email,
      credentials.user.password,
    ]);
    console.log(response);

    let query1 = `
        INSERT INTO companies(name,alias,currency,currency_alias) VALUES(?,?,?,?)
      `;
    let response1 = await Company.insert(query1, [
      credentials.business.name,
      credentials.business.alias,
      credentials.business.currency,
      credentials.business.currency_alias
    ]);
    //console.log(response1);
    return response1.error;
  };

  const createAccount = async () => {
    let response = await create();

    console.log("Register response",response);
    

    let auth = {
      logged_in: false,
      user: {},
    };
    // Login after successfull registration
    if (!response) {
      let query = 'SELECT * FROM users WHERE email=? LIMIT 1';
      let res = await User.selectAll(query, [credentials.user.email]);

        auth = {
          logged_in: res?.data?true:false,
          user: res?.data?res.data[0]:{},
        };
    }

    await AsyncStorage.setItem('auth', JSON.stringify(auth));
    setAuth(auth);
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
              <TopNavigationAction
                onPress={() => navigation.goBack()}
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                icon={props => {
                  return (
                    <Icon
                      {...props}
                      name={'arrow-back'}
                      fill={app_colors.icon_color}
                    />
                  );
                }}
              />
              <Text
                style={{
                  color: app_colors.text_color,
                  fontSize: 26,
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                SIGN UP
              </Text>
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
          CREATE AN ACCOUNT
        </Text>
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: 'row',
            gap: 10,
          }}>
          <View
            style={{
              width: Dimensions.get('window').width * 0.96,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                marginTop: 20,
                marginBottom: 20,
                color: app_colors.text_color,
              }}>
              BUSINESS DETAILS
            </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              placeholderTextColor={'rgba(0,0,0,0.4)'}
              value={credentials.business.name}
              style={{
                ...styles.input,
                borderColor: app_colors.link_color,
                color: app_colors.text_color,
              }}
              placeholder="Enter business name eg FaceBook"
              onChangeText={text =>
                setCredentials({
                  ...credentials,
                  business: {...credentials.business, name: text},
                })
              }></TextInput>

            <TextInput
              underlineColorAndroid={'transparent'}
              placeholderTextColor={'rgba(0,0,0,0.4)'}
              value={credentials.business.alias}
              style={{
                ...styles.input,
                borderColor: app_colors.link_color,
                color: app_colors.text_color,
              }}
              placeholder="(Optional) Enter business alias name eg FB"
              onChangeText={text =>
                setCredentials({
                  ...credentials,
                  business: {...credentials.business, alias: text},
                })
              }></TextInput>

            <TextInput
              underlineColorAndroid={'transparent'}
              placeholderTextColor={'rgba(0,0,0,0.4)'}
              value={credentials.business.currency}
              style={{
                ...styles.input,
                borderColor: app_colors.link_color,
                color: app_colors.text_color,
              }}
              placeholder="Enter currency eg Dollar.... "
              onChangeText={text =>
                setCredentials({
                  ...credentials,
                  business: {...credentials.business, currency: text},
                })
              }></TextInput>

            <TextInput
              underlineColorAndroid={'transparent'}
              placeholderTextColor={'rgba(0,0,0,0.4)'}
              value={credentials.business.currency_alias}
              style={{
                ...styles.input,
                borderColor: app_colors.link_color,
                color: app_colors.text_color,
              }}
              placeholder="Enter currency alias eg $.... "
              onChangeText={text =>
                setCredentials({
                  ...credentials,
                  business: {...credentials.business, currency_alias: text},
                })
              }></TextInput>

            <Button
              onPress={() => {
                scrollTo(1);
              }}
              style={{
                backgroundColor: app_colors.app_color,
                borderColor: app_colors.border_color,
                marginTop: 10,
                width: '100%',
              }}>
              {props => (
                <Text style={{color: app_colors.text_color, fontSize: 20}}>
                  Next
                </Text>
              )}
            </Button>
          </View>

          <View
            style={{
              width: Dimensions.get('window').width * 0.96,
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 20,
                marginTop: 20,
                marginBottom: 20,
                color: app_colors.text_color,
              }}>
              MY DETAILS
            </Text>
            <TextInput
              underlineColorAndroid={'transparent'}
              placeholderTextColor={'rgba(0,0,0,0.4)'}
              value={credentials.user.name}
              style={{
                ...styles.input,
                borderColor: app_colors.link_color,
                color: app_colors.text_color,
              }}
              placeholder="Enter your name..."
              keyboardType="email-address"
              onChangeText={text =>
                setCredentials({
                  ...credentials,
                  user: {...credentials.user, name: text},
                })
              }></TextInput>
            <TextInput
              underlineColorAndroid={'transparent'}
              placeholderTextColor={'rgba(0,0,0,0.4)'}
              value={credentials.user.email}
              style={{
                ...styles.input,
                borderColor: app_colors.link_color,
                color: app_colors.text_color,
              }}
              placeholder="Enter your email..."
              keyboardType="email-address"
              onChangeText={text =>
                setCredentials({
                  ...credentials,
                  user: {...credentials.user, email: text},
                })
              }></TextInput>

            <TextInput
              underlineColorAndroid={'transparent'}
              placeholderTextColor={'rgba(0,0,0,0.4)'}
              value={credentials.user.password}
              secureTextEntry={true}
              style={{
                ...styles.input,
                borderColor: app_colors.link_color,
                color: app_colors.text_color,
              }}
              placeholder="password"
              onChangeText={text => {
                setCredentials({
                  ...credentials,
                  user: {...credentials.user, password: text},
                });
              }}
            />

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('login');
              }}>
              <Text
                style={{
                  color: app_colors.link_color,
                  fontSize: 20,
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                Have an account?Login.
              </Text>
            </TouchableOpacity>

            <Button
              onPress={() => {
                scrollTo(0);
              }}
              style={{
                backgroundColor: app_colors.app_color,
                borderColor: app_colors.border_color,
                width: 100,
                marginBottom: 10,
              }}>
              {props => (
                <Text style={{color: app_colors.text_color, fontSize: 20}}>
                  Previous
                </Text>
              )}
            </Button>

            <Button
              onPress={() => {
                createAccount();
              }}
              style={{
                backgroundColor: app_colors.app_color,
                borderColor: app_colors.border_color,
              }}>
              {props => (
                <Text style={{color: app_colors.text_color, fontSize: 20}}>
                  SIGN UP
                </Text>
              )}
            </Button>
          </View>
        </ScrollView>
      </ScrollView>
    </View>
  );
};

export default Register;

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
