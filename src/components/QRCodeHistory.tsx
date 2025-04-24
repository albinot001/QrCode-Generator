import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Pagination,
  ScrollArea,
  Stack,
  Tabs,
  Text,
} from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { ContactData, SavedQRCode, WifiData } from "../types/qr-types";
import { formatDate } from "../utils/date";

interface QRCodeHistoryProps {
  history: SavedQRCode[];
  onSelect: (code: SavedQRCode) => void;
  onClear: () => void;
  onDelete: (id: string) => void;
}

const ITEMS_PER_PAGE = 5;

export function QRCodeHistory({
  history,
  onSelect,
  onClear,
  onDelete,
}: QRCodeHistoryProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"all" | "url" | "wifi">("all");

  const filteredHistory = history.filter((code) => {
    if (activeTab === "all") return true;
    return code.type === activeTab;
  });

  const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleTabChange = (value: string | null) => {
    if (value) {
      setActiveTab(value as "all" | "url" | "wifi");
      setCurrentPage(1);
    }
  };

  const getQRCodeTitle = (code: SavedQRCode) => {
    switch (code.type) {
      case "wifi": {
        const data = code.data as WifiData;
        return `WiFi: ${data.ssid}`;
      }
      case "contact": {
        const data = code.data as ContactData;
        return `Contact: ${data.name}`;
      }
      case "url":
        return `URL: ${code.data as string}`;
      case "text":
        const text = code.data as string;
        return `Text: ${text.substring(0, 30)}${text.length > 30 ? "..." : ""}`;
      default:
        return "QR Code";
    }
  };

  const urlCount = history.filter((code) => code.type === "url").length;
  const wifiCount = history.filter((code) => code.type === "wifi").length;

  return (
    <Stack gap="md">
      <Group justify="space-between">
        <Text fw={500} size="lg">
          History
        </Text>
        {history.length > 0 && (
          <Button variant="subtle" color="red" onClick={onClear} size="sm">
            Clear All
          </Button>
        )}
      </Group>

      {history.length === 0 ? (
        <Text c="dimmed" ta="center" py="xl">
          No QR codes generated yet
        </Text>
      ) : (
        <Stack gap="md">
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tabs.List>
              <Tabs.Tab value="all">
                All
                <Badge ml="xs" size="sm" variant="light">
                  {history.length}
                </Badge>
              </Tabs.Tab>
              <Tabs.Tab value="url">
                URLs
                <Badge ml="xs" size="sm" variant="light">
                  {urlCount}
                </Badge>
              </Tabs.Tab>
              <Tabs.Tab value="wifi">
                WiFi
                <Badge ml="xs" size="sm" variant="light">
                  {wifiCount}
                </Badge>
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>

          <ScrollArea h={400} type="hover">
            <AnimatePresence initial={false}>
              {paginatedHistory.map((code) => (
                <motion.div
                  key={code.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.2 }}
                  style={{ marginBottom: "0.5rem" }}
                  onHoverStart={() => setHoveredId(code.id)}
                  onHoverEnd={() => setHoveredId(null)}
                >
                  <Card
                    shadow="sm"
                    p="sm"
                    withBorder
                    style={{
                      cursor: "pointer",
                      backgroundColor:
                        hoveredId === code.id
                          ? "var(--mantine-color-gray-0)"
                          : undefined,
                    }}
                    onClick={() => onSelect(code)}
                  >
                    <Group justify="space-between" align="center">
                      <Group gap="sm">
                        <Text size="xl">
                          {code.type === "wifi"
                            ? "WiFi"
                            : code.type === "url"
                            ? "URL"
                            : "Text"}
                        </Text>
                        <div>
                          <Text fw={500} size="sm">
                            {getQRCodeTitle(code)}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {formatDate(code.createdAt)}
                          </Text>
                        </div>
                      </Group>
                      <ActionIcon
                        color="red"
                        variant="subtle"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(code.id);
                        }}
                      >
                        Delete
                      </ActionIcon>
                    </Group>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </ScrollArea>

          {totalPages > 1 && (
            <Group justify="center">
              <Pagination
                value={currentPage}
                onChange={setCurrentPage}
                total={totalPages}
                size="sm"
                radius="md"
                withEdges
              />
            </Group>
          )}
        </Stack>
      )}
    </Stack>
  );
}
