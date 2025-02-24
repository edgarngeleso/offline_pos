import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
  } from 'react-native';
  import React, {useContext, useState} from 'react';
  
  import {AuthContext, SettingsContext} from '../../contexts';
  import {colors} from '../../utils';
  import {Button, Input, Layout} from '@ui-kitten/components';
  import {Header} from '../../components';
  import Animated, {SlideInDown, FadeOutDown} from 'react-native-reanimated';
  
  const _entering = SlideInDown.springify().damping(20);
  const _exiting = FadeOutDown.springify().damping(20);
  
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
  
  const Edit = ({navigation}) => {
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
    return (
      <Layout
        style={{
          flex: 1,
          backgroundColor: app_colors.app_color,
        }}>
        <Header navigation={navigation} heading={"All"} is_drawer={false}/>
        <Text
          style={{
            color: app_colors.text_color,
            textAlign: 'center',
            margin: 20,
          }}>
          All
        </Text>
        <ScrollView
        contentContainerStyle={{
          gap:10,
        }}
        >

          <Text 
          style={{
            ...styles.text,
            color:app_colors.text_color
          }}
          >
            Name
          </Text>
          <Input placeholder='Name eg Litres' />
          <Text 
          style={{
            ...styles.text,
            color:app_colors.text_color
          }}
          >
            Alias
          </Text>
          <Input placeholder='Alias eg ltr' />

          <Button>SAVE</Button>
        </ScrollView>
      </Layout>
    );
  };
  
  export default Edit;
  
  const styles = StyleSheet.create({
    text:{
      marginBottom:10,
      fontSize:20
    }
  });
  