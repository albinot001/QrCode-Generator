export interface WifiData {
  ssid: string;
  password: string;
  security: "WPA" | "WEP" | "nopass";
}

export interface ContactData {
  name: string;
  phone: string;
  email: string;
  organization?: string;
}

export interface QRCodeStyle {
  logo?: string;
  dotColor?: string;
  backgroundColor?: string;
  cornerSquareColor?: string;
  cornerDotColor?: string;
}

export type QRCodeType = "wifi" | "contact" | "text" | "url";

export interface QRCodeData {
  type: QRCodeType;
  data: string | WifiData | ContactData;
  createdAt: Date;
  style?: {
    fgColor: string;
    bgColor: string;
    size: number;
    logo?: string;
  };
}

export interface SavedQRCode {
  id: string;
  type: QRCodeType;
  data: WifiData | ContactData | string;
  style?: QRCodeStyle;
  createdAt: string;
}
