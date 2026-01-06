"use client";

import { Badge } from "@repo/ui/components/badge";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export interface ComponentSpecification {
  id: string;
  name: string;
  productId?: string;
  specs: {
    id: string;
    productId: string;
    componentType: string;
    socketType?: string;
    cores?: number;
    threads?: number;
    baseClock?: number;
    boostClock?: number;
    tdp?: number;
    integratedGraphics?: boolean;
    chipset?: string;
    formFactor?: string;
    memoryType?: string;
    maxMemory?: number;
    memorySlots?: number;
    pciSlots?: number;
    m2Slots?: number;
    sataSlots?: number;
    memoryCapacity?: number;
    memorySpeed?: number;
    memoryLatency?: string;
    gpuChipset?: string;
    vram?: number;
    powerConnectors?: string;
    recommendedPsu?: number;
    slotWidth?: number;
    length?: number;
    storageCapacity?: number;
    storageInterface?: string;
    formFactorStorage?: string;
    readSpeed?: number;
    writeSpeed?: number;
    wattage?: number;
    efficiency?: string;
    modular?: string;
    coolerType?: string;
    maxTdp?: number;
    radiatorSize?: number;
    height?: number;
    maxGpuLength?: number;
    maxCoolerHeight?: number;
    maxPsuLength?: number;
    frontFans?: number;
    topFans?: number;
    rearFans?: number;
    radiatorSupport?: string;
    driveBays25?: number;
    driveBays35?: number;
    fanSize?: number;
    fanRpm?: string;
    noiseLevel?: string;
    createdAt: string;
    updatedAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

const formatComponentType = (type: string | undefined) => {
  if (!type) return "Unknown";
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const renderSpecsSummary = (componentType: string, specs: any) => {
  switch (componentType) {
    case "processor":
      return `${specs.cores || "N/A"}C/${specs.threads || "N/A"}T @ ${specs.baseClock || "N/A"}GHz`;
    case "motherboard":
      return `${specs.socketType?.toUpperCase() || "N/A"} | ${specs.formFactor?.toUpperCase() || "N/A"}`;
    case "memory":
      return `${specs.memoryCapacity || "N/A"}GB ${specs.memoryType?.toUpperCase() || "N/A"} @ ${specs.memorySpeed || "N/A"}MHz`;
    case "graphic_card":
      return `${specs.gpuChipset || "N/A"} | ${specs.vram || "N/A"}GB VRAM`;
    case "ssd_nvme":
    case "hard_disk":
      return `${specs.storageCapacity || "N/A"}GB | ${specs.storageInterface || "N/A"}`;
    case "power_supply":
      return `${specs.wattage || "N/A"}W | ${specs.efficiency || "N/A"}`;
    case "cooler":
      return `${formatComponentType(specs.coolerType || "N/A")} | Max ${specs.maxTdp || "N/A"}W`;
    case "pc_case":
      return `${specs.formFactor?.toUpperCase() || "N/A"} | GPU: ${specs.maxGpuLength || "N/A"}mm`;
    case "fan":
      return `${specs.fanSize || "N/A"}mm | ${specs.fanRpm || "N/A"} RPM`;
    default:
      return "No specs";
  }
};

export const columns: ColumnDef<ComponentSpecification>[] = [
  {
    accessorKey: "specs.componentType",
    header: "Component Type",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary">
          {formatComponentType(row.original.specs?.componentType)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "id",
    header: "Product ID",
    cell: ({ row }) => {
      return (
        <div className="font-mono text-sm text-muted-foreground">
          {row.original.id}
        </div>
      );
    },
  },
  {
    accessorKey: "specs.socketType",
    header: "Socket Type",
    cell: ({ row }) => {
      const socketType = row.original.specs?.socketType;
      return (
        <div className="text-sm">
          {socketType ? (
            <Badge variant="outline">{socketType.toUpperCase()}</Badge>
          ) : (
            <span className="text-muted-foreground">-</span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "specs",
    header: "Specifications Summary",
    cell: ({ row }) => {
      return (
        <div className="max-w-[300px] text-sm">
          {renderSpecsSummary(
            row.original.specs?.componentType || "",
            row.original.specs || {}
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
