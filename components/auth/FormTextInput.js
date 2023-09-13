import React, { useState } from "react";
import { TextInput, HelperText, Text } from "react-native-paper";

import { View } from "react-native";

const FormTextInput = ({ label, error, ...restProps }) => {
  const [secure, setSecure] = useState(true);

  if (label === "Password") {
    return (
      <View style={{ height: 75 }}>
        <TextInput
          label={label}
          mode="flat"
          error={!!error}
          underlineColor={"#D2DE32"}
          activeUnderlineColor={"#016A70"}
          textColor={"#016A70"}
          autoCapitalize="none"
          secureTextEntry={secure}
          {...restProps}
          right={
            <TextInput.Icon
              icon={secure === true ? "eye" : "eye-off"}
              onPress={() => setSecure(!secure)}
            />
          }
        />
        {error && <HelperText type="error">{error}</HelperText>}
      </View>
    );
  } else if (label === "Confirm Password") {
    return (
      <View style={{ height: 75 }}>
        <TextInput
          label={label}
          mode="flat"
          error={!!error}
          underlineColor={"#D2DE32"}
          activeUnderlineColor={"#016A70"}
          textColor={"#016A70"}
          autoCapitalize="none"
          secureTextEntry={secure}
          {...restProps}
          right={
            <TextInput.Icon
              icon={secure === true ? "eye" : "eye-off"}
              onPress={() => setSecure(!secure)}
            />
          }
        />
        {error && <HelperText type="error">{error}</HelperText>}
      </View>
    );
  } else {
    return (
      <View style={{ height: 75 }}>
        <TextInput
          label={label}
          mode="flat"
          error={!!error}
          underlineColor={"#D2DE32"}
          activeUnderlineColor={"#016A70"}
          textColor={"#016A70"}
         
          
          {...restProps}
        />
        {error && <HelperText type="error">{error}</HelperText>}
      </View>
    );
  }
};

export default FormTextInput;
