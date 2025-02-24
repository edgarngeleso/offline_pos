import {
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {AuthContext, ReloadAll, SettingsContext} from '../../contexts';
import {colors, functions} from '../../utils';
import {
  Button,
  Icon,
  Input,
  Layout,
  Select,
  SelectItem,
} from '@ui-kitten/components';
import {Header} from '../../components';
import Animated, {SlideInDown, FadeOutDown} from 'react-native-reanimated';
import {Product, Sale, SaleProduct, User} from '../../models';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const Pos = ({navigation}) => {
  const [searchOpen, setSearchOpen] = useState(false);

  const [refresh, setRefresh] = useState(false);
  const [products, setProducts] = useState({});
  const [paidAmount, setPaidAmount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [productsSearches, setProductsSearches] = useState({});

  const [reloadAll, setReloadAll] = useContext(ReloadAll);

  const [isQuote, setIsQuote] = useState(false);

  const [app_settings, _] = useContext(SettingsContext);
  const isDark = useColorScheme() == 'dark';

  const [customers, setCustomers] = useState({});
  const [customer, setCustomer] = useState({
    id: null,
    index: null,
  });

  const getCustomers = async _ => {
    let query = 'SELECT * FROM users WHERE is_customer=?';
    let response = await User.selectAll(query, [1]);
    setCustomers(response);
  };

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

  const add = (item, added_quantity = null) => {
    let cart_items = reloadAll.cart;
    cart_items.forEach((cart_item, index) => {
      if (item.id == cart_item.id) {
        let quantity = added_quantity ?? item.quantity + 1;
        if (quantity > item.available_quantity) {
          let value = {...item, quantity: item.available_quantity};
          cart_items[index] = value;
          Alert.alert(
            'WARNING!!',
            `Their is only ${item.available_quantity} units of ${item.name} left.Quantity will be set to ${item.available_quantity}`,
          );
        } else {
          let value = {...item, quantity: quantity};
          cart_items[index] = value;
        }
      }
    });
    setReloadAll({...reloadAll, cart: cart_items, home: !reloadAll?.home});
  };

  const subtract = (item, added_quantity = null) => {
    let cart_items = reloadAll.cart;
    cart_items.forEach((cart_item, index) => {
      if (item.id == cart_item.id) {
        let quantity = added_quantity ?? item.quantity - 1;
        if (quantity < 1) {
          cart_items = deleteItem(item);

          return;
        } else {
          let value = {...item, quantity: quantity};
          cart_items[index] = value;
        }
      }
    });
    setReloadAll({...reloadAll, cart: cart_items});
  };

  const deleteItem = item => {
    let cart_items = reloadAll.cart;
    cart_items = cart_items.filter(i => i.id != item.id);
    setReloadAll({...reloadAll, cart: cart_items});
    return cart_items;
  };

  const search = async () => {
    if (searchQuery.length < 1) {
      setProductsSearches({});
      return;
    }

    let query = `
    SELECT products.* 
    FROM products
    JOIN suppliers 
    ON suppliers.id=products.supplier_id
    WHERE products.name LIKE ?
    OR suppliers.name LIKE ? 
    `;
    let values = [`%${searchQuery}%`, `%${searchQuery}%`];

    let response = await Product.selectAll(query, values);

    setProductsSearches(response);
  };

  let totalCost = reloadAll.cart
    .map(item => item.quantity * item.selling_price)
    .reduce((prev, next) => prev + next, 0);

  let totalQuantity = reloadAll.cart
    .map(item => item.quantity)
    .reduce((prev, next) => prev + next, 0);

  const [loading, setLoading] = useState(false);

  const placeOrder = async (is_quote = null) => {
    setLoading(true);
    let values = [
      totalCost,
      totalCost,
      totalQuantity,
      new Date(Date.now()).toLocaleDateString(),
    ];

    // Add a sale
    let sale_query = `
      INSERT INTO sales(total,total_paid,quantity,created_at) VALUES(?,?,?,?)
      `;
    if (is_quote) {
      sale_query = `
      INSERT INTO sales(user_id,total,total_paid,quantity,is_quotation,created_at) VALUES(?,?,?,?,?,?)
      `;
      values = [
        customer.id,
        totalCost,
        paidAmount,
        totalQuantity,
        totalCost - paidAmount == 0 ? 0 : 1,
        new Date(Date.now()).toLocaleDateString(),
      ];
    }
    let a = await Sale.insert(sale_query, values);
    let sale = await Sale.selectOne();

    reloadAll.cart.forEach(async item => {
      let sale_product_query = `INSERT 
      INTO sale_products(sale_id,product_id,product_name,price,quantity,total,created_at) 
      VALUES(?,?,?,?,?,?,?)`;
      let b = await SaleProduct.insert(sale_product_query, [
        sale?.data.id,
        item.id,
        item.name,
        item.selling_price,
        item.quantity,
        item.quantity * item.selling_price,
        new Date(Date.now()).toLocaleDateString(),
      ]);

      // update quantity of the products
      let update_product_query = `UPDATE products SET quantity=? WHERE id=?`;
      await Product.update(update_product_query, [
        item.available_quantity - item.quantity,
        item.id,
      ]);
    });

    setReloadAll({
      ...reloadAll,
      cart: [],
      home: !reloadAll?.home,
      sales: !reloadAll.sales,
    });
    ToastAndroid.show(`Order made`, ToastAndroid.LONG);
    setPaidAmount(0);
    totalCost = 0;
    setCustomer({index: null, id: null});
    setLoading(false);
    setIsQuote(false);
  };

  useEffect(() => {
    load();
  }, [reloadAll?.cart]);

  useEffect(() => {
    search();
  }, [searchQuery]);

  useEffect(() => {
    getCustomers();
  }, []);

  return (
    <Layout
      style={{
        flex: 1,
        backgroundColor: app_colors.app_color,
      }}>
      <Header navigation={navigation} heading={'POS'} is_drawer={false} />
      <Text
        style={{
          color: app_colors.text_color,
          margin: 20,
        }}>
        POS
      </Text>

      <Modal
        visible={isQuote}
        onRequestClose={() => setIsQuote(false)}
        transparent>
        <View
          style={{
            flex: 1,
          }}>
          <TouchableOpacity
            onPress={() => setIsQuote(false)}
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
              MARK SALE AS QUOTATION
            </Text>

            <Text
              style={{
                color: app_colors.text_color,
                fontSize: 18,
              }}>
              Enter paid amount
            </Text>
            <Input
              placeholder="Paid amount..."
              onChangeText={text => {
                if (text > totalCost) {
                  setPaidAmount(totalCost);
                } else {
                  setPaidAmount(text);
                }
              }}
              keyboardType="numeric"
            />

            <Text
              style={{
                color: app_colors.text_color,
                fontSize: 18,
              }}>
              Select customer
            </Text>
            <Select
              value={
                customer?.index
                  ? customers.data[customer.index - 1].name
                  : 'Select customer'
              }
              placeholder={'Select customer'}
              onSelect={value => {
                setCustomer({
                  index: value.row + 1,
                  id: customers.data[value.row].id,
                });
              }}>
              {customers?.data &&
                customers.data.map((item, index) => {
                  return <SelectItem key={index} title={item.name} />;
                })}
            </Select>
            <Text
              style={{
                color: app_colors.text_color,
                fontSize: 20,
              }}>
              Balance : {totalCost - paidAmount}
            </Text>
            <Button onPress={() => placeOrder(true)}>Quote</Button>
          </View>
        </View>
      </Modal>

      <Modal visible={loading} transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.2)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: app_colors.text_color,
            }}>
            Saving... Please wait....
          </Text>
        </View>
      </Modal>

      <View
      style={{
        margin:"1%"
      }}
      >
        <Input
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
          accessoryLeft={props => {
            return (
              <Icon
                {...props}
                name={'search'}
                fill={app_colors.icon_color}
                size={50}
              />
            );
          }}
          placeholder="Search by product name, supplier "
        />
        <Button
          onPress={() => setSearchQuery('')}
          accessoryLeft={props => (
            <Icon {...props} name={'close'} fill={app_colors.danger} />
          )}
          style={{
            position: 'absolute',
            right: 0,
            height: 20,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          }}
        />
      </View>

      <View
      style={{
        margin:"1%"
      }}
      >
        <Select
        placeholder={"Select product from dropdown"}
          onSelect={index => {
            let cart_items = reloadAll?.cart ?? [];
            let item = products.data[index.row];
            let exists = false;
            for (let index = 0; index < cart_items.length; index++) {
              if (item.id == cart_items[index].id) {
                add(cart_items[index]);
                return;
              }
            }

            if (!exists) {
              cart_items.push({
                ...item,
                available_quantity: item.quantity,
                quantity: 1,
              });
              setReloadAll({...reloadAll, cart: cart_items});
            }
          }}>
          {products?.data &&
            products.data.map((item, index) => {
              return <SelectItem key={item.id} title={item.name} />;
            })}
        </Select>
      </View>

      {productsSearches?.data ? (
        <ScrollView
          contentContainerStyle={{
            gap: 10,
          }}
          style={{
            width: '100%',
            marginTop: 10,
          }}>
          {productsSearches?.data.map((item, index) => {
            return (
              <AnimatedTouchableOpacity
                onPress={() => {
                  setSearchQuery('');
                  let cart_items = reloadAll?.cart ?? [];

                  let exists = false;
                  for (let index = 0; index < cart_items.length; index++) {
                    if (item.id == cart_items[index].id) {
                      add(cart_items[index]);
                      return;
                    }
                  }

                  if (!exists) {
                    cart_items.push({
                      ...item,
                      available_quantity: item.quantity,
                      quantity: 1,
                    });
                    setReloadAll({...reloadAll, cart: cart_items});
                  }
                }}
                entering={_entering}
                exiting={_exiting}
                key={index}
                style={{
                  ...styles.vehicle,
                  borderRadius: 10,
                  backgroundColor: app_colors.box_color,
                  borderWidth: 1,
                  borderColor: app_colors.border_color,
                  position: 'relative',
                }}>
                <Text
                  style={{
                    color: app_colors.text_color,
                  }}>
                  {item.name.length > 50
                    ? `${item.name.substring(0, 50)}...`
                    : item.name}
                </Text>
                <Icon
                  name={'plus'}
                  style={{
                    color: app_colors.icon_color,
                    width: 30,
                    height: 30,
                    position: 'absolute',
                    right: 10,
                    top: -30,
                  }}
                  fill={app_colors.icon_color}
                />
              </AnimatedTouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <></>
      )}

      <ScrollView
        contentContainerStyle={{
          gap: 10,
          marginTop: 10,
        }}>
        {reloadAll?.cart && reloadAll?.cart.length > 0 ? (
          <Text style={{color: app_colors.text_color, margin: 10}}>
            Cart items
          </Text>
        ) : (
          <></>
        )}
        {reloadAll?.cart.map((item, index) => {
          return (
            <Animated.View
              entering={_entering}
              key={index}
              style={{
                ...styles.vehicle,
                backgroundColor: app_colors.box_color,
                borderWidth: 1,
                borderColor: app_colors.border_color,
              }}>
              <Text style={{color: app_colors.text_color}}>{item.name}</Text>
              <Text style={{color: app_colors.text_color}}>
                Ksh. {item.selling_price * item.quantity}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '80%',
                  justifyContent: 'space-between',
                }}>
                <Button
                  onPress={() => {
                    subtract(item);
                  }}
                  status="danger"
                  style={{
                    top: 5,
                    right: 5,
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  }}
                  accessoryLeft={props => (
                    <Icon
                      {...props}
                      name={'minus'}
                      size={40}
                      fill={app_colors.danger}
                    />
                  )}
                />

                <Text style={{color: app_colors.text_color}}>
                  Quantity : {item.quantity}
                </Text>

                <Button
                  onPress={() => {
                    add(item);
                  }}
                  status="danger"
                  style={{
                    top: 5,
                    right: 5,
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                  }}
                  accessoryLeft={props => (
                    <Icon
                      {...props}
                      name={'plus'}
                      size={40}
                      fill={app_colors.danger}
                    />
                  )}
                />
              </View>

              <Button
                onPress={() => deleteItem(item)}
                status="danger"
                style={{
                  position: 'absolute',
                  top: 5,
                  right: 5,
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
            </Animated.View>
          );
        })}

        {reloadAll?.cart && reloadAll?.cart.length > 0 ? (
          <Text
            style={{
              color: app_colors.text_color,
              margin: 10,
              fontWeight: 'bold',
              fontSize: 20,
            }}>
            Total : Ksh. {totalCost}
          </Text>
        ) : (
          <></>
        )}
      </ScrollView>

      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 0,
          backgroundColor: app_colors.box_color,
          flexDirection: 'row',
          gap: 10,
          padding: 5,
        }}>
        <Button onPress={() => placeOrder()} status="success">
          Complete Order
        </Button>
        {/* <Button status="primary">Multiple pay</Button> */}
        <Button onPress={() => setIsQuote(true)} status="primary">
          Mark as quotation
        </Button>
      </View>
    </Layout>
  );
};

const add = (items, item_id, added_quantity = null) => {
  let all_items = items;
  all_items.forEach((item, index) => {
    if (item.id == item_id) {
      let quantity = added_quantity ?? item.quantity + 1;
      let value = {...item, quantity: quantity};
      all_items[index] = value;
    }
  });

  return all_items;
};

const subtract = (items, item_id, added_quantity = null) => {
  let all_items = items;
  all_items.forEach((item, index) => {
    if (item.id == item_id) {
      let quantity = added_quantity ?? item.quantity - 1;
      let value = {...item, quantity: quantity};
      all_items[index] = value;
    }
  });

  return all_items;
};

const remove = (items, item_id) => {
  let all_items = items;
  all_items.filter(item => item.id != item_id);

  return all_items;
};

export default Pos;

const styles = StyleSheet.create({
  vehicle: {
    padding: 10,
    gap: 10,
    borderRadius: 20,
  },
});
