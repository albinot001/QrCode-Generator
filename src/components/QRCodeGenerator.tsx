import {
  ActionIcon,
  Box,
  Button,
  ColorInput,
  Container,
  Divider,
  Group,
  Menu,
  Paper,
  Slider,
  Stack,
  Tabs,
  Text,
  TextInput,
  Title,
  Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { AnimatePresence, motion } from "framer-motion";
import { QRCodeCanvas, QRCodeSVG } from "qrcode.react";
import { useRef, useState } from "react";
import { useQRCodeHistory } from "../hooks/useQRCodeHistory";
import { QRCodeType, SavedQRCode, WifiData } from "../types/qr-types";
import { LogoUpload } from "./LogoUpload";
import { QRCodeHistory } from "./QRCodeHistory";
import { WifiForm } from "./qr-types/WifiForm";

const QRCodeGenerator = () => {
  const [url, setUrl] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [qrSize, setQrSize] = useState(256);
  const [activeTab, setActiveTab] = useState<"url" | "wifi">("url");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [wifiData, setWifiData] = useState<WifiData>({
    ssid: "",
    password: "",
    security: "WPA",
  });
  const { history, saveToHistory, clearHistory, removeFromHistory } =
    useQRCodeHistory();
  const qrRef = useRef<HTMLDivElement>(null);

  const generateId = () =>
    `qr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const getQRCodeValue = () => {
    if (activeTab === "url") {
      return url;
    } else {
      const { ssid, password, security } = wifiData;
      return `WIFI:T:${security};S:${ssid};P:${password};;`;
    }
  };

  const handleGenerateQRCode = () => {
    const value = getQRCodeValue();
    if (value) {
      const newQRCode: SavedQRCode = {
        id: generateId(),
        type: activeTab as QRCodeType,
        data: activeTab === "url" ? value : wifiData,
        style: {
          dotColor: qrColor,
          backgroundColor: "#FFFFFF",
          logo: logoUrl || undefined,
        },
        createdAt: new Date().toISOString(),
      };
      saveToHistory(newQRCode);
    }
  };

  const downloadQRCode = (format: "png" | "jpg" | "svg") => {
    const value = getQRCodeValue();
    if (!value) {
      notifications.show({
        title: "Error",
        message:
          activeTab === "url"
            ? "Please enter a URL first"
            : "Please fill in the WiFi details",
        color: "red",
      });
      return;
    }

    if (format === "svg") {
      // Handle SVG download
      const svgElement = qrRef.current?.querySelector("svg");
      if (svgElement) {
        const svgData = new XMLSerializer().serializeToString(svgElement);
        const svgBlob = new Blob([svgData], {
          type: "image/svg+xml;charset=utf-8",
        });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(svgBlob);
        link.download = `qrcode.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
    } else {
      // Handle PNG/JPG download
      const canvas = qrRef.current?.querySelector("canvas");
      if (canvas) {
        const imageType = format === "png" ? "image/png" : "image/jpeg";
        const dataUrl = canvas.toDataURL(imageType, 1.0);
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `qrcode.${format}`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }

    notifications.show({
      title: "Success",
      message: `QR Code downloaded as ${format.toUpperCase()}!`,
      color: "green",
    });

    handleGenerateQRCode();
  };

  const copyToClipboard = async () => {
    const value = getQRCodeValue();
    if (!value) {
      notifications.show({
        title: "Error",
        message:
          activeTab === "url"
            ? "Please enter a URL first"
            : "Please fill in the WiFi details",
        color: "red",
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(value);
      notifications.show({
        title: "Success",
        message: "QR Code data copied to clipboard!",
        color: "green",
      });
      handleGenerateQRCode();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to copy QR Code data",
        color: "red",
      });
    }
  };

  const shareQRCode = async () => {
    const value = getQRCodeValue();
    if (!value) {
      notifications.show({
        title: "Error",
        message:
          activeTab === "url"
            ? "Please enter a URL first"
            : "Please fill in the WiFi details",
        color: "red",
      });
      return;
    }

    try {
      await navigator.share({
        title: "Share QR Code",
        text: "Check out this QR Code!",
        url: value,
      });
      handleGenerateQRCode();
    } catch (err) {
      notifications.show({
        title: "Error",
        message: "Failed to share QR Code",
        color: "red",
      });
    }
  };

  const handleHistorySelect = (code: SavedQRCode) => {
    if (code.type === "url") {
      setActiveTab("url");
      setUrl(code.data as string);
      setQrColor(code.style?.dotColor || "#000000");
      setLogoUrl(code.style?.logo || null);
    } else if (code.type === "wifi") {
      setActiveTab("wifi");
      setWifiData(code.data as WifiData);
      setQrColor(code.style?.dotColor || "#000000");
      setLogoUrl(code.style?.logo || null);
    }
  };

  const isFormValid = () => {
    if (activeTab === "url") {
      return !!url;
    } else {
      return (
        !!wifiData.ssid &&
        (wifiData.security === "nopass" || !!wifiData.password)
      );
    }
  };

  return (
    <Container size="sm" py="xl">
      <Stack gap="xl">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title order={1} ta="center" mb="xl">
            QR Code Generator
          </Title>
        </motion.div>

        <Tabs
          value={activeTab}
          onChange={(value) => setActiveTab(value as "url" | "wifi")}
        >
          <Tabs.List>
            <Tabs.Tab value="url">URL</Tabs.Tab>
            <Tabs.Tab value="wifi">WiFi</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="url">
            <TextInput
              label="Enter URL"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              size="md"
              mt="md"
            />
          </Tabs.Panel>

          <Tabs.Panel value="wifi">
            <Box mt="md">
              <WifiForm data={wifiData} onChange={setWifiData} />
            </Box>
          </Tabs.Panel>
        </Tabs>

        <Divider label="Style Options" labelPosition="center" />

        <Group grow>
          <ColorInput
            label="QR Code Color"
            value={qrColor}
            onChange={setQrColor}
            withEyeDropper
          />
        </Group>

        <Stack gap="xs">
          <Text size="sm">QR Code Size</Text>
          <Slider
            value={qrSize}
            onChange={setQrSize}
            min={128}
            max={512}
            step={32}
            label={(value) => `${value}px`}
            marks={[
              { value: 128, label: "128px" },
              { value: 256, label: "256px" },
              { value: 512, label: "512px" },
            ]}
          />
        </Stack>

        <LogoUpload onLogoChange={setLogoUrl} />

        <AnimatePresence>
          {isFormValid() && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
              ref={qrRef}
            >
              <Paper
                shadow="md"
                p="md"
                withBorder
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "white",
                }}
              >
                <QRCodeSVG
                  value={getQRCodeValue()}
                  size={qrSize}
                  level="H"
                  includeMargin
                  fgColor={qrColor}
                  imageSettings={
                    logoUrl
                      ? {
                          src: logoUrl,
                          height: qrSize * 0.2,
                          width: qrSize * 0.2,
                          excavate: true,
                        }
                      : undefined
                  }
                />
                {/* Hidden canvas for PNG/JPG downloads */}
                <div style={{ display: "none" }}>
                  <QRCodeCanvas
                    value={getQRCodeValue()}
                    size={qrSize}
                    level="H"
                    includeMargin
                    fgColor={qrColor}
                    imageSettings={
                      logoUrl
                        ? {
                            src: logoUrl,
                            height: qrSize * 0.2,
                            width: qrSize * 0.2,
                            excavate: true,
                          }
                        : undefined
                    }
                  />
                </div>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

        <Group justify="center" gap="sm">
          <Menu>
            <Menu.Target>
              <Button variant="filled" color="blue" disabled={!isFormValid()}>
                Download
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={() => downloadQRCode("png")}>
                Download as PNG
              </Menu.Item>
              <Menu.Item onClick={() => downloadQRCode("jpg")}>
                Download as JPG
              </Menu.Item>
              <Menu.Item onClick={() => downloadQRCode("svg")}>
                Download as SVG
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Tooltip label="Copy URL">
            <ActionIcon
              variant="filled"
              size="xl"
              color="green"
              onClick={copyToClipboard}
              disabled={!url}
            >
              Copy
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Share">
            <ActionIcon
              variant="filled"
              size="xl"
              color="grape"
              onClick={shareQRCode}
              disabled={!url}
            >
              Share
            </ActionIcon>
          </Tooltip>
        </Group>

        <QRCodeHistory
          history={history}
          onSelect={handleHistorySelect}
          onClear={clearHistory}
          onDelete={removeFromHistory}
        />
      </Stack>
    </Container>
  );
};

export default QRCodeGenerator;
