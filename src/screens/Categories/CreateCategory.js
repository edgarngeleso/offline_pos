import { StyleSheet, Text, TextInput, View,NativeModules } from 'react-native'
import React, { useState } from 'react'
import { Button, Input } from '@ui-kitten/components';
import { Header } from '../../components';

const {SQLiteModule} = NativeModules;

const CreateCategory = () => {
  const [note,setNote] = useState({
    error:false,
    loading:false,
    message:"",
  });
  const create = () => {
    setNote({
      error:false,
      loading:true,
      message:"",
    });
    SQLiteModule.insertData('categories', `name,color,created_at`, `?,?,?`, [
      'Work',
      'red',
    ])
      .then(response => {
        console.log(response);
        setNote({
          error:false,
          loading:false,
          message:"",
        });
      })
      .catch(e => {
        console.log(e);
        setNote({
          error:false,
          loading:false,
          message:"",
        });
      });
  };

  return (
    <View>
      <Header/>
      <Text>Create Category</Text>

      <View style={{
        flexDirection:"column",
        gap:10,
      }}>
        <Input/>
        <Button>Save</Button>
      </View>
      
    </View>
  )
}

export default CreateCategory;

const styles = StyleSheet.create({})