"use client";

import { Badge } from "@repo/ui/components/badge";
import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

export interface CompatibilityRule {
  id: string;
  name: string;
  description?: string;
  ruleType: string;
  primaryComponent: string;
  secondaryComponent?: string;
  ruleDefinition: {
    condition: string;
    parameters: Record<string, any>;
    errorMessage?: string;
    warningMessage?: string;
  };
  severity: "error" | "warning" | "info";
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
  maxGpuLength?: number;
  maxCoolerHeight?: number;
  maxPsuLength?: number;
  frontFans?: number;
  topFans?: number;
}

const formatComponentType = (type: string | undefined) => {
  if (!type) return "Unknown";
  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const columns: ColumnDef<CompatibilityRule>[] = [
  {
    accessorKey: "name",
    header: "Rule Name",
    cell: ({ row }) => {
      return (
        <div className="font-medium max-w-[200px] truncate">
          {row.original.name}
        </div>
      );
    },
  },
  {
    accessorKey: "ruleType",
    header: "Type",
    cell: ({ row }) => {
      return (
        <Badge variant="outline" className="capitalize">
          {row.original.ruleType.replace(/_/g, " ")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "primaryComponent",
    header: "Primary Component",
    cell: ({ row }) => {
      return (
        <Badge variant="secondary">
          {formatComponentType(row.original.primaryComponent)}
        </Badge>
      );
    },
  },
  {
    accessorKey: "secondaryComponent",
    header: "Secondary Component",
    cell: ({ row }) => {
      const secondary = row.original.secondaryComponent;
      return secondary ? (
        <Badge variant="secondary">{formatComponentType(secondary)}</Badge>
      ) : (
        <span className="text-muted-foreground">-</span>
      );
    },
  },
  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => {
      const severity = row.original.severity;
      const variant =
        severity === "error"
          ? "destructive"
          : severity === "warning"
            ? "default"
            : "secondary";
      return (
        <Badge variant={variant} className="capitalize">
          {severity}
        </Badge>
      );
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      return row.original.isActive ? (
        <Badge variant="default">Active</Badge>
      ) : (
        <Badge variant="outline">Inactive</Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      return <div className="text-center">{row.original.priority}</div>;
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
