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
  const [chipsetFilter, setChipsetFilter] = useState<"all" | "intel" | "amd">("all");

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

  // Component categories configuration
  const componentCategories = [
    { id: "processor", label: "Processors", field: "processorId" as keyof BuildData },
    { id: "motherboard", label: "Motherboards", field: "motherboardId" as keyof BuildData },
    { id: "memory", label: "Memory", field: "memoryId" as keyof BuildData },
    { id: "graphic_card", label: "Graphics Cards", field: "graphicCardId" as keyof BuildData },
    { id: "ssd_nvme", label: "SSD & NVMe", field: "ssdNvmeId" as keyof BuildData },
    { id: "hard_disk", label: "Hard Disk", field: "hardDiskId" as keyof BuildData },
    { id: "power_supply", label: "Power Supply", field: "powerSupplyId" as keyof BuildData },
    { id: "cooler", label: "Coolers", field: "coolerId" as keyof BuildData },
    { id: "pc_case", label: "PC Case", field: "pcCaseId" as keyof BuildData },
    { id: "fan", label: "Fans", field: "fanIds" as keyof BuildData, isArray: true },
    { id: "ssd_nvme_extra", label: "Extra SSD & NVMe", field: "extraSsdNvmeIds" as keyof BuildData, isArray: true },
    { id: "hard_disk_extra", label: "Extra Hard Disk", field: "extraHardDiskIds" as keyof BuildData, isArray: true },
  ];

  const [selectedCategory, setSelectedCategory] = useState(componentCategories[0]);

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
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Main 3-Column Layout */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN - Brand & Chipset Filter */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="rounded-2xl shadow-sm border-0 bg-white">
              <CardContent className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Build My PC</h1>
                  <p className="text-sm text-blue-600 font-medium mt-1">v2.2</p>
                  <p className="text-xs text-gray-500 mt-2">by Game Zone Tech</p>
                </div>

                <Separator />

                {/* Chipset Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Chipset Filter</Label>
                  <div className="grid grid-cols-3 gap-2 p-1 bg-gray-100 rounded-lg">
                    <Button
                      variant={chipsetFilter === "all" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setChipsetFilter("all")}
                      className={`rounded-md ${chipsetFilter === "all" ? "bg-blue-600 hover:bg-blue-700 text-white" : "hover:bg-gray-200"}`}
                    >
                      All
                    </Button>
                    <Button
                      variant={chipsetFilter === "intel" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setChipsetFilter("intel")}
                      className={`rounded-md ${chipsetFilter === "intel" ? "bg-blue-600 hover:bg-blue-700 text-white" : "hover:bg-gray-200"}`}
                    >
                      Intel
                    </Button>
                    <Button
                      variant={chipsetFilter === "amd" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setChipsetFilter("amd")}
                      className={`rounded-md ${chipsetFilter === "amd" ? "bg-blue-600 hover:bg-blue-700 text-white" : "hover:bg-gray-200"}`}
                    >
                      AMD
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Build Options */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Build Name</Label>
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
                      className="rounded-lg"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Label htmlFor="isPublic" className="text-sm cursor-pointer">Public Build</Label>
                    <Switch
                      id="isPublic"
                      checked={buildData.isPublic}
                      onCheckedChange={(checked) =>
                        setBuildData((prev) => ({ ...prev, isPublic: checked }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <Label htmlFor="isTemplate" className="text-sm cursor-pointer">Template</Label>
                    <Switch
                      id="isTemplate"
                      checked={buildData.isTemplate}
                      onCheckedChange={(checked) =>
                        setBuildData((prev) => ({ ...prev, isTemplate: checked }))
                      }
                    />
                  </div>
                </div>

                <Separator />

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={handleSave}
                    className="w-full rounded-lg bg-blue-600 hover:bg-blue-700"
                    disabled={createBuild.isPending || updateBuild.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {buildId ? "Update Build" : "Save Build"}
                  </Button>

                  {buildId && (
                    <Button
                      onClick={handleClone}
                      variant="outline"
                      className="w-full rounded-lg"
                      disabled={cloneBuild.isPending}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Clone Build
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Compatibility Issues */}
            {compatibilityIssues.length > 0 && (
              <Card className="rounded-2xl shadow-sm border-0 bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Issues
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {compatibilityIssues.slice(0, 3).map((issue, index) => (
                    <Alert
                      key={index}
                      variant={issue.severity === "error" ? "destructive" : "default"}
                      className="py-2"
                    >
                      <AlertDescription className="text-xs">
                        {issue.message}
                      </AlertDescription>
                    </Alert>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* MIDDLE COLUMN - Component Categories Grid */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="rounded-2xl shadow-sm border-0 bg-white">
              <CardHeader>
                <CardTitle className="text-lg">Select Components</CardTitle>
                <CardDescription>Choose a category to browse products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {componentCategories.map((category) => {
                    const isSelected = selectedCategory.id === category.id;
                    const hasSelection = category.isArray 
                      ? (buildData[category.field] as string[]).length > 0
                      : buildData[category.field];
                    
                    return (
                      <button
                        key={category.id}
                        onClick={() => {
                          setSelectedCategory(category);
                          setSelectedComponentType(category.id);
                        }}
                        className={`p-4 rounded-xl border-2 transition-all hover:shadow-md text-left ${
                          isSelected
                            ? "border-blue-600 bg-blue-50"
                            : hasSelection
                            ? "border-green-400 bg-green-50"
                            : "border-gray-200 bg-white hover:border-blue-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className={`font-semibold text-sm ${isSelected ? "text-blue-700" : "text-gray-900"}`}>
                              {category.label}
                            </p>
                            {hasSelection && (
                              <p className="text-xs text-green-600 mt-1">
                                {category.isArray 
                                  ? `${(buildData[category.field] as string[]).length} selected`
                                  : "✓ Selected"}
                              </p>
                            )}
                          </div>
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-blue-600 mt-1"></div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN - Product List */}
          <div className="lg:col-span-4">
            <Card className="rounded-2xl shadow-sm border-0 bg-white sticky top-4">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedCategory.label}</CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {filteredProducts.length} products available
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsProductDialogOpen(true)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    View All
                  </Button>
                </div>
              </CardHeader>
              <ScrollArea className="h-[600px]">
                <CardContent className="p-4 space-y-3">
                  {loadingProducts ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-sm">No products found</p>
                    </div>
                  ) : (
                    filteredProducts.slice(0, 10).map((product) => {
                      const isCompatible = isProductCompatible(product.id);
                      const isCurrentlySelected = selectedCategory.isArray
                        ? (buildData[selectedCategory.field] as string[]).includes(product.id)
                        : buildData[selectedCategory.field] === product.id;

                      return (
                        <button
                          key={product.id}
                          onClick={() => {
                            if (isCompatible && !isCurrentlySelected) {
                              setSelectedField(selectedCategory.field);
                              setIsArrayField(selectedCategory.isArray || false);
                              handleProductSelect(product);
                            }
                          }}
                          disabled={!isCompatible || isCurrentlySelected}
                          className={`w-full p-3 rounded-xl border transition-all text-left ${
                            isCurrentlySelected
                              ? "border-green-500 bg-green-50"
                              : isCompatible
                              ? "border-gray-200 hover:border-blue-400 hover:shadow-md bg-white"
                              : "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex gap-3">
                            {/* Product Image */}
                            <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                              {product.images && product.images[0] ? (
                                <Image
                                  src={product.images[0].imageUrl}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-xs text-gray-400">No image</span>
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900 truncate">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {product.brand?.name || "No brand"}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                {isCurrentlySelected && (
                                  <Badge className="text-xs bg-green-600">Selected</Badge>
                                )}
                                {!isCompatible && (
                                  <Badge variant="destructive" className="text-xs">Incompatible</Badge>
                                )}
                              </div>
                            </div>

                            {/* Price */}
                            <div className="text-right flex-shrink-0">
                              <div className="text-sm font-bold text-gray-900">
                                <Price amount={product.discountPrice || product.price} />
                              </div>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Left - Total Price */}
            <div>
              <p className="text-xs text-gray-500">TOTAL</p>
              <p className="text-2xl font-bold text-gray-900">
                <Price amount={totalPrice} />
              </p>
              <p className="text-xs text-blue-600 mt-1">Monthly payments available</p>
            </div>

            {/* Right - Navigation Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                disabled={true}
                className="rounded-full px-6"
              >
                Back
              </Button>
              <Button
                className="rounded-full px-6 bg-blue-600 hover:bg-blue-700"
                onClick={() => router.push("/account/builds")}
              >
                Next
                <span className="ml-2">→</span>
              </Button>
            </div>
          </div>
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
