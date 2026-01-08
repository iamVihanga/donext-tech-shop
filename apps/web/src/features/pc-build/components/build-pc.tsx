"use client";

import { Price } from "@/components/price";
import { useGetProducts } from "@/features/products/actions/use-get-products";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { ScrollArea } from "@repo/ui/components/scroll-area";
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
  Search,
  Trash2,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCheckCompatibility } from "../actions/use-check-compatibility";
import { useCloneBuild } from "../actions/use-clone-build";
import { useCreateBuild } from "../actions/use-create-build";
import { useGetBuild } from "../actions/use-get-build";
import { useGetCompatibleComponents } from "../actions/use-get-compatible-components";
import { useUpdateBuild } from "../actions/use-update-build";

interface Product {
  id: string;
  name: string;
  price: string | number;
  discountPrice?: string | number;
  brandId?: string;
  brand?: { name: string };
  categoryId?: string;
  category?: { name: string };
  images?: Array<{ imageUrl: string }>;
  stockQuantity?: number;
  stock?: number;
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
  const checkCompatibility = useCheckCompatibility();

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

  // Product selection dialog state
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedComponentType, setSelectedComponentType] =
    useState<string>("");
  const [selectedField, setSelectedField] = useState<keyof BuildData | null>(
    null
  );
  const [isArrayField, setIsArrayField] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Selected products cache (for displaying names and calculating price)
  const [selectedProducts, setSelectedProducts] = useState<
    Map<string, Product>
  >(new Map());

  // Fetch products for dialog
  const { data: productsData, isLoading: loadingProducts } = useGetProducts({
    page: 1,
    limit: 50,
    search: searchQuery || null,
  });

  // Fetch compatible components based on current build
  const { data: compatibleComponents } = useGetCompatibleComponents({
    componentType: selectedComponentType,
    currentComponents: {
      processorId: buildData.processorId,
      motherboardId: buildData.motherboardId,
      memoryId: buildData.memoryId,
      graphicCardId: buildData.graphicCardId,
      pcCaseId: buildData.pcCaseId,
      powerSupplyId: buildData.powerSupplyId,
    },
  });

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

  // Filter products by component type
  const filteredProducts = useMemo(() => {
    if (!productsData?.data) return [];

    const products = productsData.data as Product[];

    // Map component types to category IDs or names (case-insensitive matching)
    // You can get these IDs from your categories API
    const categoryIdMap: Record<string, string[]> = {
      processor: ["88574de1-92a1-4a38-a5d1-dc8a669f538f"], // CPU category ID
      motherboard: ["706b3ed0-7b9d-4403-99e4-d0077fe99a81"], // MOTHERBOARDS category ID
      memory: ["705c09d0-8fb6-4439-b31f-48017f8b88ef"], // RAM category ID
    };

    // Fallback to name-based matching for categories we don't have IDs for
    const categoryNameMap: Record<string, string[]> = {
      processor: ["processor", "cpu"],
      motherboard: ["motherboard", "mobo", "motherboards"],
      memory: ["memory", "ram"],
      graphic_card: [
        "graphics card",
        "gpu",
        "graphic card",
        "video card",
        "vga",
      ],
      ssd_nvme: ["ssd", "nvme", "m.2", "solid state"],
      hard_disk: ["hard disk", "hdd", "hard drive", "storage"],
      power_supply: ["power supply", "psu"],
      cooler: ["cooler", "cpu cooler", "cooling"],
      pc_case: ["case", "pc case", "chassis", "casing"],
      fan: ["fan", "case fan", "cooling fan"],
      monitor: ["monitor", "display", "screen"],
      keyboard: ["keyboard"],
      mouse: ["mouse"],
      mouse_pad: ["mouse pad", "mousepad"],
      headset: ["headset", "headphone", "headphones"],
      speaker: ["speaker", "speakers"],
      ups: ["ups", "battery backup"],
      table: ["table", "desk"],
      chair: ["chair", "gaming chair"],
      thermal_paste: ["thermal paste", "thermal compound"],
      cable: ["cable", "cables"],
      software: ["software", "os", "operating system"],
    };

    // If no component type is selected, return all products
    if (!selectedComponentType) {
      return products;
    }

    const categoryIds = categoryIdMap[selectedComponentType] || [];
    const searchTerms = categoryNameMap[selectedComponentType] || [];

    // Show all products matching the category (don't filter by compatibility)
    return products.filter((product) => {
      // First try to match by category ID
      if (product.categoryId && categoryIds.includes(product.categoryId)) {
        return true;
      }

      // Fallback to name-based matching
      const categoryName = product.category?.name?.toLowerCase() || "";
      return searchTerms.some((term) =>
        categoryName.includes(term.toLowerCase())
      );
    });
  }, [productsData, selectedComponentType]);

  // Get set of compatible product IDs for checking
  const compatibleProductIds = useMemo(() => {
    if (compatibleComponents && Array.isArray(compatibleComponents)) {
      return new Set(compatibleComponents.map((c: any) => c.id));
    }
    return null;
  }, [compatibleComponents]);

  // Check compatibility whenever core components change
  useEffect(() => {
    const coreComponents = [
      buildData.processorId,
      buildData.motherboardId,
      buildData.memoryId,
      buildData.graphicCardId,
      buildData.powerSupplyId,
      buildData.coolerId,
      buildData.pcCaseId,
    ];

    // Only check if at least 2 components are selected
    const selectedCount = coreComponents.filter(Boolean).length;
    if (selectedCount >= 2) {
      checkCompatibility.mutate(
        {
          processorId: buildData.processorId,
          motherboardId: buildData.motherboardId,
          memoryId: buildData.memoryId,
          memoryQuantity: buildData.memoryQuantity,
          graphicCardId: buildData.graphicCardId,
          ssdNvmeId: buildData.ssdNvmeId,
          hardDiskId: buildData.hardDiskId,
          powerSupplyId: buildData.powerSupplyId,
          coolerId: buildData.coolerId,
          pcCaseId: buildData.pcCaseId,
          fanIds: buildData.fanIds,
          extraSsdNvmeIds: buildData.extraSsdNvmeIds,
          extraHardDiskIds: buildData.extraHardDiskIds,
        },
        {
          onSuccess: (data) => {
            setCompatibilityIssues(data.issues);
          },
          onError: () => {
            // Silently fail - compatibility check is not critical
            setCompatibilityIssues([]);
          },
        }
      );
    } else {
      setCompatibilityIssues([]);
    }
  }, [
    buildData.processorId,
    buildData.motherboardId,
    buildData.memoryId,
    buildData.memoryQuantity,
    buildData.graphicCardId,
    buildData.ssdNvmeId,
    buildData.hardDiskId,
    buildData.powerSupplyId,
    buildData.coolerId,
    buildData.pcCaseId,
    buildData.fanIds,
    buildData.extraSsdNvmeIds,
    buildData.extraHardDiskIds,
  ]);

  // Calculate total price
  useEffect(() => {
    let total = 0;

    // Helper to convert price to number
    const getPrice = (product: Product) => {
      const price = product.discountPrice || product.price;
      return typeof price === "string" ? parseFloat(price) : price;
    };

    // Add core components
    const componentFields: (keyof BuildData)[] = [
      "processorId",
      "motherboardId",
      "memoryId",
      "graphicCardId",
      "ssdNvmeId",
      "hardDiskId",
      "powerSupplyId",
      "coolerId",
      "pcCaseId",
      "keyboardId",
      "mouseId",
      "mousePadId",
      "headsetId",
      "speakerId",
      "upsId",
      "tableId",
      "chairId",
      "thermalPasteId",
    ];

    componentFields.forEach((field) => {
      const productId = buildData[field] as string | undefined;
      if (productId && selectedProducts.has(productId)) {
        const product = selectedProducts.get(productId)!;
        total += getPrice(product);
      }
    });

    // Add memory quantity multiplier
    if (buildData.memoryId && selectedProducts.has(buildData.memoryId)) {
      const product = selectedProducts.get(buildData.memoryId)!;
      total += getPrice(product) * (buildData.memoryQuantity - 1); // Already added once above
    }

    // Add array fields
    const arrayFields: (keyof BuildData)[] = [
      "fanIds",
      "extraSsdNvmeIds",
      "extraHardDiskIds",
      "monitorIds",
      "softwareIds",
      "cableIds",
    ];

    arrayFields.forEach((field) => {
      const ids = buildData[field] as string[];
      ids.forEach((id) => {
        if (selectedProducts.has(id)) {
          const product = selectedProducts.get(id)!;
          total += getPrice(product);
        }
      });
    });

    setTotalPrice(total);
  }, [buildData, selectedProducts]);

  const openProductDialog = (
    componentType: string,
    field: keyof BuildData,
    isArray: boolean = false
  ) => {
    setSelectedComponentType(componentType);
    setSelectedField(field);
    setIsArrayField(isArray);
    setSearchQuery("");
    setIsProductDialogOpen(true);
  };

  // Check if a product is compatible with current build
  const isProductCompatible = (productId: string): boolean => {
    // If we don't have compatibility data yet, allow selection
    if (!compatibleProductIds) return true;
    // If we have compatibility data, check if product is in the compatible list
    return compatibleProductIds.has(productId);
  };

  const handleProductSelect = (product: Product) => {
    if (!selectedField) return;

    // Prevent selection of incompatible products
    if (!isProductCompatible(product.id)) {
      return;
    }

    // Cache the product
    setSelectedProducts((prev) => new Map(prev).set(product.id, product));

    if (isArrayField) {
      // Add to array
      setBuildData((prev) => ({
        ...prev,
        [selectedField]: [...(prev[selectedField] as string[]), product.id],
      }));
    } else {
      // Set single value
      setBuildData((prev) => ({
        ...prev,
        [selectedField]: product.id,
      }));
    }

    setIsProductDialogOpen(false);
  };

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
  }) => {
    const productId = buildData[field] as string | undefined;
    const product = productId ? selectedProducts.get(productId) : null;

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="flex gap-2">
          <Input
            value={product?.name || ""}
            placeholder={`Select ${label.toLowerCase()}`}
            readOnly
            className="flex-1"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => openProductDialog(componentType, field, false)}
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
        {product && (
          <div className="text-sm text-muted-foreground flex items-center justify-between">
            <span>{product.brand?.name || ""}</span>
            <Price
              amount={
                typeof (product.discountPrice || product.price) === "string"
                  ? parseFloat(
                      (product.discountPrice as string) ||
                        (product.price as string)
                    )
                  : product.discountPrice || product.price
              }
              className="font-semibold"
            />
          </div>
        )}
      </div>
    );
  };

  const ArrayComponentSelector = ({
    label,
    field,
    componentType,
  }: {
    label: string;
    field: keyof BuildData;
    componentType: string;
  }) => {
    const ids = buildData[field] as string[];

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <div className="space-y-2">
          {ids.map((id, index) => {
            const product = selectedProducts.get(id);
            return (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={product?.name || id}
                  readOnly
                  className="flex-1"
                />
                {product && (
                  <Price
                    amount={
                      typeof (product.discountPrice || product.price) ===
                      "string"
                        ? parseFloat(
                            (product.discountPrice as string) ||
                              (product.price as string)
                          )
                        : product.discountPrice || product.price
                    }
                    className="text-sm min-w-20"
                  />
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleArrayRemove(field, index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => openProductDialog(componentType, field, true)}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add {label}
          </Button>
        </div>
      </div>
    );
  };

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
                    <span>
                      {
                        [
                          buildData.processorId,
                          buildData.motherboardId,
                          buildData.memoryId,
                          buildData.graphicCardId,
                          buildData.ssdNvmeId,
                          buildData.powerSupplyId,
                          buildData.pcCaseId,
                        ].filter(Boolean).length
                      }{" "}
                      selected
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Storage & Cooling:</span>
                    <span>
                      {
                        [
                          buildData.coolerId,
                          buildData.hardDiskId,
                          ...buildData.fanIds,
                          ...buildData.extraSsdNvmeIds,
                          ...buildData.extraHardDiskIds,
                        ].filter(Boolean).length
                      }{" "}
                      selected
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accessories:</span>
                    <span>
                      {
                        [
                          buildData.keyboardId,
                          buildData.mouseId,
                          buildData.mousePadId,
                          buildData.headsetId,
                          buildData.speakerId,
                          buildData.upsId,
                          buildData.tableId,
                          buildData.chairId,
                          buildData.thermalPasteId,
                          ...buildData.monitorIds,
                          ...buildData.softwareIds,
                          ...buildData.cableIds,
                        ].filter(Boolean).length
                      }{" "}
                      selected
                    </span>
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

      {/* Product Selection Dialog */}
      <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>
              Select {selectedComponentType.replace(/_/g, " ").toUpperCase()}
            </DialogTitle>
            <DialogDescription>
              {compatibleProductIds && compatibleProductIds.size > 0 ? (
                <span className="flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-600" />
                  Incompatible products are marked and cannot be selected
                </span>
              ) : (
                "Choose a product from the list below"
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Products List */}
            <ScrollArea className="h-[450px] pr-4">
              {loadingProducts ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8 space-y-3">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
                  <div>
                    <p className="font-medium text-muted-foreground">
                      No products found
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Looking for: {selectedComponentType.replace(/_/g, " ")}
                    </p>
                  </div>
                  {productsData?.data &&
                    (productsData.data as Product[]).length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Total products in this category:{" "}
                        {(productsData.data as Product[]).length}
                      </p>
                    )}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {filteredProducts.map((product) => {
                    const isCompatible = isProductCompatible(product.id);
                    return (
                      <Card
                        key={product.id}
                        className={`transition-colors ${
                          isCompatible
                            ? "cursor-pointer hover:border-primary"
                            : "cursor-not-allowed border-destructive/50 bg-destructive/5"
                        }`}
                        onClick={() => handleProductSelect(product)}
                      >
                        <CardContent className="p-4">
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="relative w-20 h-20 flex-shrink-0 bg-muted rounded-md overflow-hidden">
                              {product.images && product.images[0] ? (
                                <Image
                                  src={product.images[0].imageUrl}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                                  No image
                                </div>
                              )}
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold truncate">
                                  {product.name}
                                </h4>
                                {!isCompatible && (
                                  <Badge
                                    variant="destructive"
                                    className="flex-shrink-0"
                                  >
                                    Not Compatible
                                  </Badge>
                                )}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                {product.brand?.name || "No brand"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge
                                  variant={
                                    (product.stockQuantity ||
                                      product.stock ||
                                      0) > 0
                                      ? "default"
                                      : "destructive"
                                  }
                                >
                                  {(product.stockQuantity ||
                                    product.stock ||
                                    0) > 0
                                    ? `In Stock (${product.stockQuantity || product.stock})`
                                    : "Out of Stock"}
                                </Badge>
                                {product.category && (
                                  <Badge variant="outline">
                                    {product.category.name}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right flex-shrink-0">
                              {product.discountPrice ? (
                                <>
                                  <div className="text-lg font-bold">
                                    <Price amount={product.discountPrice} />
                                  </div>
                                  <div className="text-sm text-muted-foreground line-through">
                                    <Price amount={product.price} />
                                  </div>
                                </>
                              ) : (
                                <div className="text-lg font-bold">
                                  <Price amount={product.price} />
                                </div>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
