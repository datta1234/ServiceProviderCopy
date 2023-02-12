import React, { useEffect, useMemo } from "react";
import { View, StyleProp, ViewStyle, TouchableOpacity } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";
import Icon from "react-native-dynamic-vector-icons";

/**
 * ? Local imports
 */
import createStyles from "./InboxScreen.style";

import { SCREENS } from "@shared-constants";
import Text from "@shared-components/text-wrapper/TextWrapper";
import HeaderContainer from "@shared-components/headers/HeaderContainer";

/**
 * ? Constants
 */
const MOCK_DATA: any = [
  { name: "Jason Miller", message: "Would you like to...", time: "2:05PM" },
  { name: "Arnorld Jones", message: `Hi! I'm done with...`, time: "Yesterday" },
  { name: "David Williams", message: "Good day! I have...", time: "Friday" },
  { name: "Michael Brown", message: "I have a concern...", time: "Monday" },
];

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IInboxScreenProps {
  style?: CustomStyleProp;
  navigation: any;
}

const InboxScreen: React.FC<IInboxScreenProps> = ({ navigation }) => {
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
  const renderItem = (name: string, message: string, time: string) => (
    <TouchableOpacity
      style={{
        height: 40,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottomColor: "rgba(0,0,0,0.1)",
        borderBottomWidth: 1,
        marginBottom: 5,
      }}
    >
      <View style={{ marginBottom: 10 }}>
        <Text h4 color="rgba(0,0,0,0.8)" style={{ marginBottom: 3 }}>
          {name}
        </Text>
        <Text h6>{message}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text h6>{time}</Text>
        <Icon
          name="keyboard-arrow-right"
          type="MaterialIcons"
          color={"rgba(0,0,0,0.5)"}
          size={25}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <HeaderContainer pageTitle="Inbox" navigateTo={SCREENS.HOME} />
      <View style={styles.container}>
        {MOCK_DATA?.map((m: any) => {
          return renderItem(m.name, m.message, m.time);
        })}
      </View>
    </>
  );
};

export default InboxScreen;
