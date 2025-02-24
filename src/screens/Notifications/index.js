import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    useColorScheme,
    View,
  } from 'react-native';
  import React, {useContext, useEffect, useState} from 'react';
  
  import {AuthContext, SettingsContext} from '../../contexts';
  import {colors, random_color} from '../../utils';
  import {Layout} from '@ui-kitten/components';
  import {Header, Note} from '../../components';
  import Animated, {SlideInDown, FadeOutDown} from 'react-native-reanimated';
import { Product } from '../../models';
  
  const _entering = SlideInDown.springify().damping(20);
  const _exiting = FadeOutDown.springify().damping(20);
  
  const AnimatedTouchableOpacity =
    Animated.createAnimatedComponent(TouchableOpacity);
  
  const Notifications = ({navigation}) => {
    const [lessStock,setLessStock] = useState({});

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

    const getNotifications = async()=>{
      let less_stock = await Product.selectAll(
            `SELECT products.name,products.quantity,measurement_units.alias 
            FROM products 
            JOIN measurement_units 
            ON measurement_units.id=products.measurement_unit_id 
            WHERE quantity<alert_amount`,
          );
          setLessStock(less_stock);
    }

    useEffect(()=>{
      getNotifications();
    },[])
    return (
      <Layout
        style={{
          flex: 1,
          backgroundColor: app_colors.app_color,
        }}>
        <Header navigation={navigation} heading={"Notifications"} is_drawer={false}/>
        <Text
          style={{
            color: app_colors.text_color,
            textAlign: 'center',
            margin: 20,
          }}>
          Notifications
        </Text>
        <ScrollView
        contentContainerStyle={{
          gap:10,
        }}
        >
          {lessStock?.data &&
          lessStock?.data.map((item, index) => {
            return (
              <Note
                id={item.id}
                navigation={navigation}
                setSelectedItems={() => {}}
                selectedItems={[]}
                setModalOpen={() => {}}
                modalOpen={null}
                key={index}
                note={`Their is only ${item.quantity}${item?.alias ?? ''} of ${
                  item.name
                } remaining. Consider adding some`}
                category_name={'stock'}
                color={random_color()}
                navigate_to={'stock'}
              />
            );
          })}
        </ScrollView>
      </Layout>
    );
  };
  
  export default Notifications;
  
  const styles = StyleSheet.create({
    vehicle:{
      padding:10,
      gap:10,
      borderRadius:20
    }
  });
  