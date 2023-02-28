import React ,{FC, useMemo}from "react";
import { ImageBackground, ScrollView, StyleProp, Text, View, ViewStyle } from "react-native";
const IMAGE_BG = "../../assets/v2/auth/images/image-bg.png";
import LAWNQ from "@assets/v2/auth/images/lawnq.svg";
import { useTheme } from "@react-navigation/native";
import createStyles from "./ServiceType.style";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;


const ServiceType:React.FC<any> = () => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return (
    <ImageBackground source={require(IMAGE_BG)} style={styles.container}>
      <ScrollView
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps={"never"}
  >
    <View style={{backgroundColor:"red",height:'100%',width:'100%'}}>
      <View style={{display:'flex',alignSelf:'center',alignContent:'center',alignItems:'center',}}>
        <LAWNQ />
      </View>
      </View>
      </ScrollView>
      </ImageBackground>
  )
};

export default ServiceType;
