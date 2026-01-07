"use client";

import { Price } from "@/components/price";
import { Alert, AlertDescription } from "@repo/ui/components/alert";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { Separator } from "@repo/ui/components/separator";
import { Switch } from "@repo/ui/components/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { Textarea } from "@repo/ui/components/textarea";
import {
  AlertCircle,
  CheckCircle2,
  Copy,
  Info,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useCloneBuild } from "../actions/use-clone-build";
import { useCreateBuild } from "../actions/use-create-build";
import { useGetBuild } from "../actions/use-get-build";
import { useUpdateBuild } from "../actions/use-update-build";

interface Component {
  id: string;
  name: string;
  price: number;
  brand?: string;
  imageUrl?: string;
  category?: string;
}

interface CompatibilityIssue {
  severity: "error" | "warning" | "info";
  component: string;
  message: string;
}

interface BuildData {
  name: string;
  description?: string;
  processorId?: string;
  motherboardId?: string;
  memoryId?: string;
  memoryQuantity: number;
  graphicCardId?: string;
  ssdNvmeId?: string;
  hardDiskId?: string;
  powerSupplyId?: string;
  coolerId?: string;
  pcCaseId?: string;
  fanIds: string[];
  extraSsdNvmeIds: string[];
  extraHardDiskIds: string[];
  monitorIds: string[];
  softwareIds: string[];
  keyboardId?: string;
  mouseId?: string;
  mousePadId?: string;
  headsetId?: string;
  speakerId?: string;
  upsId?: string;
  tableId?: string;
  chairId?: string;
  thermalPasteId?: string;
  cableIds: string[];
  isPublic: boolean;
  isTemplate: boolean;
}

export function BuildPc() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const buildId = searchParams.get("id");

  const { data: existingBuild, isLoading: loadingBuild } = useGetBuild(
    buildId || undefined
  );
  const createBuild = useCreateBuild();
  const updateBuild = useUpdateBuild();
  const cloneBuild = useCloneBuild();

  const [buildData, setBuildData] = useState<BuildData>({
    name: "My PC Build",
    description: "",
    memoryQuantity: 1,
    fanIds: [],
    extraSsdNvmeIds: [],
    extraHardDiskIds: [],
    monitorIds: [],
    softwareIds: [],
    cableIds: [],
    isPublic: false,
    isTemplate: false,
  });

  const [compatibilityIssues, setCompatibilityIssues] = useState<
    CompatibilityIssue[]
  >([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [activeTab, setActiveTab] = useState("core");

  // Load existing build data
  useEffect(() => {
    if (existingBuild?.data) {
      setBuildData({
        name: existingBuild.data.name || "My PC Build",
        description: existingBuild.data.description || "",
        processorId: existingBuild.data.processorId || undefined,
        motherboardId: existingBuild.data.motherboardId || undefined,
        memoryId: existingBuild.data.memoryId || undefined,
        memoryQuantity: existingBuild.data.memoryQuantity || 1,
        graphicCardId: existingBuild.data.graphicCardId || undefined,
        ssdNvmeId: existingBuild.data.ssdNvmeId || undefined,
        hardDiskId: existingBuild.data.hardDiskId || undefined,
        powerSupplyId: existingBuild.data.powerSupplyId || undefined,
        coolerId: existingBuild.data.coolerId || undefined,
        pcCaseId: existingBuild.data.pcCaseId || undefined,
        fanIds: existingBuild.data.fanIds || [],
        extraSsdNvmeIds: existingBuild.data.extraSsdNvmeIds || [],
        extraHardDiskIds: existingBuild.data.extraHardDiskIds || [],
        monitorIds: existingBuild.data.monitorIds || [],
        softwareIds: existingBuild.data.softwareIds || [],
        keyboardId: existingBuild.data.keyboardId || undefined,
        mouseId: existingBuild.data.mouseId || undefined,
        mousePadId: existingBuild.data.mousePadId || undefined,
        headsetId: existingBuild.data.headsetId || undefined,
        speakerId: existingBuild.data.speakerId || undefined,
        upsId: existingBuild.data.upsId || undefined,
        tableId: existingBuild.data.tableId || undefined,
        chairId: existingBuild.data.chairId || undefined,
        thermalPasteId: existingBuild.data.thermalPasteId || undefined,
        cableIds: existingBuild.data.cableIds || [],
        isPublic: existingBuild.data.isPublic || false,
        isTemplate: existingBuild.data.isTemplate || false,
      });

      // Calculate price from existing build
      if (existingBuild.data.totalPrice) {
        setTotalPrice(existingBuild.data.totalPrice);
      }

      // Load compatibility issues if available
      if (existingBuild.data.compatibilityIssues) {
        setCompatibilityIssues(existingBuild.data.compatibilityIssues);
      }
    }
  }, [existingBuild]);

  const handleSave = () => {
    if (buildId) {
      updateBuild.mutate({ id: buildId, data: buildData });
    } else {
      createBuild.mutate(buildData);
    }
  };

  const handleClone = () => {
    if (buildId) {
      cloneBuild.mutate({ id: buildId });
    }
  };

  const handleComponentSelect = (
    field: keyof BuildData,
    value: string | undefined
  ) => {
    setBuildData((prev) => ({ ...prev, [field]: value }));
  };

  const handleArrayAdd = (field: keyof BuildData, value: string) => {
    setBuildData((prev) => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value],
    }));
  };

  const handleArrayRemove = (field: keyof BuildData, index: number) => {
    setBuildData((prev) => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index),
    }));
  };

  const ComponentSelector = ({
    label,
    field,
    componentType,
  }: {
    label: string;
    field: keyof BuildData;
    componentType: string;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input
          value={(buildData[field] as string) || ""}
          placeholder={`Select ${label.toLowerCase()}`}
          readOnly
          className="flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // TODO: Open component selection modal
            console.log(`Select ${componentType}`);
          }}
        >
          <Plus className="h-4 w-4" />
        </Button>
        {buildData[field] && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleComponentSelect(field, undefined)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );

  const ArrayComponentSelector = ({
    label,
    field,
    componentType,
  }: {
    label: string;
    field: keyof BuildData;
    componentType: string;
  }) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="space-y-2">
        {(buildData[field] as string[]).map((id, index) => (
          <div key={index} className="flex gap-2">
            <Input value={id} readOnly className="flex-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleArrayRemove(field, index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            // TODO: Open component selection modal
            console.log(`Add ${componentType}`);
          }}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {label}
        </Button>
      </div>
    </div>
  );

  if (loadingBuild && buildId) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading build...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Build Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>PC Builder</CardTitle>
              <CardDescription>Configure your custom PC build</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Build Name & Description */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Build Name</Label>
                  <Input
                    id="name"
                    value={buildData.name}
                    onChange={(e) =>
                      setBuildData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="My PC Build"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={buildData.description || ""}
                    onChange={(e) =>
                      setBuildData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    placeholder="Describe your build..."
                    rows={3}
                  />
                </div>
              </div>

              <Separator />

              {/* Component Selection Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="core">Core</TabsTrigger>
                  <TabsTrigger value="storage">Storage & Cooling</TabsTrigger>
                  <TabsTrigger value="accessories">Accessories</TabsTrigger>
                </TabsList>

                <TabsContent value="core" className="space-y-4 mt-4">
                  <ComponentSelector
                    label="Processor (CPU)"
                    field="processorId"
                    componentType="processor"
                  />
                  <ComponentSelector
                    label="Motherboard"
                    field="motherboardId"
                    componentType="motherboard"
                  />
                  <ComponentSelector
                    label="Memory (RAM)"
                    field="memoryId"
                    componentType="memory"
                  />
                  <div className="space-y-2">
                    <Label htmlFor="memoryQuantity">Memory Quantity</Label>
                    <Input
                      id="memoryQuantity"
                      type="number"
                      min={1}
                      max={8}
                      value={buildData.memoryQuantity}
                      onChange={(e) =>
                        setBuildData((prev) => ({
                          ...prev,
                          memoryQuantity: parseInt(e.target.value) || 1,
                        }))
                      }
                    />
                  </div>
                  <ComponentSelector
                    label="Graphics Card (GPU)"
                    field="graphicCardId"
                    componentType="graphic_card"
                  />
                  <ComponentSelector
                    label="Power Supply (PSU)"
                    field="powerSupplyId"
                    componentType="power_supply"
                  />
                  <ComponentSelector
                    label="PC Case"
                    field="pcCaseId"
                    componentType="pc_case"
                  />
                </TabsContent>

                <TabsContent value="storage" className="space-y-4 mt-4">
                  <ComponentSelector
                    label="Primary SSD/NVMe"
                    field="ssdNvmeId"
                    componentType="ssd_nvme"
                  />
                  <ArrayComponentSelector
                    label="Additional SSD/NVMe"
                    field="extraSsdNvmeIds"
                    componentType="ssd_nvme"
                  />
                  <ComponentSelector
                    label="Primary Hard Disk"
                    field="hardDiskId"
                    componentType="hard_disk"
                  />
                  <ArrayComponentSelector
                    label="Additional Hard Disks"
                    field="extraHardDiskIds"
                    componentType="hard_disk"
                  />
                  <ComponentSelector
                    label="CPU Cooler"
                    field="coolerId"
                    componentType="cooler"
                  />
                  <ArrayComponentSelector
                    label="Case Fans"
                    field="fanIds"
                    componentType="fan"
                  />
                </TabsContent>

                <TabsContent value="accessories" className="space-y-4 mt-4">
                  <ArrayComponentSelector
                    label="Monitors"
                    field="monitorIds"
                    componentType="monitor"
                  />
                  <ComponentSelector
                    label="Keyboard"
                    field="keyboardId"
                    componentType="keyboard"
                  />
                  <ComponentSelector
                    label="Mouse"
                    field="mouseId"
                    componentType="mouse"
                  />
                  <ComponentSelector
                    label="Mouse Pad"
                    field="mousePadId"
                    componentType="mouse_pad"
                  />
                  <ComponentSelector
                    label="Headset"
                    field="headsetId"
                    componentType="headset"
                  />
                  <ComponentSelector
                    label="Speaker"
                    field="speakerId"
                    componentType="speaker"
                  />
                  <ComponentSelector
                    label="UPS"
                    field="upsId"
                    componentType="ups"
                  />
                  <ComponentSelector
                    label="Desk/Table"
                    field="tableId"
                    componentType="table"
                  />
                  <ComponentSelector
                    label="Chair"
                    field="chairId"
                    componentType="chair"
                  />
                  <ComponentSelector
                    label="Thermal Paste"
                    field="thermalPasteId"
                    componentType="thermal_paste"
                  />
                  <ArrayComponentSelector
                    label="Cables"
                    field="cableIds"
                    componentType="cable"
                  />
                  <ArrayComponentSelector
                    label="Software"
                    field="softwareIds"
                    componentType="software"
                  />
                </TabsContent>
              </Tabs>

              <Separator />

              {/* Build Options */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPublic">Public Build</Label>
                    <p className="text-sm text-muted-foreground">
                      Share this build with the community
                    </p>
                  </div>
                  <Switch
                    id="isPublic"
                    checked={buildData.isPublic}
                    onCheckedChange={(checked) =>
                      setBuildData((prev) => ({ ...prev, isPublic: checked }))
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isTemplate">Template Build</Label>
                    <p className="text-sm text-muted-foreground">
                      Use this as a template for future builds
                    </p>
                  </div>
                  <Switch
                    id="isTemplate"
                    checked={buildData.isTemplate}
                    onCheckedChange={(checked) =>
                      setBuildData((prev) => ({ ...prev, isTemplate: checked }))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary & Actions */}
        <div className="space-y-6">
          {/* Compatibility Issues */}
          {compatibilityIssues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  Compatibility Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {compatibilityIssues.map((issue, index) => (
                  <Alert
                    key={index}
                    variant={
                      issue.severity === "error" ? "destructive" : "default"
                    }
                  >
                    <AlertDescription className="flex items-start gap-2">
                      {issue.severity === "error" && (
                        <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      {issue.severity === "warning" && (
                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      {issue.severity === "info" && (
                        <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-medium text-sm">{issue.component}</p>
                        <p className="text-sm">{issue.message}</p>
                      </div>
                    </AlertDescription>
                  </Alert>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Price Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Price Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-2xl font-bold">
                  <span>Total:</span>
                  <Price amount={totalPrice} />
                </div>
                <Separator />
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Core Components:</span>
                    <span>6 selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accessories:</span>
                    <span>4 selected</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleSave}
                className="w-full"
                disabled={createBuild.isPending || updateBuild.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {buildId ? "Update Build" : "Save Build"}
              </Button>

              {buildId && (
                <>
                  <Button
                    onClick={handleClone}
                    variant="outline"
                    className="w-full"
                    disabled={cloneBuild.isPending}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Clone Build
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this build?")
                      ) {
                        // TODO: Implement delete
                        router.push("/account/builds");
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Build
                  </Button>
                </>
              )}

              <Separator />

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/account/builds")}
              >
                View All Builds
              </Button>
            </CardContent>
          </Card>

          {/* Build Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Build Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status:</span>
                <Badge
                  variant={
                    compatibilityIssues.length === 0 ? "default" : "destructive"
                  }
                >
                  {compatibilityIssues.length === 0
                    ? "Compatible"
                    : "Issues Found"}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Visibility:</span>
                <Badge variant={buildData.isPublic ? "secondary" : "outline"}>
                  {buildData.isPublic ? "Public" : "Private"}
                </Badge>
              </div>
              {buildData.isTemplate && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Type:</span>
                  <Badge variant="secondary">Template</Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
