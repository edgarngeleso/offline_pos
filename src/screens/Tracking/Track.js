import { StyleSheet, Text, useColorScheme, View } from 'react-native'
import React, { useContext, useState } from 'react'
import { colors, Constants } from '../../utils';
import { useGetLocation } from '../../hooks';

import { SettingsContext } from '../../contexts';
import { Layout } from '@ui-kitten/components';

const Track = () => {

 const userLocation = useGetLocation();

 
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
        <MapView
          initialRegion={{
            latitude: userLocation.coordinates.lat ?? 1.2921,
            longitude: userLocation.coordinates.lng ?? 36.8219,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          style={{
            flex: 1,
          }}
          provider={PROVIDER_GOOGLE}>
          <Marker
            coordinate={{
              latitude: userLocation.coordinates.lat ?? 1.2921,
              longitude: userLocation.coordinates.lng ?? 36.8219,
            }}

            title='My location'
            
          />
          <MapViewDirections
            apikey={Constants.GOOGLE_MAPS_API_KEY}
            origin={{
              latitude: userLocation.coordinates.lat ?? 1.2921,
              longitude: userLocation.coordinates.lng ?? 36.8219,
            }}
            destination={{
              latitude: parseFloat(order?.driver_latitude) ?? 1.2921,
              longitude: parseFloat(order?.driver_longitude) ?? 36.8219,
            }}

            strokeColor={apptheme.buttonColor}
            strokeWidth={4}
          />
        </MapView>

    </Layout>
  )
}

export default Track;

const styles = StyleSheet.create({})