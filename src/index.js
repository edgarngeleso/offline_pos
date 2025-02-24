import {StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  Auth,
  Categories,
  HRM,
  MeasurementUnits,
  Notes,
  Notifications,
  Products,
  Profile,
  Sales,
  Settings,
  Suppliers,
  Tracking,
  Users,
  Vehicles,
} from './screens';
import {AuthContext} from './contexts';

// The following import is a bad pactice but I had to since it's rendering screens
import {AppNavigator} from './navigation';

const Stack = createNativeStackNavigator();

const AppScreens = () => {
  const [auth, setAuth] = useContext(AuthContext);

  return (
    <Stack.Navigator>
      {!auth.logged_in ? (
        <>
          <Stack.Screen
            name="login"
            component={Auth.Login}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="register"
            component={Auth.Register}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="forgot-password"
            component={Auth.ForgotPassword}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="reset-password"
            component={Auth.ResetPassword}
            options={{
              headerShown: false,
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="home"
            component={AppNavigator}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="vehicles"
            component={Vehicles.All}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="leave"
            component={HRM.UserLeaves}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="tasks"
            component={HRM.Tasks}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="vehicle"
            component={Vehicles.Vehicle}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="edit-vehicle"
            component={Vehicles.EditVehicle}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="devices"
            component={Tracking.Devices}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="create-measurement-unit"
            component={MeasurementUnits.Create}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="edit-measurement-unit"
            component={MeasurementUnits.Edit}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="create-user"
            component={Users.Create}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="edit-user"
            component={Users.Edit}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="create-supplier"
            component={Suppliers.Create}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="edit-supplier"
            component={Suppliers.Edit}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="create-product"
            component={Products.Create}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="edit-product"
            component={Products.Edit}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="view-sale"
            component={Sales.ViewItem}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="track"
            component={Tracking.Track}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="view-directions"
            component={Tracking.ViewDirections}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="vehicles-on-map"
            component={Tracking.VehiclesOnMap}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="profile"
            component={Profile}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="notifications"
            component={Notifications}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="settings"
            component={Settings}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppScreens;

const styles = StyleSheet.create({});
