# PC Builder Feature Documentation

## Overview

This PC Builder feature allows users to build custom PCs by selecting compatible components. The system automatically checks compatibility between components and provides warnings/errors when incompatible parts are selected.

## Database Schema

### 1. `product_component_specs` Table

Extends the products table with PC component-specific specifications.

**Key Fields:**

- `productId`: Links to the products table
- `componentType`: Type of component (processor, motherboard, memory, etc.)
- Processor specs: socketType, cores, threads, TDP, etc.
- Motherboard specs: chipset, formFactor, memoryType, slots, etc.
- Memory specs: capacity, speed, latency, type
- Graphics card specs: VRAM, power requirements, dimensions
- Storage specs: capacity, interface, speeds
- Power supply specs: wattage, efficiency, modularity
- Cooler specs: type, compatible sockets, TDP rating
- Case specs: dimensions, fan support, drive bays

### 2. `pc_builds` Table

Stores user PC configurations.

**Core Components (Compatibility-Checked):**

- processorId
- motherboardId
- memoryId (with memoryQuantity)
- graphicCardId
- ssdNvmeId, hardDiskId
- powerSupplyId
- coolerId
- pcCaseId
- fanIds (array)
- extraSsdNvmeIds, extraHardDiskIds (arrays)

**Accessories (No Compatibility Check):**

- monitorIds, softwareIds, cableIds (arrays)
- keyboardId, mouseId, mousePadId
- headsetId, speakerId
- upsId, tableId, chairId
- thermalPasteId

**Metadata:**

- totalPrice: Calculated total
- estimatedWattage: Power consumption estimate
- compatibilityIssues: JSON array of issues
- isPublic, isTemplate, isPurchased

### 3. `compatibility_rules` Table

Defines compatibility rules between components (extensible for future rules).

## API Endpoints

### PC Builds

#### `GET /api/pc-builder/builds`

Get all PC builds with optional filters.

**Query Parameters:**

- `userId`: Filter by user
- `isPublic`: Filter public builds
- `isTemplate`: Filter template builds
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**

```json
{
  "builds": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 50,
    "totalPages": 3
  }
}
```

#### `GET /api/pc-builder/builds/:id`

Get a single PC build with all related products.

**Response:**

```json
{
  "id": "uuid",
  "name": "My Gaming Build",
  "description": "High-end gaming PC",
  "processor": { /* product details */ },
  "motherboard": { /* product details */ },
  "totalPrice": "2500.00",
  "estimatedWattage": 650,
  "compatibilityIssues": [
    {
      "severity": "warning",
      "component": "Power Supply",
      "message": "Consider higher wattage for headroom"
    }
  ],
  ...
}
```

#### `POST /api/pc-builder/builds`

Create a new PC build (requires authentication).

**Request Body:**

```json
{
  "name": "My Gaming Build",
  "description": "High-end gaming PC",
  "processorId": "uuid",
  "motherboardId": "uuid",
  "memoryId": "uuid",
  "memoryQuantity": 2,
  "graphicCardId": "uuid",
  "powerSupplyId": "uuid",
  ...
}
```

**Response:** Created build with compatibility check results.

#### `PATCH /api/pc-builder/builds/:id`

Update a PC build (requires authentication and ownership).

**Request Body:** Same as POST, but all fields optional.

#### `DELETE /api/pc-builder/builds/:id`

Delete a PC build (requires authentication and ownership).

#### `POST /api/pc-builder/builds/:id/clone`

Clone/duplicate a PC build (requires authentication).

### Compatibility

#### `POST /api/pc-builder/compatibility/check`

Check compatibility of components without saving.

**Request Body:**

```json
{
  "processorId": "uuid",
  "motherboardId": "uuid",
  "memoryId": "uuid",
  "memoryQuantity": 2,
  "graphicCardId": "uuid",
  "powerSupplyId": "uuid",
  "coolerId": "uuid",
  "pcCaseId": "uuid"
}
```

**Response:**

```json
{
  "isCompatible": false,
  "issues": [
    {
      "severity": "error",
      "component": "Processor/Motherboard",
      "message": "Socket mismatch: Processor (lga1700) is not compatible with Motherboard (am5)"
    }
  ],
  "estimatedWattage": 550
}
```

#### `GET /api/pc-builder/compatibility/components`

Get compatible components for a specific type based on current build.

**Query Parameters:**

- `componentType`: Type of component to get
- `buildId`: Existing build ID (optional)
- `currentComponents`: JSON string of current components (optional)

**Example:**

```
GET /api/pc-builder/compatibility/components?componentType=memory&buildId=uuid
```

**Response:**

```json
[
  {
    "id": "uuid",
    "name": "Corsair Vengeance DDR5 32GB",
    "price": "150.00",
    "specs": {
      /* component specifications */
    },
    "compatibilityWarnings": [
      {
        "severity": "warning",
        "component": "Memory",
        "message": "High-speed RAM may require BIOS tweaking"
      }
    ]
  }
]
```

### Component Specifications

#### `GET /api/pc-builder/components`

Get component specifications with filters.

**Query Parameters:**

- `componentType`: Filter by type
- `socketType`: Filter by socket (for processors/motherboards)
- `memoryType`: Filter by memory type
- `formFactor`: Filter by form factor
- `minPrice`, `maxPrice`: Price range
- `page`, `limit`: Pagination

#### `POST /api/pc-builder/components`

Create component specifications (admin only).

**Request Body:**

```json
{
  "productId": "uuid",
  "componentType": "processor",
  "socketType": "lga1700",
  "cores": 16,
  "threads": 24,
  "baseClock": 3.4,
  "boostClock": 5.8,
  "tdp": 125,
  "integratedGraphics": true
}
```

#### `PATCH /api/pc-builder/components/:id`

Update component specifications (admin only).

#### `DELETE /api/pc-builder/components/:id`

Delete component specifications (admin only).

### Compatibility Rules

#### `GET /api/pc-builder/rules`

Get all compatibility rules.

#### `POST /api/pc-builder/rules`

Create a compatibility rule (admin only).

#### `PATCH /api/pc-builder/rules/:id`

Update a compatibility rule (admin only).

#### `DELETE /api/pc-builder/rules/:id`

Delete a compatibility rule (admin only).

## Compatibility Checking Logic

The system performs the following compatibility checks:

### 1. **Socket Compatibility** (Critical)

- Processor socket must match motherboard socket
- Examples: LGA1700, AM5, AM4, etc.
- **Severity:** Error

### 2. **Memory Type Compatibility** (Critical)

- RAM type must match motherboard support
- Examples: DDR5, DDR4, DDR3
- **Severity:** Error

### 3. **Memory Capacity Check**

- Total RAM (capacity × quantity) must not exceed motherboard max
- RAM sticks must not exceed available slots
- **Severity:** Error

### 4. **Cooler Socket Compatibility**

- Cooler must support processor socket
- Cooler TDP rating should handle processor TDP
- **Severity:** Error (socket), Warning (TDP)

### 5. **Case Compatibility**

- GPU length must fit in case
- Cooler height must fit in case
- PSU length must fit in case (if applicable)
- **Severity:** Error

### 6. **Power Supply Wattage**

- PSU must provide enough wattage for all components
- Calculation: CPU TDP + GPU power + ~100W overhead
- Recommends 20% headroom
- **Severity:** Error (insufficient), Warning (minimal headroom)

### 7. **Storage Interface Compatibility**

- M.2 drives must not exceed available M.2 slots
- SATA drives must not exceed available SATA ports
- **Severity:** Error (M.2), Warning (SATA)

### 8. **Form Factor Compatibility**

- Motherboard form factor must fit in case
- Examples: ATX, Micro-ATX, Mini-ITX
- **Severity:** Warning

## Component Types

### Core Components (Require Compatibility Checking)

1. **Processor** - CPU with socket type, cores, TDP
2. **Motherboard** - Socket, chipset, memory support, slots
3. **Memory** - RAM type, capacity, speed
4. **Graphic Card** - GPU, VRAM, power, dimensions
5. **SSD/NVMe** - Storage capacity, interface, speed
6. **Hard Disk** - Storage capacity, form factor
7. **Power Supply** - Wattage, efficiency, modularity
8. **Cooler** - Type (air/liquid), socket support, TDP rating
9. **PC Case** - Form factor, dimensions, fan support
10. **Fans** - Size, RPM, noise level

### Accessories (No Compatibility Check)

1. Monitor
2. Software
3. Keyboard
4. Mouse
5. Mouse Pad
6. Headset
7. Speakers
8. UPS
9. Table
10. Chair
11. Thermal Paste
12. Cables

## Usage Example

### 1. **Create Product with Component Specs**

First, create a product in the products table, then add component specifications:

```javascript
// Create processor specs
POST /api/pc-builder/components
{
  "productId": "intel-i9-14900k",
  "componentType": "processor",
  "socketType": "lga1700",
  "cores": 24,
  "threads": 32,
  "baseClock": 3.2,
  "boostClock": 6.0,
  "tdp": 125,
  "integratedGraphics": true
}

// Create motherboard specs
POST /api/pc-builder/components
{
  "productId": "asus-z790-prime",
  "componentType": "motherboard",
  "socketType": "lga1700",
  "chipset": "Z790",
  "formFactor": "atx",
  "memoryType": "ddr5",
  "maxMemory": 128,
  "memorySlots": 4,
  "m2Slots": 4,
  "sataSlots": 6
}
```

### 2. **Build a PC**

```javascript
POST /api/pc-builder/builds
{
  "name": "4K Gaming Beast",
  "processorId": "intel-i9-14900k",
  "motherboardId": "asus-z790-prime",
  "memoryId": "corsair-ddr5-32gb",
  "memoryQuantity": 2,
  "graphicCardId": "rtx-4090",
  "ssdNvmeId": "samsung-990-pro-2tb",
  "powerSupplyId": "corsair-rm1000x",
  "coolerId": "nzxt-kraken-360",
  "pcCaseId": "lian-li-o11-dynamic",
  "keyboardId": "logitech-g915",
  "mouseId": "logitech-g-pro"
}
```

The API will:

1. Validate all component compatibility
2. Calculate total price
3. Estimate power consumption
4. Return build with any compatibility issues

### 3. **Check What Memory is Compatible**

```javascript
GET /api/pc-builder/compatibility/components?componentType=memory&currentComponents={"motherboardId":"asus-z790-prime"}
```

Returns only DDR5 memory that's compatible with the selected motherboard.

### 4. **Clone a Template Build**

```javascript
POST / api / pc - builder / builds / template - budget - gaming / clone;
```

Creates a copy of the template build for the authenticated user.

## Frontend Integration Tips

1. **Progressive Component Selection**

   - Start with CPU or motherboard
   - Use `getCompatibleComponents` to filter options as user builds
   - Show compatibility warnings in real-time

2. **Real-time Validation**

   - Call `/compatibility/check` on component change
   - Display issues with color-coded severity
   - Highlight incompatible components

3. **Price Calculator**

   - Update total price as components are added
   - Show price breakdown by category
   - Display savings if applicable

4. **Wattage Estimator**

   - Show power consumption meter
   - Visualize PSU headroom
   - Warn if PSU is undersized

5. **Build Templates**

   - Offer pre-configured builds (Budget, Mid-range, High-end)
   - Allow users to start from template and customize
   - Save popular builds as templates

6. **Comparison Tool**
   - Compare multiple builds side-by-side
   - Show performance differences
   - Compare prices

## Next Steps

1. **Database Migration**: Run migration to create the new tables
2. **Seed Data**: Add component specifications for existing products
3. **Frontend Implementation**: Build the UI for PC builder
4. **Admin Panel**: Create interface to manage component specs
5. **Testing**: Test compatibility logic thoroughly
6. **Documentation**: API documentation for frontend team

## Advanced Features (Future)

1. **Performance Scoring**: Calculate estimated performance scores
2. **Bottleneck Detection**: Identify component bottlenecks
3. **Price Tracking**: Monitor price changes and suggest alternatives
4. **User Reviews**: Allow reviews on specific builds
5. **Build Sharing**: Share builds via URL
6. **Export to PDF**: Generate build specification PDF
7. **Affiliate Links**: Integration with component retailers
8. **AI Recommendations**: Suggest components based on use case
