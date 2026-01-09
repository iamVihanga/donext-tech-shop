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
import { AlertCircle, Copy, Download, Info, Plus, Save, Search, X } from "lucide-react";
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
  const [chipsetFilter, setChipsetFilter] = useState<"all" | "intel" | "amd">(
    "all"
  );

  // Product selection dialog state
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [selectedComponentType, setSelectedComponentType] =
    useState<string>("");
  const [selectedField, setSelectedField] = useState<keyof BuildData | null>(
    null
  );
  const [isArrayField, setIsArrayField] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [animatingProduct, setAnimatingProduct] = useState<string | null>(null);
  const [showQuotationDialog, setShowQuotationDialog] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

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

    // Trigger animation
    setAnimatingProduct(product.id);
    setTimeout(() => setAnimatingProduct(null), 600);

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

  const handlePrintBuild = () => {
    window.print();
  };

  const handleShareBuild = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: buildData.name,
          text: `Check out my PC build: ${buildData.name}`,
          url: url,
        });
      } catch (err) {
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
      }
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleDownloadQuotation = () => {
    // Show confirmation dialog
    setShowQuotationDialog(true);
  };

  const downloadQuotationFile = () => {
    let quotation = `PC BUILD QUOTATION\n===================\n\n`;
    quotation += `Build Name: ${buildData.name}\nDate: ${new Date().toLocaleDateString()}\n\nCOMPONENTS:\n-----------\n\n`;

    componentCategories.forEach((category) => {
      const items: Array<{ id: string; product?: Product }> = [];

      if (category.isArray) {
        const ids = buildData[category.field] as string[];
        ids.forEach((id) =>
          items.push({ id, product: selectedProducts.get(id) })
        );
      } else {
        const id = buildData[category.field] as string | undefined;
        if (id) items.push({ id, product: selectedProducts.get(id) });
      }

      if (items.length > 0) {
        quotation += `${category.label}:\n`;
        items.forEach((item) => {
          const product = item.product;
          if (product) {
            const isMemory = category.field === "memoryId";
            const price =
              typeof (product.discountPrice || product.price) === "string"
                ? parseFloat(
                    (product.discountPrice as string) ||
                      (product.price as string)
                  )
                : product.discountPrice || product.price;
            const totalPrice = isMemory
              ? price * buildData.memoryQuantity
              : price;
            const qty =
              isMemory && buildData.memoryQuantity > 1
                ? ` (x${buildData.memoryQuantity})`
                : "";
            quotation += `  - ${product.name}${qty}: Rs. ${totalPrice.toFixed(2)}\n`;
          }
        });
        quotation += `\n`;
      }
    });

    quotation += `\n-----------\nTOTAL: Rs. ${totalPrice.toFixed(2)}\n\n\nGenerated by Game Zone Tech PC Builder v2.2`;

    const blob = new Blob([quotation], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${buildData.name.replace(/\s+/g, "_")}_quotation.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleConfirmOrder = async () => {
    setIsCreatingOrder(true);
    try {
      // Prepare order items from build data
      const orderItemsData: Array<{
        productId: string;
        quantity: number;
        product: Product;
      }> = [];

      // Collect all items from build
      componentCategories.forEach((category) => {
        if (category.isArray) {
          const ids = buildData[category.field] as string[];
          ids.forEach((id) => {
            const product = selectedProducts.get(id);
            if (product) {
              orderItemsData.push({
                productId: id,
                quantity: 1,
                product,
              });
            }
          });
        } else {
          const id = buildData[category.field] as string | undefined;
          if (id) {
            const product = selectedProducts.get(id);
            if (product) {
              const isMemory = category.field === "memoryId";
              orderItemsData.push({
                productId: id,
                quantity: isMemory ? buildData.memoryQuantity : 1,
                product,
              });
            }
          }
        }
      });

      // Create order via API
      const rpcClient = await import("@/lib/rpc/client").then((m) =>
        m.getClient()
      );
      const response = await rpcClient.api.orders.checkout.$post({
        json: {
          customerName: "Guest Customer", // This should come from user session
          customerEmail: "guest@example.com", // This should come from user session
          shippingAddress: {
            street: "N/A",
            city: "N/A",
            state: "N/A",
            postalCode: "00000",
            country: "N/A",
          },
          paymentMethod: "bank_transfer",
          notes: `PC Build Order: ${buildData.name}\n\nBuild ID: ${buildId || "new"}\n\nThis order was created from PC Builder.`,
        },
      });

      if (response.ok) {
        const order = await response.json();
        setShowQuotationDialog(false);
        setIsCreatingOrder(false);

        // Show success message
        alert(`Order created successfully! Order Number: ${order.orderNumber}`);

        // Download quotation
        downloadQuotationFile();

        // Redirect to order page
        router.push(`/account/orders`);
      } else {
        const error = await response.json();
        throw new Error(error.message || "Failed to create order");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      alert(
        "Failed to create order. " +
          (error instanceof Error ? error.message : "Please try again.")
      );
      setIsCreatingOrder(false);
    }
  };

  const handleDownloadOnly = () => {
    downloadQuotationFile();
    setShowQuotationDialog(false);
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

  // Component categories configuration - in proper order
  const componentCategories = [
    {
      id: "processor",
      label: "Processor (CPU)",
      field: "processorId" as keyof BuildData,
      icon: "🔲",
    },
    {
      id: "motherboard",
      label: "Motherboard",
      field: "motherboardId" as keyof BuildData,
      icon: "🔲",
    },
    {
      id: "memory",
      label: "Memory (RAM)",
      field: "memoryId" as keyof BuildData,
      icon: "🔲",
      hasQuantity: true,
    },
    {
      id: "graphic_card",
      label: "Graphics Card",
      field: "graphicCardId" as keyof BuildData,
      icon: "🔲",
    },
    {
      id: "ssd_nvme",
      label: "Primary SSD/NVMe",
      field: "ssdNvmeId" as keyof BuildData,
      icon: "💾",
    },
    {
      id: "ssd_nvme_extra",
      label: "Extra SSD/NVMe",
      field: "extraSsdNvmeIds" as keyof BuildData,
      isArray: true,
      icon: "💾",
    },
    {
      id: "hard_disk",
      label: "Primary HDD",
      field: "hardDiskId" as keyof BuildData,
      icon: "💿",
    },
    {
      id: "hard_disk_extra",
      label: "Extra HDD",
      field: "extraHardDiskIds" as keyof BuildData,
      isArray: true,
      icon: "💿",
    },
    {
      id: "power_supply",
      label: "Power Supply",
      field: "powerSupplyId" as keyof BuildData,
      icon: "⚡",
    },
    {
      id: "cooler",
      label: "CPU Cooler",
      field: "coolerId" as keyof BuildData,
      icon: "❄️",
    },
    {
      id: "pc_case",
      label: "PC Case",
      field: "pcCaseId" as keyof BuildData,
      icon: "📦",
    },
    {
      id: "fan",
      label: "Case Fans",
      field: "fanIds" as keyof BuildData,
      isArray: true,
      icon: "🌀",
    },
    {
      id: "monitor",
      label: "Monitors",
      field: "monitorIds" as keyof BuildData,
      isArray: true,
      icon: "🖥️",
    },
    {
      id: "keyboard",
      label: "Keyboard",
      field: "keyboardId" as keyof BuildData,
      icon: "⌨️",
    },
    {
      id: "mouse",
      label: "Mouse",
      field: "mouseId" as keyof BuildData,
      icon: "🖱️",
    },
    {
      id: "mouse_pad",
      label: "Mouse Pad",
      field: "mousePadId" as keyof BuildData,
      icon: "🔲",
    },
    {
      id: "headset",
      label: "Headset",
      field: "headsetId" as keyof BuildData,
      icon: "🎧",
    },
    {
      id: "speaker",
      label: "Speakers",
      field: "speakerId" as keyof BuildData,
      icon: "🔊",
    },
    { id: "ups", label: "UPS", field: "upsId" as keyof BuildData, icon: "🔋" },
  ];

  const [selectedCategory, setSelectedCategory] = useState(
    componentCategories[0]
  );

  // Get count of selected items for a category
  const getCategoryItemCount = (category: (typeof componentCategories)[0]) => {
    if (category.isArray) {
      return (buildData[category.field] as string[]).length;
    }
    return buildData[category.field] ? 1 : 0;
  };

  // Remove an item from build
  const removeFromBuild = (field: keyof BuildData, productId?: string) => {
    if (productId) {
      // Remove from array
      setBuildData((prev) => ({
        ...prev,
        [field]: (prev[field] as string[]).filter((id) => id !== productId),
      }));
    } else {
      // Remove single item
      setBuildData((prev) => ({
        ...prev,
        [field]: undefined,
      }));

      // Reset memory quantity if removing memory
      if (field === "memoryId") {
        setBuildData((prev) => ({
          ...prev,
          memoryQuantity: 1,
        }));
      }
    }
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
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 border-b sticky top-0 z-40 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white drop-shadow-md">
                🖥️ Build My PC
              </h1>
              <p className="text-sm text-amber-100 font-medium">
                v2.2 by Game Zone Tech - Custom PC Configurator
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSave}
                className="rounded-lg bg-white text-amber-600 hover:bg-amber-50 font-semibold shadow-md transition-all hover:scale-105"
                disabled={createBuild.isPending || updateBuild.isPending}
              >
                <Save className="h-4 w-4 mr-2" />
                {buildId ? "Update Build" : "Save Build"}
              </Button>
              {buildId && (
                <Button
                  onClick={handleClone}
                  variant="outline"
                  className="rounded-lg bg-amber-500 text-white border-amber-400 hover:bg-amber-600 transition-all hover:scale-105"
                  disabled={cloneBuild.isPending}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Clone
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main 3-Column Layout */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN - Category Selection */}
          <div className="lg:col-span-3">
            <Card className="rounded-2xl shadow-lg border-0 bg-white sticky top-24">
              <CardHeader className="pb-3 bg-gradient-to-r from-amber-50 to-white rounded-t-2xl">
                <CardTitle className="text-base font-bold text-amber-900">
                  ⚙️ Components
                </CardTitle>
                <CardDescription className="text-xs">
                  Select a category to configure
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                {/* Chipset Filter */}
                <div className="px-4 py-3 bg-gray-50">
                  <div className="grid grid-cols-3 gap-1 p-1 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <Button
                      variant={chipsetFilter === "all" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setChipsetFilter("all")}
                      className={`rounded-md text-xs h-8 transition-all ${chipsetFilter === "all" ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md" : "hover:bg-gray-100"}`}
                    >
                      All
                    </Button>
                    <Button
                      variant={chipsetFilter === "intel" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setChipsetFilter("intel")}
                      className={`rounded-md text-xs h-8 transition-all ${chipsetFilter === "intel" ? "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-md" : "hover:bg-gray-100"}`}
                    >
                      Intel
                    </Button>
                    <Button
                      variant={chipsetFilter === "amd" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setChipsetFilter("amd")}
                      className={`rounded-md text-xs h-8 transition-all ${chipsetFilter === "amd" ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-md" : "hover:bg-gray-100"}`}
                    >
                      AMD
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* Category Grid */}
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="p-3">
                    <div className="grid grid-cols-2 gap-2">
                      {componentCategories.map((category) => {
                        const isSelected = selectedCategory.id === category.id;
                        const itemCount = getCategoryItemCount(category);
                        const hasSelection = itemCount > 0;

                        return (
                          <button
                            key={category.id}
                            onClick={() => {
                              setSelectedCategory(category);
                              setSelectedComponentType(category.id);
                            }}
                            className={`relative p-3 rounded-xl transition-all transform hover:scale-105 ${
                              isSelected
                                ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white shadow-lg ring-2 ring-amber-400 ring-offset-2"
                                : hasSelection
                                  ? "bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-400 hover:shadow-md"
                                  : "bg-white border-2 border-gray-200 hover:border-amber-300 hover:shadow-md"
                            }`}
                          >
                            <div className="text-center">
                              <div
                                className={`text-2xl mb-1 ${
                                  isSelected ? "animate-bounce" : ""
                                }`}
                              >
                                {category.icon}
                              </div>
                              <p
                                className={`font-semibold text-xs leading-tight ${
                                  isSelected ? "text-white" : "text-gray-900"
                                }`}
                              >
                                {category.label.replace(/\s*\([^)]*\)/g, "")}
                              </p>
                              {hasSelection && (
                                <Badge
                                  className={`mt-1 text-xs ${
                                    isSelected
                                      ? "bg-white text-amber-600"
                                      : "bg-green-600 text-white"
                                  }`}
                                >
                                  {itemCount}
                                </Badge>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* MIDDLE COLUMN - Product List with Quantity */}
          <div className="lg:col-span-5">
            <Card className="rounded-2xl shadow-lg border-0 bg-white">
              <CardHeader className="border-b bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                      <span className="text-2xl">{selectedCategory.icon}</span>
                      {selectedCategory.label}
                    </CardTitle>
                    <CardDescription className="text-xs mt-1">
                      {filteredProducts.length} products available
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsProductDialogOpen(true)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-all"
                  >
                    <Search className="h-4 w-4 mr-1" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <ScrollArea className="h-[calc(100vh-200px)]">
                <CardContent className="p-3 space-y-2">
                  {loadingProducts ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
                    </div>
                  ) : filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-500 text-sm">No products found</p>
                    </div>
                  ) : (
                    filteredProducts.map((product) => {
                      const isCompatible = isProductCompatible(product.id);
                      const isCurrentlySelected = selectedCategory.isArray
                        ? (
                            buildData[selectedCategory.field] as string[]
                          ).includes(product.id)
                        : buildData[selectedCategory.field] === product.id;
                      const isMemory = selectedCategory.field === "memoryId";
                      const isAnimating = animatingProduct === product.id;

                      return (
                        <div
                          key={product.id}
                          className={`p-3 rounded-xl border transition-all ${
                            isAnimating
                              ? "animate-pulse scale-105 border-amber-500 bg-amber-50 shadow-lg"
                              : isCurrentlySelected
                                ? "border-green-500 bg-gradient-to-r from-green-50 to-green-100 shadow-md"
                                : isCompatible
                                  ? "border-gray-200 bg-white hover:border-amber-400 hover:shadow-md transform hover:scale-[1.02]"
                                  : "border-gray-200 bg-gray-50 opacity-60"
                          }`}
                        >
                          <div className="flex gap-3">
                            {/* Product Image */}
                            <div className="relative w-16 h-16 flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden shadow-sm">
                              {product.images && product.images[0] ? (
                                <Image
                                  src={product.images[0].imageUrl}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-xs text-gray-400">
                                    📦
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Product Info */}
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm text-gray-900 line-clamp-1">
                                {product.name}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {product.brand?.name || "No brand"}
                              </p>
                              <div className="flex items-center gap-1 mt-1">
                                {isCurrentlySelected && (
                                  <Badge className="text-xs bg-green-600 px-2 py-0">
                                    ✓ Added
                                  </Badge>
                                )}
                                {!isCompatible && (
                                  <Badge
                                    variant="destructive"
                                    className="text-xs px-2 py-0"
                                  >
                                    ⚠ Incompatible
                                  </Badge>
                                )}
                              </div>

                              {/* Price */}
                              <div className="mt-1 font-bold text-sm text-amber-700">
                                <Price
                                  amount={
                                    product.discountPrice || product.price
                                  }
                                />
                              </div>
                            </div>

                            {/* Action Button / Quantity Control */}
                            <div className="flex flex-col items-end justify-between">
                              {isCurrentlySelected ? (
                                <>
                                  {isMemory && (
                                    <div className="flex items-center gap-2 mb-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 w-7 p-0"
                                        onClick={() => {
                                          if (buildData.memoryQuantity > 1) {
                                            setBuildData((prev) => ({
                                              ...prev,
                                              memoryQuantity:
                                                prev.memoryQuantity - 1,
                                            }));
                                          }
                                        }}
                                      >
                                        -
                                      </Button>
                                      <span className="text-sm font-medium w-8 text-center">
                                        {buildData.memoryQuantity}
                                      </span>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="h-7 w-7 p-0"
                                        onClick={() => {
                                          if (buildData.memoryQuantity < 8) {
                                            setBuildData((prev) => ({
                                              ...prev,
                                              memoryQuantity:
                                                prev.memoryQuantity + 1,
                                            }));
                                          }
                                        }}
                                      >
                                        +
                                      </Button>
                                    </div>
                                  )}
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() =>
                                      removeFromBuild(
                                        selectedCategory.field,
                                        selectedCategory.isArray
                                          ? product.id
                                          : undefined
                                      )
                                    }
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : (
                                <Button
                                  size="sm"
                                  disabled={!isCompatible}
                                  onClick={() => {
                                    setSelectedField(selectedCategory.field);
                                    setIsArrayField(
                                      selectedCategory.isArray || false
                                    );
                                    handleProductSelect(product);
                                  }}
                                  className="bg-amber-500 hover:bg-amber-600 mt-auto"
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>

          {/* RIGHT COLUMN - Build Summary */}
          <div className="lg:col-span-4">
            <Card className="rounded-2xl shadow-sm border-0 bg-white sticky top-24">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">Your Build</CardTitle>
                <CardDescription className="text-xs">
                  Selected components
                </CardDescription>
              </CardHeader>
              <ScrollArea className="h-[calc(100vh-280px)]">
                <CardContent className="p-4 space-y-3">
                  {/* Build Name */}
                  <div className="mb-4">
                    <Label
                      htmlFor="buildName"
                      className="text-xs text-gray-600"
                    >
                      Build Name
                    </Label>
                    <Input
                      id="buildName"
                      value={buildData.name}
                      onChange={(e) =>
                        setBuildData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="My PC Build"
                      className="rounded-lg mt-1"
                    />
                  </div>

                  <Separator className="my-4" />

                  {/* Selected Components */}
                  {componentCategories.map((category) => {
                    const items: Array<{ id: string; product?: Product }> = [];

                    if (category.isArray) {
                      const ids = buildData[category.field] as string[];
                      ids.forEach((id) => {
                        items.push({ id, product: selectedProducts.get(id) });
                      });
                    } else {
                      const id = buildData[category.field] as
                        | string
                        | undefined;
                      if (id) {
                        items.push({ id, product: selectedProducts.get(id) });
                      }
                    }

                    if (items.length === 0) return null;

                    return (
                      <div key={category.id} className="mb-4">
                        <h4 className="text-xs font-semibold text-gray-600 mb-2">
                          {category.label}
                        </h4>
                        <div className="space-y-2">
                          {items.map((item, idx) => {
                            const product = item.product;
                            if (!product) return null;

                            const isMemory = category.field === "memoryId";
                            const price =
                              typeof (
                                product.discountPrice || product.price
                              ) === "string"
                                ? parseFloat(
                                    (product.discountPrice as string) ||
                                      (product.price as string)
                                  )
                                : product.discountPrice || product.price;
                            const totalPrice = isMemory
                              ? price * buildData.memoryQuantity
                              : price;

                            return (
                              <div
                                key={idx}
                                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-start gap-2">
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 line-clamp-2">
                                      {product.name}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                      {product.brand?.name}
                                    </p>
                                    {isMemory &&
                                      buildData.memoryQuantity > 1 && (
                                        <p className="text-xs text-blue-600 mt-1">
                                          Qty: {buildData.memoryQuantity}
                                        </p>
                                      )}
                                    <p className="text-sm font-bold text-gray-900 mt-1">
                                      <Price amount={totalPrice} />
                                    </p>
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    onClick={() =>
                                      removeFromBuild(
                                        category.field,
                                        category.isArray ? item.id : undefined
                                      )
                                    }
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}

                  {Object.values(buildData).filter(
                    (v) => v && (Array.isArray(v) ? v.length > 0 : true)
                  ).length === 3 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">
                        No components selected yet
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Start adding components from the list
                      </p>
                    </div>
                  )}
                </CardContent>
              </ScrollArea>

              {/* Compatibility Issues */}
              {compatibilityIssues.length > 0 && (
                <>
                  <Separator />
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <h4 className="text-sm font-semibold text-gray-900">
                        Compatibility Issues
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {compatibilityIssues.slice(0, 3).map((issue, index) => (
                        <Alert
                          key={index}
                          variant={
                            issue.severity === "error"
                              ? "destructive"
                              : "default"
                          }
                          className="py-2"
                        >
                          <AlertDescription className="text-xs">
                            {issue.message}
                          </AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </div>
                </>
              )}
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
              <p className="text-xs text-blue-600 mt-1">
                Monthly payments available
              </p>
            </div>

            {/* Right - Action Buttons */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleDownloadQuotation}
                className="rounded-full px-6 border-amber-500 text-amber-600 hover:bg-amber-50"
                disabled={totalPrice === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Quotation
              </Button>
              <Button
                className="rounded-full px-6 bg-amber-600 hover:bg-amber-700"
                onClick={() => router.push("/account/builds")}
              >
                View My Builds
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

      {/* Quotation Confirmation Dialog */}
      <Dialog open={showQuotationDialog} onOpenChange={setShowQuotationDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Download Quotation
            </DialogTitle>
            <DialogDescription>
              Review your PC build quotation and optionally confirm your order
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Build Summary */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-4 rounded-lg border-2 border-amber-200">
              <h3 className="font-bold text-lg mb-2 text-amber-900">
                {buildData.name}
              </h3>
              <p className="text-sm text-amber-700">
                Generated on {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Components List */}
            <ScrollArea className="h-[300px] border rounded-lg">
              <div className="p-4 space-y-3">
                {componentCategories.map((category) => {
                  const items: Array<{ id: string; product?: Product }> = [];

                  if (category.isArray) {
                    const ids = buildData[category.field] as string[];
                    ids.forEach((id) =>
                      items.push({ id, product: selectedProducts.get(id) })
                    );
                  } else {
                    const id = buildData[category.field] as string | undefined;
                    if (id)
                      items.push({ id, product: selectedProducts.get(id) });
                  }

                  if (items.length === 0) return null;

                  return (
                    <div key={category.id} className="mb-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                        <span>{category.icon}</span>
                        {category.label}
                      </h4>
                      <div className="space-y-2 ml-6">
                        {items.map((item, idx) => {
                          const product = item.product;
                          if (!product) return null;

                          const isMemory = category.field === "memoryId";
                          const price =
                            typeof (product.discountPrice || product.price) ===
                            "string"
                              ? parseFloat(
                                  (product.discountPrice as string) ||
                                    (product.price as string)
                                )
                              : product.discountPrice || product.price;
                          const totalPrice = isMemory
                            ? price * buildData.memoryQuantity
                            : price;
                          const qty =
                            isMemory && buildData.memoryQuantity > 1
                              ? ` (x${buildData.memoryQuantity})`
                              : "";

                          return (
                            <div
                              key={idx}
                              className="flex items-center justify-between text-sm bg-white p-2 rounded border"
                            >
                              <div className="flex items-center gap-2 flex-1">
                                {product.images && product.images[0] && (
                                  <div className="relative w-10 h-10 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                                    <Image
                                      src={product.images[0].imageUrl}
                                      alt={product.name}
                                      fill
                                      className="object-cover"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-gray-900 truncate">
                                    {product.name}
                                    {qty}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {product.brand?.name || "No brand"}
                                  </p>
                                </div>
                              </div>
                              <div className="font-semibold text-amber-700 ml-4">
                                Rs. {totalPrice.toFixed(2)}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>

            {/* Total */}
            <div className="bg-gray-900 text-white p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">TOTAL AMOUNT</span>
                <span className="text-2xl font-bold">
                  Rs. {totalPrice.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setShowQuotationDialog(false)}
                className="flex-1"
                disabled={isCreatingOrder}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                onClick={handleDownloadOnly}
                className="flex-1 border-amber-500 text-amber-600 hover:bg-amber-50"
                disabled={isCreatingOrder}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Only
              </Button>
              <Button
                onClick={handleConfirmOrder}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                disabled={isCreatingOrder}
              >
                {isCreatingOrder ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Creating Order...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Confirm Order & Download
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-gray-500 mt-2">
              💡 Confirming order will save it to your orders and update
              inventory stock
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
