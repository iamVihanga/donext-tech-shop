# 🖥️ PC Builder Feature

A comprehensive PC building system that allows users to configure custom PCs with automatic compatibility checking, inspired by [Chama Computers](https://www.chamacomputers.lk/build-my-pc).

## 📋 Overview

The PC Builder feature enables customers to:

- **Build custom PCs** by selecting individual components
- **Check compatibility** automatically between components
- **Save and share builds** with others
- **Clone template builds** for quick customization
- **Calculate total cost** and power requirements
- **Get recommendations** for compatible parts

## 🎯 Key Features

### ✅ Core Components (Compatibility-Checked)

- Processors (Intel & AMD)
- Motherboards
- Memory (RAM)
- Graphics Cards
- Storage (SSD/NVMe & Hard Drives)
- Power Supplies
- CPU Coolers
- PC Cases
- Cooling Fans

### 🎨 Accessories (No Compatibility Check)

- Monitors
- Software
- Keyboards & Mice
- Mouse Pads
- Headsets & Speakers
- UPS
- Tables & Chairs
- Thermal Paste
- Cables

## 🔧 Technical Architecture

### Database Schema

```
┌─────────────────────────┐
│  products               │
│  (existing table)       │
└───────────┬─────────────┘
            │
            │ 1:1
            ▼
┌─────────────────────────┐
│ product_component_specs │ ◄─── Component-specific specs
│  - socket_type          │      (CPU, GPU, RAM, etc.)
│  - memory_type          │
│  - tdp                  │
│  - wattage              │
│  - etc.                 │
└─────────────────────────┘

┌─────────────────────────┐
│  users                  │
└───────────┬─────────────┘
            │
            │ 1:N
            ▼
┌─────────────────────────┐
│  pc_builds              │ ◄─── User PC configurations
│  - processorId          │
│  - motherboardId        │
│  - memoryId             │
│  - graphicCardId        │
│  - totalPrice           │
│  - compatibilityIssues  │
│  - etc.                 │
└─────────────────────────┘

┌─────────────────────────┐
│  compatibility_rules    │ ◄─── Extensible rules engine
│  - ruleType             │
│  - ruleDefinition       │
│  - severity             │
└─────────────────────────┘
```

### API Structure

```
/api/pc-builder/
├── builds/                    # PC Build CRUD
│   ├── GET /                  # List all builds
│   ├── GET /:id               # Get single build
│   ├── POST /                 # Create new build
│   ├── PATCH /:id             # Update build
│   ├── DELETE /:id            # Delete build
│   └── POST /:id/clone        # Clone build
│
├── compatibility/             # Compatibility checks
│   ├── POST /check            # Check component compatibility
│   └── GET /components        # Get compatible components
│
├── components/                # Component specifications
│   ├── GET /                  # List components
│   ├── POST /                 # Create component spec
│   ├── PATCH /:id             # Update component spec
│   └── DELETE /:id            # Delete component spec
│
└── rules/                     # Compatibility rules (Admin)
    ├── GET /                  # List rules
    ├── POST /                 # Create rule
    ├── PATCH /:id             # Update rule
    └── DELETE /:id            # Delete rule
```

## 🚦 Compatibility Checking

The system performs automatic compatibility validation:

### Critical Checks (❌ Errors)

1. **Socket Matching**: CPU socket must match motherboard socket
2. **Memory Type**: RAM type (DDR5/DDR4/DDR3) must match motherboard
3. **Memory Capacity**: Total RAM must not exceed motherboard max
4. **Memory Slots**: RAM sticks must fit in available slots
5. **Cooler Socket**: Cooler must support CPU socket
6. **GPU Length**: GPU must fit in case
7. **Cooler Height**: Cooler must fit in case
8. **Power Supply**: Must provide sufficient wattage

### Warning Checks (⚠️ Warnings)

1. **Cooler TDP**: Cooler should handle CPU heat output
2. **PSU Headroom**: PSU should have 20% extra capacity
3. **Storage Slots**: Check M.2 and SATA slot availability

### Example Compatibility Response

```json
{
  "isCompatible": false,
  "issues": [
    {
      "severity": "error",
      "component": "Processor/Motherboard",
      "message": "Socket mismatch: Processor (LGA1700) is not compatible with Motherboard (AM5)"
    },
    {
      "severity": "warning",
      "component": "Power Supply",
      "message": "PSU has minimal headroom. Recommended: 750W+"
    }
  ],
  "estimatedWattage": 625
}
```

## 📦 Installation & Setup

### 1. Database Migration

```bash
cd apps/api
pnpm run db:push
```

### 2. Seed Component Data

```sql
-- See PC_BUILDER_SEED_DATA.sql for examples
INSERT INTO product_component_specs (
  product_id,
  component_type,
  socket_type,
  cores,
  threads,
  tdp
) VALUES (
  'intel-i9-14900k',
  'processor',
  'lga1700',
  24,
  32,
  125
);
```

### 3. Start Development

```bash
# API
cd apps/api
pnpm run dev

# Web
cd apps/web
pnpm run dev
```

## 💻 Usage Examples

### Creating a Build

```typescript
// Frontend code
const response = await fetch("/api/pc-builder/builds", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "4K Gaming Beast",
    processorId: "intel-i9-14900k",
    motherboardId: "asus-z790-hero",
    memoryId: "corsair-ddr5-32gb",
    memoryQuantity: 2,
    graphicCardId: "rtx-4090",
    powerSupplyId: "corsair-rm1000x",
    // ... other components
  }),
});

const build = await response.json();
// Returns build with compatibility check results
```

### Checking Compatibility

```typescript
const response = await fetch("/api/pc-builder/compatibility/check", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    processorId: "intel-i9-14900k",
    motherboardId: "asus-b660-plus",
    memoryId: "corsair-ddr4-32gb",
  }),
});

const { isCompatible, issues } = await response.json();
// Check for errors before allowing user to proceed
```

### Getting Compatible Components

```typescript
// Get RAM compatible with selected motherboard
const response = await fetch(
  "/api/pc-builder/compatibility/components?" +
    "componentType=memory&" +
    "currentComponents=" +
    encodeURIComponent(
      JSON.stringify({
        motherboardId: "asus-z790-hero",
      })
    )
);

const compatibleRAM = await response.json();
// Only shows DDR5 RAM (since Z790 supports DDR5)
```

## 📱 Frontend Implementation Tips

### 1. Progressive Component Selection

Guide users through a logical flow:

```typescript
const buildSteps = [
  { component: "processor", required: true },
  { component: "motherboard", required: true },
  { component: "memory", required: true },
  { component: "storage", required: true },
  { component: "power_supply", required: true },
  { component: "case", required: true },
  { component: "cooler", recommended: true },
  { component: "graphics_card", optional: true },
  // ... accessories
];
```

### 2. Real-time Validation

```typescript
const [build, setBuild] = useState({});
const [compatibility, setCompatibility] = useState(null);

useEffect(() => {
  // Debounce compatibility check
  const checkCompatibility = async () => {
    const result = await fetch("/api/pc-builder/compatibility/check", {
      method: "POST",
      body: JSON.stringify(build),
    }).then((r) => r.json());

    setCompatibility(result);
  };

  if (Object.keys(build).length > 0) {
    checkCompatibility();
  }
}, [build]);
```

### 3. Visual Indicators

```tsx
function CompatibilityBadge({ issues }) {
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");

  if (errors.length > 0) {
    return <Badge variant="destructive">❌ {errors.length} Issues</Badge>;
  }
  if (warnings.length > 0) {
    return <Badge variant="warning">⚠️ {warnings.length} Warnings</Badge>;
  }
  return <Badge variant="success">✓ Compatible</Badge>;
}
```

### 4. Smart Filtering

```typescript
// Only show compatible components
async function getFilteredComponents(type, currentBuild) {
  const response = await fetch(
    `/api/pc-builder/compatibility/components?` +
      `componentType=${type}&` +
      `currentComponents=${JSON.stringify(currentBuild)}`
  );

  return response.json();
}
```

## 🎨 UI/UX Best Practices

1. **Visual Hierarchy**: Show compatibility status prominently
2. **Progressive Disclosure**: Don't overwhelm with all options at once
3. **Clear Feedback**: Explain WHY components are incompatible
4. **Smart Defaults**: Suggest popular configurations
5. **Comparison Tools**: Let users compare similar components
6. **Mobile-First**: Many users shop on mobile devices
7. **Performance**: Lazy load images, paginate long lists

## 🔐 Security & Permissions

- **Anonymous users**: Can view builds, check compatibility
- **Authenticated users**: Can create, edit, delete their builds
- **Admin users**: Can manage component specs and rules

## 📊 Analytics & Tracking

Consider tracking:

- Popular component combinations
- Common incompatibility errors
- Build completion rates
- Average build values
- Conversion rates (build → purchase)

## 🚀 Performance Optimization

### Caching Strategy

```typescript
// Cache compatibility results
const cacheKey = `compat:${processorId}:${motherboardId}:${memoryId}`;
const cached = await redis.get(cacheKey);

if (cached) {
  return JSON.parse(cached);
}

const result = await checkCompatibility(...);
await redis.setex(cacheKey, 3600, JSON.stringify(result)); // 1 hour
return result;
```

### Database Indexes

```sql
-- Already included in schema
CREATE INDEX idx_component_type ON product_component_specs(component_type);
CREATE INDEX idx_socket_type ON product_component_specs(socket_type);
CREATE INDEX idx_memory_type ON product_component_specs(memory_type);
CREATE INDEX idx_build_user ON pc_builds(user_id);
```

## 🧪 Testing

### Unit Tests

```typescript
describe("Compatibility Checking", () => {
  it("should detect socket mismatch", async () => {
    const result = await checkBuildCompatibility({
      processorId: "intel-lga1700-cpu",
      motherboardId: "amd-am5-mobo",
    });

    expect(result.isCompatible).toBe(false);
    expect(result.issues).toContainEqual(
      expect.objectContaining({
        severity: "error",
        component: "Processor/Motherboard",
      })
    );
  });
});
```

## 📚 Documentation

- **[Full Documentation](./PC_BUILDER_DOCUMENTATION.md)**: Complete API reference
- **[Compatibility Guide](./PC_BUILDER_COMPATIBILITY_GUIDE.md)**: Component compatibility matrix
- **[Seed Data](./PC_BUILDER_SEED_DATA.sql)**: Database examples
- **[Checklist](./PC_BUILDER_CHECKLIST.md)**: Implementation tasks

## 🗺️ Roadmap

### Phase 1: MVP ✅

- [x] Database schema
- [x] API endpoints
- [x] Core compatibility checks
- [ ] Basic UI

### Phase 2: Enhancement

- [ ] Advanced compatibility rules
- [ ] Build templates
- [ ] Price tracking
- [ ] Performance scoring

### Phase 3: Advanced

- [ ] AI recommendations
- [ ] Social features
- [ ] Mobile app
- [ ] AR visualization

## 🤝 Contributing

1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Test compatibility edge cases

## 📝 License

Part of the Donext Tech Shop project.

## 📞 Support

For issues or questions:

- Check the documentation first
- Review the compatibility guide
- Test with the seed data
- Contact the development team

---

**Built with**: Node.js, Hono, PostgreSQL, Drizzle ORM, TypeScript, Next.js

**Inspired by**: PCPartPicker, Chama Computers Build-My-PC
