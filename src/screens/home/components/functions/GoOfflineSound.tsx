import React from "react";
var Sound = require("react-native-sound");

class GoOfflineSound extends React.PureComponent<any> {
  render() {
    const { play, setPlayOfflineSound } = this.props;
    Sound.setCategory("Playback");

    var goOffline = new Sound(
      "go_offline.mp4",
      Sound.MAIN_BUNDLE,
      (error: any) => {
        if (error) {
          console.log("failed to load the sound", error);
          return;
        }
        // loaded successfully
        console.log(
          "duration in seconds: " +
            goOffline.getDuration() +
            "number of channels: " +
            goOffline.getNumberOfChannels()
        );

        // Play the sound with an onEnd callback
        play &&
          goOffline.play((success: any) => {
            if (success) {
              console.log("successfully finished playing");
              setPlayOfflineSound(false);
            } else {
              console.log("playback failed due to audio decoding errors");
              setPlayOfflineSound(false);
            }
          });
      }
    );

    goOffline.setVolume(0.8);

    !play && goOffline.release();

    return null;
  }
}

export default GoOfflineSound;
