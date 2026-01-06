import { z } from "zod";

// Component type validation
export const componentTypeSchema = z.enum([
  "processor",
  "motherboard",
  "memory",
  "graphic_card",
  "ssd_nvme",
  "hard_disk",
  "power_supply",
  "cooler",
  "pc_case",
  "fan",
  "monitor",
  "software",
  "keyboard",
  "mouse",
  "mouse_pad",
  "headset",
  "speaker",
  "ups",
  "table",
  "chair",
  "thermal_paste",
  "cable",
]);

export const socketTypeSchema = z.enum([
  "lga1700",
  "lga1200",
  "lga1151",
  "am5",
  "am4",
  "strx4",
  "other",
]);

export const memoryTypeSchema = z.enum(["ddr5", "ddr4", "ddr3", "other"]);

export const formFactorSchema = z.enum([
  "atx",
  "micro_atx",
  "mini_itx",
  "e_atx",
  "other",
]);

export const coolerTypeSchema = z.enum(["air", "aio_liquid", "custom_liquid"]);

// Product Component Specs schema
export const createComponentSpecsSchema = z.object({
  productId: z.string(),
  componentType: componentTypeSchema,

  // Processor specs
  socketType: socketTypeSchema.optional(),
  cores: z.number().int().positive().optional(),
  threads: z.number().int().positive().optional(),
  baseClock: z.number().positive().optional(),
  boostClock: z.number().positive().optional(),
  tdp: z.number().int().positive().optional(),
  integratedGraphics: z.boolean().optional(),

  // Motherboard specs
  chipset: z.string().max(100).optional(),
  formFactor: formFactorSchema.optional(),
  memoryType: memoryTypeSchema.optional(),
  maxMemory: z.number().int().positive().optional(),
  memorySlots: z.number().int().positive().optional(),
  pciSlots: z.number().int().optional(),
  m2Slots: z.number().int().optional(),
  sataSlots: z.number().int().optional(),

  // Memory specs
  memoryCapacity: z.number().int().positive().optional(),
  memorySpeed: z.number().int().positive().optional(),
  memoryLatency: z.string().max(50).optional(),

  // Graphics Card specs
  gpuChipset: z.string().max(100).optional(),
  vram: z.number().int().positive().optional(),
  powerConnectors: z.string().max(100).optional(),
  recommendedPsu: z.number().int().positive().optional(),
  slotWidth: z.number().positive().optional(),
  length: z.number().int().positive().optional(),

  // Storage specs
  storageCapacity: z.number().int().positive().optional(),
  storageInterface: z.string().max(50).optional(),
  formFactorStorage: z.string().max(50).optional(),
  readSpeed: z.number().int().positive().optional(),
  writeSpeed: z.number().int().positive().optional(),

  // Power Supply specs
  wattage: z.number().int().positive().optional(),
  efficiency: z.string().max(50).optional(),
  modular: z.string().max(50).optional(),

  // Cooler specs
  coolerType: coolerTypeSchema.optional(),
  compatibleSockets: z.array(z.string()).optional(),
  maxTdp: z.number().int().positive().optional(),
  radiatorSize: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),

  // PC Case specs
  maxGpuLength: z.number().int().positive().optional(),
  maxCoolerHeight: z.number().int().positive().optional(),
  maxPsuLength: z.number().int().positive().optional(),
  frontFans: z.string().max(50).optional(),
  topFans: z.string().max(50).optional(),
  rearFans: z.string().max(50).optional(),
  radiatorSupport: z.string().max(100).optional(),
  driveBays25: z.number().int().optional(),
  driveBays35: z.number().int().optional(),

  // Fan specs
  fanSize: z.number().int().positive().optional(),
  fanRpm: z.string().max(50).optional(),
  noiseLevel: z.number().positive().optional(),

  // Additional specs
  additionalSpecs: z.record(z.any()).optional(),
});

export const updateComponentSpecsSchema = createComponentSpecsSchema.partial();

// PC Build schemas
export const createPcBuildSchema = z.object({
  name: z.string().min(1).max(255).default("My PC Build"),
  description: z.string().optional(),

  // Core components
  processorId: z.string().optional(),
  motherboardId: z.string().optional(),
  memoryId: z.string().optional(),
  memoryQuantity: z.number().int().min(1).max(8).default(1),
  graphicCardId: z.string().optional(),
  ssdNvmeId: z.string().optional(),
  hardDiskId: z.string().optional(),
  powerSupplyId: z.string().optional(),
  coolerId: z.string().optional(),
  pcCaseId: z.string().optional(),

  // Additional components
  fanIds: z.array(z.string()).optional(),
  extraSsdNvmeIds: z.array(z.string()).optional(),
  extraHardDiskIds: z.array(z.string()).optional(),

  // Accessories
  monitorIds: z.array(z.string()).optional(),
  softwareIds: z.array(z.string()).optional(),
  keyboardId: z.string().optional(),
  mouseId: z.string().optional(),
  mousePadId: z.string().optional(),
  headsetId: z.string().optional(),
  speakerId: z.string().optional(),
  upsId: z.string().optional(),
  tableId: z.string().optional(),
  chairId: z.string().optional(),
  thermalPasteId: z.string().optional(),
  cableIds: z.array(z.string()).optional(),

  // Metadata
  isPublic: z.boolean().default(false),
  isTemplate: z.boolean().default(false),
});

export const updatePcBuildSchema = createPcBuildSchema.partial();

// Compatibility check schema
export const compatibilityCheckSchema = z.object({
  processorId: z.string().optional(),
  motherboardId: z.string().optional(),
  memoryId: z.string().optional(),
  memoryQuantity: z.number().int().min(1).max(8).optional(),
  graphicCardId: z.string().optional(),
  ssdNvmeId: z.string().optional(),
  hardDiskId: z.string().optional(),
  powerSupplyId: z.string().optional(),
  coolerId: z.string().optional(),
  pcCaseId: z.string().optional(),
  fanIds: z.array(z.string()).optional(),
  extraSsdNvmeIds: z.array(z.string()).optional(),
  extraHardDiskIds: z.array(z.string()).optional(),
});

// Get compatible components schema
export const getCompatibleComponentsSchema = z.object({
  componentType: componentTypeSchema,
  buildId: z.string().optional(),
  currentComponents: z
    .object({
      processorId: z.string().optional(),
      motherboardId: z.string().optional(),
      memoryId: z.string().optional(),
      graphicCardId: z.string().optional(),
      pcCaseId: z.string().optional(),
      powerSupplyId: z.string().optional(),
    })
    .optional(),
});

// Compatibility rule schema
export const createCompatibilityRuleSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  ruleType: z.string().max(50),
  primaryComponent: componentTypeSchema,
  secondaryComponent: componentTypeSchema.optional(),
  ruleDefinition: z.object({
    condition: z.string(),
    parameters: z.record(z.any()),
    errorMessage: z.string().optional(),
    warningMessage: z.string().optional(),
  }),
  severity: z.enum(["error", "warning", "info"]).default("error"),
  isActive: z.boolean().default(true),
  priority: z.number().int().default(0),
});

export const updateCompatibilityRuleSchema =
  createCompatibilityRuleSchema.partial();

// Query schemas
export const getPcBuildsQuerySchema = z.object({
  userId: z.string().optional(),
  isPublic: z.boolean().optional(),
  isTemplate: z.boolean().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});

export const getComponentsQuerySchema = z.object({
  componentType: componentTypeSchema.optional(),
  socketType: socketTypeSchema.optional(),
  memoryType: memoryTypeSchema.optional(),
  formFactor: formFactorSchema.optional(),
  minPrice: z.number().positive().optional(),
  maxPrice: z.number().positive().optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
});
