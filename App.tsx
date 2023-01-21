import { StatusBar } from "react-native";
import Routes from "./src/routes/routes";

export default function App() {
  return (
    <>
      <StatusBar barStyle={"light-content"} />
      <Routes />
    </>
  );
}
