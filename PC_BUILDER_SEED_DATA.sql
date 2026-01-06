-- PC Builder Feature Migration and Seed Data Guide

-- ============================================
-- ENUMS
-- ============================================

-- Component types
CREATE TYPE component_type AS ENUM (
  'processor',
  'motherboard',
  'memory',
  'graphic_card',
  'ssd_nvme',
  'hard_disk',
  'power_supply',
  'cooler',
  'pc_case',
  'fan',
  'monitor',
  'software',
  'keyboard',
  'mouse',
  'mouse_pad',
  'headset',
  'speaker',
  'ups',
  'table',
  'chair',
  'thermal_paste',
  'cable'
);

-- Socket types
CREATE TYPE socket_type AS ENUM (
  'lga1700',
  'lga1200',
  'lga1151',
  'am5',
  'am4',
  'strx4',
  'other'
);

-- Memory types
CREATE TYPE memory_type AS ENUM (
  'ddr5',
  'ddr4',
  'ddr3',
  'other'
);

-- Form factors
CREATE TYPE form_factor AS ENUM (
  'atx',
  'micro_atx',
  'mini_itx',
  'e_atx',
  'other'
);

-- Cooler types
CREATE TYPE cooler_type AS ENUM (
  'air',
  'aio_liquid',
  'custom_liquid'
);

-- ============================================
-- SAMPLE SEED DATA
-- ============================================

-- Example: Intel Core i9-14900K Processor Specs
INSERT INTO product_component_specs (
  product_id,
  component_type,
  socket_type,
  cores,
  threads,
  base_clock,
  boost_clock,
  tdp,
  integrated_graphics
) VALUES (
  'product-id-for-i9-14900k',
  'processor',
  'lga1700',
  24,
  32,
  3.2,
  6.0,
  125,
  true
);

-- Example: ASUS ROG Maximus Z790 Hero Motherboard Specs
INSERT INTO product_component_specs (
  product_id,
  component_type,
  socket_type,
  chipset,
  form_factor,
  memory_type,
  max_memory,
  memory_slots,
  pci_slots,
  m2_slots,
  sata_slots
) VALUES (
  'product-id-for-asus-z790',
  'motherboard',
  'lga1700',
  'Z790',
  'atx',
  'ddr5',
  128,
  4,
  3,
  5,
  6
);

-- Example: Corsair Vengeance DDR5 32GB Memory Specs
INSERT INTO product_component_specs (
  product_id,
  component_type,
  memory_type,
  memory_capacity,
  memory_speed,
  memory_latency
) VALUES (
  'product-id-for-corsair-ddr5-32gb',
  'memory',
  'ddr5',
  32,
  6000,
  'CL36'
);

-- Example: RTX 4090 Graphics Card Specs
INSERT INTO product_component_specs (
  product_id,
  component_type,
  gpu_chipset,
  vram,
  power_connectors,
  recommended_psu,
  slot_width,
  length
) VALUES (
  'product-id-for-rtx-4090',
  'graphic_card',
  'RTX 4090',
  24,
  '1x 16-pin',
  850,
  3.5,
  336
);

-- Example: Samsung 990 PRO 2TB SSD Specs
INSERT INTO product_component_specs (
  product_id,
  component_type,
  storage_capacity,
  storage_interface,
  form_factor_storage,
  read_speed,
  write_speed
) VALUES (
  'product-id-for-samsung-990-pro',
  'ssd_nvme',
  2048,
  'NVMe PCIe 4.0',
  'M.2 2280',
  7450,
  6900
);

-- Example: Corsair RM1000x Power Supply Specs
INSERT INTO product_component_specs (
  product_id,
  component_type,
  wattage,
  efficiency,
  modular
) VALUES (
  'product-id-for-corsair-rm1000x',
  'power_supply',
  1000,
  '80+ Gold',
  'Fully Modular'
);

-- Example: NZXT Kraken Z73 AIO Cooler Specs
INSERT INTO product_component_specs (
  product_id,
  component_type,
  cooler_type,
  compatible_sockets,
  max_tdp,
  radiator_size
) VALUES (
  'product-id-for-nzxt-kraken-z73',
  'cooler',
  'aio_liquid',
  ARRAY['lga1700', 'lga1200', 'lga1151', 'am5', 'am4'],
  280,
  360
);

-- Example: Lian Li O11 Dynamic EVO Case Specs
INSERT INTO product_component_specs (
  product_id,
  component_type,
  form_factor,
  max_gpu_length,
  max_cooler_height,
  radiator_support,
  drive_bays_25,
  drive_bays_35,
  front_fans,
  top_fans,
  rear_fans
) VALUES (
  'product-id-for-lian-li-o11',
  'pc_case',
  'atx',
  420,
  167,
  'Front: 360mm, Top: 360mm, Side: 360mm',
  4,
  2,
  '3x 120mm',
  '3x 120mm',
  '1x 120mm'
);

-- Example: Noctua NF-A12x25 Fan Specs
INSERT INTO product_component_specs (
  product_id,
  component_type,
  fan_size,
  fan_rpm,
  noise_level
) VALUES (
  'product-id-for-noctua-nf-a12',
  'fan',
  120,
  '450-2000 RPM',
  22.6
);

-- ============================================
-- EXAMPLE COMPATIBILITY RULES
-- ============================================

-- Rule: Socket must match between CPU and Motherboard
INSERT INTO compatibility_rules (
  name,
  description,
  rule_type,
  primary_component,
  secondary_component,
  rule_definition,
  severity,
  is_active,
  priority
) VALUES (
  'CPU-Motherboard Socket Match',
  'Processor socket type must match motherboard socket type',
  'socket_match',
  'processor',
  'motherboard',
  '{
    "condition": "socket_match",
    "parameters": {
      "field1": "socketType",
      "field2": "socketType"
    },
    "errorMessage": "Processor socket does not match motherboard socket"
  }'::jsonb,
  'error',
  true,
  100
);

-- Rule: Memory type must match motherboard support
INSERT INTO compatibility_rules (
  name,
  description,
  rule_type,
  primary_component,
  secondary_component,
  rule_definition,
  severity,
  is_active,
  priority
) VALUES (
  'RAM-Motherboard Memory Type Match',
  'Memory type must match motherboard support',
  'memory_type_match',
  'memory',
  'motherboard',
  '{
    "condition": "memory_type_match",
    "parameters": {
      "field1": "memoryType",
      "field2": "memoryType"
    },
    "errorMessage": "Memory type does not match motherboard support"
  }'::jsonb,
  'error',
  true,
  90
);

-- Rule: PSU wattage must be sufficient
INSERT INTO compatibility_rules (
  name,
  description,
  rule_type,
  primary_component,
  rule_definition,
  severity,
  is_active,
  priority
) VALUES (
  'Power Supply Wattage Check',
  'Power supply wattage must be sufficient for all components',
  'power_requirement',
  'power_supply',
  '{
    "condition": "wattage_sufficient",
    "parameters": {
      "minimumHeadroom": 20
    },
    "errorMessage": "Power supply wattage is insufficient for this build"
  }'::jsonb,
  'error',
  true,
  80
);

-- ============================================
-- EXAMPLE PC BUILD
-- ============================================

-- Example: High-End Gaming Build
INSERT INTO pc_builds (
  user_id,
  name,
  description,
  processor_id,
  motherboard_id,
  memory_id,
  memory_quantity,
  graphic_card_id,
  ssd_nvme_id,
  power_supply_id,
  cooler_id,
  pc_case_id,
  total_price,
  estimated_wattage,
  is_public,
  is_template
) VALUES (
  'user-id',
  '4K Gaming Beast',
  'High-end gaming PC for 4K gaming and content creation',
  'product-id-for-i9-14900k',
  'product-id-for-asus-z790',
  'product-id-for-corsair-ddr5-32gb',
  2,
  'product-id-for-rtx-4090',
  'product-id-for-samsung-990-pro',
  'product-id-for-corsair-rm1000x',
  'product-id-for-nzxt-kraken-z73',
  'product-id-for-lian-li-o11',
  4500.00,
  650,
  true,
  true
);

-- ============================================
-- HELPFUL QUERIES
-- ============================================

-- Get all processors with their specs
SELECT
  p.id,
  p.name,
  p.price,
  pcs.socket_type,
  pcs.cores,
  pcs.threads,
  pcs.tdp
FROM products p
INNER JOIN product_component_specs pcs ON p.id = pcs.product_id
WHERE pcs.component_type = 'processor'
  AND p.is_active = true;

-- Get all motherboards compatible with LGA1700
SELECT
  p.id,
  p.name,
  p.price,
  pcs.chipset,
  pcs.form_factor,
  pcs.memory_type,
  pcs.max_memory
FROM products p
INNER JOIN product_component_specs pcs ON p.id = pcs.product_id
WHERE pcs.component_type = 'motherboard'
  AND pcs.socket_type = 'lga1700'
  AND p.is_active = true;

-- Get all DDR5 memory
SELECT
  p.id,
  p.name,
  p.price,
  pcs.memory_capacity,
  pcs.memory_speed,
  pcs.memory_latency
FROM products p
INNER JOIN product_component_specs pcs ON p.id = pcs.product_id
WHERE pcs.component_type = 'memory'
  AND pcs.memory_type = 'ddr5'
  AND p.is_active = true;

-- Get all public PC builds with component names
SELECT
  pb.id,
  pb.name,
  pb.description,
  pb.total_price,
  pb.estimated_wattage,
  p_cpu.name as processor_name,
  p_mobo.name as motherboard_name,
  p_gpu.name as gpu_name
FROM pc_builds pb
LEFT JOIN products p_cpu ON pb.processor_id = p_cpu.id
LEFT JOIN products p_mobo ON pb.motherboard_id = p_mobo.id
LEFT JOIN products p_gpu ON pb.graphic_card_id = p_gpu.id
WHERE pb.is_public = true
ORDER BY pb.created_at DESC;

-- Get build with compatibility issues
SELECT
  id,
  name,
  compatibility_issues
FROM pc_builds
WHERE compatibility_issues IS NOT NULL
  AND jsonb_array_length(compatibility_issues) > 0;
