import { Group, Image, Text, rem } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useState } from "react";

interface LogoUploadProps {
  onLogoChange: (logoUrl: string) => void;
}


export function LogoUpload({ onLogoChange }: LogoUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const handleDrop = (files: FileWithPath[]) => {
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setPreview(dataUrl);
        onLogoChange(dataUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <Text size="sm" mb="xs">
        Logo Overlay (Optional)
      </Text>
      <Dropzone
        onDrop={handleDrop}
        accept={IMAGE_MIME_TYPE}
        maxSize={5 * 1024 * 1024} 
        maxFiles={1}
        style={{ width: "100%" }}
      >
        <Group
          justify="center"
          gap="xl"
          style={{ minHeight: rem(100), pointerEvents: "none" }}
        >
          {preview ? (
            <Image
              src={preview}
              alt="Logo preview"
              w={80}
              h={80}
              fit="contain"
            />
          ) : (
            <div style={{ textAlign: "center" }}>
              <Text size="sm" c="dimmed" inline mt={7}>
                Drag a logo image here or click to select
              </Text>
              <Text size="xs" c="dimmed" inline mt={5}>
                PNG or JPG, max 5MB
              </Text>
            </div>
          )}
        </Group>
      </Dropzone>
    </div>
  );
}
