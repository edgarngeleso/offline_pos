import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Pie = () => {
  return (
    <View
      style={{
        width: 300,
        height: 300,
        backgroundColor: 'red',
        borderRadius: 150,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {/* <View
        style={{
            width:150,
            height:100,
            backgroundColor:"green",
            position:"absolute",
            left:0,
            borderTopLeftRadius:50,
            borderBottomLeftRadius:50,
            transformOrigin:"right",
            transform:[
                {
                    rotate:"90deg"
                }
            ]
        }}
        ></View> */}

      <View
        style={{
          width: 150,
          height: 100,
          backgroundColor: 'green',
          position: 'absolute',
          left: 0,
          borderTopLeftRadius: 25,
          borderBottomLeftRadius: 25,
          transformOrigin: 'right',
          transform: [
            {
              rotate: '70deg',
            },
          ],
        }}>
        <View
          style={{
            position: 'absolute',
            height: 90,
            backgroundColor: 'transparent',
            borderBottomWidth:1,
            left: 0,
            width: '100%',
            transformOrigin: 'left',
            transform: [
              {
                rotate: '20deg',
              },
              {
                translateY: -90,
              },
            ],
          }}
        />

        <View
          style={{
            position: 'absolute',
            height: 90,
            backgroundColor: 'transparent',
            borderTopWidth:1,
            bottom: 0,
            width: '100%',
            transformOrigin: 'left',
            transform: [
              {
                rotate: '-20deg',
              },
              {
                translateY: 90,
              },
            ],
          }}
        />
      </View>
    </View>
  );
};

export default Pie;

const styles = StyleSheet.create({});
