import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {bold, regular, img_url} from '../config/Constants';
import * as colors from '../assets/css/Colors';
import CardView from 'react-native-cardview';
const VendorListCard = ({image, storeName, address, onPress}) => {
  return (
    <View
      style={{
        width: 200,
        margin: 10,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors.borderClr1,
      }}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onPress}
        style={{
          alignItems: 'center',
          borderRadius: 10,
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}>
        <View style={{width: 200, height: 100}}>
          <Image
            source={{uri: img_url + image}}
            style={{
              width: undefined,
              height: undefined,
              flex: 1,
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            }}
          />
        </View>
        <View style={{paddingHorizontal: 12}}>
          <View style={{margin: 10}} />
          <Text
            style={{
              fontSize: 16,
              color: colors.theme_fg_two,
              fontFamily: bold,
              textAlign: 'left',
            }}>
            {storeName}
          </Text>
          <View style={{margin: 4}} />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{color: colors.grey, fontFamily: regular, fontSize: 12}}>
            {address}
          </Text>
        </View>
        <View style={{margin: 10}} />
      </TouchableOpacity>
    </View>
  );
};

export default VendorListCard;
