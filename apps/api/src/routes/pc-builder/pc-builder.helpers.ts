import { productComponentSpecs, products } from "@repo/database";
import { and, eq, inArray } from "drizzle-orm";
import { db } from "../../db";

// Compatibility check result interface
export interface CompatibilityIssue {
  severity: "error" | "warning" | "info";
  component: string;
  message: string;
}

/**
 * Check compatibility between components
 */
export async function checkBuildCompatibility(buildComponents: {
  processorId?: string;
  motherboardId?: string;
  memoryId?: string;
  memoryQuantity?: number;
  graphicCardId?: string;
  ssdNvmeId?: string;
  hardDiskId?: string;
  powerSupplyId?: string;
  coolerId?: string;
  pcCaseId?: string;
  fanIds?: string[];
  extraSsdNvmeIds?: string[];
  extraHardDiskIds?: string[];
}): Promise<{
  isCompatible: boolean;
  issues: CompatibilityIssue[];
  estimatedWattage: number;
}> {
  const issues: CompatibilityIssue[] = [];
  let estimatedWattage = 0;

  // Fetch component specifications
  const componentIds = [
    buildComponents.processorId,
    buildComponents.motherboardId,
    buildComponents.memoryId,
    buildComponents.graphicCardId,
    buildComponents.ssdNvmeId,
    buildComponents.hardDiskId,
    buildComponents.powerSupplyId,
    buildComponents.coolerId,
    buildComponents.pcCaseId,
    ...(buildComponents.fanIds || []),
    ...(buildComponents.extraSsdNvmeIds || []),
    ...(buildComponents.extraHardDiskIds || []),
  ].filter(Boolean) as string[];

  if (componentIds.length === 0) {
    return { isCompatible: true, issues: [], estimatedWattage: 0 };
  }

  const specs = await db
    .select()
    .from(productComponentSpecs)
    .where(inArray(productComponentSpecs.productId, componentIds));

  const specMap = new Map(specs.map((s) => [s.productId, s]));

  const processorSpec = buildComponents.processorId
    ? specMap.get(buildComponents.processorId)
    : null;
  const motherboardSpec = buildComponents.motherboardId
    ? specMap.get(buildComponents.motherboardId)
    : null;
  const memorySpec = buildComponents.memoryId
    ? specMap.get(buildComponents.memoryId)
    : null;
  const graphicCardSpec = buildComponents.graphicCardId
    ? specMap.get(buildComponents.graphicCardId)
    : null;
  const powerSupplySpec = buildComponents.powerSupplyId
    ? specMap.get(buildComponents.powerSupplyId)
    : null;
  const coolerSpec = buildComponents.coolerId
    ? specMap.get(buildComponents.coolerId)
    : null;
  const caseSpec = buildComponents.pcCaseId
    ? specMap.get(buildComponents.pcCaseId)
    : null;

  // 1. Socket compatibility (Processor vs Motherboard)
  if (processorSpec && motherboardSpec) {
    if (processorSpec.socketType !== motherboardSpec.socketType) {
      issues.push({
        severity: "error",
        component: "Processor/Motherboard",
        message: `Socket mismatch: Processor (${processorSpec.socketType}) is not compatible with Motherboard (${motherboardSpec.socketType})`,
      });
    }
  }

  // 2. Memory type compatibility (Memory vs Motherboard)
  if (memorySpec && motherboardSpec) {
    if (memorySpec.memoryType !== motherboardSpec.memoryType) {
      issues.push({
        severity: "error",
        component: "Memory/Motherboard",
        message: `Memory type mismatch: RAM (${memorySpec.memoryType}) is not compatible with Motherboard (${motherboardSpec.memoryType})`,
      });
    }

    // Check memory capacity
    const memoryQuantity = buildComponents.memoryQuantity || 1;
    const totalMemory = (memorySpec.memoryCapacity || 0) * memoryQuantity;
    if (motherboardSpec.maxMemory && totalMemory > motherboardSpec.maxMemory) {
      issues.push({
        severity: "error",
        component: "Memory/Motherboard",
        message: `Memory capacity exceeded: ${totalMemory}GB exceeds motherboard maximum of ${motherboardSpec.maxMemory}GB`,
      });
    }

    // Check memory slots
    if (
      motherboardSpec.memorySlots &&
      memoryQuantity > motherboardSpec.memorySlots
    ) {
      issues.push({
        severity: "error",
        component: "Memory/Motherboard",
        message: `Too many memory sticks: ${memoryQuantity} exceeds available slots (${motherboardSpec.memorySlots})`,
      });
    }
  }

  // 3. Cooler compatibility (Cooler vs Processor)
  if (coolerSpec && processorSpec) {
    // Check socket compatibility
    if (
      coolerSpec.compatibleSockets &&
      coolerSpec.compatibleSockets.length > 0 &&
      processorSpec.socketType
    ) {
      if (!coolerSpec.compatibleSockets.includes(processorSpec.socketType)) {
        issues.push({
          severity: "error",
          component: "Cooler/Processor",
          message: `Cooler is not compatible with processor socket (${processorSpec.socketType})`,
        });
      }
    }

    // Check TDP
    if (coolerSpec.maxTdp && processorSpec.tdp) {
      if (processorSpec.tdp > coolerSpec.maxTdp) {
        issues.push({
          severity: "warning",
          component: "Cooler/Processor",
          message: `Cooler may not adequately cool processor (CPU TDP: ${processorSpec.tdp}W, Cooler max: ${coolerSpec.maxTdp}W)`,
        });
      }
    }
  }

  // 4. Case compatibility checks
  if (caseSpec) {
    // Check GPU length
    if (graphicCardSpec && caseSpec.maxGpuLength && graphicCardSpec.length) {
      if (graphicCardSpec.length > caseSpec.maxGpuLength) {
        issues.push({
          severity: "error",
          component: "Graphics Card/Case",
          message: `Graphics card (${graphicCardSpec.length}mm) is too long for case (max ${caseSpec.maxGpuLength}mm)`,
        });
      }
    }

    // Check cooler height (for air coolers)
    if (
      coolerSpec &&
      coolerSpec.coolerType === "air" &&
      caseSpec.maxCoolerHeight &&
      coolerSpec.height
    ) {
      if (coolerSpec.height > caseSpec.maxCoolerHeight) {
        issues.push({
          severity: "error",
          component: "Cooler/Case",
          message: `Cooler (${coolerSpec.height}mm) is too tall for case (max ${caseSpec.maxCoolerHeight}mm)`,
        });
      }
    }

    // Check motherboard form factor
    if (motherboardSpec && motherboardSpec.formFactor) {
      const caseFormFactors = ["atx", "micro_atx", "mini_itx"];
      const motherboardFormFactors = {
        e_atx: 0,
        atx: 1,
        micro_atx: 2,
        mini_itx: 3,
      };

      // This is simplified - in reality, you'd check case specs for supported form factors
      // For now, we assume ATX cases support all smaller form factors
    }
  }

  // 5. Power supply wattage calculation and check
  if (processorSpec?.tdp) {
    estimatedWattage += processorSpec.tdp;
  }

  if (graphicCardSpec?.recommendedPsu) {
    // GPU recommended PSU usually includes system power
    estimatedWattage = Math.max(
      estimatedWattage,
      graphicCardSpec.recommendedPsu
    );
  } else if (graphicCardSpec?.vram) {
    // Rough estimate based on VRAM (not accurate, but better than nothing)
    estimatedWattage += graphicCardSpec.vram * 20;
  }

  // Add overhead for other components (rough estimate)
  estimatedWattage += 100; // Motherboard, storage, fans, etc.

  if (powerSupplySpec?.wattage) {
    const recommendedWattage = estimatedWattage * 1.2; // 20% headroom
    if (powerSupplySpec.wattage < estimatedWattage) {
      issues.push({
        severity: "error",
        component: "Power Supply",
        message: `Power supply (${powerSupplySpec.wattage}W) is insufficient for this build (estimated ${Math.round(estimatedWattage)}W needed)`,
      });
    } else if (powerSupplySpec.wattage < recommendedWattage) {
      issues.push({
        severity: "warning",
        component: "Power Supply",
        message: `Power supply (${powerSupplySpec.wattage}W) has minimal headroom. Recommended: ${Math.round(recommendedWattage)}W+`,
      });
    }
  }

  // 6. Storage interface checks
  if (motherboardSpec) {
    // Count M.2 slots needed
    const m2Drives = [
      buildComponents.ssdNvmeId,
      ...(buildComponents.extraSsdNvmeIds || []),
    ].filter(Boolean);

    const m2Specs = m2Drives
      .map((id) => specMap.get(id as string))
      .filter((s) => s?.storageInterface?.toLowerCase().includes("m.2"));

    if (motherboardSpec.m2Slots && m2Specs.length > motherboardSpec.m2Slots) {
      issues.push({
        severity: "error",
        component: "Storage/Motherboard",
        message: `Too many M.2 drives (${m2Specs.length}) for available slots (${motherboardSpec.m2Slots})`,
      });
    }

    // Count SATA drives needed
    const sataDrives = [
      buildComponents.hardDiskId,
      ...(buildComponents.extraHardDiskIds || []),
    ].filter(Boolean);

    const sataSpecs = sataDrives
      .map((id) => specMap.get(id as string))
      .filter((s) => s?.storageInterface?.toLowerCase().includes("sata"));

    if (
      motherboardSpec.sataSlots &&
      sataSpecs.length > motherboardSpec.sataSlots
    ) {
      issues.push({
        severity: "warning",
        component: "Storage/Motherboard",
        message: `Many SATA drives (${sataSpecs.length}) may exceed available SATA ports (${motherboardSpec.sataSlots})`,
      });
    }
  }

  // 7. Check if critical components are missing
  if (!processorSpec && buildComponents.processorId) {
    issues.push({
      severity: "info",
      component: "Processor",
      message:
        "Processor specifications not found. Cannot verify compatibility.",
    });
  }

  if (!motherboardSpec && buildComponents.motherboardId) {
    issues.push({
      severity: "info",
      component: "Motherboard",
      message:
        "Motherboard specifications not found. Cannot verify compatibility.",
    });
  }

  const isCompatible = !issues.some((issue) => issue.severity === "error");

  return {
    isCompatible,
    issues,
    estimatedWattage: Math.round(estimatedWattage),
  };
}

/**
 * Calculate total price for a build
 */
export async function calculateBuildPrice(buildComponents: {
  processorId?: string;
  motherboardId?: string;
  memoryId?: string;
  memoryQuantity?: number;
  graphicCardId?: string;
  ssdNvmeId?: string;
  hardDiskId?: string;
  powerSupplyId?: string;
  coolerId?: string;
  pcCaseId?: string;
  fanIds?: string[];
  extraSsdNvmeIds?: string[];
  extraHardDiskIds?: string[];
  monitorIds?: string[];
  softwareIds?: string[];
  keyboardId?: string;
  mouseId?: string;
  mousePadId?: string;
  headsetId?: string;
  speakerId?: string;
  upsId?: string;
  tableId?: string;
  chairId?: string;
  thermalPasteId?: string;
  cableIds?: string[];
}): Promise<number> {
  const componentIds = [
    buildComponents.processorId,
    buildComponents.motherboardId,
    buildComponents.memoryId,
    buildComponents.graphicCardId,
    buildComponents.ssdNvmeId,
    buildComponents.hardDiskId,
    buildComponents.powerSupplyId,
    buildComponents.coolerId,
    buildComponents.pcCaseId,
    buildComponents.keyboardId,
    buildComponents.mouseId,
    buildComponents.mousePadId,
    buildComponents.headsetId,
    buildComponents.speakerId,
    buildComponents.upsId,
    buildComponents.tableId,
    buildComponents.chairId,
    buildComponents.thermalPasteId,
    ...(buildComponents.fanIds || []),
    ...(buildComponents.extraSsdNvmeIds || []),
    ...(buildComponents.extraHardDiskIds || []),
    ...(buildComponents.monitorIds || []),
    ...(buildComponents.softwareIds || []),
    ...(buildComponents.cableIds || []),
  ].filter(Boolean) as string[];

  if (componentIds.length === 0) {
    return 0;
  }

  const productPrices = await db
    .select({
      id: products.id,
      price: products.price,
    })
    .from(products)
    .where(inArray(products.id, componentIds));

  let totalPrice = 0;

  productPrices.forEach((product) => {
    const price = parseFloat(product.price);

    // Handle memory quantity
    if (product.id === buildComponents.memoryId) {
      totalPrice += price * (buildComponents.memoryQuantity || 1);
    } else {
      // Count how many times this product appears in arrays
      let quantity = 1;

      if (buildComponents.fanIds?.includes(product.id)) {
        quantity = buildComponents.fanIds.filter(
          (id) => id === product.id
        ).length;
      } else if (buildComponents.extraSsdNvmeIds?.includes(product.id)) {
        quantity = buildComponents.extraSsdNvmeIds.filter(
          (id) => id === product.id
        ).length;
      } else if (buildComponents.extraHardDiskIds?.includes(product.id)) {
        quantity = buildComponents.extraHardDiskIds.filter(
          (id) => id === product.id
        ).length;
      } else if (buildComponents.monitorIds?.includes(product.id)) {
        quantity = buildComponents.monitorIds.filter(
          (id) => id === product.id
        ).length;
      } else if (buildComponents.softwareIds?.includes(product.id)) {
        quantity = buildComponents.softwareIds.filter(
          (id) => id === product.id
        ).length;
      } else if (buildComponents.cableIds?.includes(product.id)) {
        quantity = buildComponents.cableIds.filter(
          (id) => id === product.id
        ).length;
      }

      totalPrice += price * quantity;
    }
  });

  return totalPrice;
}

/**
 * Get compatible components based on current build
 */
export async function getCompatibleComponents(
  componentType: string,
  currentComponents?: {
    processorId?: string;
    motherboardId?: string;
    memoryId?: string;
    graphicCardId?: string;
    pcCaseId?: string;
    powerSupplyId?: string;
  }
) {
  let query = db
    .select({
      product: products,
      specs: productComponentSpecs,
    })
    .from(productComponentSpecs)
    .innerJoin(products, eq(products.id, productComponentSpecs.productId))
    .where(
      and(
        eq(productComponentSpecs.componentType, componentType as any),
        eq(products.isActive, true)
      )
    );

  const results = await query;

  if (!currentComponents) {
    return results.map((r) => ({ ...r.product, specs: r.specs }));
  }

  // Filter based on compatibility
  const compatibleResults = [];

  for (const result of results) {
    const testBuild = {
      ...currentComponents,
      [`${componentType}Id`]: result.product.id,
    };

    const { isCompatible, issues } = await checkBuildCompatibility(testBuild);

    // Only include if no errors (warnings are ok)
    const hasErrors = issues.some((issue) => issue.severity === "error");
    if (!hasErrors) {
      compatibleResults.push({
        ...result.product,
        specs: result.specs,
        compatibilityWarnings: issues.filter((i) => i.severity === "warning"),
      });
    }
  }

  return compatibleResults;
}
