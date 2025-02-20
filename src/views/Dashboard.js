import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Image,
  View,
  SafeAreaView,
  Dimensions,
  Text,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Linking,
} from 'react-native';
import * as colors from '../assets/css/Colors';
import {
  img_url,
  regular,
  bold,
  home,
  api_url,
  white_logo,
  screenWidth,
} from '../config/Constants';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  updateCurrentAddress,
  updateCurrentLat,
  updateCurrentLng,
  currentTag,
  updateAddress,
} from '../actions/CurrentAddressActions';
import axios from 'axios';
import {connect} from 'react-redux';
import CardView from 'react-native-cardview';
import Loader from '../components/Loader';
import Icon, {Icons} from '../components/Icons';
import DoctorListCard from '../components/DoctorListCard';
import {calculateReadingTime} from '../helpers/helper';
import VendorListCard from '../components/VendorListCard';
import {format, compareAsc} from 'date-fns';

const Dashboard = props => {
  const navigation = useNavigation();
  const route = useRoute();
  const [banners, setBanners] = useState([]);
  const [services, setServices] = useState([]);
  const [symptoms_first, setSymptomsFirst] = useState([]);
  const [symptoms_second, setSymptomsSecond] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [labs, setLabs] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [is_error, setError] = useState(0);
  const [loading, setLoading] = useState(false);
  const [recommended_doctors, setRecomendedDoctors] = useState([]);
  const [top_rated_doctors, setTopRatedDoctors] = useState([]);
  const [blogs, setBlogs] = useState([]);

  const doctor_categories = () => {
    navigation.navigate('DoctorCategories');
  };

  useEffect(() => {
    get_home_details();
  }, []);

  const get_home_details = async () => {
    setLoading(true);
    await axios({
      method: 'post',
      url: api_url + home,
      data: {lat: props.current_lat, lng: props.current_lng},
    })
      .then(async response => {
        console.log(response.data.result.recommended_doctors.length);
        setLoading(false);
        if (response.data.status == 1) {
          setBanners(response.data.result.banners);
          setServices(response.data.result.services);
          setSymptomsFirst(response.data.result.symptoms_first);
          setSymptomsSecond(response.data.result.symptoms_second);
          setVendors(response.data.result.vendors);
          setLabs(response.data.result.labs);
          setHospitals(response.data.result.hospitals);
          setRecomendedDoctors(response.data.result.recommended_doctors);
          setTopRatedDoctors(response.data.result.top_rated_doctors);
          setBlogs(response.data.result.blogs);
        } else {
          setError(1);
        }
      })
      .catch(error => {
        setLoading(false);
        alert(error);
      });
  };

  const navigate = (route, param) => {
    navigation.navigate(route, {type: param});
  };

  const navigate_symptoms = (specialist, type) => {
    navigation.navigate('DoctorList', {specialist: specialist, type: type});
  };

  const navigate_vendors = (pharm_id, vendor_name) => {
    navigation.navigate('PharmCategories', {
      pharm_id: pharm_id,
      vendor_name: vendor_name,
    });
  };

  const banners_list = () => {
    return banners.map(data => {
      return (
        <TouchableOpacity
          key={data.id}
          onPress={open_linking.bind(this, data.link)}
          activeOpacity={1}>
          <ImageBackground
            source={{uri: img_url + data.url}}
            imageStyle={styles.home_style2}
            style={styles.home_style3}
          />
        </TouchableOpacity>
      );
    });
  };

  const open_linking = url => {
    if (url) {
      Linking.openURL(url);
    }
  };

  const services_list = () => {
    return services.map(data => {
      return (
        <TouchableOpacity
          key={data.id}
          activeOpacity={1}
          style={{paddingVertical: 10}}
          onPress={navigate.bind(this, data.action, data.id)}>
          <CardView
            cardElevation={4}
            cardMaxElevation={0}
            style={{width: screenWidth * 0.85}}
            cornerRadius={10}>
            <ImageBackground
              source={{uri: img_url + data.service_image}}
              style={styles.ban_style3}
            />
          </CardView>
        </TouchableOpacity>
      );
    });
  };

  const symptoms_first_list = () => {
    return symptoms_first.map(data => {
      return (
        <TouchableOpacity
          key={data.id}
          onPress={navigate_symptoms.bind(this, data.specialist_id, 1)}
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              height: 70,
              width: 70,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: colors.borderClr1,
              justifyContent: 'center',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Image
              style={{
                height: 40,
                width: 40,
                flex: 1,
                borderRadius: 10,
                objectFit: 'contain',
                alignItems: 'center',
              }}
              source={{uri: img_url + data.symptom_image}}
            />
          </View>
          <View style={{margin: 5}} />
          <Text
            style={{
              fontSize: 12,
              margin: 8,
              color: colors.theme_fg_two,
              fontFamily: bold,

              textAlign: 'center',
              alignSelf: 'center',
            }}>
            {data.symptom_name}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  const symptoms_second_list = () => {
    return symptoms_second.map(data => {
      return (
        <TouchableOpacity
          key={data.id}
          onPress={navigate_symptoms.bind(this, data.specialist_id, 1)}
          style={{
            alignItems: 'center',
            width: Dimensions.get('window').width / 4 - 17,
          }}>
          <View style={{height: 70, width: 70, borderRadius: 10}}>
            <Image
              style={{
                height: undefined,
                width: undefined,
                flex: 1,
                borderRadius: 10,
              }}
              source={{uri: img_url + data.symptom_image}}
            />
          </View>
          <View style={{margin: 5}} />
          <Text
            style={{
              fontSize: 10,
              color: colors.theme_fg_two,
              fontFamily: bold,
              marginTop: 5,
            }}>
            {data.symptom_name}
          </Text>
        </TouchableOpacity>
      );
    });
  };

  const show_vendors = () => {
    return vendors.map(data => {
      return (
        <VendorListCard
          key={data.id}
          image={data.store_image}
          storeName={data.store_name}
          address={data.manual_address}
          onPress={navigate_vendors.bind(this, data.id, data.store_name)}
        />
      );
    });
  };

  const hospital_details = data => {
    navigation.navigate('HospitalDetails', {data: data});
  };

  const view_all = (title, type, data) => {
    navigation.navigate('ViewList', {data: data, title: title, type: type});
  };

  const show_hospitals = () => {
    return hospitals.map(data => {
      return (
        <View style={{marginBottom: 20, margin: 5, width: 200}} key={data.id}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={hospital_details.bind(this, data)}>
            <CardView cardElevation={5} cardMaxElevation={5} cornerRadius={10}>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  backgroundColor: colors.theme_fg_three,
                  borderRadius: 10,
                }}>
                <View
                  style={{
                    width: 200,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}>
                  <View style={{height: 200, width: '100%'}}>
                    <Image
                      style={{height: undefined, width: undefined, flex: 1}}
                      source={{uri: img_url + data.hospital_logo}}
                    />
                  </View>
                </View>
                <View style={{margin: 5}} />
                <View style={{justifyContent: 'flex-start'}}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.theme_fg,
                      fontFamily: bold,
                    }}>
                    {data.hospital_name}
                  </Text>
                  <View style={{margin: 5}} />
                  {data.type == 1 ? (
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.theme_fg_three,
                        fontFamily: bold,
                        letterSpacing: 0.5,
                        backgroundColor: colors.badge_bg,
                        borderRadius: 10,
                        padding: 3,
                        textAlign: 'center',
                      }}>
                      Hospital
                    </Text>
                  ) : (
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.theme_bg_three,
                        fontFamily: bold,
                        letterSpacing: 0.5,
                        backgroundColor: colors.badge_bg,
                        borderRadius: 10,
                        padding: 3,
                        textAlign: 'center',
                      }}>
                      Clinic
                    </Text>
                  )}
                </View>
              </View>
              <View style={{margin: 5}} />
              <View
                style={{
                  width: '90%',
                  marginLeft: '5%',
                  flexDirection: 'row',
                  paddingLeft: 10,
                  paddingRight: 10,
                  alignItems: 'center',
                }}>
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  style={{
                    fontSize: 12,
                    color: colors.grey,
                    fontFamily: regular,
                  }}>
                  {data.address}
                </Text>
              </View>
              <View style={{margin: 5}} />
            </CardView>
          </TouchableOpacity>
        </View>
      );
    });
  };

  const show_recommended_doctors = () => {
    return recommended_doctors.map(data => {
      return (
        <DoctorListCard
          key={data.id}
          image={data.profile_image}
          name={data.doctor_name}
          qualification={data.qualification}
          specialist={data.specialist}
          experience={data.experience}
          onPress={create_appointment.bind(this, data)}
        />
      );
    });
  };

  const create_appointment = doctor_details => {
    navigation.navigate('CreateAppointment', {
      doctor_details: doctor_details,
      appointment_fee: doctor_details.appointment_fee,
    });
  };

  const show_top_rated_doctors = () => {
    return top_rated_doctors.map(data => {
      return (
        <View key={data.id} style={{marginBottom: 20, margin: 5, width: 200}}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={create_appointment.bind(this, data)}>
            <CardView cardElevation={5} cardMaxElevation={5} cornerRadius={10}>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  backgroundColor: colors.theme_fg_three,
                  borderRadius: 10,
                }}>
                <View style={{width: 200}}>
                  <View style={{height: 200, width: '100%'}}>
                    <Image
                      style={{height: undefined, width: undefined, flex: 1}}
                      source={{uri: img_url + data.profile_image}}
                    />
                  </View>
                </View>
                <View style={{margin: 5}} />
                <View style={{justifyContent: 'flex-start'}}>
                  <Text
                    style={{
                      fontSize: 14,
                      color: colors.theme_fg,
                      fontFamily: bold,
                    }}>
                    Dr.{data.doctor_name}
                  </Text>
                  <View style={{margin: 5}} />
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.theme_fg_three,
                      fontFamily: bold,
                      letterSpacing: 0.5,
                      backgroundColor: colors.badge_bg,
                      borderRadius: 10,
                      padding: 3,
                      textAlign: 'center',
                    }}>
                    {data.qualification}
                  </Text>
                </View>
              </View>
              <View style={{margin: 5}} />
            </CardView>
          </TouchableOpacity>
        </View>
      );
    });
  };

  const navigate_lab_details = (id, name) => {
    navigation.navigate('LabDetails', {lab_id: id, lab_name: name});
  };

  const show_labs = () => {
    return labs.map(data => {
      return (
        <View key={data.id} style={{marginBottom: 20, margin: 5, width: 200}}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={navigate_lab_details.bind(this, data.id, data.lab_name)}
            style={{width: 200, margin: 10}}>
            <CardView cardElevation={5} cardMaxElevation={5} cornerRadius={10}>
              <View
                style={{
                  width: '100%',
                  alignItems: 'center',
                  backgroundColor: colors.theme_fg_three,
                  borderRadius: 10,
                }}>
                <View style={{width: 200}}>
                  <View style={{height: 200, width: '100%'}}>
                    <Image
                      style={{height: undefined, width: undefined, flex: 1}}
                      source={{uri: img_url + data.lab_image}}
                    />
                  </View>
                </View>
                <View style={{margin: 5}} />
                <View style={{justifyContent: 'flex-start'}}>
                  <View
                    style={{
                      width: '100%',
                      alignItems: 'flex-start',
                      justifyContent: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: 14,
                        color: colors.theme_fg,
                        fontFamily: bold,
                      }}>
                      {data.lab_name}
                    </Text>
                    <View style={{margin: 5}} />
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={{
                        fontSize: 12,
                        color: colors.grey,
                        fontFamily: regular,
                      }}>
                      {data.address}
                    </Text>
                    <View style={{margin: 5}} />
                  </View>
                </View>
              </View>
            </CardView>
          </TouchableOpacity>
        </View>
      );
    });
  };

  const set_address = () => {
    navigation.navigate('SelectCurrentLocation');
  };

  const all_doctors = () => {
    //navigation.navigate("SelectCurrentLocation")
  };

  const show_blogs = () => {
    return blogs.map(data => (
      <TouchableOpacity
        key={data.id}
        onPress={() => navigation.navigate('BlogDetails', {data: data})}
        style={{
          height: 90,
          width: '100%',
          borderColor: colors.borderClr1,
          borderWidth: 1,
          borderRadius: 6,
          marginVertical: 6,
        }}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 4,
            paddingVertical: 3,
          }}>
          <Image
            source={{uri: img_url + data.image}}
            resizeMode="cover"
            style={{height: '95%', width: 90, borderRadius: 5}}
          />
          <View style={{flex: 1, flexDirection: 'row', marginLeft: 16}}>
            <View>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={{
                  color: colors.black,
                  fontWeight: bold,
                  fontSize: 16,
                  lineHeight: 25,
                }}>
                {data.title}
              </Text>
              <View
                style={{
                  flexDirection: 'row',
                  gap: 6,
                  marginTop: 6,
                  alignItems: 'center',
                }}>
                <Text style={{fontSize: 12}}>
                  {format(new Date(data.created_at), 'MMM dd, yyyy')}
                </Text>
                <Text
                  style={{
                    fontWeight: bold,
                    color: colors.theme_fg,
                    fontSize: 12,
                  }}>
                  {calculateReadingTime(data.description)}min read
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    ));
  };
  const navigate_pharm_cart = () => {
    if (props.cart_count != undefined) {
      navigation.navigate('PharmCart');
    } else {
      alert('Add your products in cart.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Loader visible={loading} />
      <ScrollView style={{padding: 10}} showsVerticalScrollIndicator={false}>
        <View style={{margin: 5}} />
        <View style={styles.header}>
          <TouchableOpacity
            onPress={set_address}
            style={{height: 30, width: 20}}>
            <Image
              style={{height: undefined, width: undefined, flex: 1}}
              source={white_logo}
            />
          </TouchableOpacity>
          <View style={{margin: 5}} />
          <TouchableOpacity onPress={set_address} style={{width: '80%'}}>
            <Text style={{color: colors.theme_fg_two, fontFamily: bold}}>
              {props.current_tag}
            </Text>
            <Text
              numberOfLines={1}
              style={{
                color: colors.theme_fg_two,
                fontSize: 12,
                fontFamily: regular,
              }}>
              {props.current_address}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={navigate_pharm_cart.bind(this)}
            style={{
              height: 30,
              width: 20,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              type={Icons.Ionicons}
              name="cart"
              style={{fontSize: 25, color: colors.theme_fg}}
            />
            {props.cart_count != undefined ? (
              <Text
                style={{
                  color: colors.theme_fg_three,
                  fontFamily: bold,
                  fontSize: 16,
                  backgroundColor: 'red',
                  borderRadius: 10,
                  justifyContent: 'center',
                  textAlign: 'center',
                  position: 'absolute',
                  top: -10,
                  left: 16,
                  width: 20,
                }}>
                {props.cart_count}
              </Text>
            ) : (
              <Text
                style={{
                  color: colors.theme_fg_three,
                  fontFamily: bold,
                  fontSize: 16,
                  backgroundColor: 'red',
                  borderRadius: 10,
                  justifyContent: 'center',
                  textAlign: 'center',
                  position: 'absolute',
                  top: -10,
                  left: 16,
                  width: 20,
                }}>
                +
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <View style={{margin: 10}} />
        <Text
          numberOfLines={2}
          style={{
            fontSize: 22,
            color: colors.theme_fg_two,
            fontFamily: bold,
            maxWidth: '75%',
          }}>
          Find your Doctor for your Symptoms
        </Text>
        <View style={{margin: 5}} />
        <View style={{flexDirection: 'row'}}>
          <ScrollView
            horizontal={true}
            style={{padding: 10}}
            showsHorizontalScrollIndicator={false}>
            {[...symptoms_first_list(), ...symptoms_second_list()]}
          </ScrollView>
        </View>
        {/* <View style={{margin: 5}} />
        <View style={{flexDirection: 'row'}}>
          <ScrollView
            horizontal={true}
            style={{padding: 10}}
            showsHorizontalScrollIndicator={false}>
            {symptoms_second_list()}
          </ScrollView>
        </View> */}
        <View style={{margin: 20}} />
        <View style={styles.home_style1}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {banners_list()}
          </ScrollView>
        </View>
        <View style={{margin: 20}} />
        {recommended_doctors.length > 0 && (
          <View>
            <View style={{flexDirection: 'row'}}>
              <View style={{alignSelf: 'flex-start', width: '75%'}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.theme_fg_two,
                    fontFamily: bold,
                  }}>
                  Recommended Doctors
                </Text>
              </View>
              <View style={{alignSelf: 'flex-end', width: '25%'}}>
                <Text
                  onPress={view_all.bind(
                    this,
                    'Recommended Doctors',
                    2,
                    recommended_doctors,
                  )}
                  style={{
                    fontSize: 12,
                    fontFamily: bold,
                    letterSpacing: 0.5,
                    borderRadius: 10,
                    padding: 3,
                    textAlign: 'center',
                    color: colors.lightTeal1,
                  }}>
                  See All
                </Text>
              </View>
            </View>
            <View style={styles.ban_style1}>
              <ScrollView
                horizontal={true}
                style={{paddingVertical: 10}}
                showsHorizontalScrollIndicator={false}>
                {show_recommended_doctors()}
                <View style={{margin: 10}} />
              </ScrollView>
            </View>
          </View>
        )}
        <Text
          style={{fontSize: 18, color: colors.theme_fg_two, fontFamily: bold}}>
          Our Valuable Services
        </Text>
        <View style={{margin: 5}} />
        <View style={styles.ban_style1}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {services_list()}
          </ScrollView>
        </View>
        <View style={{margin: 20}} />

        {hospitals.length > 0 && (
          <View>
            <View style={{flexDirection: 'row'}}>
              <View style={{alignSelf: 'flex-start', width: '75%'}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.theme_fg_two,
                    fontFamily: bold,
                  }}>
                  Recommended Hospitals
                </Text>
              </View>
              <View style={{alignSelf: 'flex-end', width: '25%'}}>
                <Text
                  onPress={view_all.bind(
                    this,
                    'Recommended Hospitals',
                    1,
                    hospitals,
                  )}
                  style={{
                    fontSize: 12,
                    fontFamily: bold,
                    letterSpacing: 0.5,
                    borderRadius: 10,
                    padding: 3,
                    textAlign: 'center',
                    color: colors.lightTeal1,
                  }}>
                  See All
                </Text>
              </View>
            </View>

            <View style={styles.ban_style1}>
              <ScrollView
                horizontal={true}
                style={{padding: 10}}
                showsHorizontalScrollIndicator={false}>
                {show_hospitals()}
                <View style={{margin: 10}} />
              </ScrollView>
            </View>
          </View>
        )}

        {top_rated_doctors.length > 0 && (
          <View>
            <View style={{flexDirection: 'row'}}>
              <View style={{alignSelf: 'flex-start', width: '75%'}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.theme_fg_two,
                    fontFamily: bold,
                  }}>
                  Top Rated Doctors
                </Text>
              </View>
              <View style={{alignSelf: 'flex-end', width: '25%'}}>
                <Text
                  onPress={view_all.bind(
                    this,
                    'Top Rated Doctors',
                    3,
                    top_rated_doctors,
                  )}
                  style={{
                    fontSize: 12,
                    fontFamily: bold,
                    letterSpacing: 0.5,
                    borderRadius: 10,
                    padding: 3,
                    textAlign: 'center',
                    color: colors.lightTeal1,
                  }}>
                  See All
                </Text>
              </View>
            </View>
            <View style={styles.ban_style1}>
              <ScrollView
                horizontal={true}
                style={{padding: 10}}
                showsHorizontalScrollIndicator={false}>
                {show_top_rated_doctors()}
                <View style={{margin: 10}} />
              </ScrollView>
            </View>
          </View>
        )}
        {labs.length > 0 && (
          <View>
            <View style={{flexDirection: 'row'}}>
              <View style={{alignSelf: 'flex-start', width: '75%'}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.theme_fg_two,
                    fontFamily: bold,
                  }}>
                  Recommended Labs
                </Text>
              </View>
              <View style={{alignSelf: 'flex-end', width: '25%'}}>
                <Text
                  onPress={view_all.bind(this, 'Recommended Labs', 4, labs)}
                  style={{
                    fontSize: 12,
                    fontFamily: bold,
                    letterSpacing: 0.5,
                    borderRadius: 10,
                    padding: 3,
                    textAlign: 'center',
                    color: colors.lightTeal1,
                  }}>
                  See All
                </Text>
              </View>
            </View>
            <View style={styles.ban_style1}>
              <ScrollView
                horizontal={true}
                style={{padding: 10}}
                showsHorizontalScrollIndicator={false}>
                {show_labs()}
                <View style={{margin: 10}} />
              </ScrollView>
            </View>
          </View>
        )}
        {vendors.length > 0 && (
          <View>
            <Text
              style={{
                fontSize: 18,
                color: colors.theme_fg_two,
                fontFamily: bold,
              }}>
              Recommended Pharmacies
            </Text>
            <View style={styles.ban_style1}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                {show_vendors()}
              </ScrollView>
            </View>
          </View>
        )}
        <View style={{margin: 5}}></View>
        {blogs.length > 0 && (
          <View>
            <View style={{flexDirection: 'row'}}>
              <View style={{alignSelf: 'flex-start', width: '75%'}}>
                <Text
                  style={{
                    fontSize: 18,
                    color: colors.theme_fg_two,
                    fontFamily: bold,
                  }}>
                  Latest Articles or News
                </Text>
              </View>
              <View style={{alignSelf: 'flex-end', width: '25%'}}>
                <Text
                  onPress={view_all.bind(
                    this,
                    'Recommended Hospitals',
                    1,
                    hospitals,
                  )}
                  style={{
                    fontSize: 12,
                    fontFamily: bold,
                    letterSpacing: 0.5,
                    borderRadius: 10,
                    padding: 3,
                    textAlign: 'center',
                    color: colors.lightTeal1,
                  }}>
                  See All
                </Text>
              </View>
            </View>

            <View style={styles.ban_style1}>
              <View style={{width: '100%', marginBottom: 6}}>
                <View style={{margin: 5}} />
                {show_blogs()}
                <View style={{margin: 10}} />
              </View>
            </View>
          </View>
        )}
        <View style={{margin: 60}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.theme_bg_three,
    padding: 16,
  },
  header: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#ccc',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  ban_style1: {
    flexDirection: 'row',
  },
  ban_style2: {
    borderRadius: 10,
  },
  ban_style3: {
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
    marginRight: 10,
  },
  home_style1: {
    flexDirection: 'row',
    widht: '100%',
  },
  home_style2: {
    borderRadius: 10,
  },
  home_style3: {
    height: 170,
    width: Dimensions.get('window').width * 0.85,
    borderRadius: 10,
    marginRight: 10,
  },
});

function mapStateToProps(state) {
  return {
    current_lat: state.current_location.current_lat,
    current_lng: state.current_location.current_lng,
    current_address: state.current_location.current_address,
    current_tag: state.current_location.current_tag,
    address: state.current_location.address,
    sub_total: state.order.sub_total,
    cart_count: state.order.cart_count,
  };
}

const mapDispatchToProps = dispatch => ({
  updateAddress: data => dispatch(updateAddress(data)),
  updateCurrentAddress: data => dispatch(updateCurrentAddress(data)),
  updateCurrentLat: data => dispatch(updateCurrentLat(data)),
  updateCurrentLng: data => dispatch(updateCurrentLng(data)),
  currentTag: data => dispatch(currentTag(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
