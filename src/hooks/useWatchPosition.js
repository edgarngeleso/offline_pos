import Geolocation from '@react-native-community/geolocation';
import React, { useEffect, useState } from 'react'

const useWatchPosition = () => {
    const [userLocation, setUserLocation] = useState({
        coords: {lat: 0, lng: 0},
        data: null,
      });
      const [isOpen,setIsOpen] = useState(false);
    
      Geolocation.setRNConfiguration({
        skipPermissionRequests: true,
        authorizationLevel: 'auto',
        enableBackgroundLocationUpdates: true,
        locationProvider: 'auto',
      });
    
      const getUserLocation = () => {
        Geolocation.watchPosition(
          position => {
            setUserLocation({
                coords: {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                },
                isGoogle:false,
                data: res,
              });
            
          },
          e => {
            console.log(e);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
          },
        );
      };

      useEffect(()=>{
        
        getUserLocation();
      },[]);

      return {coordinates:userLocation.coords,data:userLocation.data,getUserLocation};
}

export default useWatchPosition;