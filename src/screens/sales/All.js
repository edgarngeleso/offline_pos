import {
  Modal,
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
import {Button, Icon, Layout, Popover} from '@ui-kitten/components';
import {Header} from '../../components';
import Animated, {SlideInDown, FadeOutDown} from 'react-native-reanimated';
import {Product, Sale} from '../../models';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const All = ({navigation}) => {
  const [refresh, setRefresh] = useState(false);
  const [sales, setSales] = useState({});
  const [activeButton, setActiveButton] = useState(0);
  const [popoverVisible, setPopoverVisible] = useState(false);

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
    let query = "SELECT * FROM sales";
    let values = [];
    if(activeButton==1){
      query = "SELECT * FROM sales WHERE total=total_paid";
      values = [];
    }else if(activeButton==2){
      query = "SELECT * FROM sales WHERE total>total_paid ";
      values = [];
    }else if(activeButton==3){
      query = "SELECT * FROM sales WHERE total_paid=? AND is_quotation=?";
      values = [0,1];
    }

    query += " ORDER BY id DESC";

    let response = await Sale.selectAll(query,values);
    setSales(response);
    setRefresh(false);
  }

  const deleteItem = async item => {
    let query = 'DELETE FROM sales WHERE id=?';
    let response = await Sale.remove(query, [item.id]);
    if (!response.error) {
      setRefresh(true);
      load();
    }
  };
  useEffect(() => {
    load();
  }, [reloadAll?.sales,activeButton]);

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
        Sales
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Button
          onPress={() => navigation.navigate('pos')}
          style={{
            width: 150,
            margin: 10,
          }}>
          Create sale
        </Button>

        <Popover
          visible={popoverVisible}
          onBackdropPress={()=>setPopoverVisible(false)}
          anchor={props => (
            <Button
              {...props}
              onPress={() => setPopoverVisible(true)}
              style={{
                margin: 10,
                backgroundColor: 'transparent',
                borderColor: 'transparent',
              }}
              accessoryLeft={props => (
                <Icon
                  {...props}
                  name={'more-vertical'}
                  fill={app_colors.icon_color}
                  size={50}
                />
              )}
            />
          )}
          placement={'bottom'}>
          <View
            style={{
              width: '100%',
              flexDirection: 'column',
              flexWrap: 'wrap',
              margin: '1%',
              padding:5,
            }}>
            <Button
              onPress={()=>{
                setPopoverVisible(false);
                setActiveButton(0);
              }}
              style={{
                backgroundColor: app_colors.box_color,
                borderColor:"transparent",
                marginTop:5,
              }}>
              {
                (props)=><Text {...props} style={{color:app_colors.text_color}}>All</Text>
              }
            </Button>
            <Button
            onPress={()=>{
              setPopoverVisible(false);
              setActiveButton(1);
            }}
              style={{
                backgroundColor: app_colors.box_color,
                borderColor:"transparent",
                marginTop:5,
              }}>
              {
                (props)=><Text {...props} style={{color:app_colors.text_color}}>Fully Paid</Text>
              }
            </Button>
            <Button
            onPress={()=>{
              setPopoverVisible(false);
              setActiveButton(2);
            }}
              style={{
                backgroundColor: app_colors.box_color,
                borderColor:"transparent",
                marginTop:5,
              }}>
              {
                (props)=><Text {...props} style={{color:app_colors.text_color}}>Partially paid</Text>
              }
            </Button>
            <Button
            onPress={()=>{
              setPopoverVisible(false);
              setActiveButton(3);
            }}
              style={{
                backgroundColor: app_colors.box_color,
                borderColor:"transparent",
                marginTop:5,
              }}>
              {
                (props)=><Text {...props} style={{color:app_colors.text_color}}>Quotations</Text>
              }
            </Button>
          </View>
        </Popover>
      </View>

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
        {sales?.data &&
          sales?.data.map((item, index) => {
            return (
              <AnimatedTouchableOpacity
                onPress={() => navigation.navigate('view-sale', {...item})}
                entering={_entering}
                key={index}
                style={{
                  ...styles.vehicle,
                  backgroundColor: app_colors.box_color,
                  borderWidth: 1,
                  borderColor: app_colors.border_color,
                }}>
                <Text style={{color: app_colors.text_color}}>
                  Sale ID : {item.id}
                </Text>
                <Text style={{color: app_colors.text_color}}>
                  Total : Ksh.{item.total_paid ?? item.total}
                </Text>
                {
                  item.is_quotation?
                  <Text style={{color: app_colors.text_color}}>
                  Balance : Ksh.{item.total-item.total_paid}
                </Text>:<></>
                }
                <Text style={{color: app_colors.text_color}}>
                  Date : {item.created_at}
                </Text>
                <Text style={{color: app_colors.text_color}}>
                  {item.phone_number}
                </Text>

                <Button
                  onPress={() => {
                    if (item.total_paid == 0) {
                      deleteItem(item);
                    }
                  }}
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
                      name={
                        item.total_paid == 0
                          ? 'trash'
                          : item.total_paid < item.total
                          ? 'activity'
                          : 'checkmark'
                      }
                      size={40}
                      fill={
                        item.total_paid == 0
                          ? app_colors.danger
                          : item.total_paid < item.total
                          ? app_colors.icon_color
                          : app_colors.link_color
                      }
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
    width: '98%',
    margin: '1%',
    marginBottom: 0,
  },
});
