// import * as React from 'react';
// import { View, Text, StyleSheet } from 'react-native';
// import { Appbar, Drawer } from 'react-native-paper';

// const Test = () => {
//   const [isDrawerVisible, setIsDrawerVisible] = React.useState(false);

//   const openDrawer = () => setIsDrawerVisible(true);
//   const closeDrawer = () => setIsDrawerVisible(false);

//   return (
//     <View style={styles.container}>
//       <Appbar.Header>
//         <Appbar.Action icon="menu" onPress={openDrawer} />
//         <Appbar.Content title="Drawer Example" />
//       </Appbar.Header>
//       <Drawer.Section>
//         <Drawer.Item label="Item 1" onPress={() => alert('Item 1 pressed')} />
//         <Drawer.Item label="Item 2" onPress={() => alert('Item 2 pressed')} />
//         <Drawer.Item label="Item 3" onPress={() => alert('Item 3 pressed')} />
//       </Drawer.Section>
//       <View style={styles.content}>
//         <Text>This is the main content of the screen.</Text>
//       </View>
//       <Drawer
//         visible={isDrawerVisible}
//         onDismiss={closeDrawer}
//         style={styles.drawer}
//       >
//         <Drawer.Item label="Close Drawer" onPress={closeDrawer} />
//       </Drawer>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   content: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   drawer: {
//     width: 250,
//   },
// });

// export default Test;
