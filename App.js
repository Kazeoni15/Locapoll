
import React from 'react';
import './firebase-config';

import { useFonts } from 'expo-font'
import RootNavigation from './navigation/RootNavigation';

export default function App() {
  const [loaded] = useFonts()

  

  return (
    <RootNavigation/>
  )

}
