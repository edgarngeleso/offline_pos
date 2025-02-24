import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  NativeModules,
  Dimensions,
  TouchableOpacity,
  Modal,
  Alert,
  useColorScheme,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {
  Button,
  Card,
  Icon,
  Input,
  Layout,
  Popover,
  PopoverPlacements,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {Graphs, Header, Note} from '../../components';

import Animated, {
  FadeInUp,
  FadeOutDown,
  LinearTransition,
  SlideInDown,
  SlideOutDown,
} from 'react-native-reanimated';
import {
  AuthContext,
  NotesContext,
  ReloadAll,
  SettingsContext,
} from '../../contexts';
import {colors} from '../../utils';
import {
  Company,
  MeasurementUnit,
  Product,
  Sale,
  Supplier,
  User,
} from '../../models';
import {opacity} from 'react-native-reanimated/lib/typescript/Colors';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);
//const _layout = LinearTransition.springify().damping(20);

const {SQLiteModule, FileHandler} = NativeModules;

const Home = ({navigation}) => {
  const [users, setUsers] = useState({});
  const [suppliers, setSuppliers] = useState({});
  const [sales, setSales] = useState(0.0);
  const [todaySales, setTodaySales] = useState(0.0);
  const [lessStock, setLessStock] = useState(null);
  const [graphsData, setGraphsData] = useState([]);

  const [reloadAll, setReloadAll] = useContext(ReloadAll);

  const [auth, setAuth] = useContext(AuthContext);

  const [app_settings, _] = useContext(SettingsContext);
  const isDark = useColorScheme() == 'dark';

  let app_colors = colors.light;
  if (app_settings.dark_theme) {
    app_colors = colors.dark;
  }

  if (app_settings.system_theme && !app_settings.dark_theme) {
    app_colors = isDark ? colors.dark : colors.light;
  }

  const inArray = (haystack, needle) => {
    for (let index = 0; index < haystack.length; index++) {
      if (needle == haystack[index]) {
        return [true, index];
      }
    }
    return false;
  };

  const homeGraphs = async () => {
    let daysOfWeek = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let today = new Date(Date.now());
    today.setHours(today.getHours() - 24 * 7);
    

    let query = `SELECT * FROM sales WHERE created_at BETWEEN ? AND ?`;
    let sales = await Sale.selectAll(query, [
      today.toLocaleDateString(),
      new Date(Date.now()).toLocaleDateString(),
    ]);
    

    let dayVsSale = {labels: [], dataset: []};

    let labels = [];
    let dataset = [];

    for (let index = 0; index < sales.data.length; index++) {
      let formattedDate = sales.data[index].created_at.split("/")
                        .reverse()
                        .join("-");
      let today = new Date(formattedDate);
      let created_at = daysOfWeek[today.getDay()];

      let isInArray = inArray(labels, created_at);

      if (isInArray) {
        dataset[isInArray[1]] +=
          sales.data[index].total_paid ?? sales.data[index].total;
      } else {
        
        labels.push(created_at);
        dataset[labels.length - 1] =
          sales.data[index].total_paid ?? sales.data[index].total;
      }
    }

    console.log(labels);
    

    dayVsSale = {labels, dataset};
    setGraphsData([dayVsSale]);
  };

  const homeData = async () => {
    let app_sales = await Sale.selectAll();
    let total =
      app_sales?.data &&
      app_sales.data
        .map(item => item.total_paid ?? item.total)
        .reduce((prev, next) => prev + next, 0);
    setSales(total);

    let today_sales_query = `
    SELECT * FROM sales WHERE created_at=?
    `;
    let app_today_sales = await Sale.selectAll(today_sales_query, [
      new Date(Date.now()).toLocaleDateString(),
    ]);
    let totalToday =
      app_today_sales?.data &&
      app_today_sales.data
        .map(item => item.total_paid ?? item.total)
        .reduce((prev, next) => prev + next, 0);
    setTodaySales(totalToday);

    let app_users = await User.selectAll(
      'SELECT * FROM users WHERE is_customer=?',
      [1],
    );
    setUsers(app_users);
    let app_suppliers = await Supplier.selectAll();
    setSuppliers(app_suppliers);

    let less_stock = await Product.selectAll(
      `SELECT products.name,products.quantity,measurement_units.alias 
      FROM products 
      JOIN measurement_units 
      ON measurement_units.id=products.measurement_unit_id 
      WHERE quantity<alert_amount`,
    );
    setLessStock(less_stock);
  };

  useEffect(() => {
    homeData();
    homeGraphs();
  }, [reloadAll?.home]);

  const writeToFile = async _ => {
    let response = await FileHandler.writeToFile(
      'file.txt',
      JSON.stringify([
        {name: 'User', id: 1, email: 'user@gmail.com'},
        {name: 'User1', id: 2, email: 'user1@gmail.com'},
        {name: 'User2', id: 3, email: 'user2@gmail.com'},
        {name: 'User3', id: 4, email: 'user3@gmail.com'},
        {name: 'User4', id: 5, email: 'user4@gmail.com'},
      ]),
    );
    //console.log(response);
  };

  const readFile = async _ => {
    let response = await FileHandler.readFile('file.txt');
    //console.log(response);
  };

  const createPdf = async _ => {
    let response = await FileHandler.createPDF(
      'app.pdf',
      'COMPANY 1',
      `
                Item 1: Ksh. 5000 , Item 2 : Ksh.200
                Item 1: Ksh. 5000 , Item 2 : Ksh.200
                Item 1: Ksh. 5000 , Item 2 : Ksh.200
                Item 1: Ksh. 5000 , Item 2 : Ksh.200
                Item 1: Ksh. 5000 , Item 2 : Ksh.200
                Item 1: Ksh. 5000 , Item 2 : Ksh.200
                Item 1: Ksh. 5000 , Item 2 : Ksh.200
              `,
      `${new Date(Date.now()).toLocaleDateString()}, Served By E. Ngeleso`,
    );
    //console.log(response);
  };

  const getBusinessData = async _ => {
    let response = await Company.selectOne();

    setReloadAll({...reloadAll, business: response.data});
  };

  useEffect(() => {
    getBusinessData();

    //writeToFile();
    //readFile();
    //createPdf();
  }, []);

  return (
    <Layout
      style={{
        flex: 1,
        backgroundColor: app_colors.app_color,
      }}>
      <Header navigation={navigation} />

      <ScrollView>
        <View
          style={{
            width: '100%',
            height: 100,
            backgroundColor: app_colors.box_color,
            borderBottomLeftRadius: 60,

            marginBottom: 20,
            flexDirection: 'row',
            gap: 5,
            alignItems: 'center',
            padding: 10,
            paddingLeft: 30,
          }}>
          <Text
            style={{
              fontSize: 35,
              fontWeight: 'bold',
              color: app_colors.text_color,
            }}>
            Hello
          </Text>
          <Button
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              height: 20,
              width: 20,
            }}
            accessoryLeft={props => (
              <Icon
                {...props}
                name={'smiling-face'}
                size={40}
                fill={app_colors.text_color}
              />
            )}
          />
          <Text
            style={{
              fontSize: 35,
              fontWeight: 'bold',
              color: app_colors.text_color,
            }}>
            {auth.user.name}
          </Text>
        </View>

        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            flexWrap: 'wrap',
            marginBottom: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <HomeItem
            icon="credit-card"
            navigation={navigation}
            to={'sales'}
            name={'Sales'}
            value={`${reloadAll?.business?.currency_alias ?? ''} ${sales}`}
            app_colors={app_colors}
            width={'48%'}
          />
          <HomeItem
            navigation={navigation}
            to={'sales'}
            name={'Today`s sales'}
            value={`${reloadAll?.business?.currency_alias ?? ''} ${todaySales}`}
            app_colors={app_colors}
            width={'48%'}
          />
          <HomeItem
            navigation={navigation}
            icon="people"
            to={'users'}
            name={'Customers'}
            value={users?.data?.length}
            app_colors={app_colors}
            width={'48%'}
          />

          <HomeItem
            icon="person"
            navigation={navigation}
            to={'suppliers'}
            name={'Suppliers'}
            value={suppliers?.data?.length}
            app_colors={app_colors}
            width={'48%'}
          />
        </View>

        {
          graphsData.length>0 && <Graphs.Bar
          heading={'Sales vs days'}
          data={
            graphsData.length > 0 ? graphsData[0] : {dataset: [], labels: []}
          }
          height={500}
        />
        }

        {lessStock &&
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

const random_color = () => {
  const values = 'abcdef0123456789';
  let color = '#';
  for (let index = 0; index < 6; index++) {
    const random_index = Math.floor(Math.random() * values.length);
    color += values[random_index];
  }
  return color;
};

const HomeItem = ({
  navigation,
  to,
  name,
  value,
  app_colors,
  width,
  icon = 'hash',
}) => {
  return (
    <View
      style={{
        width,
        backgroundColor: app_colors.app_color,
        borderRadius: 20,
        minHeight: 180,
        borderWidth: 1,
        borderColor: app_colors.gray,
      }}>
      <View
        style={{
          position: 'absolute',
          zIndex: -1,
          height: '20%',
          width: '40%',
          top: '50%',
          left: '60%',
          alignItems: 'center',
        }}>
        <Icon
          name={icon}
          fill={app_colors.icon_color}
          style={{
            height: 30,
            width: 30,
            color: app_colors.icon_color,
            opacity: 0.7,
          }}
        />
      </View>
      <Text
        style={{
          ...styles.text,
          color: app_colors.text_color,
        }}>
        {value}
      </Text>
      <Text
        style={{
          ...styles.text,
          color: app_colors.text_color,
          marginBottom: 35,
        }}>
        {name}
      </Text>

      <TouchableOpacity
        onPress={() => navigation.navigate(to)}
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          padding: 10,
          backgroundColor: app_colors.box_color,
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
        }}>
        <Text
          style={{
            color: app_colors.text_color,
          }}>
          More info
        </Text>
        <Icon
          style={{height: 20, width: 20}}
          name={'arrow-forward'}
          fill={'red'}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    padding: 5,
    paddingLeft: 30,
  },
});

export default Home;
