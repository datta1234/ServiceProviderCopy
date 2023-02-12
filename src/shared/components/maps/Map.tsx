import React, { useMemo, useState, memo } from "react";
import { View, StyleProp, ViewStyle, Dimensions } from "react-native";
import { useTheme } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Icon from "react-native-dynamic-vector-icons";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import FastImage from "react-native-fast-image";

/**
 * ? Local imports
 */
import createStyles from "./Map.style";

/**
 * ? Constants
 */
const PHONE = "../../../assets/icons/gray/phone.png";

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const GOOGLE_PLACES_API_KEY = "AIzaSyAQ_Hd8-sh8uM6rufkNrkvABip3292UoXs";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface ISearchableMapProps {
  style?: CustomStyleProp;
  height?: string | number;
  width?: string | number;
  mapHeight?: string | number;
  mapWidth?: string | number;
}

const SearchableMap: React.FC<ISearchableMapProps> = ({
  height = "100%",
  width = "100%",
  mapHeight = "50%",
  mapWidth = "50%",
  style,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [lat, setLat] = useState<number>(-33.80825);
  const [lng, setLng] = useState<number>(151.00502);

  const [URL, SetURL] = useState<string>("");
  const [desc, setDesc] = useState<string>("");

  const mapStyle = [
    {
      elementType: "geometry",
      stylers: [
        {
          color: "#f5f5f5",
        },
      ],
    },
    {
      elementType: "labels.icon",
      stylers: [
        {
          visibility: "off",
        },
      ],
    },
    {
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#616161",
        },
      ],
    },
    {
      elementType: "labels.text.stroke",
      stylers: [
        {
          color: "#f5f5f5",
        },
      ],
    },
    {
      featureType: "administrative.land_parcel",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#bdbdbd",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "geometry",
      stylers: [
        {
          color: "#eeeeee",
        },
      ],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [
        {
          color: "#e5e5e5",
        },
      ],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#9e9e9e",
        },
      ],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [
        {
          color: "#ffffff",
        },
      ],
    },
    {
      featureType: "road.arterial",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#757575",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [
        {
          color: "#dadada",
        },
      ],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#616161",
        },
      ],
    },
    {
      featureType: "road.local",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#9e9e9e",
        },
      ],
    },
    {
      featureType: "transit.line",
      elementType: "geometry",
      stylers: [
        {
          color: "#e5e5e5",
        },
      ],
    },
    {
      featureType: "transit.station",
      elementType: "geometry",
      stylers: [
        {
          color: "#eeeeee",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [
        {
          color: "#c9c9c9",
        },
      ],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [
        {
          color: "#9e9e9e",
        },
      ],
    },
  ];

  /**
   * ? Functions
   */

  const handleRegionChange = (mapData: any) => {
    setLat(mapData.latitude);
    setLng(mapData.longitude);
  };

  /* -------------------------------------------------------------------------- */
  /*                               Render Methods                               */
  /* -------------------------------------------------------------------------- */
  const GooglePlacesInput = () => {
    return (
      <View
        style={[
          styles.searchInputContainer,
          { height, width, marginBottom: -height * 0.6 },
        ]}
      >
        <GooglePlacesAutocomplete
          placeholder="Select Property"
          onPress={(data, details = null) => {
            const newLat: number = Number(details?.geometry.location.lat);
            const newLng: number = Number(details?.geometry.location.lng);
            const newUrl: string = details?.url || "";

            // setLat(newLat);
            // setLng(newLng);

            // setDesc(data.description);
            // SetURL(newUrl);
          }}
          query={{
            key: GOOGLE_PLACES_API_KEY,
            language: "en",
          }}
          fetchDetails
          enableHighAccuracyLocation
          keepResultsAfterBlur={true}
          renderLeftButton={() => (
            <FastImage
              source={require(PHONE)}
              // style={styles.leftIcon}
              resizeMode={"contain"}
            />
          )}
          renderRightButton={() => {
            return (
              <FastImage
                source={require(PHONE)}
                // style={styles.leftIcon}
                resizeMode={"contain"}
              />
            );
          }}
          styles={{
            textInput: {
              height: 50,
              //   color: "white",
              fontSize: 16,
              //   backgroundColor: "grey",
              borderColor: "rgba(0,0,0,0.05)",
            },
          }}
          textInputProps={
            {
              // placeholderTextColor: "white",
            }
          }
        />
      </View>
    );
  };

  const MapMarker = memo(() => {
    return (
      <Marker
        title={desc}
        coordinate={{ latitude: lat, longitude: lng }}
        key={"1"}
      >
        <Icon name="location-sharp" type="Ionicons" color={"red"} size={30} />
      </Marker>
    );
  });

  const Map = memo(() => {
    return (
      <MapView
        key={1}
        toolbarEnabled
        mapType="standard"
        // provider={PROVIDER_GOOGLE}
        customMapStyle={mapStyle}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.0043,
          longitudeDelta: 0.0043 * ASPECT_RATIO,
        }}
        // onRegionChangeComplete={handleRegionChange}
        style={[
          styles.mapContainer,
          {
            height: mapHeight,
            width: mapWidth,
          },
        ]}
        // liteMode
        // loadingEnabled
        // loadingIndicatorColor="#666666"
        // loadingBackgroundColor="#eeeeee"
        scrollEnabled={false}
        rotateEnabled={true}
        showsUserLocation={true}
        // followUserLocation={true}
        zoomEnabled={true}
        zoomControlEnabled={true}
      >
        <MapMarker />
      </MapView>
    );
  });

  return (
    <View style={[styles.container, style]}>
      {/* <GooglePlacesInput /> */}
      <Map />
    </View>
  );
};

export default memo(SearchableMap);
