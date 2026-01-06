"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Pencil, Trash2 } from "lucide-react";

interface SpecificationCardProps {
  specification: any;
  onEdit?: (spec: any) => void;
  onDelete?: (id: string) => void;
}

export function SpecificationCard({
  specification,
  onEdit,
  onDelete,
}: SpecificationCardProps) {
  const { id, componentType, productId, specs } = specification;

  const formatComponentType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderProcessorSpecs = () => (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {specs.socketType && (
        <div>
          <span className="font-medium">Socket:</span>{" "}
          {specs.socketType.toUpperCase()}
        </div>
      )}
      {specs.cores && (
        <div>
          <span className="font-medium">Cores:</span> {specs.cores}
        </div>
      )}
      {specs.threads && (
        <div>
          <span className="font-medium">Threads:</span> {specs.threads}
        </div>
      )}
      {specs.baseClock && (
        <div>
          <span className="font-medium">Base Clock:</span> {specs.baseClock} GHz
        </div>
      )}
      {specs.boostClock && (
        <div>
          <span className="font-medium">Boost Clock:</span> {specs.boostClock}{" "}
          GHz
        </div>
      )}
      {specs.tdp && (
        <div>
          <span className="font-medium">TDP:</span> {specs.tdp}W
        </div>
      )}
      {specs.integratedGraphics !== undefined && (
        <div>
          <span className="font-medium">iGPU:</span>{" "}
          {specs.integratedGraphics ? "Yes" : "No"}
        </div>
      )}
    </div>
  );

  const renderMotherboardSpecs = () => (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {specs.socketType && (
        <div>
          <span className="font-medium">Socket:</span>{" "}
          {specs.socketType.toUpperCase()}
        </div>
      )}
      {specs.chipset && (
        <div>
          <span className="font-medium">Chipset:</span> {specs.chipset}
        </div>
      )}
      {specs.formFactor && (
        <div>
          <span className="font-medium">Form Factor:</span>{" "}
          {specs.formFactor.toUpperCase()}
        </div>
      )}
      {specs.memoryType && (
        <div>
          <span className="font-medium">Memory Type:</span>{" "}
          {specs.memoryType.toUpperCase()}
        </div>
      )}
      {specs.maxMemory && (
        <div>
          <span className="font-medium">Max Memory:</span> {specs.maxMemory}GB
        </div>
      )}
      {specs.memorySlots && (
        <div>
          <span className="font-medium">Memory Slots:</span> {specs.memorySlots}
        </div>
      )}
    </div>
  );

  const renderMemorySpecs = () => (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {specs.memoryType && (
        <div>
          <span className="font-medium">Type:</span>{" "}
          {specs.memoryType.toUpperCase()}
        </div>
      )}
      {specs.memoryCapacity && (
        <div>
          <span className="font-medium">Capacity:</span> {specs.memoryCapacity}
          GB
        </div>
      )}
      {specs.memorySpeed && (
        <div>
          <span className="font-medium">Speed:</span> {specs.memorySpeed} MHz
        </div>
      )}
      {specs.memoryLatency && (
        <div>
          <span className="font-medium">Latency:</span> {specs.memoryLatency}
        </div>
      )}
    </div>
  );

  const renderGraphicsCardSpecs = () => (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {specs.gpuChipset && (
        <div>
          <span className="font-medium">GPU:</span> {specs.gpuChipset}
        </div>
      )}
      {specs.vram && (
        <div>
          <span className="font-medium">VRAM:</span> {specs.vram}GB
        </div>
      )}
      {specs.powerConnectors && (
        <div>
          <span className="font-medium">Power:</span> {specs.powerConnectors}
        </div>
      )}
      {specs.recommendedPsu && (
        <div>
          <span className="font-medium">Recommended PSU:</span>{" "}
          {specs.recommendedPsu}W
        </div>
      )}
      {specs.length && (
        <div>
          <span className="font-medium">Length:</span> {specs.length}mm
        </div>
      )}
    </div>
  );

  const renderStorageSpecs = () => (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {specs.storageCapacity && (
        <div>
          <span className="font-medium">Capacity:</span> {specs.storageCapacity}
          GB
        </div>
      )}
      {specs.storageInterface && (
        <div>
          <span className="font-medium">Interface:</span>{" "}
          {specs.storageInterface}
        </div>
      )}
      {specs.formFactorStorage && (
        <div>
          <span className="font-medium">Form Factor:</span>{" "}
          {specs.formFactorStorage}
        </div>
      )}
      {specs.readSpeed && (
        <div>
          <span className="font-medium">Read Speed:</span> {specs.readSpeed}{" "}
          MB/s
        </div>
      )}
      {specs.writeSpeed && (
        <div>
          <span className="font-medium">Write Speed:</span> {specs.writeSpeed}{" "}
          MB/s
        </div>
      )}
    </div>
  );

  const renderPowerSupplySpecs = () => (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {specs.wattage && (
        <div>
          <span className="font-medium">Wattage:</span> {specs.wattage}W
        </div>
      )}
      {specs.efficiency && (
        <div>
          <span className="font-medium">Efficiency:</span> {specs.efficiency}
        </div>
      )}
      {specs.modular && (
        <div>
          <span className="font-medium">Modular:</span> {specs.modular}
        </div>
      )}
    </div>
  );

  const renderCoolerSpecs = () => (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {specs.coolerType && (
        <div>
          <span className="font-medium">Type:</span>{" "}
          {formatComponentType(specs.coolerType)}
        </div>
      )}
      {specs.maxTdp && (
        <div>
          <span className="font-medium">Max TDP:</span> {specs.maxTdp}W
        </div>
      )}
      {specs.radiatorSize && (
        <div>
          <span className="font-medium">Radiator:</span> {specs.radiatorSize}mm
        </div>
      )}
      {specs.height && (
        <div>
          <span className="font-medium">Height:</span> {specs.height}mm
        </div>
      )}
    </div>
  );

  const renderCaseSpecs = () => (
    <div className="grid grid-cols-2 gap-2 text-sm">
      {specs.formFactor && (
        <div>
          <span className="font-medium">Form Factor:</span>{" "}
          {specs.formFactor.toUpperCase()}
        </div>
      )}
      {specs.maxGpuLength && (
        <div>
          <span className="font-medium">Max GPU Length:</span>{" "}
          {specs.maxGpuLength}mm
        </div>
      )}
      {specs.maxCoolerHeight && (
        <div>
          <span className="font-medium">Max Cooler Height:</span>{" "}
          {specs.maxCoolerHeight}mm
        </div>
      )}
      {specs.radiatorSupport && (
        <div className="col-span-2">
          <span className="font-medium">Radiator Support:</span>{" "}
          {specs.radiatorSupport}
        </div>
      )}
    </div>
  );

  const renderSpecs = () => {
    switch (componentType) {
      case "processor":
        return renderProcessorSpecs();
      case "motherboard":
        return renderMotherboardSpecs();
      case "memory":
        return renderMemorySpecs();
      case "graphic_card":
        return renderGraphicsCardSpecs();
      case "ssd_nvme":
      case "hard_disk":
        return renderStorageSpecs();
      case "power_supply":
        return renderPowerSupplySpecs();
      case "cooler":
        return renderCoolerSpecs();
      case "pc_case":
        return renderCaseSpecs();
      default:
        return (
          <div className="text-sm text-muted-foreground">
            No specifications available
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Badge variant="outline">
                {formatComponentType(componentType)}
              </Badge>
            </CardTitle>
            <CardDescription>Product ID: {productId}</CardDescription>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(specification)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon" onClick={() => onDelete(id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>{renderSpecs()}</CardContent>
    </Card>
  );
}
