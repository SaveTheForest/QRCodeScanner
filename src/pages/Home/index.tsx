import * as S from "./style";
import { Camera, CameraType, FlashMode } from "expo-camera";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Alert, Linking, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import uuid from "react-native-uuid";

export default function Home() {
  const FlashOnIcon = <Ionicons name="flash" size={42} color="black" />;
  const FlashOffIcon = (
    <Ionicons name="flash-outline" size={42} color="black" />
  );
  const ReverseCam = (
    <Ionicons name="camera-reverse-outline" size={42} color="black" />
  );

  const [typeCam, setTypeCam] = useState(CameraType.back);
  const [permission, requestPermission] = useState({});
  const [scanned, setScanned] = useState(false);
  const [toarch, setToarch] = useState(FlashMode.off);

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

  const onScanned = async ({ type, data }: any) => {
    setScanned(true);

    function scannerReady() {
      setTimeout(Timeout, 2000);

      function Timeout() {
        setScanned(false);
      }
    }
    try {
      const newDate = {
        id: uuid.v4(),
        data: data,
        date: new Date().toLocaleString(),
      };
      const response = await AsyncStorage.getItem("@savepass:date");
      const previousData = response ? JSON.parse(response) : [];
      const DATA = [...previousData, newDate];
      const result = DATA ? JSON.stringify(DATA) : DATA;
      await AsyncStorage.setItem("@savepass:date", result);
      console.log(JSON.parse(result));
    } catch (e) {
      console.log(e);
    }

    Alert.alert("Scanner Success", "You want open link?", [
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
  const teste = () => {
    return true;
  };
  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      requestPermission(status);
    };

    teste();
    getBarCodeScannerPermissions();
  }, []);

  return (
    <S.Container>
      {teste() ? (
        <>
          <Camera
            type={typeCam}
            style={[
              StyleSheet.absoluteFillObject,
              { width: "100%", height: "100%" },
            ]}
            flashMode={toarch}
            onBarCodeScanned={scanned ? undefined : onScanned}
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
            }}
          />
          <S.ContainerButtons>
            <S.Button onPress={handleToarch}>
              {toarch == "off" ? FlashOffIcon : FlashOnIcon}
            </S.Button>
            <S.Button onPress={handleReverveCam}>{ReverseCam}</S.Button>
          </S.ContainerButtons>
        </>
      ) : (
        <Text>aaa</Text>
      )}
    </S.Container>
  );
}
