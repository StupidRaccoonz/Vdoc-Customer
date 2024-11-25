import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  SafeAreaView,
  Text,
  ScrollView,
  View,
  TouchableOpacity,
  Image,
  Linking,
  Alert,
  Dimensions,
} from 'react-native';
import * as colors from '../assets/css/Colors';
import {
  bold,
  regular,
  correct,
  certified,
  api_url,
  customer_lab_package_details,
  consultation_time_slots,
  img_url,
  month_name,
  check_consultation,
  create_consultation,
} from '../config/Constants';
import {useNavigation, useRoute} from '@react-navigation/native';
import axios from 'axios';
import {connect} from 'react-redux';
import {
  updateLabPromo,
  updateLabAddToCart,
  updateLabSubTotal,
  updateLabCalculateTotal,
  updateLabTotal,
  updateLabId,
  updateCurrentLabId,
  labReset,
} from '../actions/LabOrderActions';
import Loader from '../components/Loader';
import RBSheet from 'react-native-raw-bottom-sheet';
import CustomButton from '../components/CustomButton';

const DoctorProfile = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const [doctor, setDoctor] = useState(route.params.doctor_details);
  const [slots, setSlots] = useState([]);
  const [time, setTime] = useState(null);
  const refRBSheet = useRef(null);
  const [consultation_fee, setConsultationFee] = useState(0);
  const [doctor_id, setDoctorId] = useState(0);
  const [dates, setDateList] = useState([]);
  const [date, setDate] = useState();
  const [loading, setLoading] = useState(false);
  // const [loaded, setLoaded]= useState(false);

  useEffect(() => {
    get_dates();
  }, []);

  const get_dates = async () => {
    let dates = [];
    for (let i = 0; i < 7; i++) {
      if (i == 0) {
        let today = new Date();
        dates[i] =
          today.getFullYear() +
          '-' +
          (today.getMonth() + 1) +
          '-' +
          today.getDate();
      } else {
        let today = new Date();
        let new_date = new Date(
          today.getFullYear(),
          today.getMonth(),
          today.getDate() + i,
        );
        dates[i] =
          new_date.getFullYear() +
          '-' +
          (new_date.getMonth() + 1) +
          '-' +
          new_date.getDate();
      }
    }
    setDateList(dates);
    setDate(dates[0]);
  };

  const get_time = async () => {
    await axios({
      method: 'post',
      url: api_url + consultation_time_slots,
      data: {date: date, doctor_id: doctor.id},
    })
      .then(async response => {
        setSlots(response.data.result);
        setTime(response.data.result[0].value);
        show_slots();
        refRBSheet.current.open();
      })
      .catch(error => {});
  };
  const change_date = async date => {
    setDate(date);
    get_time(date);
  };
  const change_time = time => {
    setTime(time);
  };

  const show_dates = () => {
    return dates.map((data, i) => {
      let temp = data.split('-');
      let cur_date = temp[2];
      let month = month_name[temp[1] - 1];
      return (
        <TouchableOpacity
          key={i}
          onPress={change_date.bind(this, data)}
          style={[
            data == date ? styles.active_badge : styles.in_active_badge,
            styles.dateItem,
          ]}>
          <Text
            style={[
              data == date ? styles.active_text : styles.in_active_text,
              styles.dateText,
            ]}>
            {cur_date}
          </Text>
          <View style={{margin: 1}} />
          <Text
            style={
              data == date
                ? styles.active_month_text
                : styles.inactive_month_text
            }>
            {month}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  const show_slots = () => {
    return slots.map((data, i) => {
      return (
        <TouchableOpacity
          key={i}
          onPress={change_time.bind(this, data['value'])}
          style={[
            data['value'] == time
              ? styles.active_time_badge
              : styles.in_active_time_badge,
            styles.timeSlotItemWrapper,
          ]}>
          <Text
            style={[
              data['value'] == time
                ? styles.active_time_text
                : styles.in_active_time_text,
              styles.timeSlotItemText,
            ]}>
            {data['key']}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  const get_slots = async (id, consultation_fee) => {
    setConsultationFee(consultation_fee);
    setDoctorId(id);
    get_time();
  };

  const set_consultation_data = async () => {
    let data = {
      patient_id: global.id,
      doctor_id: doctor.id,
      total: consultation_fee,
      consultation_type: 2,
      date: date,
      time: time,
    };
    console.log(data);
    payment_methods(data);
  };

  const payment_methods = data => {
    if (global.id == 0) {
      navigation.navigate('CheckPhone');
    } else {
      confirm_consultation(data);
    }
  };

  const confirm_consultation = async data => {
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + check_consultation,
      data: {patient_id: global.id, doctor_id: doctor.id},
    })
      .then(async response => {
        setLoading(false);
        if (response.data.result == 0) {
          navigation.navigate('PaymentMethods', {
            type: 2,
            amount: data.total,
            data: data,
            route: create_consultation,
            from: 'doctor_list',
          });
        } else {
          move_to_call(response.data.result, data);
        }
      })
      .catch(error => {
        setLoading(false);
        alert('Sorry something went wrong');
      });
  };

  const move_to_call = async (consultation_request_id, data) => {
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + continue_consultation,
      data: {
        patient_id: global.id,
        doctor_id: data.doctor_id,
        consultation_request_id: consultation_request_id,
      },
    })
      .then(async response => {
        setLoading(false);
        navigation.navigate('VideoCall', {
          id: response.data.result.id,
          doctor_id: response.data.result.doctor_id,
        });
      })
      .catch(error => {
        setLoading(false);
        alert('Sorry something went wrong');
      });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={{padding: 16}}>
        <View
          style={{
            padding: 10,
            width: '100%',
            flexDirection: 'row',
            backgroundColor: colors.theme_bg_three,
          }}>
          <View style={{width: '50%', paddingTop: 10}}>
            <View style={styles.image_style}>
              <Image
                style={{
                  height: undefined,
                  width: undefined,
                  flex: 1,
                  borderRadius: 10,
                }}
                source={{uri: img_url + doctor.profile_image}}
              />
            </View>
            <View style={{margin: 5}} />
            {/* <Text
              style={{
                fontSize: 16,
                fontFamily: bold,
                color: colors.theme_fg_two,
                textAlign: 'center',
              }}>
              Dr.{doctor.doctor_name}
            </Text>
            <Text
              style={{
                fontSize: 12,
                fontFamily: regular,
                color: colors.grey,
                textAlign: 'center',
              }}>
              {doctor.experience} Years Experiences
            </Text> */}
          </View>
          <View style={{width: '50%', paddingTop: 10}}>
            <Text
              style={{
                fontFamily: bold,
                fontSize: 18,
                fontWeight: 'bold',
                color: colors.black,
              }}>
              Dr. {doctor.doctor_name}
            </Text>
            <Text
              style={{
                fontFamily: regular,
                fontSize: 12,
                color: colors.clrGrey,
                marginTop: 4,
              }}>
              {doctor.specialist}
            </Text>
            <View style={{margin: 5}} />
            <View
              style={{
                backgroundColor: colors.primarySurface,
                paddingHorizontal: 6,
                paddingVertical: 3,
                width: 'auto',
                alignSelf: 'flex-start',
              }}>
              <Text
                style={{
                  color: colors.theme_bg,
                  fontWeight: '500',
                  fontSize: 13,
                  alignSelf: 'flex-start',
                }}>
                {`${doctor.consultation_fee} INR per Consultation`}
              </Text>
            </View>
            {/* <Text style={{fontFamily: bold, fontSize: 15, color: colors.grey}}>
              Sub Specialist
            </Text> */}
            {/* <Text
              style={{
                fontFamily: regular,
                fontSize: 12,
                color: colors.theme_fg_two,
              }}>
              {doctor.sub_specialist}
            </Text>
            <View style={{margin: 5}} /> */}
            {/* <Text style={{fontFamily: bold, fontSize: 15, color: colors.grey}}>
              Gender
            </Text> */}
            {/* {doctor.gender == 1 ? (
              <Text
                style={{
                  fontFamily: regular,
                  fontSize: 12,
                  color: colors.theme_fg_two,
                }}>
                Male
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: regular,
                  fontSize: 12,
                  color: colors.theme_fg_two,
                }}>
                Female
              </Text>
            )} */}
            <View style={{margin: 5}} />
            <Text
              style={{
                fontFamily: regular,
                fontSize: 12,
                color: colors.theme_fg_two,
                backgroundColor: colors.borderClr1,
                alignSelf: 'flex-start',
                paddingHorizontal: 6,
                paddingVertical: 4,
                borderRadius: 4,
              }}>
              {doctor.qualification}
            </Text>
            <Text style={{marginTop: 6}}>{doctor.experience}</Text>
          </View>
        </View>

        {/* <View style={{margin: 5}} />
        <View style={{padding: 10, backgroundColor: colors.theme_bg_three}}>
          <View style={{margin: 5}} />
          <View
            style={{
              width: '100%',
              textAlign: 'center',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                fontSize: 15,
                color: colors.theme_fg_two,
                fontFamily: bold,
              }}>
              About
            </Text>
            <View style={{margin: 2}} />
            <Text
              style={{fontSize: 12, color: colors.grey, fontFamily: regular}}>
              {doctor.description}
            </Text>
          </View>
          <View style={{margin: 5}} />
        </View>
        <View style={{margin: 5}} /> */}
        {/*<View style={{ padding:10, backgroundColor:colors.theme_bg_three }}>
        <View style={{ margin:5 }}/>
        <Text style={{ fontSize:15, color:colors.theme_fg_two, fontFamily:bold}}>Services At</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>Mercy Hospital st. Louis</Text>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>Delhi, India</Text>
        <View style={{ margin:5 }}/>
      </View>
      <View style={{ margin:5 }} />
      <View style={{ padding:10, backgroundColor:colors.theme_bg_three }}>
        <View style={{ margin:5 }}/>
        <Text style={{ fontSize:15, color:colors.theme_fg_two, fontFamily:bold}}>Services</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>Diabetes Test</Text>
        <View style={{ margin:5 }}/>
      </View>
      <View style={{ margin:5 }} />
      <View style={{ padding:10, backgroundColor:colors.theme_bg_three }}>
        <View style={{ margin:5 }}/>
        <Text style={{ fontSize:15, color:colors.theme_fg_two, fontFamily:bold}}>Specialisation</Text>
        <View style={{ margin:2 }}/>
        <Text style={{ fontSize:12, color:colors.grey, fontFamily:regular}}>General Physician Test</Text>
        <View style={{ margin:5 }}/>
        </View>*/}
        <View style={{margin: 20}} />
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            width: '100%',

            alignItems: 'center',
          }}>
          <CustomButton label="Consult Now" style={{width: 300}} />
          <Text
            style={{
              marginVertical: 24,
              color: colors.black,
              fontWeight: 'bold',
            }}>
            OR
          </Text>
        </View>

        <View style={{padding: 10}}>
          {/* <Text
            style={{
              fontFamily: bold,
              fontSize: 14,
              color: colors.theme_fg_two,
            }}>
            Select your date
          </Text> */}
          <View style={{flexDirection: 'row', marginTop: 10}}>
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}>
              {show_dates()}
            </ScrollView>
          </View>

          <View style={styles.horizontalLine}></View>

          {/* <Text
            style={{
              fontFamily: bold,
              fontSize: 14,
              color: colors.theme_fg_two,
            }}>
            Select your Time
          </Text> */}
          <View style={{flexDirection: 'row'}}>
            <ScrollView
              horizontal={false}
              alwaysBounceVertical
              nestedScrollEnabled={true}
              showsHorizontalScrollIndicator={false}>
              <View style={styles.slotScrollviewStyle}>{show_slots()}</View>
            </ScrollView>
          </View>
        </View>
        {/* <CustomButton
          label="Done"
          style={styles.rb_button}
          onPress={set_consultation_data.bind(this)}></CustomButton> */}
      </ScrollView>
      <View class={styles.consultLaterBtnWrapper}>
        <CustomButton
          label="Consult Later"
          style={{width: 300, alignSelf: 'center', margin: 24}}
          onPress={set_consultation_data.bind(this)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: colors.white,
  },
  searchBarContainer: {
    borderColor: colors.light_grey,
    borderRadius: 10,
    borderWidth: 2,
    height: 45,
  },
  textFieldcontainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    height: 45,
  },
  textFieldIcon: {
    paddingLeft: 10,
    paddingRight: 5,
    fontSize: 20,
    color: colors.theme_fg,
  },
  textField: {
    flex: 1,
    padding: 5,
    borderRadius: 10,
    height: 45,
    fontFamily: regular,
  },
  border_style: {
    borderBottomWidth: 1,
    borderColor: colors.light_blue,
  },
  border_style1: {
    borderBottomWidth: 10,
    borderColor: colors.light_blue,
  },
  image_style: {
    height: 150,
    width: 150,
  },
  button: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.theme_bg,
    width: '49%',
    borderWidth: 1,
  },
  button1: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.theme_fg,
    width: '49%',
    borderWidth: 1,
  },
  button3: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.theme_fg_two,
    width: '100%',
    borderWidth: 1,
  },
  button4: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.theme_fg,
    backgroundColor: colors.theme_fg,
    width: '30%',
    borderWidth: 1,
  },
  home_style1: {
    paddingTop: 10,
    flexDirection: 'row',
  },
  home_style2: {
    borderRadius: 10,
  },
  home_style3: {
    height: 70,
    width: 130,
    borderRadius: 10,
    marginRight: 10,
  },
  image_style1: {
    height: 50,
    width: 50,
  },
  box: {
    borderColor: colors.light_grey,
    borderWidth: 2,
    width: '100%',
    borderRadius: 20,
    backgroundColor: colors.theme_fg_three,
  },
  box_image: {
    alignSelf: 'center',
    height: 300,
    width: '100%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  rb_button: {
    width: 140,
    alignSelf: 'center',
    margin: 24,
  },
  in_active_badge: {
    borderWidth: 1,
    borderColor: colors.light_grey,
    backgroundColor: colors.theme_fg_three,
    padding: 5,
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  in_active_time_badge: {
    borderWidth: 1.2,
    borderColor: colors.primaryBorderClr1,
    backgroundColor: colors.theme_fg_three,
    padding: 5,
    width: 100,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  active_badge: {
    borderWidth: 1,
    borderColor: colors.theme_bg,
    backgroundColor: colors.theme_bg,
    padding: 5,
    width: 60,
    height: 60,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  active_time_badge: {
    borderWidth: 1,
    borderColor: colors.theme_bg,
    backgroundColor: colors.theme_bg,
    padding: 5,
    width: 100,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  in_active_text: {
    fontSize: 12,
    color: colors.theme_fg_two,
    fontFamily: bold,
  },
  in_active_time_text: {
    fontSize: 12,
    color: colors.theme_fg_two,
    fontFamily: bold,
  },
  active_text: {
    fontSize: 12,
    color: colors.theme_fg_three,
    fontFamily: bold,
  },
  active_time_text: {
    fontSize: 12,
    color: colors.theme_fg_three,
    fontFamily: bold,
  },
  dateItem: {
    height: 75,
    borderRadius: 17,
  },
  dateText: {
    fontSize: 22,
    fontWeight: '800',
  },
  active_month_text: {
    color: colors.white,
    fontSize: 12,
  },
  inactive_month_text: {
    color: colors.clrGrey,
    fontSize: 12,
  },
  horizontalLine: {
    height: 1,
    backgroundColor: colors.primarySurface,
    marginVertical: 24,
  },
  slotScrollviewStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    justifyContent: 'space-between',
    paddingBottom: 120,
  },
  timeSlotItemWrapper: {marginBottom: 16, borderRadius: 18},
  timeSlotItemText: {fontSize: 14},
  consultLaterBtnWrapper: {
    position: 'absolute',
    bottom: 0,
  },
});

function mapStateToProps(state) {
  return {
    promo: state.lab_order.promo,
    sub_total: state.lab_order.sub_total,
    cart_items: state.lab_order.cart_items,
    total: state.lab_order.total,
    current_lab_id: state.lab_order.current_lab_id,
    lab_id: state.lab_order.lab_id,
  };
}

const mapDispatchToProps = dispatch => ({
  updateLabPromo: data => dispatch(updateLabPromo(data)),
  updateLabAddToCart: data => dispatch(updateLabAddToCart(data)),
  updateLabSubTotal: data => dispatch(updateLabSubTotal(data)),
  updateLabCalculateTotal: data => dispatch(updateLabCalculateTotal(data)),
  updateLabTotal: data => dispatch(updateLabTotal(data)),
  updateLabId: data => dispatch(updateLabId(data)),
  updateCurrentLabId: data => dispatch(updateCurrentLabId(data)),
  labReset: () => dispatch(labReset()),
});

export default connect(mapStateToProps, mapDispatchToProps)(DoctorProfile);
