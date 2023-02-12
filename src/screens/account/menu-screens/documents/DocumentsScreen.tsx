import React, { useEffect, useMemo } from "react";
import { View, StyleProp, ViewStyle, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import Icon from "react-native-dynamic-vector-icons";

/**
 * ? Local imports
 */
import createStyles from "./DocumentsScreen.style";

import { SCREENS } from "@shared-constants";
import Text from "@shared-components/text-wrapper/TextWrapper";
import HeaderContainer from "@shared-components/headers/HeaderContainer";
import { v2Colors } from "@theme/themes";
import { getCardBgColor, getStatusBgColor } from "./helpers";

/**
 * ? SVGs
 */
import CHECK from "@assets/v2/bookings/icons/check-white.svg";
import { toLower } from "lodash";

/**
 * ? Constants
 */
const MOCK_DATA: any = [
  { name: "VEVO Check", status: "Incomplete" },
  { name: "AFP Check", status: "Pending" },
  { name: "Driver's License", status: "Completed" },
  { name: "Insurance", status: "Completed" },
];

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IDocumentsScreenProps {
  style?: CustomStyleProp;
  navigation: any;
}

const DocumentsScreen: React.FC<IDocumentsScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const { colors } = theme;
  const styles = useMemo(() => createStyles(theme), [theme]);

  /**
   * ? Watchers
   */
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {});

    return unsubscribe;
  }, [navigation]);

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const renderItem = (name: string, status: string) => (
    <TouchableOpacity
      style={[
        styles.itemContainer,
        {
          backgroundColor: getCardBgColor(status),
        },
      ]}
    >
      <Text bold style={{ fontSize: 15 }}>
        {name}
      </Text>
      <View style={styles.itemRightContainer}>
        <View
          style={[
            styles.statusContainer,
            {
              backgroundColor: getStatusBgColor(status),
            },
          ]}
        >
          <Text h5 bold color={"white"}>
            {status}
          </Text>

          <View style={{ width: 5 }} />
          {toLower(status) === "completed" && <CHECK />}
        </View>
        <View style={{ width: 8 }} />
        <Icon
          name="keyboard-arrow-right"
          type="MaterialIcons"
          color={v2Colors.green}
          size={25}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <HeaderContainer pageTitle="Documents" navigateTo={SCREENS.HOME} />
      <View style={styles.container}>
        {MOCK_DATA?.map((m: any) => {
          return renderItem(m.name, m.status);
        })}
      </View>
    </>
  );
};

export default DocumentsScreen;
