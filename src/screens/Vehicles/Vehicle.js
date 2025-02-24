import { ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useContext, useState } from 'react'

import { AuthContext, SettingsContext } from '../../contexts';
import { colors } from '../../utils';
import { Button, Icon, Layout } from '@ui-kitten/components';
import { Header } from '../../components';

const Vehicle = ({navigation,route}) => {
  const {id} = route.params;
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
  return (
    <Layout
        style={{
            flex:1,
            backgroundColor:app_colors.app_color
        }}
    >
      <Header navigation={navigation}/>
      <Text style={{
        color:app_colors.text_color
      }}>Vehicle</Text>

      <Button
        accessoryLeft={(props)=><Icon {...props} name={"edit"} fill={"red"}/>}
      >
          {
            (props)=><Text style={{color:app_colors.text_color}}>Edit details</Text>
          }
        </Button>

      <ScrollView>
      <Text style={{color:app_colors.text_color}}>Vehicle {id}</Text>
      <Text style={{color:app_colors.text_color}}>Vehicle {id} REG</Text>
      <Text style={{color:app_colors.text_color}}>Vehicle {id}</Text>
        <Button
          onPress={()=>navigation.navigate("track",{id})}
        >
          {
            (props)=><Text style={{color:app_colors.text_color}}>Track movements</Text>
          }
        </Button>
      </ScrollView>
    </Layout>
  )
}

export default Vehicle;

const styles = StyleSheet.create({})