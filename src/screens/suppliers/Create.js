import {
  ScrollView,
  StyleSheet,
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
import {Supplier} from '../../models';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const Create = ({navigation}) => {
  const [item, setItem] = useState({
    name: '',
    email: '',
    phone: '',
    created_at: new Date(Date.now()),
  });

  const [error,setError] = useState({
    state:false,
    message:"",
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
    let query = 'INSERT INTO suppliers(name,email,phone_number,created_at) VALUES(?,?,?,?)';
    let response = await Supplier.insert(query, [
      item.name,
      item.email,
      item.phone,
      item.created_at,
    ]);

    if(!response.error){
      setReloadAll({...reloadAll,suppliers:!reloadAll.suppliers,home:!reloadAll.home})
      navigation.navigate("suppliers");
    }
    
    
  };
  return (
    <Layout
      style={{
        flex: 1,
        backgroundColor: app_colors.app_color,
      }}>
      <Header navigation={navigation} heading={'Add supplier'} is_drawer={false} />
      
      <Text
        style={{
          color: error.state?app_colors.danger:app_colors.text_color,
          textAlign: 'center',
          margin: 20,
        }}>
        {
          error.state?
          error.message:
          "Add new supplier"
        }
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
        onChangeText={(text)=>setItem({...item,name:text})}
        placeholder="Name" />
        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Email
        </Text>
        <Input
        onChangeText={(text)=>setItem({...item,email:text})}
        keyboardType='email-address'
        placeholder="Email" />
        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Phone number
        </Text>
        <Input
        onChangeText={(text)=>setItem({...item,phone:text})}
        placeholder="Phone number" 
        keyboardType='phone-pad'
        />

        <Button 
        onPress={()=>createItem()}
        >SAVE</Button>
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
