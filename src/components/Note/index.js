import {StyleSheet, Text, TouchableOpacity, useColorScheme, View} from 'react-native';
import React, {useContext, useState} from 'react';
import Animated, {FadeInDown, FadeInUp} from 'react-native-reanimated';
import { SettingsContext } from '../../contexts';
import { colors } from '../../utils';

const _entering = FadeInDown.springify().damping(100);

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const Note = ({
  id,
  category_name,
  color,
  note,
  children,
  navigation,
  modalOpen,
  setModalOpen,
  selectedItems,
  setSelectedItems,
  navigate_to=null,
}) => {
  const [isActive, setIsActive] = useState(false);

  const [app_settings,_] = useContext(SettingsContext);
  const isDark = useColorScheme()=="dark";

  let app_colors = colors.light;
  if(app_settings.dark_theme){
    app_colors = colors.dark;
  }

  if(app_settings.system_theme && !app_settings.dark_theme){
    app_colors = isDark?colors.dark:colors.light;
  }

  return (
    <AnimatedTouchableOpacity
      entering={_entering}
      style={{
        ...styles.container,
        backgroundColor: selectedItems.find(item=>item.id==id) ? 'green' : app_colors.box_color,
      }}
      onPress={() => {
        if(selectedItems.length>0 && !isActive){
          setIsActive(true);
          setSelectedItems([...selectedItems,{id,note}]);
        }
        else if (isActive) {
          setIsActive(false);
          let items = selectedItems.filter(item=>item.id!=id);
          setSelectedItems(items);
        } else {
          navigation.navigate(navigate_to??"home", {id,note});
        }

        if (setModalOpen) {
          setModalOpen(false);
        }
      }}
      
      onLongPress={() => {
        setIsActive(true);
        setSelectedItems([...selectedItems,{id,note}]);
      }}>
      <Text style={{...styles.note, 
        color: selectedItems.find(item=>item.id==id) ? '#ffffff' : app_colors.text_color}}>
        {note.length>90?`${note.substring(0,90)}...`:note}
      </Text>
      {children}
      <View
        style={{
          ...styles.category_holder,
          backgroundColor: color,
        }}>
        <Text style={{...styles.category, color: '#ffffff'}}>
          {category_name}
        </Text>
      </View>
      
    </AnimatedTouchableOpacity>
  );
};

export default Note;

const styles = StyleSheet.create({
  container: {
    width: '98%',
    height: 100,
    margin: '1%',
    borderRadius: 15,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#f5f5f5',
    padding:8
  },
  note: {
    width: '100%',
    fontSize: 20,
    color: '#0e100e',
  },
  category_holder: {
    width: 'auto',
    display: 'flex',
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  category: {
    fontSize: 14,
  },
});
