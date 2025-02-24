import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import React, {useContext, useState} from 'react';
import {AuthContext, ReloadAll, SettingsContext} from '../../contexts';
import {colors} from '../../utils';
import {Button, Icon, Input} from '@ui-kitten/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Header} from '../../components';
import {app_logo} from '../../assets';

const Profile = ({navigation}) => {
  const [auth, setAuth] = useContext(AuthContext);
  const [reloadAll,setReloadAll] = useContext(ReloadAll);
  const [app_settings, _] = useContext(SettingsContext);
  const isDark = useColorScheme() == 'dark';

  const [modalOpen,setModalOpen] = useState({
    state:false,
    item:null,
  });

  let app_colors = colors.light;
  if (app_settings.dark_theme) {
    app_colors = colors.dark;
  }

  if (app_settings.system_theme && !app_settings.dark_theme) {
    app_colors = isDark ? colors.dark : colors.light;
  }

  const logout = async () => {
    let user_auth = {logged_in: false, user: {}};
    await AsyncStorage.removeItem('auth');
    setAuth(user_auth);
  };

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: app_colors.app_color,
      }}>
      <Header navigation={navigation} heading={'Profile'} is_drawer={false} />

      <Modal
        visible={modalOpen.state}
        onRequestClose={()=>setModalOpen({state:false,item:null})}
        animationType='slide'
      >
        {
          modalOpen.item==1?
          <Enable2FA app_colors={app_colors} setModalOpen={setModalOpen}/>:
          modalOpen.item==2?
          <UpdatePassword app_colors={app_colors} setModalOpen={setModalOpen}/>:
          modalOpen.item==3?
          <UpdateProfile app_colors={app_colors} setModalOpen={setModalOpen}/>:
          <></>
        }
      </Modal>

      <ScrollView
        contentContainerStyle={{
          ...styles.container,
        }}>
        <View
          style={{
            ...styles.image_container,
          }}>
          <Image
            source={auth.user.image ? {uri: ''} : app_logo}
            style={{
              ...styles.image,
            }}
          />
          <Button

            status='success'
            onPress={()=>setModalOpen({state:true,item:3})}
            style={{
              ...styles.button,
            }}
            accessoryLeft={props => (
              <Icon {...props} name={'edit'} fill={'red'} size={40} />
            )}
          />
        </View>
        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          {auth.user?.name}
        </Text>
        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          {auth.user?.email}
        </Text>

        {
          reloadAll.is_premium?
          <Button 
       
          status='warning'
          onPress={()=>setModalOpen({state:true,item:1})}
        
        style={{
          marginBottom:20,
          minHeight:40,
          backgroundColor:"transparent"
        }}
        >
          {props => <Text {...props} style={{color:app_colors.text_color}}>ENABLE 2FA</Text>}
        </Button>:<></>
        }

        <Button 
       
          status='success'
          onPress={()=>setModalOpen({state:true,item:2})}
        accessoryRight={(props)=><Icon {...props} name={"edit"} fill={app_colors.danger} />}
        style={{
          marginBottom:20,
          minHeight:40,
          backgroundColor:"transparent"
        }}
        >
          {props => <Text {...props} style={{color:app_colors.text_color}}>UPDATE PASSWORD</Text>}
        </Button>

        <Button 
       
          status='danger'
        onPress={() => logout()}
        accessoryRight={(props)=><Icon {...props} name={"log-out"} fill={app_colors.danger} />}
        style={{
          marginBottom:20,
          minHeight:40,
          backgroundColor:"transparent"
        }}
        >
          {props => <Text {...props} style={{color:app_colors.text_color}}>LOG OUT</Text>}
        </Button>
      </ScrollView>
    </View>
  );
};


const Enable2FA = ({app_colors,setModalOpen})=>{
  return (<View style={{
    backgroundColor:app_colors.app_color,
    flex:1,
  }} >
    <Text>Two Factor Authentication (2FA) </Text>
    <Text>2FA secures your account. You can only log in after verification on email or phone number </Text>
    <Button status='success'
    onPress={()=>{
      setModalOpen({state:false,item:null});
    }}
    >CONFIRM</Button>
  </View>)
}

const UpdatePassword = ({app_colors,setModalOpen})=>{
  return (<View style={{
    backgroundColor:app_colors.app_color,
    flex:1,
  }}>
    <Text>Update password</Text>
    <Input
    status='info'
    placeholder='Old password'

    />
    <Input
    status='info'
    placeholder='New password'

    
    />
    <Button status='success'
    onPress={()=>{
      setModalOpen({state:false,item:null});
    }}
    >UPDATE</Button>
  </View>)
}

const UpdateProfile = ({app_colors,setModalOpen})=>{
  return (<View style={{
    backgroundColor:app_colors.app_color,
    flex:1,
  }}>
    <Text>Update profile details</Text>
    <Input
    status='info'
    placeholder='Name'

    />
    <Input
    status='info'
    placeholder='Email'
    keyboardType='email-address'
    
    />
    <Button status='success'
    onPress={()=>{
      setModalOpen({state:false,item:null});
    }}
    >UPDATE</Button>
  </View>)
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },

  image_container: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    position:"relative",
  },

  button: {
    width:40,
    position:"absolute",
    top:10,
    right:10,
    backgroundColor:"transparent",
    
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
    objectFit: 'cover',
  },
  text: {
    fontSize: 20,
    marginBottom: 10,
  },
});
