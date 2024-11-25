import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import * as colors from '../assets/css/Colors';
const CustomButton = ({label, onPress, shadow, style}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.button, style]}>
      <Text
        style={{
          color: colors.theme_fg_three,
          fontFamily: 'bold',
          fontSize: 16,
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = new StyleSheet.create({
  button: {
    paddingVertical: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_bg,
  },
});

export default CustomButton;
