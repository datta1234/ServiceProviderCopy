import { useTheme } from "@react-navigation/native";
import React, { useMemo } from "react";
import { View, TextInput } from "react-native";
import { Controller } from "react-hook-form";

/**
 * ? Local imports
 */
import createStyles from "./style";
import Text from "@shared-components/text-wrapper/TextWrapper";
import { v2Colors } from "@theme/themes";

interface IInputTextWithTitle {
  control: any;
  name: string;
  label: string;
  maxInputLength?: number | undefined;
  autoCorrect?: boolean;
}

const InputTextWithTitle: React.FC<IInputTextWithTitle> = ({
  control,
  name,
  label = "Label",
  maxInputLength = 500,
  autoCorrect = false,
}) => {
  const theme = useTheme();
  const styles = useMemo(() => createStyles(), [theme]);

  return (
    <View style={styles.container}>
      <Text color={v2Colors.green}>{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({
          field: { onChange, onBlur, value },
          fieldState: { error },
        }) => {
          return (
            <>
              <TextInput
                onChangeText={onChange}
                onBlur={onBlur}
                defaultValue={value}
                style={{ color: v2Colors.gray, fontSize: 16 }}
              />
            </>
          );
        }}
      />
    </View>
  );
};

export default InputTextWithTitle;
