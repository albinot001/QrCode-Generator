import { Select, Stack, TextInput } from "@mantine/core";
import { WifiData } from "../../types/qr-types";

interface WifiFormProps {
  data: WifiData;
  onChange: (data: WifiData) => void;
}

export function WifiForm({ data, onChange }: WifiFormProps) {
  const handleChange = (field: keyof WifiData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Stack gap="md">
      <TextInput
        label="Network Name (SSID)"
        value={data.ssid}
        onChange={(e) => handleChange("ssid", e.target.value)}
        placeholder="Enter WiFi network name"
      />
      <TextInput
        label="Password"
        type="password"
        value={data.password}
        onChange={(e) => handleChange("password", e.target.value)}
        placeholder="Enter WiFi password"
      />
      <Select
        label="Security"
        value={data.security}
        onChange={(value) =>
          handleChange("security", value as WifiData["security"])
        }
        data={[
          { value: "WPA", label: "WPA/WPA2" },
          { value: "WEP", label: "WEP" },
          { value: "nopass", label: "No Password" },
        ]}
      />
    </Stack>
  );
}
