import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {bold, img_url} from '../config/Constants';
import * as colors from '../assets/css/Colors';
const DoctorListCard = ({
  image,
  name,
  specialist,
  qualification,
  experience,
  onPress,
}) => {
  return (
    <View style={{margin: 8, width: 165}}>
      <TouchableOpacity activeOpacity={1} onPress={onPress}>
        <View
          style={{
            width: '100%',
            alignItems: 'flex-start',
            backgroundColor: colors.theme_fg_three,
            borderRadius: 10,
            borderColor: colors.borderClr1,
            borderWidth: 1,
            paddingVertical: 12,
            paddingHorizontal: 14,
          }}>
          <View style={{width: '100%'}}>
            <View
              style={{
                width: '100%',
                justifyContent: 'center',
                marginLeft: 'auto',
                marginRight: 'auto',
                alignSelf: 'center',
              }}>
              <Image
                style={{
                  height: 100,
                  width: 100,
                  borderRadius: 100,
                  justifyContent: 'center',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                }}
                source={{uri: img_url + image}}
              />
            </View>
          </View>
          <View style={{margin: 5}} />
          <View style={{justifyContent: 'flex-start'}}>
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={{
                fontSize: 16,
                color: colors.black,
                fontFamily: bold,
                textAlign: 'left',
                marginBottom: 2,
              }}>
              Dr. {name}
            </Text>

            <Text
              style={{
                fontSize: 13,
                color: colors.clrGrey,
                fontFamily: bold,
                textAlign: 'left',
              }}>
              {specialist}
            </Text>
            <View style={{margin: 5}} />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: colors.lightTeal1,
                  fontFamily: bold,
                  letterSpacing: 0.5,
                  backgroundColor: colors.lightTealSurface1,
                  borderRadius: 4,
                  padding: 4,
                  textAlign: 'center',
                }}>
                {qualification}
              </Text>
              <Text>{experience}</Text>
            </View>
          </View>
        </View>
        <View style={{margin: 5}} />
      </TouchableOpacity>
    </View>
  );
};

export default DoctorListCard;
