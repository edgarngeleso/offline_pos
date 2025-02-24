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
  Modal,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {Header} from '../../components';
import {
  Button,
  Icon,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {NotesContext, SettingsContext} from '../../contexts';

import {colors} from '../../utils';

const {SQLiteModule} = NativeModules;

const ForgotPassword = ({navigation, route}) => {
  const category_name = route.params?.name;
  const [note, setNote] = useState({
    category_id: 1,
    email:"",
    message: '',
    created_at: new Date(Date.now()),
  });

  const [codeSent,setCodeSent] = useState(false);

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
            <View
            style={{
              flexDirection:"row",
              alignItems:"center",

            }}
            >
              <TopNavigationAction
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
              />
              <Text
                style={{
                  color: app_colors.text_color,
                  fontSize: 20,
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                FORGOT PASSWORD
              </Text>
            </View>
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

      <Modal 
      visible={codeSent} 
      transparent
      onRequestClose={()=>setCodeSent(false)}
      animationType='slide'
      >
      <ScrollView
        style={{
          width: '98%',
          height: '100%',
          margin: '1%',
          borderWidth: 1,
          borderColor: 'transparent',
          position: 'relative',
          gap: 10,
          backgroundColor:app_colors.app_color
        }}>
        <Text
          style={{
            textAlign: 'center',
            fontSize: 26,
            marginTop: 80,
            marginBottom: 50,
            color: app_colors.text_color,
          }}>
          ENTER PASSWORD RESET CODE
        </Text>

        <Text
          style={{
            textAlign: 'center',
            fontSize: 18,
            marginTop: 10,
            marginBottom: 30,
            color: app_colors.text_color,
          }}>
          A password reset code has been sent to {note.email}.
        </Text>

        <TextInput
          autoFocus
          underlineColorAndroid={'transparent'}
          placeholderTextColor={'rgba(0,0,0,0.4)'}
          value={note.message}
          style={{
            ...styles.input,
            borderColor: app_colors.link_color,
            color: app_colors.text_color,
          }}
          placeholder="Password Reset code"
          
          onChangeText={text => setNote({...note, message: text})}></TextInput>

        <Button
          onPress={() => {
            navigation.navigate("reset-password",{email:note.email});
          }}
          style={{
            backgroundColor: app_colors.app_color,
            borderColor: app_colors.border_color,
          }}>
          {props => (
            <Text style={{color: app_colors.text_color, fontSize: 20}}>
              CONFIRM
            </Text>
          )}
        </Button>

        <TouchableOpacity
          onPress={() => {
            
          }}>
          <Text
            style={{
              color: app_colors.link_color,
              fontSize: 20,
              marginTop: 10,
              marginBottom: 10,
            }}>
            Didn't receive code? Resend in 
          </Text>
        </TouchableOpacity>
      </ScrollView>
      </Modal>

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
          FORGOTTEN PASSWORD?
        </Text>
        <TextInput
          autoFocus
          underlineColorAndroid={'transparent'}
          placeholderTextColor={'rgba(0,0,0,0.4)'}
          value={note.email}
          style={{
            ...styles.input,
            borderColor: app_colors.link_color,
            color: app_colors.text_color,
          }}
          placeholder="Enter email"
          keyboardType="email-address"
          onChangeText={text => setNote({...note, email: text})}></TextInput>

        <Button
          onPress={() => {
            setCodeSent(true);
          }}
          style={{
            backgroundColor: app_colors.app_color,
            borderColor: app_colors.border_color,
          }}>
          {props => (
            <Text style={{color: app_colors.text_color, fontSize: 20}}>
              REQUEST PASSWORD RESET
            </Text>
          )}
        </Button>

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
            Remembered password? Login.
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ForgotPassword;

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
    marginBottom:10
  },
});
