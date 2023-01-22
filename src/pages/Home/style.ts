import styled from "styled-components/native";

export const Container = styled.View`
  flex: 1;
  flex-direction: column;
  justify-content: space-between;
`;
export const ContainerButtons = styled.View`
  width: 80%;
  height: 45px;
  margin-top: 70px;
  align-self: center;
  flex-direction: row;
  justify-content: center;
  border-radius: 10px;
  z-index: 9999;
`;

export const Button = styled.TouchableOpacity``;

export const ContainerSlider = styled.View`
  flex-direction: row;
  align-items: center;
  align-self: center;
  z-index: 9999;
  margin-bottom: 70px;
`;
