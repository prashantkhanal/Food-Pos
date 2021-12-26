import React from 'react';
import * as Yup from 'yup';
import {View, StyleSheet} from 'react-native';
import {Button, FormControl, Input} from 'native-base';
import {Formik} from 'formik';
import {useDispatch} from 'react-redux';
import {loginAction} from '../../redux/Action/auth.action';

const loginYupValidation = Yup.object().shape({
  username: Yup.string().required('Email is Required'),
  password: Yup.string().required('Password is Required'),
});

export default function Login() {
  const dispatch = useDispatch();

  return (
    <Formik
      initialValues={{
        username: '',
        password: '',
      }}
      onSubmit={val => {
        dispatch(loginAction(val));
      }}
      validateOnMount={true}
      validationSchema={loginYupValidation}>
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        touched,
        errors,
        isValid,
      }) => (
        <View>
          <View style={style.fromContainer}>
            <FormControl.Label>Email</FormControl.Label>
            <Input
              onChangeText={handleChange('username')}
              onBlur={handleBlur('username')}
              value={values.username}
              placeholder="Email"
              variant="rounded"
            />
          </View>

          <View style={style.fromContainer}>
            <FormControl.Label>Password</FormControl.Label>
            <Input
              onChangeText={handleChange('password')}
              onBlur={handleBlur('password')}
              value={values.password}
              placeholder="Password"
              variant="rounded"
            />
          </View>
          <Button onPress={handleSubmit}>Login</Button>
        </View>
      )}
    </Formik>
  );
}

const style = StyleSheet.create({
  fromContainer: {
    marginTop: 13,
  },
});
