import React from 'react';
import {Login} from '../../screens';

export default function AuthStack(Stack) {
  return <Stack.Screen name="Login" component={Login} />;
}
