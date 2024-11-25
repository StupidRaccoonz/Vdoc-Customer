import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {chevronLeft} from '../assets/images';
const CustomHeader = ({title, navigation, trailing}) => {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.headerBackImgContainer}
        onPress={() => navigation.goBack()}>
        <Image style={styles.headerBackImg} source={chevronLeft} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {trailing && <View style={styles.trainingWrapper}>{trailing}</View>}
    </View>
  );
};
const styles = new StyleSheet.create({
  header: {
    height: 60,
    width: '100%',
    backgroundColor: '#fff',
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    textAlign: 'center',
    color: '#000',
    fontWeight: 'bold',
  },
  headerBackImgContainer: {
    position: 'absolute',
    left: 18,
  },
  headerBackImg: {
    tintColor: '#000',
    resizeMode: 'contain',
  },
  trainingWrapper: {
    position: 'absolute',
    right: 18,
  },
});

export default CustomHeader;
