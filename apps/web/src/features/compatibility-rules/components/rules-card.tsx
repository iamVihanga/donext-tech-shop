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
import { Pencil, Trash2, AlertCircle, AlertTriangle, Info } from "lucide-react";

import { CompatibilityRule } from "./rules-table/columns";

interface RuleCardProps {
  rule: CompatibilityRule;
  onEdit?: (rule: CompatibilityRule) => void;
  onDelete?: (id: string) => void;
}

export function RuleCard({ rule, onEdit, onDelete }: RuleCardProps) {
  const formatComponentType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getSeverityIcon = () => {
    switch (rule.severity) {
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getSeverityBadge = () => {
    const variant =
      rule.severity === "error"
        ? "destructive"
        : rule.severity === "warning"
          ? "default"
          : "secondary";
    return (
      <Badge variant={variant} className="capitalize">
        {rule.severity}
      </Badge>
    );
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{rule.name}</CardTitle>
              {getSeverityIcon()}
            </div>
            {rule.description && (
              <CardDescription>{rule.description}</CardDescription>
            )}
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(rule)}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(rule.id)}
                className="h-8 w-8 text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Rule Status and Type */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">
              {rule.ruleType.replace(/_/g, " ")}
            </Badge>
            {getSeverityBadge()}
            {rule.isActive ? (
              <Badge variant="default">Active</Badge>
            ) : (
              <Badge variant="outline">Inactive</Badge>
            )}
            <Badge variant="secondary">Priority: {rule.priority}</Badge>
          </div>

          {/* Components */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">
                Primary Component:
              </span>
              <div className="mt-1">
                <Badge variant="secondary">
                  {formatComponentType(rule.primaryComponent)}
                </Badge>
              </div>
            </div>
            {rule.secondaryComponent && (
              <div>
                <span className="font-medium text-muted-foreground">
                  Secondary Component:
                </span>
                <div className="mt-1">
                  <Badge variant="secondary">
                    {formatComponentType(rule.secondaryComponent)}
                  </Badge>
                </div>
              </div>
            )}
          </div>

          {/* Rule Definition */}
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium text-muted-foreground">
                Condition:
              </span>{" "}
              <code className="bg-muted px-1.5 py-0.5 rounded">
                {rule.ruleDefinition.condition}
              </code>
            </div>
            {Object.keys(rule.ruleDefinition.parameters).length > 0 && (
              <div>
                <span className="font-medium text-muted-foreground">
                  Parameters:
                </span>
                <pre className="mt-1 bg-muted p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(rule.ruleDefinition.parameters, null, 2)}
                </pre>
              </div>
            )}
          </div>

          {/* Messages */}
          {(rule.ruleDefinition.errorMessage ||
            rule.ruleDefinition.warningMessage) && (
            <div className="space-y-2 text-sm">
              {rule.ruleDefinition.errorMessage && (
                <div className="flex items-start gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Error:</span>{" "}
                    {rule.ruleDefinition.errorMessage}
                  </div>
                </div>
              )}
              {rule.ruleDefinition.warningMessage && (
                <div className="flex items-start gap-2 text-yellow-600">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Warning:</span>{" "}
                    {rule.ruleDefinition.warningMessage}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Metadata */}
          <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t">
            <span>Created: {new Date(rule.createdAt).toLocaleDateString()}</span>
            <span>Updated: {new Date(rule.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
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
