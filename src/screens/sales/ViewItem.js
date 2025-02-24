import {
  Alert,
  Linking,
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
import {colors, Constants} from '../../utils';
import {Button, Icon, Input, Layout} from '@ui-kitten/components';
import {Header} from '../../components';
import Animated, {SlideInDown, FadeOutDown} from 'react-native-reanimated';
import {Product, Sale, SaleProduct, User} from '../../models';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const ViewItem = ({navigation, route}) => {
  const [sale, setSale] = useState(route.params);

  const [refresh, setRefresh] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [sales, setSales] = useState({});

  const [reloadAll, setReloadAll] = useContext(ReloadAll);
  const [auth, setAuth] = useContext(AuthContext);

  const [isVisible, setIsVisible] = useState(false);

  const [paidAmount, setPaidAmount] = useState(0);

  const [user, setUser] = useState(0);

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
    let query = `SELECT sale_products.*,measurement_units.alias 
                    FROM 
                    sale_products 
                    JOIN products 
                    ON products.id=sale_products.product_id
                    JOIN measurement_units 
                    ON measurement_units.id=products.measurement_unit_id
                    WHERE sale_id=?`;
    let response = await SaleProduct.selectAll(query, [sale?.id]);
    setSales(response);
    setRefresh(false);
  }

  const loadItem = async () => {
    let query = `SELECT * FROM sales WHERE id=?`;
    let response = await Sale.selectAll(query, [sale.id]);
    if (!response.error) {
      setSale(response.data[0]);
    }
  };

  const addAmount = async () => {
    let query = 'UPDATE sales SET total_paid=?,is_quotation=? WHERE id=?';
    let total_paid = parseFloat(paidAmount) + parseFloat(sale.total_paid);
    let response = await Sale.update(query, [
      total_paid,
      total_paid == sale.total ? 0 : 1,
      sale.id,
    ]);

    loadItem();

    setModalOpen(false);
    setPaidAmount(0);
    setReloadAll({...reloadAll, sales: !reloadAll?.sales});
  };

  const getUser = async _ =>{
    let query = "SELECT * FROM users WHERE id=?";
    let response = await User.selectAll(query,[sale.user_id]);
    if(!response.error){
      setUser(response);
    }

    console.log(response);
    
  }

  const openLink = async url => {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'ERROR',
          `Unable to open link. Try again later.`,
        );
        //ToastAndroid.show(`No app can open this url.`, ToastAndroid.LONG);
      }
    };

  useEffect(() => {
    getUser();
    load();
  }, []);

  return (
    <Layout
      style={{
        flex: 1,
        backgroundColor: app_colors.app_color,
      }}>
      <Header
        navigation={navigation}
        heading={`${sale?.id}`}
        is_drawer={false}
      />

      <Modal
        visible={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        transparent>
        <View
          style={{
            flex: 1,
          }}>
          <TouchableOpacity
            onPress={() => setModalOpen(false)}
            style={{
              width: '100%',
              height: '50%',
              backgroundColor: 'rgba(0,0,0,0.2)',
            }}
          />
          <View
            style={{
              width: '100%',
              height: '50%',
              backgroundColor: app_colors.box_color,
              gap: 10,
              padding: 10,
            }}>
            <Text
              style={{
                color: app_colors.text_color,
                fontSize: 18,
                textAlign: 'center',
                margin: 10,
              }}>
              ADD PAYMENT TO SALE
            </Text>

            <Text
              style={{
                color: app_colors.text_color,
                fontSize: 18,
              }}>
              Enter amount
            </Text>
            <Input
              value={paidAmount}
              placeholder="Paid amount..."
              onChangeText={text => {
                if (text == '') {
                  setPaidAmount(0);
                  return;
                }

                if (text > sale.total - sale.total_paid) {
                  setPaidAmount(0);
                  Alert.alert(
                    'More than balance warning!!!',
                    `The balance for this sale is balance is ${
                      reloadAll.business.currency_alias
                    }. ${sale.total - sale.total_paid}`,
                  );
                } else {
                  setPaidAmount(text);
                }
              }}
              keyboardType="numeric"
            />

            <Text
              style={{
                color: app_colors.text_color,
                fontSize: 20,
              }}>
              Balance : {reloadAll.business.currency_alias}.
              {parseFloat(sale.total) -
                (parseFloat(sale.total_paid) + parseFloat(paidAmount))}
            </Text>
            <Button onPress={() => addAmount()}>ADD AMOUNT</Button>
          </View>
        </View>
      </Modal>

      {sale?.is_quotation ? (
        <Button
          onPress={() => setModalOpen(true)}
          status="warning"
          style={{
            position: 'absolute',
            right: 10,
            top: 70,
            backgroundColor: 'transparent',
            width: 60,
          }}
          accessoryLeft={props => (
            <Icon
              {...props}
              size={40}
              name={'edit'}
              fill={app_colors.icon_color}
            />
          )}
        />
      ) : (
        <></>
      )}

      <Text
        style={{
          color: app_colors.text_color,
          textAlign: 'center',
          margin: 20,
          fontWeight: 'bold',
        }}>
        Sale Details
      </Text>

      <Text
        style={{
          color: app_colors.text_color,
          marginTop: 10,
          marginLeft: 10,
        }}>
        Sale ID : {sale.id}
      </Text>

      <Text
        style={{
          color: app_colors.text_color,
          marginTop: 10,
          marginLeft: 10,
        }}>
        Quantity : {sale.quantity ?? 'N/A'}
      </Text>

      <Text
        style={{
          color: app_colors.text_color,
          marginTop: 10,
          marginLeft: 10,
        }}>
        Total : {reloadAll.business.currency_alias ?? ''}. {sale.total}
      </Text>
      {sale.is_quotation ? (
        <Text
          style={{
            color: app_colors.text_color,
            marginTop: 10,
            marginLeft: 10,
          }}>
          Balance : {reloadAll.business.currency_alias ?? ''}.{' '}
          {sale.total - sale.total_paid}
        </Text>
      ) : (
        <></>
      )}
      <Text
        style={{
          color: app_colors.text_color,
          marginTop: 10,
          marginLeft: 10,
        }}>
        Date : {sale.created_at}
      </Text>

      {user?.data ? (
        <>
          <Text
            style={{
              color: app_colors.text_color,
              textAlign: 'center',
              margin: 20,
              fontWeight: 'bold',
            }}>
            Customer Details
          </Text>
          <View
            style={{
              gap: 10,
              margin: '1%',
            }}>
            <Text
              style={{
                color: app_colors.text_color,
              }}>
              Name : {user.data[0].name}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: app_colors.text_color,
                }}>
                Phone : {user.data[0].phone_number}
              </Text>
              <Button
                onPress={() => openLink(`tel:${user.data[0].phone_number}`)}
                style={{
                  backgroundColor: 'transparent',
                }}
                accessoryLeft={props => (
                  <Icon
                    {...props}
                    name={'phone'}
                    fill={app_colors.icon_color}
                    size={40}
                  />
                )}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  color: app_colors.text_color,
                }}>
                Email: {user.data[0].email}
              </Text>
              <Button
                onPress={() => openLink(`mailto:${user.data[0].email}`)}
                style={{
                  backgroundColor: 'transparent',
                }}
                accessoryLeft={props => (
                  <Icon
                    {...props}
                    name={'email'}
                    fill={app_colors.icon_color}
                    size={40}
                  />
                )}
              />
            </View>
          </View>
        </>
      ) : (
        <></>
      )}

      <Text
        style={{
          color: app_colors.text_color,
          margin: 20,
          fontWeight: 'bold',
        }}>
        Sale products
      </Text>

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
                entering={_entering}
                key={index}
                style={{
                  ...styles.vehicle,
                  backgroundColor: app_colors.box_color,
                  borderWidth: 1,
                  borderColor: app_colors.border_color,
                }}>
                <Text style={{color: app_colors.text_color}}>
                  Name : {item.product_name}
                </Text>
                <Text style={{color: app_colors.text_color}}>
                  Price : {reloadAll.business.currency_alias ?? ''}.{item.price}
                </Text>
                <Text style={{color: app_colors.text_color}}>
                  Quantity : {item.quantity}
                  {item.alias}
                </Text>
                <Text style={{color: app_colors.text_color}}>
                  Total : {reloadAll.business.currency_alias ?? ''}.{item.total}
                </Text>
                <Text style={{color: app_colors.text_color}}>
                  Date : {item.created_at}
                </Text>
              </AnimatedTouchableOpacity>
            );
          })}
      </ScrollView>
    </Layout>
  );
};

export default ViewItem;

const styles = StyleSheet.create({
  vehicle: {
    padding: 10,
    gap: 10,
    borderRadius: 20,
  },
});
