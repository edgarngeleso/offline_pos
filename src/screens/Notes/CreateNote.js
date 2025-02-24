import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  NativeModules,
  useColorScheme,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {Header} from '../../components';
import {Icon, TopNavigation, TopNavigationAction} from '@ui-kitten/components';
import {NotesContext, SettingsContext} from '../../contexts';

import {colors} from '../../utils';

const {SQLiteModule} = NativeModules;

const CreateNote = ({navigation, route}) => {
  const category_name = route.params.name;
  const [note, setNote] = useState({
    category_id: route.params.category_id,
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

  return (
    <View
      style={{
        backgroundColor:app_colors.app_color
      }}
    >
      <TopNavigation
        style={{
          backgroundColor:app_colors.app_color
        }}
        accessoryLeft={props => {
          return (
            <React.Fragment>
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
                }}>{`Write ${category_name} notes`}</Text>
            </React.Fragment>
          );
        }}
        accessoryRight={props => {
          return (
            <React.Fragment>
              <TopNavigationAction
                onPress={() => create()}
                icon={props => {
                  return <Icon {...props} name={'save'} fill={app_colors.icon_color} />;
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
        }}>
        {/* <View style={{
                position:"absolute",
                top:30,
                left:0,
                right:0,
                bottom:30
            }}>
                {
                    Array.from({length:300}).map((_,index)=>{
                        return <View key={index} 
                        style={{width:"100%",marginTop:26,backgroundColor:"grey",height:1}} />
                    })
                }
            </View> */}

        <TextInput
          multiline
          autoFocus
          underlineColorAndroid={'transparent'}
          textAlignVertical="top"
          placeholderTextColor={'#f5f5f5'}
          value={note.message}
          style={{
            width: '100%',
            borderWidth: 1,
            borderColor: 'transparent',
            color: app_colors.text_color,
            position: 'relative',
            fontSize: 26,
            lineHeight: 26,
            padding: 0,
            paddingTop: 15,
            margin: 0,
          }}
          placeholder="Create note"
          onChangeText={text => setNote({...note, message: text})}></TextInput>
      </ScrollView>
    </View>
  );
};

export default CreateNote;

const styles = StyleSheet.create({});
