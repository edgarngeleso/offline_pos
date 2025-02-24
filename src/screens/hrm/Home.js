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
import {colors, random_color} from '../../utils';
import {Icon, Layout} from '@ui-kitten/components';
import {Header, Note} from '../../components';
import Animated, {SlideInDown, FadeOutDown} from 'react-native-reanimated';
import {Leave, Product, Task} from '../../models';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const Home = ({navigation}) => {
  const [leaves, setLeaves] = useState({});
  const [tasks, setTasks] = useState({});
  const [reloadAll,setReloadAll] = useContext(ReloadAll);

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

  const hrmHomeData = async () => {
    let leaves = await Leave.selectAll(
      `SELECT COUNT(id) as total FROM leaves WHERE has_reported_back=?`,
      [0]
    );
    
    setLeaves(leaves);

    let tasks = await Task.selectAll(
      `SELECT COUNT(id) as total FROM tasks WHERE is_completed=?`,
      [0]
    );
    
    
    setTasks(tasks);
  };

  useEffect(() => {
    hrmHomeData();
  }, [reloadAll?.hrm]);
  return (
    <Layout
      style={{
        flex: 1,
        backgroundColor: app_colors.app_color,
      }}>
      <Header navigation={navigation} heading={'HRM'} is_drawer={false} />
      <Text
        style={{
          color: app_colors.text_color,
          textAlign: 'center',
          margin: 20,
          fontSize: 26,
          fontWeight: 'bold',
        }}>
        Human Resources Management
      </Text>
      <ScrollView
        contentContainerStyle={{
          gap: 10,
          margin: '1%',
        }}>
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap:10,
          }}>
          <HomeItem
            icon="activity"
            navigation={navigation}
            to={'leave'}
            name={'Leaves'}
            value={leaves?.data?leaves.data[0].total:0}
            app_colors={app_colors}
            width={'48%'}
          />
          <HomeItem
            icon="list"
            navigation={navigation}
            to={'tasks'}
            name={'Tasks'}
            value={tasks?.data?tasks.data[0].total:0}
            app_colors={app_colors}
            width={'48%'}
          />
        </View>
      </ScrollView>
    </Layout>
  );
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

export default Home;

const styles = StyleSheet.create({
  vehicle: {
    padding: 10,
    gap: 10,
    borderRadius: 20,
  },
  text: {
    fontSize: 25,
    fontWeight: 'bold',
    padding: 5,
    paddingLeft: 30,
  },
});
