import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import * as eva from '@eva-design/eva';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import AppScreens from './src';

const App = () => {
  return (
    <>
      
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <NavigationContainer
          linking={{
            prefixes: 'pos://',
            config: {
              screens: {
                HOME: {},
              },
            },
          }}>
            <AppScreens/>
          </NavigationContainer>
          
      </ApplicationProvider>
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
