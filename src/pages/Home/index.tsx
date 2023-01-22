import * as S from "./style";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { BarCodeScanner } from "expo-barcode-scanner";
import Slider from "@react-native-community/slider";
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";
import {
  CamOff,
  FlashOffIcon,
  FlashOnIcon,
  ReverseCam,
  ZoomMinus,
  ZoomMore,
} from "../../icons";

//CRIAR UMA TELA PARA EXIBIR AS INFORMAÇÕES AO SCANNEAR UM QR CODE

/*
LOGICA DE DELETAR
remove_user = async(userid) => {
    try{
        let usersJSON= await AsyncStorage.getItem('users');
        let usersArray = JSON.parse(usersJSON);
        alteredUsers = usersArray.filter(function(e){
            return e.id !== userid.id

        })
        AsyncStorage.setItem('users', JSON.stringify(alteredUsers));
        this.setState({
           users:alteredUsers
        })
    }
    catch(error){
        console.log(error)
    }
}; */

export default function Home() {
  const [typeCam, setTypeCam] = useState(CameraType.back);
  const [permission, requestPermission] = useState({});
  const [scanned, setScanned] = useState(false);
  const [toarch, setToarch] = useState(FlashMode.off);
  const [isVisible, setIsVisible] = useState(false);
  const [zoom, setZoom] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setIsVisible(true);

      return () => {
        setIsVisible(false);
      };
    }, [])
  );
  const handleToarch = () => {
    {
      toarch == "off" ? setToarch(FlashMode.torch) : setToarch(FlashMode.off);
    }
  };
  const handleReverveCam = () => {
    {
      typeCam == "back"
        ? setTypeCam(CameraType.front)
        : setTypeCam(CameraType.back);
    }
  };
  async function writeDataBase(data: string) {
    try {
      const newData = {
        id: uuid.v4(),
        data: data,
        date: new Date().toLocaleString(),
      };
      const response = await AsyncStorage.getItem("@save:data");
      const previousData = response ? JSON.parse(response) : [];
      const DATA = [...previousData, newData];
      const result = DATA ? JSON.stringify(DATA) : DATA;

      await AsyncStorage.setItem("@save:data", result);
    } catch (e) {
      console.log(e);
    }
  }

  const onScanned = async ({ type, data }: any) => {
    setScanned(true);

    writeDataBase(data);
    function scannerReady() {
      setTimeout(Timeout, 2000);

      function Timeout() {
        setScanned(false);
      }
    }

    Alert.alert("You want open link?", `Linking:${data}`, [
      {
        text: "Cancel",
        onPress: () => scannerReady(),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => Linking.openURL(data).finally(() => setScanned(false)),
      },
    ]);
  };
  const getBarCodeScannerPermissions = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    requestPermission(status);
  };
  useEffect(() => {
    getBarCodeScannerPermissions();
  }, []);

  return (
    <S.Container>
      {permission === "granted" ? (
        isVisible ? (
          <>
            <S.ContainerButtons>
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: "#283231",
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  borderRadius: 10,
                  opacity: 0.5,
                }}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: "space-around",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <S.Button onPress={handleToarch}>
                  {toarch == "off" ? FlashOffIcon : FlashOnIcon}
                </S.Button>
                <S.Button onPress={handleReverveCam}>{ReverseCam}</S.Button>
              </View>
            </S.ContainerButtons>

            <S.ContainerSlider>
              {ZoomMinus}
              <Slider
                onValueChange={(value) => setZoom(value)}
                style={{ width: 250, height: 40 }}
                minimumValue={0}
                maximumValue={1}
                minimumTrackTintColor="#FFFFFF"
                maximumTrackTintColor="#000000"
                thumbTintColor="#725AEC"
              />
              {ZoomMore}
            </S.ContainerSlider>

            <Camera
              zoom={zoom}
              type={typeCam}
              ratio={"16:9"}
              style={[
                StyleSheet.absoluteFillObject,
                { width: "100%", flex: 1 },
              ]}
              flashMode={toarch}
              onBarCodeScanned={scanned ? undefined : onScanned}
              barCodeScannerSettings={{
                barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
              }}
            />
          </>
        ) : null
      ) : (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{ fontSize: 15, marginVertical: 30, textAlign: "center" }}
          >
            Allow the app to access your camera for it to work. {"\n"}
            Click on the camera to request permission
          </Text>
          <TouchableOpacity onPress={getBarCodeScannerPermissions}>
            {CamOff}
          </TouchableOpacity>
        </View>
      )}
    </S.Container>
  );
}
