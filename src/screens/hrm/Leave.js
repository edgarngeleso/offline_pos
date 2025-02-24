import {
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';

import {AuthContext, ReloadAll, SettingsContext} from '../../contexts';
import {colors, random_color} from '../../utils';
import {
  Button,
  Datepicker,
  Icon,
  Input,
  Layout,
  Popover,
  Select,
  SelectItem,
} from '@ui-kitten/components';
import {Header, Note} from '../../components';
import Animated, {SlideInDown, FadeOutDown} from 'react-native-reanimated';
import {Leave, User} from '../../models';

const _entering = SlideInDown.springify().damping(20);
const _exiting = FadeOutDown.springify().damping(20);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const UserLeaves = ({navigation}) => {
  const [allLeaves, setAllLeaves] = useState({});
  const [selectedLeave, setSelectedLeave] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [popoverVisible, setPopoverVisible] = useState(null);
  const [popoverActiveButton, setPopoverActiveButton] = useState(null);
  const [activeButton, setActiveButton] = useState(null);

  const [auth, setAuth] = useContext(AuthContext);
  const [reloadAll, setReloadAll] = useContext(ReloadAll);

  const [isVisible, setIsVisible] = useState(false);

  const [refresh, setRefresh] = useState(false);

  const [app_settings, _] = useContext(SettingsContext);
  const isDark = useColorScheme() == 'dark';

  let app_colors = colors.light;
  if (app_settings.dark_theme) {
    app_colors = colors.dark;
  }

  if (app_settings.system_theme) {
    app_colors = isDark ? colors.dark : colors.light;
  }

  const getLeaves = async () => {
    setRefresh(true);

    let query = `SELECT leaves.*,users.name FROM leaves JOIN users ON users.id=leaves.user_id`;
    let values = [];
    if (popoverActiveButton == 1) {
      query += ` WHERE is_completed=?`;
      values = [1];
    } else if (popoverActiveButton == 2) {
      query = ` WHERE is_completed=?`;
      values = [0];
    }

    query += ' ORDER BY id DESC';

    let all_leaves = await Leave.selectAll(query, values);

    setAllLeaves(all_leaves);
    setRefresh(false);
  };

  const markAsCompleted = async item => {
    let query = `UPDATE leaves SET has_reported_back=? WHERE id=?`;
    Alert.alert(
      'CONFIRMATION',
      'Do you want to mark this leave as reported back?',
      [
        {
          text: 'YES',
          onPress: async () => {
            let response = await Leave.update(query, [1, item.id]);

            console.log(response);

            setUpdated(!updated);
            setReloadAll({...reloadAll, hrm: !reloadAll?.hrm});
          },
        },
        {
          text: 'NO',
          onPress: () => {},
        },
      ],
    );
  };

  const deleteLeave = item => {
    let query = `DELETE FROM leaves WHERE id=?`;
    Alert.alert('CONFIRMATION', 'Do you want to delete this leave?', [
      {
        text: 'YES',
        onPress: async () => {
          let response = await Leave.remove(query, [item.id]);

          console.log(response);

          setUpdated(!updated);
          setReloadAll({...reloadAll, hrm: !reloadAll?.hrm});
        },
      },
      {
        text: 'NO',
        onPress: () => {},
      },
    ]);
  };

  useEffect(() => {
    getLeaves();
  }, [updated, popoverActiveButton]);
  return (
    <Layout
      style={{
        flex: 1,
        backgroundColor: app_colors.app_color,
      }}>
      <Header navigation={navigation} heading={'Leaves'} is_drawer={false} />

      <Modal
        visible={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        transparent
        animationType="slide">
        <View
          style={{
            backgroundColor: app_colors.app_color,
            flex: 1,
          }}>
          <Button
            onPress={() => setModalOpen(false)}
            style={{
              backgroundColor: 'transparent',
              borderColor: 'transparent',
              width: 40,
            }}
            accessoryLeft={props => (
              <Icon
                {...props}
                size={40}
                name={'arrow-back'}
                fill={app_colors.text_color}
              />
            )}
          />

          {activeButton == 1 ? (
            <Add
              setModalOpen={setModalOpen}
              setUpdated={setUpdated}
              updated={updated}
            />
          ) : activeButton == 2 ? (
            <Edit
              selectedLeave={selectedLeave}
              setModalOpen={setModalOpen}
              setUpdated={setUpdated}
              updated={updated}
            />
          ) : (
            <></>
          )}
        </View>
      </Modal>

      <Text
        style={{
          color: app_colors.text_color,
          textAlign: 'center',
          margin: 20,
        }}>
        User leaves Management
      </Text>
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Button
          status="warning"
          onPress={() => {
            setModalOpen(true);
            setActiveButton(1);
          }}
          style={{
            backgroundColor: 'transparent',
            margin: 10,
            width: 100,
          }}
          accessoryLeft={props => (
            <Icon
              {...props}
              size={40}
              name={'plus'}
              fill={app_colors.icon_color}
            />
          )}>
          {props => (
            <Text
              style={{
                color: app_colors.text_color,
              }}>
              Add leave
            </Text>
          )}
        </Button>

        <Popover
          visible={popoverVisible}
          onBackdropPress={() => setPopoverVisible(false)}
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
              padding: 5,
            }}>
            <Button
              onPress={() => {
                setPopoverVisible(false);
                setPopoverActiveButton(0);
              }}
              style={{
                backgroundColor: app_colors.box_color,
                borderColor: 'transparent',
                marginTop: 5,
              }}>
              {props => (
                <Text {...props} style={{color: app_colors.text_color}}>
                  All
                </Text>
              )}
            </Button>
            <Button
              onPress={() => {
                setPopoverVisible(false);
                setPopoverActiveButton(1);
              }}
              style={{
                backgroundColor: app_colors.box_color,
                borderColor: 'transparent',
                marginTop: 5,
              }}>
              {props => (
                <Text {...props} style={{color: app_colors.text_color}}>
                  Pending
                </Text>
              )}
            </Button>
            <Button
              onPress={() => {
                setPopoverVisible(false);
                setPopoverActiveButton(2);
              }}
              style={{
                backgroundColor: app_colors.box_color,
                borderColor: 'transparent',
                marginTop: 5,
              }}>
              {props => (
                <Text {...props} style={{color: app_colors.text_color}}>
                  Reported back
                </Text>
              )}
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
              getLeaves();
            }}
          />
        }>
        {allLeaves?.data &&
          allLeaves?.data.map((item, index) => {
            return (
              <AnimatedTouchableOpacity
                onPress={() => {
                  setSelectedLeave(item);
                  setActiveButton(2);
                  setModalOpen(true);
                }}
                entering={_entering}
                key={index}
                style={{
                  ...styles.vehicle,
                  backgroundColor: app_colors.box_color,
                  borderWidth: 1,
                  borderColor: app_colors.border_color,
                }}>
                <Text style={{color: app_colors.text_color,fontWeight:"bold"}}>
                  {item?.title}
                </Text>
                <Text style={{color: app_colors.text_color}}>
                  Start date : {item.start_date}
                </Text>
                <Text style={{color: app_colors.text_color}}>
                  End date : {item.end_date}
                </Text>
                <Text style={{color: app_colors.text_color}}>
                  User : {item?.name}
                </Text>

                <View
                  style={{
                    position: 'absolute',
                    top: 20,
                    right: 10,
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                    gap: 10,
                  }}>
                  <Text
                    style={{
                      color: item.is_completed
                        ? app_colors.link_color
                        : app_colors.danger,
                      fontSize: 16,
                    }}>
                    {item.is_completed ? 'Done' : 'Pending'}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      gap: 10,
                    }}>
                    {!item.is_completed ? (
                      <Button
                        status="success"
                        onPress={() => {
                          markAsCompleted(item);
                        }}
                        accessoryLeft={props => (
                          <Icon {...props} name={'checkmark'} />
                        )}></Button>
                    ) : (
                      <></>
                    )}

                    <Button
                      status="danger"
                      onPress={() => {
                        deleteLeave(item);
                      }}
                      accessoryLeft={props => (
                        <Icon {...props} name={'trash'} />
                      )}></Button>
                  </View>
                </View>
              </AnimatedTouchableOpacity>
            );
          })}
      </ScrollView>
    </Layout>
  );
};

const Add = ({setModalOpen, setUpdated, updated}) => {
  const [app_settings, _] = useContext(SettingsContext);
  const [reloadAll, setReloadAll] = useContext(ReloadAll);

  const isDark = useColorScheme() == 'dark';

  let app_colors = colors.light;
  if (app_settings.dark_theme) {
    app_colors = colors.dark;
  }

  if (app_settings.system_theme) {
    app_colors = isDark ? colors.dark : colors.light;
  }

  const [users, setUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState({
    index: null,
    id: null,
  });

  const [selectedDate, setSelectedDate] = useState({
    start: new Date(Date.now()),
    end: new Date(Date.now()),
  });
  const [leave, setLeave] = useState({
    user_id: null,
    title: '',
    description: '',
    start_date: null,
    end_date: null,
    created_at: new Date(Date.now()).toLocaleDateString(),
  });
  const create = async () => {
    let query = `INSERT INTO leaves(user_id,title,description,start_date,end_date,created_at) VALUES(?,?,?,?,?,?)`;
    let response = await Leave.insert(query, [
      leave.user_id,
      leave.title,
      leave.description,
      leave.start_date,
      leave.end_date,
      leave.created_at,
    ]);

    console.log(response);
    setUpdated(!updated);
    setReloadAll({...reloadAll, hrm: !reloadAll?.hrm});
    setModalOpen(false);
  };

  const getUsers = async () => {
    let query = 'SELECT * FROM users WHERE is_customer=?';
    let response = await User.selectAll(query, [0]);
    setUsers(response);
  };
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <View
      style={{
        width: '98%',
        margin: '1%',
        gap: 10,
      }}>
      <Text
        style={{
          color: app_colors.text_color,
          fontWeight: 'bold',
          fontSize: 26,
          textAlign: 'center',
        }}>
        ADD A LEAVE
      </Text>

      <Text
        style={{
          color: app_colors.text_color,
        }}>
        Leave Title
      </Text>
      <Input
        placeholder="Enter title eg Normal leave..."
        value={leave.title}
        onChangeText={text => setLeave({...leave, title: text})}
      />
      <Text
        style={{
          color: app_colors.text_color,
        }}>
        Leave Description
      </Text>
      <TextInput
        textAlignVertical="top"
        onChangeText={text => setLeave({...leave, description: text})}
        multiline
        style={{
          height: 130,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#f5f5f5',
          padding: 10,
          paddingLeft: 15,
          paddingRight: 15,
          color: app_colors.text_color,
          fontSize: 20,
        }}
      />
      <Text
        style={{
          color: app_colors.text_color,
        }}>
        Assign to
      </Text>
      <Select
        value={
          selectedUser.index !== null
            ? users.data[selectedUser.index].name
            : 'Select user'
        }
        placeholder={'Select user'}
        onSelect={index => {
          setSelectedUser({
            index: index.row,
            id: users.data[index.row].id,
          });

          setLeave({...leave, user_id: users.data[index.row].id});
        }}>
        {users?.data &&
          users.data.map((item, index) => {
            return <SelectItem key={index} title={item.name} />;
          })}
      </Select>
      <Text
        style={{
          color: app_colors.text_color,
        }}>
        Start date
      </Text>
      <Datepicker
        date={selectedDate.start}
        onSelect={date => {
          setSelectedDate({...selectedDate, start: date});
          setLeave({...leave, start_date: date.toLocaleDateString()});
        }}
      />
      <Text
        style={{
          color: app_colors.text_color,
        }}>
        End date
      </Text>
      <Datepicker
        date={selectedDate.end}
        onSelect={date => {
          setSelectedDate({...selectedDate, end: date});
          setLeave({...leave, end_date: date.toLocaleDateString()});
        }}
      />

      <Button onPress={() => create()}>ADD</Button>
    </View>
  );
};

const Edit = ({setModalOpen, setUpdated, updated, selectedLeave}) => {
  const [app_settings, _] = useContext(SettingsContext);
  const [reloadAll, setReloadAll] = useContext(ReloadAll);

  const isDark = useColorScheme() == 'dark';

  let app_colors = colors.light;
  if (app_settings.dark_theme) {
    app_colors = colors.dark;
  }

  if (app_settings.system_theme) {
    app_colors = isDark ? colors.dark : colors.light;
  }

  const [users, setUsers] = useState({});
  const [selectedUser, setSelectedUser] = useState({
    index: null,
    id: null,
  });

  const [selectedDate, setSelectedDate] = useState({
    start: new Date(Date.now()),
    end: new Date(Date.now()),
  });
  const [leave, setLeave] = useState({
    user_id: selectedLeave.user_id,
    title: selectedLeave.title,
    description: selectedLeave.description,
    start_date: selectedLeave.start_date,
    end_date: selectedLeave.end_date,
    id: selectedLeave.id,
  });
  const create = async () => {
    let query = `UPDATE leaves SET user_id=?,description=?,start_date=?,end_date=? WHERE id=?`;
    let response = await Leave.insert(query, [
      leave.user_id,
      leave.description,
      leave.start_date,
      leave.end_date,
      leave.id,
    ]);

    setUpdated(!updated);
    setReloadAll({...reloadAll, hrm: !reloadAll?.hrm});
    setModalOpen(false);
  };

  const getUsers = async () => {
    let query = 'SELECT * FROM users WHERE is_customer=?';
    let response = await User.selectAll(query, [0]);
    setUsers(response);
  };
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <View
      style={{
        width: '98%',
        margin: '1%',
        gap: 10,
      }}>
      <Text
        style={{
          color: app_colors.text_color,
          fontWeight: 'bold',
          fontSize: 26,
          textAlign: 'center',
        }}>
        EDIT LEAVE
      </Text>

      <Text
        style={{
          color: app_colors.text_color,
        }}>
        Leave Title
      </Text>
      <Input
        placeholder="Enter title eg Normal leave..."
        value={leave.title}
        onChangeText={text => setLeave({...leave, title: text})}
      />

      <Text
        style={{
          color: app_colors.text_color,
        }}>
        Leave Description
      </Text>
      <TextInput
        value={leave.description}
        textAlignVertical="top"
        onChangeText={text => setLeave({...leave, description: text})}
        multiline
        style={{
          height: 130,
          borderRadius: 20,
          borderWidth: 1,
          borderColor: '#f5f5f5',
          padding: 10,
          paddingLeft: 15,
          paddingRight: 15,
          color: app_colors.text_color,
          fontSize: 20,
        }}
      />
      <Text
        style={{
          color: app_colors.text_color,
        }}>
        Assign to
      </Text>
      <Select
        value={
          selectedUser.index !== null
            ? users.data[selectedUser.index].name
            : 'Select user'
        }
        placeholder={'Select user'}
        onSelect={index => {
          setSelectedUser({
            index: index.row,
            id: users.data[index.row].id,
          });

          setLeave({...leave, user_id: users.data[index.row].id});
        }}>
        {users?.data &&
          users.data.map((item, index) => {
            return <SelectItem key={index} title={item.name} />;
          })}
      </Select>
      <Text
        style={{
          color: app_colors.text_color,
        }}>
        Start date
      </Text>
      <Datepicker
        date={selectedDate.start}
        onSelect={date => {
          setSelectedDate({...selectedDate, start: date});
          setLeave({...leave, start_date: date.toLocaleDateString()});
        }}
      />
      <Text
        style={{
          color: app_colors.text_color,
        }}>
        End date
      </Text>
      <Datepicker
        date={selectedDate.end}
        onSelect={date => {
          setSelectedDate({...selectedDate, end: date});
          setLeave({...leave, end_date: date.toLocaleDateString()});
        }}
      />

      <Button onPress={() => create()}>ADD</Button>
    </View>
  );
};

export default UserLeaves;

const styles = StyleSheet.create({
  vehicle: {
    padding: 10,
    gap: 10,
    borderRadius: 20,
  },
});
