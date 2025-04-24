import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { SavedQRCode } from "../types/qr-types";

const STORAGE_KEY = "qr-code-history";
const MAX_STORAGE_SIZE = 5 * 1024 * 1024; 

export const useQRCodeHistory = () => {
  const [history, setHistory] = useState<SavedQRCode[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(
          parsed.map((item: SavedQRCode) => ({
            ...item,
            createdAt: new Date(item.createdAt),
          }))
        );
      } catch (error) {
        console.error("Failed to parse QR code history:", error);
      }
    }
  }, []);

  const saveToHistory = (qrCode: SavedQRCode) => {
    const newHistory = [qrCode, ...history];

    const historyString = JSON.stringify(newHistory);
    if (historyString.length > MAX_STORAGE_SIZE) {
      notifications.show({
        title: "Storage Warning",
        message:
          "History storage is getting full. Consider clearing some old items.",
        color: "yellow",
      });
      return;
    }

    setHistory(newHistory);
    try {
      localStorage.setItem(STORAGE_KEY, historyString);
    } catch (error) {
      console.error("Failed to save to localStorage:", error);
      notifications.show({
        title: "Storage Error",
        message: "Failed to save to history. Storage might be full.",
        color: "red",
      });
    }
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const removeFromHistory = (id: string) => {
    const newHistory = history.filter((item) => item.id !== id);
    setHistory(newHistory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
  };

  return {
    history,
    saveToHistory,
    clearHistory,
    removeFromHistory,
  };
};
