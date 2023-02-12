import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useTheme } from "@react-navigation/native";
import * as NavigationService from "react-navigation-helpers";

/**
 * ? Local imports
 */
import createStyles from "./Earnings.style";

import { SCREENS } from "@shared-constants";
import Text from "@shared-components/text-wrapper/TextWrapper";
import HeaderContainer from "@shared-components/headers/HeaderContainer";
import { v2Colors } from "@theme/themes";
import { earnings } from "./mocks";

/**
 * ? SVGs
 */
import CASH_GREEN from "@assets/v2/earnings/images/cash-green.svg";
import CASH_OUT from "@assets/v2/earnings/icons/cash-out.svg";
import FILTER from "@assets/v2/earnings/icons/filter.svg";
import CASH_CIRCLE_GREEN from "@assets/v2/earnings/icons/cash-circle-green.svg";
import DOWNLOAD from "@assets/v2/common/icons/download.svg";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IEarningsScreenProps {
  style?: CustomStyleProp;
  navigation: any;
}

const EarningsScreen: React.FC<IEarningsScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  /**
   * ? States
   */
  const [activeDateRange, setActiveDateRange] = useState<string>("Today");

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
  const Header = () => (
    <View style={styles.headerContainer}>
      <CASH_GREEN style={styles.cashGreen} />

      <View style={styles.contentContainer}>
        <View>
          <Text h3 color={v2Colors.highlight}>
            Earnings
          </Text>
          <Text h1 color={"white"}>
            $650.00
          </Text>
        </View>

        <TouchableOpacity style={styles.cashoutContainer}>
          <Text bold color={"white"}>
            Cashout
          </Text>
          <View style={{ width: 10 }} />
          <CASH_OUT />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderItem = (props: any) => {
    const { item, index } = props;
    const { title, date, address, earned } = item;
    return (
      <View style={styles.itemContainer}>
        <View style={{ alignItems: "center" }}>
          <CASH_CIRCLE_GREEN style={{ zIndex: 3 }} />
          {index < earnings.length - 1 && <View style={styles.leftContainer} />}
        </View>

        <View>
          <Text h4 bold style={{ marginBottom: 5 }}>
            {title}
          </Text>
          <Text h5 color={v2Colors.highlight} style={{ marginBottom: 5 }}>
            {date}
          </Text>
          <Text h5>{address}</Text>
        </View>

        <Text h3>{earned}</Text>
      </View>
    );
  };

  const ListHeader = () => (
    <View style={styles.listHeaderContainer}>
      {renderListItemHeader("Today")}
      {renderListItemHeader("This Week")}
      {renderListItemHeader("This Month")}

      <TouchableOpacity>
        <FILTER />
      </TouchableOpacity>
    </View>
  );

  const renderListItemHeader = (text: string) => {
    const isActive = activeDateRange === text;

    return (
      <TouchableOpacity
        style={
          isActive
            ? styles.activelistHeaderTextContainer
            : styles.listHeaderTextContainer
        }
        onPress={() => setActiveDateRange(text)}
      >
        <Text color={isActive ? v2Colors.green : v2Colors.highlight}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  };

  const DownloadButton = () => (
    <TouchableOpacity style={styles.downloadButtonContainer}>
      <Text bold color={"white"}>
        Download
      </Text>
      <View style={{ width: 10 }} />
      <DOWNLOAD />
    </TouchableOpacity>
  );

  return (
    <>
      <Header />
      <View style={styles.listContainer}>
        <ListHeader />
        <FlatList
          data={earnings}
          renderItem={(item) => renderItem(item)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
        <DownloadButton />
      </View>
    </>
  );
};

export default EarningsScreen;
