import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useContext, useState } from 'react'

import { AuthContext, SettingsContext } from '../../contexts';
import { colors } from '../../utils';
import { Layout } from '@ui-kitten/components';
import { Header } from '../../components';

const ViewDirections = ({navigation}) => {
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
      }}>ViewDirections</Text>
    </Layout>
  )
}

export default ViewDirections;

const styles = StyleSheet.create({})