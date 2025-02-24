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
import {MeasurementUnit, Item} from '../../models';


const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const Edit = ({navigation,route}) => {
  
  const [item, setItem] = useState({
    name: route.params.name,
    alias: route.params.alias,
    has_decimals:route.params.has_decimals,
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

  const editItem = async () => {
    
    let query = 'UPDATE measurement_units SET name=?,alias=?,has_decimals=? WHERE id=?';
    let response = await MeasurementUnit.update(query, [
      item.name,
      item.alias,
      item.has_decimals,
      route.params.id
    ]);

    if(!response.error){
      setReloadAll({...reloadAll,measurement_units:!reloadAll?.measurement_units})
      navigation.navigate("measurement-units");
    }
      
  };
  return (
    <Layout
      style={{
        flex: 1,
        backgroundColor: app_colors.app_color,
      }}>
      <Header navigation={navigation} heading={`Edit ${route.params.name}`} is_drawer={false} />
      
      <Text
        style={{
          color: error.state?app_colors.danger:app_colors.text_color,
          textAlign: 'center',
          margin: 20,
        }}>
        {
          error.state?
          error.message:
          `Edit ${route.params.name}`
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
        value={item.name}
        onChangeText={(text)=>setItem({...item,name:text})}
        placeholder="Name" />
        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Alias
        </Text>
        <Input
        value={item.alias}
        onChangeText={(text)=>setItem({...item,alias:text})}
        keyboardType='alias-address'
        placeholder="Alias" />

        <View
          style={{
            flexDirection:"row",
            gap:20
          }}
        >
        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Has decimals?
        </Text>

        <Switch
          value={item.has_decimals?true:false}
          trackColor={{true: app_colors.active, false: app_colors.in_active}}
          thumbColor={item.has_decimals ? app_colors.active : app_colors.in_active}
          onValueChange={()=>setItem({...item,has_decimals:!item.has_decimals})}
        />

        </View>
        

        <Button 
        onPress={()=>editItem()}
        >SAVE</Button>
      </ScrollView>
    </Layout>
  );
};

export default Edit;

const styles = StyleSheet.create({
  text: {
    marginBottom: 10,
    fontSize: 20,
  },
});
