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
  import {Button, Input, Layout, Select, SelectItem} from '@ui-kitten/components';
  import {Header} from '../../components';
  import Animated, {SlideInDown, FadeOutDown} from 'react-native-reanimated';
  import {User} from '../../models';
  import { err } from 'react-native-svg/lib/typescript/xml';
  
  const _entering = SlideInDown.springify().damping(20);
  const _exiting = FadeOutDown.springify().damping(20);
  
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
  const userTypes = ['User',"Customer"];
  const Edit = ({navigation,route}) => {
    
    
    const [user, setUser] = useState({
      name: route.params.name,
      email: route.params.email,
      phone: route.params.phone_number,
      type: route.params.is_customer,
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
  
    const editUser = async () => {
      let query = 'UPDATE users SET name=?,email=?,phone_number=?,is_customer=? WHERE id=?';
      let response = await User.insert(query, [
        user.name,
        user.email,
        user.phone,
        user.type,
        route.params.id
      ]);
  
      if(!response.error){
        setReloadAll({...reloadAll,users:!reloadAll.users});
        navigation.navigate("users");
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
          value={user.name}
          onChangeText={(text)=>setUser({...user,name:text})}
          placeholder="Name" />
          <Text
            style={{
              ...styles.text,
              color: app_colors.text_color,
            }}>
            Email
          </Text>
          <Input
          value={user.email}
          onChangeText={(text)=>setUser({...user,email:text})}
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
          value={user.phone}
          onChangeText={(text)=>setUser({...user,phone:text})}
          placeholder="Phone number" 
          keyboardType='phone-pad'
          />

          <Text
            style={{
              ...styles.text,
              color: app_colors.text_color,
            }}>
            Select user type
          </Text>
          <Select
            value={user.type==1?"Customer":"User"}
            placeholder={"Select user type"}
            onSelect={(index)=>setUser({...user,type:index.row})}
          >
            {
              userTypes.map((item,index)=>{
                return <SelectItem key={index} title={item} />
              })
            }
          </Select>
  
          <Button 
          onPress={()=>editUser()}
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
  