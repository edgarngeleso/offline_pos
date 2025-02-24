import React, {useEffect, useState, useMemo} from 'react';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {NavigationContainer} from '@react-navigation/native';
import {
  PermissionsAndroid,
  Platform,
  ToastAndroid,
  NativeModules,
  StatusBar,
  View,
  Text,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { FadeOutDown, SlideInDown, SlideInUp, SlideOutDown } from 'react-native-reanimated';

//import { io } from 'socket.io-client';

import AppScreens from './src';
import {colors, Constants} from './src/utils';
import {
  AuthContext,
  NotesContext,
  ReloadAll,
  SettingsContext,
} from './src/contexts';
import {Splash} from './src/screens';
import { Network } from './src/modules';

const {SQLiteModule} = NativeModules;

//const socket = io(APPURLS.SOCKET_URL);

//const store = configureStore();

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);


const tables = [
  {
    name: 'users',
    query: `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      email TEXT,
      phone_number TEXT,
      password TEXT,
      is_customer INTEGER,
      is_backed_up INTEGER NULL,
      salary FlOAT NULL,
      created_at TEXT NULL
    `,
  },
  {
    name: 'measurement_units',
    query: `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      alias TEXT,
      has_decimals INTEGER,
      is_backed_up INTEGER NULL,
      created_at TEXT NULL
    `,
  },
  {
    name: 'categories',
    query: `
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      is_backed_up INTEGER NULL,
      created_at TEXT NULL
    `,
  },
  {
    name: 'products',
    query: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id INTEGER,
    measurement_unit_id INTEGER,
    supplier_id INTEGER,
    name TEXT,
    buying_price FLOAT,
    selling_price FLOAT,
    quantity FLOAT,
    alert_amount FLOAT,
    is_backed_up INTEGER NULL,
    created_at TEXT NULL
    `,
  },
  {
    name: 'sales',
    query: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cash_id INTEGER NULL,
    card_id INTEGER NULL,
    mpesa_id INTEGER NULL,
    paypal_id INTEGER NULL,
    user_id INTEGER NULL,
    quantity FLOAT,
    total FLOAT,
    total_paid FLOAT,
    is_paid INTEGER,
    is_quotation INTEGER,
    location TEXT NULL,
    is_backed_up INTEGER NULL,
    created_at TEXT NULL
    `,
  },
  {
    name: 'sale_products',
    query: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sale_id INTEGER,
    product_id INTEGER,
    quantity FLOAT,
    product_name TEXT,
    price FLOAT,
    total FLOAT,
    is_backed_up INTEGER NULL,
    created_at TEXT NULL
    `,
  },
  {
    name: 'suppliers',
    query: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone_number TEXT,
    location TEXT NULL,
    is_backed_up INTEGER NULL,
    created_at TEXT NULL
    `,
  },
  {
    name: 'companies',
    query: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    alias TEXT,
    location TEXT NULL,
    currency TEXT,
    currency_alias TEXT,
    is_backed_up INTEGER NULL,
    created_at TEXT NULL
    `,
  },
  {
    name: 'tasks',
    query: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    description TEXT,
    start_date TEXT,
    end_date TEXT,
    is_completed INTEGER NULL,
    created_at TEXT NULL
    `,
  },
  {
    name: 'leaves',
    query: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    description TEXT,
    start_date TEXT,
    end_date TEXT,
    has_reported_back INTEGER NULL,
    created_at TEXT NULL
    `,
  },
  {
    name: 'settings',
    query: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id INTEGER,
    currency TEXT,
    is_backed_up INTEGER NULL,
    created_at TEXT NULL
    `,
  },
  {
    name: 'cash_payments',
    query: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total FLOAT DEFAULT 0.0,
    is_backed_up INTEGER NULL,
    created_at TEXT NULL
    `,
  },
  {
    name: 'card_payments',
    query: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total FLOAT DEFAULT 0.0,
    is_backed_up INTEGER NULL,
    created_at TEXT NULL
    `,
  },
  {
    name: 'mpesa_payments',
    query: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total FLOAT DEFAULT 0.0,
    is_backed_up INTEGER NULL,
    created_at TEXT NULL
    `,
  },
  {
    name: 'paypal_payments',
    query: `
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    total FLOAT DEFAULT 0.0,
    is_backed_up INTEGER NULL,
    created_at TEXT NULL
    `,
  },
];

const App = () => {
  const [isConnected,setIsConnected] = useState(false);
  const [addedNotes, setAddedNotes] = useState([]);
  const [reloadAll, setReloadAll] = useState({
    home: false,
    products: false,
    categories: false,
    measurement_units: false,
    users:false,
    suppliers:false,
    cart:[],
    business:null,
    hrm:false,
  });
  const [settings, setSettings] = useState({
    dark_theme: false,
    system_theme: true,
    auto_save: false,
    show_notifications: false,
    auto_suggest: false,
    ads: true,
  });

  const [auth, setAuth] = useState({
    logged_in: false,
    user: {},
  });

  const deepLinkingConfig = {
    prefixes: ['swiff_deliveries://'],
    config: {
      screens: {
        HOME: {
          screens: {
            SOMESCREEN: 'do_something/:some_params',
          },
        },
      },
    },
  };

  const requestPermission = () => {
    if (Platform.OS == 'android') {
      try {
        let granted = PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: `${Constants.APP_NAME}`,
            message: `${Constants.APP_NAME} wants access to your location.`,
          },
        );

        if (granted == PermissionsAndroid.RESULTS.GRANTED) {
          ToastAndroid.show('Location access accepted', ToastAndroid.LONG);
        } else {
          //ToastAndroid.show("Location access denied",ToastAndroid.LONG);
        }
      } catch (error) {
        ToastAndroid.show('An error occurred', ToastAndroid.LONG);
      }
    }
  };
  const [splashScreenOpen, setSplashScreenOpen] = useState(true);

  const createTables = () => {
    tables.forEach((table, index) => {
      SQLiteModule.createTable(table.name, table.query)
        .then(response => {
          //console.log(response);
        })
        .catch(e => {
          console.log(e);
        });
    });
  };

  const getSettings = async _ => {
    let stored_settings = await AsyncStorage.getItem('settings');
    //console.log(stored_settings);

    if (stored_settings) {
      stored_settings = JSON.parse(stored_settings);
      setSettings(stored_settings);
    }
  };

  const getAuth = async _ => {
    let stored_authentication = await AsyncStorage.getItem('auth');
    //console.log(stored_authentication);

    if (stored_authentication) {
      stored_authentication = JSON.parse(stored_authentication);
      setAuth(stored_authentication);
    }
  };

  const filePermissionRequest = async _ => {
    try {
      let granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Storage permission',
          message: 'Srorage permission',
          buttonNeutral: 'Ask later',
          buttonPositive: 'OK',
          buttonNegative: 'NO',
        },
      );

      return granted == PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log(error);
      return false;
    }
  };


  const fileReadPermissionRequest = async _ => {
    try {
      let granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'Storage permission',
          message: 'Srorage permission',
          buttonNeutral: 'Ask later',
          buttonPositive: 'OK',
          buttonNegative: 'NO',
        },
      );
      
      return granted == PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log(error);
      return false;
    }
  };


  const upd = _=>{
    let query =`ALTER TABLE tasks ADD COLUMN is_completed INTEGER`
    SQLiteModule.controlData(query,[])
    .then(res=>{
      console.log(res);
      
    })
    .catch(e=>{
      console.log(e);
      
    })
  }

  useEffect(() => {
    requestPermission();
    filePermissionRequest();
    fileReadPermissionRequest();

    getSettings();
    getAuth();

    setSplashScreenOpen(true);
    setTimeout(() => {
      setSplashScreenOpen(false);
    }, 4000);
  }, []);

  useEffect(() => {
   //upd();
    createTables();

    //requestPermission();
  }, []);


  
  useEffect(()=>{
    setIsConnected(Network.checkInternet());
    let subscribe = Network.networkStatus(setIsConnected);
    return ()=>subscribe.remove();
  },[]);
  
  return (
    <>
      <StatusBar backgroundColor={colors.APP_SECONDARY_COLOR} />
      <ReloadAll.Provider value={[reloadAll, setReloadAll]}>
        <AuthContext.Provider value={[auth, setAuth]}>
          <SettingsContext.Provider value={[settings, setSettings]}>
            <NotesContext.Provider value={[addedNotes, setAddedNotes]}>
              <IconRegistry icons={EvaIconsPack} />
              <ApplicationProvider
                {...eva}
                theme={eva.light}
                styles={require('./src/assets/ui_kitten_styles_files/generated.json')}>
                <NavigationContainer
                  linking={{
                    prefixes: 'pos://',
                    config: {
                      screens: {
                        HOME: {},
                      },
                    },
                  }}>
                  {splashScreenOpen ? (
                    <Splash />
                  ) : (
                    <>
                      <AppScreens />
                    </>
                  )}
                </NavigationContainer>
              </ApplicationProvider>
            </NotesContext.Provider>
          </SettingsContext.Provider>
        </AuthContext.Provider>
      </ReloadAll.Provider>

      {
        !isConnected && <Animated.View
        entering={_entering}
        exiting={_exiting}
        style={{
          position:"absolute",
          top:Dimensions.get("window").height-60,
          backgroundColor:isConnected?"green":"red",
          width:"98%",
          margin:"1%",
          padding:15,
          borderRadius:10
        }}
        >
          <Text style={{color:"#fff"}}>{isConnected?"Connected":"Disconnected"}</Text>
        </Animated.View>
      }

    </>
  );
};
export default App;
