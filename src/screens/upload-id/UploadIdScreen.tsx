import {
  View,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "@react-navigation/native";
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from "react-native-image-picker";
import Text from "@shared-components/text-wrapper/TextWrapper";
const DEFAUT_UPLOAD_IMAGE =
  "../../assets/images/defaults/id-default-upload.png";
import DropDownPicker from "react-native-dropdown-picker";
import HeaderContainer from "@shared-components/headers/HeaderContainer";
import { SCREENS } from "@shared-constants";
import createStyles from "./UploadIdScreen.style";
import { useAuth } from "@services/hooks/useAuth";
import { useForm } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";
import FastImage from "react-native-fast-image";
import CommonButton from "@shared-components/buttons/CommonButton";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import * as NavigationService from "react-navigation-helpers";
import InputText from "@shared-components/form/InputText/v2/input-text";
import { v2Colors } from "@theme/themes";

type CustomStyleProp = StyleProp<ViewStyle> | Array<StyleProp<ViewStyle>>;

interface IUploadId {
  style?: CustomStyleProp;
  navigation?: any;
}

interface IIdTypes {
  IdType: string;
  IdDesc: string;
  HasFront: number;
  HasBack: number;
}

const UploadIdScreen: React.FC<IUploadId> = () => {
  // Redux
  const { deviceDetails, serviceProviderId, token } = useSelector(
    (state: RootState) => state.user
  );

  // States
  const [open, setOpen] = useState(false);
  const [idValue, setIdValue] = useState<any>(null);
  const [idData, setIdData] = useState<Array<object>>([]);
  const [idNumber, setIdnumber] = useState<string>("");
  const [uploading, setUploading] = useState<boolean>(false);

  // -- front image
  const [imageName, setImageName] = useState<any>(null);
  const [imageType, setImageType] = useState<any>("");
  const [imageUri, setImageUri] = useState<any>(null);

  // -- back image
  const [backImageName, setBackImageName] = useState<any>(null);
  const [backImageType, setBackImageType] = useState<any>("");
  const [backImageUri, setBackImageUri] = useState<any>("");

  //Constants
  const theme = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const { getIdtypes, uploadServiceProviderId } = useAuth();
  let requirements: IIdTypes = idData.find((x: any) => x.IdType === idValue);

  //Api Methods
  useEffect(() => {
    getIdtypes(
      (data: any) => {
        console.log(data);
        setIdData(data);
      },
      (error) => {
        console.log("error:", error);
      }
    );
  }, []);

  const onUpload = () => {
    // create form data for image get uri, type, fileName
    const values = getValues();
    const { idNumber } = values;
    let request = new FormData();
    request.append("ServiceProviderToken", token);
    request.append("ServiceProviderId", serviceProviderId);
    request.append("IdType", idValue);
    request.append("IdNumber", idNumber);
    request.append("FrontPath", {
      name: imageName,
      type: imageType,
      uri: imageUri,
    });
    request.append("BackPath", null);

    request.append("DeviceDetails.AppVersion", deviceDetails.AppVersion);
    request.append("DeviceDetails.DeviceModel", deviceDetails.DeviceModel);
    request.append("DeviceDetails.DeviceVersion", deviceDetails.DeviceVersion);
    request.append("DeviceDetails.IpAddress", deviceDetails.IpAddress);
    request.append("DeviceDetails.MacAddress", deviceDetails.MacAddress);
    request.append("DeviceDetails.Platform", deviceDetails.Platform);
    request.append("DeviceDetails.PlatformOs", deviceDetails.PlatformOs);

    console.log(request);

    // -- api on backend
    setUploading(true);
    uploadServiceProviderId(
      request,
      (data: any) => {
        if (data.StatusCode === "00") {
          Alert.alert("Success", "Successfully Uploaded Your ID", [
            {
              onPress: () => {
                NavigationService.navigate(SCREENS.ADD_BANK);
                setUploading(false);
              },
              text: "Confirm",
            },
          ]);
          setUploading(false);
        } else {
          Alert.alert("Error", data.StatusMessage);
          setUploading(false);
        }
      },
      (error) => {
        setUploading(false);
        Alert.alert("Error", "Please try again");
      }
    );
  };

  const selectImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      maxWidth: 2000,
      maxHeight: 2000,
      // selectionLimit: 0,
    };
    launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.log(response.assets);

        const name = { fileName: response.assets[0].fileName };
        const type = { type: response.assets[0].type };
        const source = { uri: response.assets[0].uri };

        setImageName(name.fileName);
        setImageType(type.type);
        setImageUri(source.uri);
      }
    });
  };

  const selectBackImage = () => {
    const options: ImageLibraryOptions = {
      mediaType: "photo",
      maxWidth: 2000,
      maxHeight: 2000,
      // selectionLimit: 0,
    };
    launchImageLibrary(options, (response: any) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        const name = { fileName: response.assets[0].fileName };
        const type = { type: response.assets[0].type };
        const source = { uri: response.assets[0].uri };

        setBackImageName(name.fileName);
        setBackImageType(type.type);
        setBackImageUri(source.uri);
      }
    });
  };

  // Forms
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: useMemo(() => {
      return {
        idNumber: idNumber,
      };
    }, []),
  });

  // Local Components
  const UploadFrontImage = () => {
    return (
      <View>
        <TouchableOpacity onPress={selectImage} style={styles.button}>
          <Text color="white">Select Front Id Image</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {imageUri !== null ? (
            <FastImage
              source={{ uri: imageUri }}
              style={styles.imageBox}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : (
            <FastImage
              source={require(DEFAUT_UPLOAD_IMAGE)}
              style={styles.imageBox}
              resizeMode={FastImage.resizeMode.contain}
            />
          )}
        </View>
      </View>
    );
  };
  const UploadBackImage = () => {
    return (
      <View>
        <TouchableOpacity onPress={selectBackImage} style={styles.button}>
          <Text color="white">Select Back Id Image</Text>
        </TouchableOpacity>
        <View style={styles.imageContainer}>
          {backImageUri !== null ? (
            <FastImage
              source={{ uri: backImageUri }}
              style={styles.imageBox}
              resizeMode={FastImage.resizeMode.contain}
            />
          ) : (
            <FastImage
              source={require(DEFAUT_UPLOAD_IMAGE)}
              style={styles.imageBox}
              resizeMode={FastImage.resizeMode.contain}
            />
          )}
        </View>
      </View>
    );
  };

  const UploadSection = () => {
    return (
      <>
        <View style={{ height: 20 }} />
        {requirements.HasFront === 1 && <UploadFrontImage />}
        {requirements.HasBack === 1 && <UploadBackImage />}
      </>
    );
  };

  const SubmitUpload = () => (
    <View style={styles.buttonContainer}>
      <CommonButton
        text={"Submit"}
        style={{ marginVertical: 10, borderRadius: 5 }}
        onPress={handleSubmit(onUpload)}
        isFetching={uploading}
      />
    </View>
  );

  return (
    <>
      <HeaderContainer pageTitle="Upload Id" navigateTo={SCREENS.HOME} />
      <View style={styles.container}>
        <DropDownPicker
          schema={{
            label: "IdDesc",
            value: "IdType",
          }}
          open={open}
          value={idValue}
          items={idData}
          setOpen={setOpen}
          setValue={setIdValue}
          setItems={setIdData}
          style={{
            zIndex: 5,
            borderColor: v2Colors.border,
            height: 60,
          }}
          dropDownContainerStyle={{
            borderColor: v2Colors.border,
          }}
        />
        <View style={{ height: 20 }} />
        <InputText
          keyboardType={"default"}
          control={control}
          name="idNumber"
          label="ID Number"
        />

        <ScrollView
          style={{ marginTop: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {/* <InputText control={control} name='idNumber' label='ID Number' leftIcon={<FastImage source={require(USER)} style={styles.leftIcon} resizeMode={"contain"} />} /> */}

          {requirements !== undefined && <UploadSection />}
        </ScrollView>
        <SubmitUpload />
      </View>
    </>
  );
};

export default UploadIdScreen;
