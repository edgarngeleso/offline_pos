import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {AuthContext, ReloadAll, SettingsContext} from '../../contexts';
import {colors} from '../../utils';
import {Button, Icon, Layout} from '@ui-kitten/components';
import {Header} from '../../components';
import Animated, {SlideInDown, FadeOutDown} from 'react-native-reanimated';
import {Product} from '../../models';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const All = ({navigation}) => {
  const [refresh, setRefresh] = useState(false);
  const [products, setProducts] = useState({});

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

  async function load() {
    let response = await Product.selectAll();
    setProducts(response);
    setRefresh(false);
  }

  const deleteItem = async (item) =>{
    let query = "DELETE FROM products WHERE id=?";
    let response = await Product.remove(query,[item.id]);
    if(!response.error){
      setRefresh(true);
      load();
    }
  }
  useEffect(() => {
    load();
  }, [reloadAll?.products]);

  return (
    <Layout
      style={{
        flex: 1,
        backgroundColor: app_colors.app_color,
      }}>
      <Header navigation={navigation} heading={'All'} is_drawer={false} />
      <Text
        style={{
          color: app_colors.text_color,
          textAlign: 'center',
          margin: 20,
        }}>
        Products
      </Text>
      <Button
        onPress={() => navigation.navigate('create-product')}
        style={{
          width: 150,
          margin: 10,
        }}>
        Add product
      </Button>
      <ScrollView
        contentContainerStyle={{
          gap: 10,
        }}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={() => {
              setRefresh(true);
              load();
            }}
          />
        }>
        {products?.data &&
          products?.data.map((item, index) => {
            return (
              <AnimatedTouchableOpacity
                onPress={()=>navigation.navigate("edit-product",{...item})}
                entering={_entering}
                key={index}
                style={{
                  ...styles.vehicle,
                  backgroundColor: app_colors.box_color,
                  borderWidth: 1,
                  borderColor: app_colors.border_color,
                }}>
                <Text style={{color: app_colors.text_color}}>{item.name}</Text>
                <Text style={{color: app_colors.text_color}}>Quantity : {item.quantity}</Text>
                <Text style={{color: app_colors.text_color}}>
                  {item.phone_number}
                </Text>

                <Button
                  onPress={()=>navigation.navigate("edit-product",{...item})}
                  status="warning"
                  style={{
                    position: 'absolute',
                    top: 5,
                    right: 10,
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  }}
                  accessoryLeft={props => (
                    <Icon
                      {...props}
                      name={'edit'}
                      size={40}
                      fill={app_colors.icon_color}
                    />
                  )}
                />

                <Button
                  onPress={()=>deleteItem(item)}
                  status="danger"
                  style={{
                    position: 'absolute',
                    top: 40,
                    right: 10,
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  }}
                  accessoryLeft={props => (
                    <Icon
                      {...props}
                      name={'trash'}
                      size={40}
                      fill={app_colors.danger}
                    />
                  )}
                />
              </AnimatedTouchableOpacity>
            );
          })}
      </ScrollView>
    </Layout>
  );
};

export default All;

const styles = StyleSheet.create({
  vehicle: {
    padding: 10,
    gap: 10,
    borderRadius: 20,
    width:"98%",
    margin:"1%",
    marginBottom:0,
  },
});
