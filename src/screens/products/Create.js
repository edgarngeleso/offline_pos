import {
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
import {Button, Input, Layout, Select, SelectItem} from '@ui-kitten/components';
import {Header} from '../../components';
import Animated, {SlideInDown, FadeOutDown} from 'react-native-reanimated';
import {MeasurementUnit, Product, Supplier} from '../../models';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const Create = ({navigation}) => {
  const [item, setItem] = useState({
    name: '',
    measurement_unit_id: null,
    supplier_id: null,
    buying_price: 0.0,
    selling_price: 0.0,
    quantity: 0,
    alert_amount: 0,
    created_at: new Date(Date.now()).toLocaleDateString(),
  });

  const [error, setError] = useState({
    state: false,
    message: '',
  });

  const [reloadAll, setReloadAll] = useContext(ReloadAll);
  const [auth, setAuth] = useContext(AuthContext);

  const [isVisible, setIsVisible] = useState(false);

  const [measurementUnits, setMeasurementUnits] = useState({});
  const [suppliers, setSuppliers] = useState({});

  const [app_settings, _] = useContext(SettingsContext);
  const isDark = useColorScheme() == 'dark';

  let app_colors = colors.light;
  if (app_settings.dark_theme) {
    app_colors = colors.dark;
  }

  if (app_settings.system_theme) {
    app_colors = isDark ? colors.dark : colors.light;
  }

  const createItem = async () => {
    console.log(item);
    
    let query =
      'INSERT INTO products(name,measurement_unit_id,supplier_id,buying_price,selling_price,quantity,alert_amount,created_at) VALUES(?,?,?,?,?,?,?,?)';
    let response = await Product.insert(query, [
      item.name,
      item.measurement_unit_id,
      item.supplier_id,
      item.buying_price,
      item.selling_price,
      item.quantity,
      item.alert_amount,
      item.created_at,
    ]);

    if (!response.error) {
      setReloadAll({
        ...reloadAll,
        products: !reloadAll.products,
        home: !reloadAll.home,
      });
      navigation.navigate('stock');
    }
  };

  useEffect(() => {
    (async function () {
      const measurement_units = await MeasurementUnit.selectAll();
      setMeasurementUnits(measurement_units);
      const suppliers = await Supplier.selectAll();
      setSuppliers(suppliers);
    })();
  }, []);

  return (
    <Layout
      style={{
        flex: 1,
        backgroundColor: app_colors.app_color,
      }}>
      <Header navigation={navigation} heading={'Add item'} is_drawer={false} />

      <Text
        style={{
          color: error.state ? app_colors.danger : app_colors.text_color,
          textAlign: 'center',
          margin: 20,
        }}>
        {error.state ? error.message : 'Add new item'}
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
          onChangeText={text => setItem({...item, name: text})}
          placeholder="Name"
        />

        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Select measurement unit
        </Text>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            gap: 10,
            flexWrap: 'wrap',
          }}>
          {measurementUnits?.data &&
            measurementUnits.data.map((unit, key) => {
              return (
                <AnimatedTouchableOpacity
                  key={key}
                  onPress={() =>
                    setItem({...item, measurement_unit_id: unit.id})
                  }
                  style={{
                    backgroundColor:
                      unit.id == item.measurement_unit_id
                        ? app_colors.border_color
                        : app_colors.box_color,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      color: app_colors.text_color,
                    }}>
                    {unit.name}({unit.alias})
                  </Text>
                </AnimatedTouchableOpacity>
              );
            })}
        </View>

        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Select supplier
        </Text>

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            gap: 10,
            flexWrap: 'wrap',
          }}>
          {suppliers?.data &&
            suppliers.data.map((supplier, key) => {
              return (
                <AnimatedTouchableOpacity
                  key={key}
                  onPress={() => setItem({...item, supplier_id: supplier.id})}
                  style={{
                    backgroundColor:
                      supplier.id == item.supplier_id
                        ? app_colors.border_color
                        : app_colors.box_color,
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 10,
                    borderRadius: 5,
                  }}>
                  <Text
                    style={{
                      color: app_colors.text_color,
                    }}>
                    {supplier.name}
                  </Text>
                </AnimatedTouchableOpacity>
              );
            })}
        </View>

        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Quantity in{' '}
          {measurementUnits?.data &&
            item.measurement_unit_id &&
            measurementUnits.data.filter(
              _ => _.id == item.measurement_unit_id,
            )[0]?.name}
        </Text>

        <Input
          onChangeText={text => setItem({...item, quantity: text})}
          placeholder="Quantity"
          keyboardType="numeric"
        />

        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Buying price per{' '}
          {measurementUnits?.data &&
            item.measurement_unit_id &&
            measurementUnits.data.filter(
              _ => _.id == item.measurement_unit_id,
            )[0]?.name}
        </Text>

        <Input
          onChangeText={text => setItem({...item, buying_price: text})}
          placeholder="Buying Price"
          keyboardType="numeric"
        />

        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Total buying cost :{' '}
          {item.buying_price && item.quantity
            ? item.buying_price * item.quantity
            : 0.0}
        </Text>

        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Selling price per{' '}
          {measurementUnits?.data &&
            item.measurement_unit_id &&
            measurementUnits.data.filter(
              _ => _.id == item.measurement_unit_id,
            )[0]?.name}
        </Text>

        <Input
          onChangeText={text => setItem({...item, selling_price: text})}
          placeholder="Selling Price"
          keyboardType="numeric"
        />

        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Profit for each : {item.selling_price - item.buying_price}
        </Text>

        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Total selling profit :{' '}
          {item.selling_price * item.quantity -
            item.buying_price * item.quantity}
        </Text>

        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Total selling cost :{' '}
          {item.selling_price && item.quantity
            ? item.selling_price * item.quantity
            : 0.0}
        </Text>

        <Text
          style={{
            ...styles.text,
            color: app_colors.text_color,
          }}>
          Alert amount
        </Text>

        <Input
          onChangeText={text => setItem({...item, alert_amount: text})}
          placeholder="alert amount"
          keyboardType="numeric"
        />

        <Button onPress={() => createItem()}>SAVE</Button>
      </ScrollView>
    </Layout>
  );
};

export default Create;

const styles = StyleSheet.create({
  text: {
    marginBottom: 10,
    fontSize: 20,
  },
});
