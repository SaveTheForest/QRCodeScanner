import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import * as S from "./style";
import {
  FlatList,
  Alert,
  View,
  Linking,
  TouchableOpacity,
  Text,
  Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Link, Trash } from "../../icons";
type dataType = {
  id: string;
  data: string;
  date: string;
};
const height = Dimensions.get("screen").height;

export default function Historic() {
  const [data, setData] = useState<dataType[]>([]);
  const [empty, setEmpty] = useState<number>();
  async function getHistoricData() {
    const response = await AsyncStorage.getItem("@save:data");
    const previousData = response ? JSON.parse(response) : [];
    setData(previousData);
    isEmpty();
  }
  const deleteAllHistoric = async () => {
    const deleteAll = async () => {
      await AsyncStorage.removeItem("@save:data");
      setEmpty(0);
      getHistoricData();
    };

    Alert.alert("Delete All", `Do you want to delete everything?`, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel clicked"),
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => deleteAll(),
      },
    ]);
  };
  async function isEmpty() {
    const response = await AsyncStorage.getItem("@save:data");
    const previousData = response?.length;

    setEmpty(previousData);
  }

  useFocusEffect(
    useCallback(() => {
      getHistoricData();
    }, [])
  );
  useEffect(() => {
    getHistoricData();
  }, []);
  return (
    <S.Container>
      <Text
        style={{
          alignSelf: "center",
          marginTop: 60,
          fontWeight: "500",
          fontSize: 28,
          color: "#323232",
        }}
      >
        Historic
      </Text>

      {empty ? (
        <>
          <FlatList
            ItemSeparatorComponent={() => (
              <View
                style={{
                  height: 0.5,
                }}
              />
            )}
            data={data}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <S.ContainerList>
                {Link}
                <View style={{ marginLeft: 10 }}>
                  <TouchableOpacity onPress={() => Linking.openURL(item.data)}>
                    <S.LinkText numberOfLines={1}>{item.data}</S.LinkText>
                  </TouchableOpacity>
                  <S.DateText>{item.date}</S.DateText>
                </View>
              </S.ContainerList>
            )}
          />
          <TouchableOpacity
            style={{
              position: "absolute",
              alignSelf: "flex-end",
              marginTop: height - 200,
              right: 30,
            }}
            onPress={deleteAllHistoric}
          >
            {Trash}
          </TouchableOpacity>
        </>
      ) : (
        <View
          style={{
            alignSelf: "center",
            flex: 1,
            justifyContent: "center",
          }}
        >
          <Text style={{ marginBottom: 80, fontSize: 16 }}>
            Your scans will be listed here
          </Text>
        </View>
      )}
    </S.Container>
  );
}
