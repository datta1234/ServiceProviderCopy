import React, {
  useEffect,
  useMemo,
  useState,
  createRef,
  useRef,
  useCallback,
} from "react";
import { View, StyleProp, ViewStyle, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import RNLocation from "react-native-location";
import { useDispatch } from "react-redux";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView from "react-native-maps";
import Geocoder from "react-native-geocoding";
import BottomSheet from "@gorhom/bottom-sheet";
import Map from "../components/map";

/**
 * ? Local imports
 */
import createStyles from "./SetLocation.style";
import { SCREENS } from "@shared-constants";
import HeaderContainer from "@shared-components/headers/HeaderContainer";
import CommonButton from "@shared-components/buttons/CommonButton";
import InputTextNoControl from "@shared-components/form/InputText/v2/input-text-no-control";

import { userActions } from "@services/states/user/user.slice";

/**
 * ? SVGs
 */
import TARGET from "@assets/v2/common/icons/target.svg";
import { v2Colors } from "@theme/themes";

/**
 * ? Constants
 */
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const GOOGLE_PLACES_API_KEY = "AIzaSyAQ_Hd8-sh8uM6rufkNrkvABip3292UoXs";
const INITIAL_REGION = {
  latitude: 14.5995,
  longitude: 120.9842,
  latitudeDelta: 0.0043,
  longitudeDelta: 0.0043 * ASPECT_RATIO,
};

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ILocatePropertyAddress {
  style?: CustomStyleProp;
  navigation: any;
}

const LocatePropertyAddress: React.FC<ILocatePropertyAddress> = ({
  navigation,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const dispatch = useDispatch();
  const { onSetAddress, onSetAddressAlias, onSetGeometry } = userActions;

  Geocoder.init(GOOGLE_PLACES_API_KEY);

  /**
   * ? States
   */
  const [region, setRegion] = useState<any>(INITIAL_REGION);

  const [URL, SetURL] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  // ? bottom sheet handlers
  const [i, setI] = useState<number>(0);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["25%", "80%"], []);
  const handleSheetChanges = useCallback((index: number) => {
    setI(() => index);
  }, []);

  /**
   * ? On Mount
   */
  useEffect(() => {
    getCurrentLocation();
  }, []);

  /**
   * ? Functions
   */
  const getCurrentLocation = async () => {
    let permission = await RNLocation.checkPermission({
      ios: "whenInUse", // or 'always'
      android: {
        detail: "coarse", // or 'fine'
      },
    });

    let location: any;

    if (!permission) {
      permission = await RNLocation.requestPermission({
        ios: "whenInUse",
        android: {
          detail: "coarse",
          rationale: {
            title: "We need to access your location",
            message: "We use your location to show where you are on the map",
            buttonPositive: "OK",
            buttonNegative: "Cancel",
          },
        },
      });
      location = await RNLocation.getLatestLocation({ timeout: 100 });
    } else {
      location = await RNLocation.getLatestLocation({ timeout: 100 });
      onWatchCoords(location.latitude, location.longitude);

      const thisRegion = {
        ...region,
        laititude: location.latitude,
        longitude: location.longitude,
      };
      setRegion(thisRegion);
    }
  };

  const onRegionChange = async (thisRegion: any) => {
    return thisRegion;
  };

  const onWatchCoords = (thisLat: number, thisLng: number) => {
    Geocoder.from({
      latitude: thisLat,
      longitude: thisLng,
    })
      .then((json) => {
        const formattedAddress = json.results[0].formatted_address;
        setDesc(formattedAddress);
        const addressComponent = json.results[0].address_components;
        onDispatchAddressComponent(addressComponent);
      })
      .catch((error) => console.log(error));
  };

  const onDispatchAddressComponent = (addressComponent: any) => {
    dispatch(
      onSetAddress({
        Country: addressComponent[5]?.long_name || "Empty",
        Province: addressComponent[4]?.long_name || "Empty",
        City: addressComponent[3]?.long_name || "Empty",
        StreetName: addressComponent[1]?.long_name || "Empty",
        StreetNumber: addressComponent[0]?.long_name || "Empty",
        PostalCode: addressComponent[6]?.long_name || "Empty",
        Address1: "Empty",
        Address2: "Empty",
        StreetType: "Empty",
      })
    );
  };

  const _clearAddress = () => {
    setI(1);
    setDesc("");
  };

  const navigateBackto = () => {
    dispatch(onSetAddressAlias(desc));
    dispatch(
      onSetGeometry({
        Latitude: region.latitude.toString(),
        Longitude: region.longitude.toString(),
      })
    );
    navigation.navigate(SCREENS.SIGNUP);
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */

  const GooglePlacesInput = () => {
    return (
      <>
        <View style={{ height, width: width * 0.92, marginTop: 5 }}>
          <GooglePlacesAutocomplete
            placeholder="Select Property"
            onPress={(data, details = null) => {
              const newLat: number = Number(details?.geometry.location.lat);
              const newLng: number = Number(details?.geometry.location.lng);
              const newUrl: string = details?.url || "";

              dispatch(
                onSetGeometry({
                  Latitude: newLat.toString() || region.latitude,
                  Longitude: newLng.toString() || region.longitude,
                })
              );
              const thisRegion = {
                ...region,
                latitude: newLat || region.latitude,
                longitude: newLng || region.longitude,
              };
              setRegion(thisRegion);

              Geocoder.from({
                latitude: newLat,
                longitude: newLng,
              })
                .then((json: any) => {
                  var addressComponent = json.results[0].address_components;
                  onDispatchAddressComponent(addressComponent);
                })
                .catch((error: any) => console.log(error));

              setDesc(data.description);
              setI(() => 0);
              SetURL(newUrl);
            }}
            query={{
              key: GOOGLE_PLACES_API_KEY,
              language: "en",
            }}
            fetchDetails
            enableHighAccuracyLocation
            keepResultsAfterBlur={true}
            keyboardShouldPersistTaps={"never"}
            styles={{
              textInput: {
                height: 60,
                fontSize: 16,
                borderColor: v2Colors.border,
                borderWidth: 1,
                backgroundColor: "white",

                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 2,
                },
                shadowOpacity: 0.23,
                shadowRadius: 2.62,

                elevation: 4,
              },
            }}
          />
        </View>
      </>
    );
  };

  const ConfirmButton = () => {
    return (
      <View
        style={{ height, width: width * 0.92, marginTop: 10, marginBottom: 20 }}
      >
        <CommonButton
          style={{ borderRadius: 5 }}
          text="Confirm"
          onPress={navigateBackto}
        />
      </View>
    );
  };

  const AddressInput = () => {
    return (
      <InputTextNoControl
        value={desc}
        setValue={setDesc}
        label="Enter Address"
        rightIcon={<TARGET height={20} width={20} />}
        onFocus={_clearAddress}
        contentContainerStyle={{ width: width * 0.92 }}
      />
    );
  };

  return (
    <View style={styles.container}>
      <HeaderContainer pageTitle="Set Address" navigateTo={SCREENS.SIGNUP} />
      <Map
        region={region}
        onRegionChange={onRegionChange}
        onWatchCoords={onWatchCoords}
        setRegion={setRegion}
        styles={styles}
      />

      <BottomSheet
        ref={bottomSheetRef}
        index={i}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enableOverDrag={false}
      >
        <View style={styles.bottomSheetContainer}>
          {!i ? (
            <>
              <View style={{ marginTop: 10 }}>
                <AddressInput />
                <View style={{ height: 15 }} />
                <ConfirmButton />
              </View>
            </>
          ) : (
            <GooglePlacesInput />
          )}
        </View>
      </BottomSheet>
    </View>
  );
};

export default LocatePropertyAddress;
