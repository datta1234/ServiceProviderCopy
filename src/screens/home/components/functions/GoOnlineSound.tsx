import React from "react";
var Sound = require("react-native-sound");

class GoOnlineSound extends React.PureComponent<any> {
  render() {
    const { play, setPlayOnlineSound } = this.props;
    Sound.setCategory("Playback");

    var goOnline = new Sound(
      "go_online.mp4",
      Sound.MAIN_BUNDLE,
      (error: any) => {
        if (error) {
          console.log("failed to load the sound", error);
          return;
        }
        // loaded successfully
        console.log(
          "duration in seconds: " +
            goOnline.getDuration() +
            "number of channels: " +
            goOnline.getNumberOfChannels()
        );

        // Play the sound with an onEnd callback
        play &&
          goOnline.play((success: any) => {
            if (success) {
              console.log("successfully finished playing");
              setPlayOnlineSound(false);
            } else {
              console.log("playback failed due to audio decoding errors");
              setPlayOnlineSound(false);
            }
          });
      }
    );

    goOnline.setVolume(0.8);

    !play && goOnline.release();

    return null;
  }
}

export default GoOnlineSound;
