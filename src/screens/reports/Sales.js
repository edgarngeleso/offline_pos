import {
  Dimensions,
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
import {
  Button,
  Calendar,
  Datepicker,
  Icon,
  Layout,
  RangeDatepicker,
} from '@ui-kitten/components';
import {Header, Table} from '../../components';
import Animated, {SlideInDown, FadeOutDown} from 'react-native-reanimated';
import {Product, Sale} from '../../models';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const Sales = ({navigation}) => {
  const [refresh, setRefresh] = useState(false);
  const [sales, setSales] = useState({});
  const [date, setDate] = useState(new Date());
  const [selectedDate,setSelectedDate] = useState(null);

  let totalAmount = 0;
  let totalProfit = 0;
  const [minDate, setMinDate] = useState(new Date());

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

    let query = `SELECT 
                  sales.*,
                  sale_products.quantity as sale_product_quantity,
                  sale_products.total,
                  sale_products.price,
                  sale_products.product_name,
                  products.buying_price
                  FROM sales
                  JOIN sale_products
                  ON sale_products.sale_id=sales.id 
                  JOIN products ON products.id=sale_products.product_id
                  
                  `;
      let values = [];
    if(selectedDate){
      query += `WHERE sales.created_at=?`;
      values=[selectedDate];
    }
    
    let response = await Sale.selectAll(query, values);
    setSales(response);
    setRefresh(false);
  }

  useEffect(() => {
    let today = new Date(Date.now());
    setMinDate(today.setHours(today - 24 * 365 * 20));

    console.log(minDate);

    load();
  }, [selectedDate]);

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
        Sales report
      </Text>

      <Text
        style={{
          color: app_colors.text_color,
          margin: 10,
        }}>
        Select date
      </Text>

      <Datepicker
        controlStyle={{
          width: '100%',
          backgroundColor: 'red',
          color: '#fff',
          margin:10,
        }}
        style={{
          width: '100%',
        }}
        date={date}
        min={minDate}
        onSelect={date => setDate(date)}
      />

      <ScrollView>
        <ScrollView
          contentContainerStyle={{
            gap: 10,
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refresh}
              onRefresh={() => {
                setRefresh(true);
                load();
              }}
            />
          }>
          <View>
            <View
              style={{
                ...styles.vehicle,
                backgroundColor: app_colors.box_color,
                borderWidth: 1,
                borderColor: app_colors.border_color,
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  ...styles.text,
                  color:app_colors.text_color,
                  width:40
                }}>
                #
              </Text>
              <Text
                style={{
                  ...styles.text,
                  color:app_colors.text_color,
                }}>
                Name
              </Text>
              <Text
                style={{
                  ...styles.text,
                  color:app_colors.text_color,
                }}>
                Buying price
              </Text>
              <Text
                style={{
                  ...styles.text,
                  color:app_colors.text_color,
                }}>
                Selling price
              </Text>
              <Text
                style={{
                  ...styles.text,
                  color:app_colors.text_color,
                }}>
                Quantity
              </Text>
              <Text
                style={{
                  ...styles.text,
                  color:app_colors.text_color,
                }}>
                Total
              </Text>
              <Text
                style={{
                  ...styles.text,
                  color:app_colors.text_color
                }}>
                Profit/Loss
              </Text>
            </View>
            <View>
              {/*
                Table body
              */}

              {sales?.data &&
                sales?.data.map((item, index) => {
                  totalAmount += item.total_paid??0;
                  // totalProfit +=
                  //   item.price * item.sale_product_quantity -
                  //   item.buying_price * item.sale_product_quantity;

                  totalProfit +=
                    item.total_paid -
                    item.buying_price * item.sale_product_quantity;

                  return (
                    <AnimatedTouchableOpacity
                      onPress={() =>
                        navigation.navigate('view-sale', {...item})
                      }
                      entering={_entering}
                      key={index}
                      style={{
                        ...styles.vehicle,
                        backgroundColor: app_colors.box_color,
                        borderWidth: 1,
                        borderColor: app_colors.border_color,
                        flexDirection: 'row',
                      }}>
                      <Text
                        style={{
                          ...styles.text,
                          color: app_colors.text_color,
                          width:40
                        }}>
                        {item.id}
                      </Text>
                      <Text
                        style={{
                          ...styles.text,
                          color: app_colors.text_color,
                        }}>
                        {item.product_name}
                      </Text>
                      <Text
                        style={{
                          ...styles.text,
                          color: app_colors.text_color,
                        }}>
                        {item.buying_price}
                      </Text>
                      <Text
                        style={{
                          ...styles.text,
                          color: app_colors.text_color,
                        }}>
                        {item.price}
                      </Text>
                      <Text
                        style={{
                          ...styles.text,
                          color: app_colors.text_color,
                        }}>
                        {item.sale_product_quantity}
                      </Text>
                      <Text
                        style={{
                          ...styles.text,
                          color: app_colors.text_color,
                        }}>
                        {item.total_paid}
                      </Text>
                      <Text
                        style={{
                          ...styles.text,
                          color:app_colors.text_color,
                        }}>
                        {item.total_paid -
                          item.sale_product_quantity * item.buying_price}
                      </Text>
                    </AnimatedTouchableOpacity>
                  );
                })}
            </View>

            <View
              style={{
                ...styles.vehicle,
                backgroundColor: app_colors.box_color,
                borderWidth: 1,
                borderColor: app_colors.border_color,
                flexDirection: 'row',
              }}>
              <Text
                style={{
                  ...styles.text,
                  width:40
                }}>
                
              </Text>
              <Text
                style={{
                  ...styles.text,
                }}></Text>
              <Text
                style={{
                  ...styles.text,
                }}></Text>
              <Text
                style={{
                  ...styles.text,
                }}></Text>
              <Text
                style={{
                  ...styles.text,
                }}></Text>
              <Text
                style={{
                  ...styles.text,
                  color:app_colors.text_color,
                }}>
                {totalAmount}
              </Text>
              <Text
                style={{
                  ...styles.text,
                  color:app_colors.text_color,
                }}>
                {totalProfit}
              </Text>
            </View>
          </View>
        </ScrollView>

        <View
          style={{
            backgroundColor: app_colors.box_color,
            margin: '1%',
            width: Dimensions.get('window').width * 0.98,
            gap: 10,
            borderRadius: 20,
            padding: 20,
          }}>
          <Text
            style={{
              color: app_colors.text_color,
              fontSize: 26,
              fontWeight: 'bold',
            }}>
            Summary
          </Text>
          <Text
            style={{
              color: app_colors.text_color,
              fontSize:20,
            }}>
            Total : Ksh.{totalAmount}
          </Text>
          <Text
            style={{
              color: app_colors.text_color,
              fontSize:20
            }}>
            {totalProfit > 0 ? `Profit` : `Loss`} : Ksh.{Math.abs(totalProfit)}
          </Text>
        </View>

        
      </ScrollView>
    </Layout>
  );
};

export default Sales;

const styles = StyleSheet.create({
  vehicle: {
    padding: 10,
    gap: 10,
    borderRadius: 0,
  },
  text: {
    borderRightWidth: 2,

    fontSize: 20,
    padding: 5,
    width: 100,
  },
});
