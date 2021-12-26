/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {SectionGrid} from 'react-native-super-grid';
import {ScrollView, Image, TouchableOpacity, Dimensions} from 'react-native';
import {Button, Card, Modal} from 'react-native-paper';
import Icon from 'react-native-vector-icons/AntDesign';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import ModalComp from './Components';
import {Alert} from 'native-base';
import {useDispatch, useSelector} from 'react-redux';
import {foodAction} from '../../redux/Action/food.action';
import {foodCategoeryAction} from '../../redux/Action/food.categoery';
import axiosInstance from '../../config';
import EscPosPrinter, {
  getPrinterSeriesByName,
} from 'react-native-esc-pos-printer';
import {foodDetailsAction} from '../../redux/Action/food.details';
import {
  addToCart,
  clearAllItemsCartAction,
  clearItemsAction,
  decreaseAction,
  increaseAction,
} from '../../redux/Action/cart.action';
import {Formik} from 'formik';
import NfcManager, {NfcEvents} from 'react-native-nfc-manager';

export default function Home() {
  const [status, setStatus] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModal1, setShowModal1] = useState(false);
  const [visible, setVisible] = useState(false);
  const [laoding, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const containerStyle = {backgroundColor: 'white', padding: 10};

  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(foodCategoeryAction());
  }, [dispatch]);

  const {foodCategoery} = useSelector(state => state);
  const foodOneDetails = useSelector(state => state.foodDetail);
  const foodData = useSelector(state => state.foodData.data);
  const cartReducer = useSelector(state => state.cartReducer);

  const foodCategoeiesData = foodCategoery.data;

  const [data, setData] = useState({
    mac_address: '',
    food_order: cartReducer.cart.map(e => {
      return {food_variation_id: e.id, quantity: e.count};
    }),
  });
  React.useEffect(() => {
    setData(prevData => {
      return {
        ...prevData,
        food_order: JSON.stringify(
          cartReducer.cart.map(e => {
            return {
              food_variation_id: e.id,
              quantity: e.count,
            };
          }),
        ),
      };
    });
  }, [cartReducer.cart]);

  const handleCategoryID = id => {
    dispatch(foodAction(id));
    setStatus(id);
    // setShowModal(true);
  };

  const url = 'https://canteen.trimurtitechnology.com/k/public';

  async function initNfc() {
    await NfcManager.start();
  }

  if (success || error) {
    setTimeout(() => {
      setError('');
      setSuccess('');
    }, 6000);
  }

  const handleSubmitForm = async values => {
    setShowModal1(true);

    initNfc();

    function readNdef() {
      const cleanUp = () => {
        NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
        NfcManager.setEventListener(NfcEvents.SessionClosed, null);
      };
      return new Promise(resolve => {
        let tagFound = null;
        NfcManager.setEventListener(NfcEvents.DiscoverTag, ({id}) => {
          tagFound = id;
          resolve(tagFound);
          setData(prevData => {
            return {
              ...prevData,
              mac_address: tagFound,
            };
          });
          NfcManager.unregisterTagEvent().catch(() => 0);
        });
        NfcManager.setEventListener(NfcEvents.SessionClosed, () => {
          cleanUp();
          if (!tagFound) {
            resolve();
          }
        });

        NfcManager.registerTagEvent();
      });
    }
    try {
      const response = await readNdef();
    } catch (err) {}
    try {
      setLoading(true);
      const res = await axiosInstance.post('/food_orders', data);
      if (res.data.status === 'error') {
        setError(res.data.message);
        setShowModal1(false);
      }
      if (res.data.status === 'success') {
        setSuccess(res.data.message);
        dispatch(clearAllItemsCartAction());
        setShowModal1(false);
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  let initialValue = 0;

  const printerBillHandle = async () => {
    try {
      const printers = await EscPosPrinter.discover();
      console.log('printers------------', printers);

      const printer = printers[0];

      await EscPosPrinter.init({
        target: printer.target,
        seriesName: getPrinterSeriesByName(printer.name),
        language: 'EPOS2_LANG_EN',
      });

      const printing = new EscPosPrinter.printing();

      const statu = await printing
        .initialize()
        .align('center')
        .size(3, 3)
        .line('DUDE!')
        .smooth()
        .line('DUDE!')
        .smooth()
        .size(1, 1)
        .text('is that a ')
        .bold()
        .underline()
        .text('printer?')
        .bold()
        .underline()
        .newline(2)
        .align('center')
        .barcode({
          value: 'Test123',
          type: 'EPOS2_BARCODE_CODE93',
          hri: 'EPOS2_HRI_BELOW',
          width: 2,
          height: 50,
        })
        .qrcode({
          value: 'Test123',
          level: 'EPOS2_LEVEL_M',
          width: 5,
        })
        .cut()
        .addPulse()
        .send();

      console.log('Success:', statu);
    } catch (e) {
      console.log('Error:', e);
    }
  };

  return (
    <>
      {/* check out modal */}

      {/* Food items Card */}

      <View style={{flexDirection: 'row'}}>
        <View
          style={{
            height: Dimensions.get('window').height / 1.32,
            width: Dimensions.get('window').width / 1.3,
          }}>
          <SectionGrid
            showsVerticalScrollIndicator={true}
            sections={foodData.map(cat => {
              return {
                data: foodData.slice(
                  initialValue,
                  (initialValue = initialValue + 4),
                ),
              };
            })}
            style={styles.gridView}
            renderItem={({item}) => (
              <View style={[styles.itemContainer]}>
                <Card
                  elevation={0}
                  style={styles.foodCard}
                  onPress={() => {
                    dispatch(foodDetailsAction(item.id));
                    // setShowModal(true);
                    setVisible(true);
                  }}>
                  <Image
                    source={{uri: url + item.image_url}}
                    style={styles.foodCardImage}
                  />
                  <Text style={styles.foodCardName}>{item.food_name}</Text>
                </Card>
              </View>
            )}
          />

          {error ? (
            <Alert
              status="error"
              style={{
                width: 350,
                fontSize: 50,
                backgroundColor: 'red',
                position: 'absolute',
                top: 20,
                right: 200,
              }}>
              <Text
                style={{
                  fontSize: 25,
                  color: '#ffffffff',
                  fontWeight: 'bold',
                }}>
                {error}
              </Text>
            </Alert>
          ) : null}
          {success ? (
            <Alert
              status="success"
              style={{
                width: 350,
                fontSize: 50,
                backgroundColor: 'blue',
                position: 'absolute',
                top: 20,
                right: 200,
              }}>
              <Text
                style={{
                  fontSize: 25,
                  color: '#ffffffff',
                  fontWeight: 'bold',
                }}>
                {success}
              </Text>
            </Alert>
          ) : null}

          <View
            showsVerticalScrollIndicator={false}
            style={{
              position: 'absolute',
              right: -240,
              padding: 0,
              margin: 0,
              // left: 0,
              // flex: 1,
              height: Dimensions.get('window').height / 1.056,
              backgroundColor: '#d6cfc7',
              alignSelf: 'flex-end',
              // paddingLeft: 10,
              width: Dimensions.get('window').width / 3.5,
            }}>
            <Formik
              initialValues={[
                {
                  food_variation_id: '',
                  qunatity: '',
                  mac_address: '',
                },
              ]}
              onSubmit={handleSubmitForm}>
              {({handleChange, handleBlur, handleSubmit}) => (
                <View
                  style={{
                    height: Dimensions.get('window').height / 1,
                    flex: 1,
                    backgroundColor: '#EFF3F6',
                    borderLeftColor: '#595260',
                    // borderWidth: 0.5,
                    // borderLeftWidth: 1,
                    // borderTopWidth: 0,
                    // borderBottomWidth: 0,
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      fontSize: 25,
                      marginBottom: 10,
                      fontFamily: 'Lato-Bold',
                      color: '#fb8500',
                    }}>
                    Cart
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingTop: 6,
                      paddingBottom: 8,
                      backgroundColor: '#FFFFFFFF',
                    }}>
                    <Text
                      style={{
                        fontSize: 18,
                        marginLeft: 10,
                        fontFamily: 'Lato-Bold',
                      }}>
                      Food Items
                    </Text>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: 'Lato-Bold',
                        marginRight: 57,
                        textTransform: 'uppercase',
                      }}>
                      Qty
                    </Text>
                  </View>
                  <View
                    style={{
                      borderBottomColor: '#fff',
                      borderBottomWidth: 1,
                    }}
                  />
                  <ScrollView showsVerticalScrollIndicator={false}>
                    {cartReducer.cart.map((e, i) => (
                      <View
                        key={i}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          marginTop: 6,
                          paddingBottom: 40,
                        }}>
                        <View style={{}}>
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={{
                                color: '#fb8500',
                                fontSize: 18,
                                marginLeft: 10,
                                fontFamily: 'Lato-Regular',
                              }}>
                              {e.food_name}
                            </Text>
                          </View>
                          <Text
                            style={{
                              fontSize: 15,
                              color: '#03071e',
                              fontFamily: 'Lato-Regular',
                              marginLeft: 10,
                            }}>
                            Rs. {e.price}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <Icon
                            name="arrowup"
                            size={20}
                            color="red"
                            onPress={() => dispatch(increaseAction(i))}
                            style={{position: 'absolute', top: 5, right: 65}}
                          />

                          <Text
                            style={{
                              marginTop: 28,

                              fontSize: 20,
                              marginRight: 30,
                            }}>
                            {e.count <= 0 ? '0' : e.count}
                          </Text>

                          <Icon
                            name="arrowdown"
                            size={20}
                            color="red"
                            onPress={() => dispatch(decreaseAction(i))}
                            style={{
                              position: 'absolute',
                              top: 55,
                              right: 65,
                            }}
                          />
                          <Icon1
                            name="cancel"
                            size={25}
                            color="red"
                            onPress={() => dispatch(clearItemsAction(i))}
                            style={{
                              marginLeft: 15,
                              marginTop: 3,
                              left: -20,
                              top: 25,
                            }}
                          />
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                  <View
                    style={{
                      // borderBottomColor: '#000000',
                      borderWidth: 0,
                      // borderBottomWidth: 0.5,
                      borderLeftWidth: 0,
                      borderRightWidth: 0,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      padding: 10,
                      backgroundColor: '#FFFFFFFF',
                    }}>
                    <Text
                      style={{
                        color: '#fb8500',
                        fontFamily: 'Lato-Bold',
                        fontSize: 18,
                      }}>
                      Total
                    </Text>
                    <Text
                      style={{
                        marginBottom: 10,
                        alignSelf: 'center',
                        color: '#001523',
                        fontFamily: 'Lato-Regular',
                      }}>
                      Rs. {cartReducer.totalAmount}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Button
                      onPress={printerBillHandle}
                      style={{
                        backgroundColor: '#fb8500',
                        borderRadius: 10,
                        padding: 3,
                        marginBottom: 5,
                        marginTop: 5,
                        width: 150,
                        marginRight: 20,
                        flex: 1,
                        marginLeft: 20,
                      }}>
                      <Text
                        style={{
                          color: '#ffffffff',
                          fontSize: 16,
                          fontFamily: 'Lato-Regular',
                          textTransform: 'capitalize',
                        }}>
                        Checkout
                      </Text>
                    </Button>
                    <Icon
                      onPress={() => dispatch(clearAllItemsCartAction())}
                      name="delete"
                      color="red"
                      size={30}
                      style={{
                        backgroundColor: '#fb8500',
                        borderRadius: 10,
                        color: '#ffffffff',
                        padding: 5,
                        marginBottom: 5,
                        marginTop: 5,
                        marginRight: 20,
                        paddingLeft: 10,
                        width: 50,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    />
                  </View>
                </View>
              )}
            </Formik>
          </View>
        </View>
      </View>

      {/* Food Categories */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        style={{
          bottom: 0,
          position: 'absolute',
          height: Dimensions.get('screen').height / 5.5,
          width: Dimensions.get('screen').width / 1.42,
          paddingTop: 5,
          marginLeft: 10,
          paddingLeft: 5,
          borderRadius: 12,
          // marginBottom: 10,
        }}>
        {foodCategoeiesData.map((e, i) => (
          <TouchableOpacity key={i} activeOpacity={3}>
            <Card
              elevation={0}
              style={{
                width: 100,
                // padding: 5,

                // borderRadius: 20,
                // marginBottom: 20,
                marginRight: 5,
                height: 100,
              }}
              onPress={() => handleCategoryID(e.id)}>
              <Image
                source={{uri: url + e.image_url}}
                style={{
                  width: 80,
                  height: 60,
                  borderRadius: 5,
                  // alignItems: 'center',
                  justifyContent: 'center',
                  marginLeft: 10,
                  marginTop: 5,
                }}
              />
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 15,
                  fontFamily: 'Lato-Regular',
                  fontWeight: '900',
                  marginBottom: 5,
                  color: '#fb8500',
                  textTransform: 'capitalize',
                }}>
                {e.category_name}
              </Text>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        style={{
          backgroundColor: '#ffffff',
          width: Dimensions.get('screen').width / 2,
          height: Dimensions.get('screen').height / 2.5,
          marginTop: 100,
          marginLeft: 100,
        }}>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {foodOneDetails.data.variation ? (
            foodOneDetails.data.variation.map((e, i) => (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                }}>
                <Card
                  style={{
                    padding: 20,
                    height: 120,
                    marginRight: 20,
                    marginLeft: 10,
                    marginBottom: 100,
                  }}
                  onPress={() => {
                    dispatch(addToCart(e));
                    setVisible(false);
                  }}
                  elevation={5}>
                  <Text
                    style={{
                      color: '#373737',
                      fontWeight: 'bold',
                      fontSize: 18,
                      textTransform: 'capitalize',
                    }}>
                    {e.variation_name}
                  </Text>
                  <Text style={{paddingTop: 5}}>Rs: {e.price}</Text>
                  <Text style={{paddingTop: 5}}>
                    Discount : {e.discount ? e?.discount : '0'}
                  </Text>
                </Card>
              </View>
            ))
          ) : (
            <View>
              <Text>No Variation found</Text>
            </View>
          )}
        </View>
      </Modal>
      <Modal
        visible={showModal1}
        onDismiss={() => setShowModal1(false)}
        style={{
          backgroundColor: '#ffffff',
          width: Dimensions.get('screen').width / 2,
          height: Dimensions.get('screen').height / 2,
          marginTop: 100,
          marginLeft: 100,
        }}>
        <View style={{alignSelf: 'center', paddingTop: 50}}>
          {laoding ? (
            <Text> Loading please Wait</Text>
          ) : (
            <Text style={{fontSize: 20, fontWeight: 'bold'}}>
              Please Scan Your T Card{' '}
            </Text>
          )}
        </View>
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Image
            source={require('../../assets/nfc.png')}
            style={{width: 175, height: 175, marginTop: 50}}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  gridView: {
    flex: 1,
    backgroundColor: '#FFFFFFFF',
  },
  itemContainer: {
    justifyContent: 'flex-end',
    padding: 5,
    height: 95,
    marginTop: 30,
  },
  itemName: {
    fontSize: 16,

    fontWeight: '600',
  },
  itemCode: {
    fontWeight: '600',
    fontSize: 12,
    color: '#fff',
  },
  foodCard: {
    padding: 10,
    backgroundColor: '#efefefef',
    borderRadius: 10,
    marginRight: 10,
    height: 120,
    width: 100,
  },
  foodCardImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  foodCardName: {
    textAlign: 'center',
    maxWidth: 100,
    fontSize: 13,
    marginBottom: 5,
    color: '#476088',
    textTransform: 'capitalize',
  },
  foodDetailCard: {},
  categoryContainer: {},
});
