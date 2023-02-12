import React, { useMemo } from "react";
import { View, Pressable } from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

/**
 * ?
 */
import createStyles from "./HeaderHome.style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { SCREENS } from "@shared-constants";

interface IHeaderHomeProps {
  name?: string;
}

const HeaderHome: React.FC<IHeaderHomeProps> = ({ name = "" }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text h2 bold>
          {`Hi ${name}!`}
        </Text>
        <Pressable
          onPress={() => NavigationService.push(SCREENS.MENU)}
        ></Pressable>
      </View>
    </View>
  );
};

export default HeaderHome;
