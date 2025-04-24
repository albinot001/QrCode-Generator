import { Stack, TextInput } from "@mantine/core";
import { ContactData } from "../../types/qr-types";

interface ContactFormProps {
  data: ContactData;
  onChange: (data: ContactData) => void;
}

export function ContactForm({ data, onChange }: ContactFormProps) {
  const handleChange = (field: keyof ContactData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Stack gap="md">
      <TextInput
        label="Name"
        value={data.name}
        onChange={(e) => handleChange("name", e.target.value)}
        placeholder="Enter full name"
      />
      <TextInput
        label="Phone"
        value={data.phone}
        onChange={(e) => handleChange("phone", e.target.value)}
        placeholder="Enter phone number"
      />
      <TextInput
        label="Email"
        type="email"
        value={data.email}
        onChange={(e) => handleChange("email", e.target.value)}
        placeholder="Enter email address"
      />
      <TextInput
        label="Organization (Optional)"
        value={data.organization || ""}
        onChange={(e) => handleChange("organization", e.target.value)}
        placeholder="Enter organization name"
      />
    </Stack>
  );
}
