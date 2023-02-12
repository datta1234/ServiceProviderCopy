import React, { createRef, memo } from "react";
import { Platform, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

/**
 * ? SVGs
 */
import MAP_PIN from "@assets/v2/common/icons/map-pin.svg";

interface IMapProps {
  region: any;
  onRegionChange: Function;
  onWatchCoords: Function;
  setRegion: Function;
  styles: any;
}

const Map: React.FC<IMapProps> = ({
  region,
  onRegionChange,
  onWatchCoords,
  setRegion,
  styles,
}) => {
  console.log("region:", region);
  /**
   * ? Refs
   */
  const mapRef = createRef<MapView>();

  const MapMarker = memo(() => {
    return (
      <View
        style={{
          left: "50%",
          marginLeft: -24,
          marginTop: -48,
          position: "absolute",
          top: "50%",
        }}
      >
        <MAP_PIN />
      </View>
    );
  });

  return (
    <>
      <MapView
        toolbarEnabled
        provider={PROVIDER_GOOGLE}
        ref={mapRef}
        mapType={"standard"}
        region={region}
        initialRegion={region}
        loadingEnabled={true}
        loadingIndicatorColor={"red"}
        onRegionChangeComplete={async (e, details?: { isGesture: boolean }) => {
          const x = await onRegionChange(e);

          if (details?.isGesture) {
            mapRef.current?.animateToRegion(x, 500);
            onWatchCoords(x.latitude, x.longitude);
            if (Platform.OS === "android") {
              const thisRegion = {
                ...region,
                latitude: x.latitude,
                longitude: x.longitude,
              };
              setRegion(thisRegion);
            }
          }
        }}
        style={[
          styles.mapContainer,
          {
            height: "100%",
            width: "100%",
          },
        ]}
      ></MapView>
      <MapMarker />
    </>
  );
};

export default Map;
