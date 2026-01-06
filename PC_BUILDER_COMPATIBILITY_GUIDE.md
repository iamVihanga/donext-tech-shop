# PC Component Compatibility Matrix

## Quick Reference Guide

This document provides a quick reference for understanding component compatibility in the PC Builder system.

## Compatibility Rules Summary

| Check           | Components             | Severity   | Rule                               |
| --------------- | ---------------------- | ---------- | ---------------------------------- |
| Socket Match    | CPU ↔ Motherboard     | ❌ Error   | Must be identical                  |
| Memory Type     | RAM ↔ Motherboard     | ❌ Error   | Must be identical (DDR5/DDR4/DDR3) |
| Memory Capacity | RAM ↔ Motherboard     | ❌ Error   | Total ≤ Max supported              |
| Memory Slots    | RAM ↔ Motherboard     | ❌ Error   | Quantity ≤ Available slots         |
| Cooler Socket   | Cooler ↔ CPU          | ❌ Error   | Cooler must support CPU socket     |
| Cooler TDP      | Cooler ↔ CPU          | ⚠️ Warning | Cooler TDP ≥ CPU TDP               |
| GPU Length      | GPU ↔ Case            | ❌ Error   | GPU length ≤ Max case support      |
| Cooler Height   | Cooler ↔ Case         | ❌ Error   | Cooler height ≤ Max case support   |
| PSU Wattage     | PSU ↔ All             | ❌ Error   | PSU wattage ≥ Total system power   |
| PSU Headroom    | PSU ↔ All             | ⚠️ Warning | PSU wattage ≥ 1.2x system power    |
| M.2 Slots       | Storage ↔ Motherboard | ❌ Error   | M.2 drives ≤ Available slots       |
| SATA Ports      | Storage ↔ Motherboard | ⚠️ Warning | SATA drives ≤ Available ports      |

### Legend

- ❌ **Error**: Build cannot proceed, must fix
- ⚠️ **Warning**: Build can proceed, but not recommended
- ℹ️ **Info**: Informational only

## Socket Compatibility

### Intel Sockets (Current Generation)

| Socket  | Generation         | Example CPUs                    |
| ------- | ------------------ | ------------------------------- |
| LGA1700 | 12th/13th/14th Gen | i9-14900K, i7-13700K, i5-12600K |
| LGA1200 | 10th/11th Gen      | i9-11900K, i7-10700K            |
| LGA1151 | 6th-9th Gen        | i9-9900K, i7-8700K              |

### AMD Sockets (Current Generation)

| Socket | Generation      | Example CPUs        |
| ------ | --------------- | ------------------- |
| AM5    | Ryzen 7000      | 7950X, 7900X, 7700X |
| AM4    | Ryzen 1000-5000 | 5950X, 5900X, 3700X |
| sTRX4  | Threadripper    | 3990X, 3970X        |

**Rule**: CPU socket MUST exactly match motherboard socket.

## Memory Type Compatibility

| Memory Type | Voltage | Speed Range    | Compatible With        |
| ----------- | ------- | -------------- | ---------------------- |
| DDR5        | 1.1V    | 4800-8400+ MHz | Only DDR5 motherboards |
| DDR4        | 1.2V    | 2133-5333 MHz  | Only DDR4 motherboards |
| DDR3        | 1.5V    | 800-2400 MHz   | Only DDR3 motherboards |

**Rule**: RAM type MUST exactly match motherboard memory type.

**Important Notes**:

- DDR5 is NOT backward compatible with DDR4
- DDR4 is NOT backward compatible with DDR3
- Physical slot shapes are different to prevent incorrect installation

## Motherboard Form Factors

| Form Factor | Dimensions (mm) | Compatible Cases               | Typical Features                |
| ----------- | --------------- | ------------------------------ | ------------------------------- |
| E-ATX       | 305 × 330       | E-ATX, Full Tower              | Max expansion, enthusiast       |
| ATX         | 305 × 244       | ATX, Full/Mid Tower            | Standard, good expansion        |
| Micro-ATX   | 244 × 244       | ATX, Micro-ATX, Mid/Mini Tower | Compact, fewer slots            |
| Mini-ITX    | 170 × 170       | All                            | Very compact, limited expansion |

**Case Compatibility**:

- E-ATX cases: Support all form factors
- ATX cases: Support ATX, Micro-ATX, Mini-ITX
- Micro-ATX cases: Support Micro-ATX, Mini-ITX
- Mini-ITX cases: Support Mini-ITX only

## Power Supply Wattage Guide

### Component Power Consumption (Approximate)

| Component               | Typical Wattage |
| ----------------------- | --------------- |
| **CPUs**                |
| Intel i9 (High-end)     | 125-253W        |
| Intel i7 (Mid-range)    | 65-125W         |
| Intel i5 (Entry)        | 65-95W          |
| AMD Ryzen 9 (High-end)  | 105-170W        |
| AMD Ryzen 7 (Mid-range) | 65-105W         |
| AMD Ryzen 5 (Entry)     | 65-95W          |
| **GPUs**                |
| RTX 4090                | 450W            |
| RTX 4080                | 320W            |
| RTX 4070 Ti             | 285W            |
| RTX 4060 Ti             | 160W            |
| RX 7900 XTX             | 355W            |
| RX 7900 XT              | 315W            |
| RX 7800 XT              | 263W            |
| **Other**               |
| Motherboard             | 50-80W          |
| RAM (per 16GB)          | 3-5W            |
| SSD/NVMe (each)         | 2-7W            |
| HDD 3.5" (each)         | 5-10W           |
| Fans (each)             | 1-5W            |
| AIO Pump                | 5-10W           |

### PSU Sizing Formula

```
Recommended PSU = (CPU TDP + GPU Power + 100W overhead) × 1.2
```

### PSU Recommendations by Build Type

| Build Type       | Components               | Recommended PSU |
| ---------------- | ------------------------ | --------------- |
| Basic Office     | i3/R3 + No GPU           | 300-450W        |
| Entry Gaming     | i5/R5 + RTX 4060         | 550-650W        |
| Mid-Range Gaming | i7/R7 + RTX 4070         | 650-750W        |
| High-End Gaming  | i9/R9 + RTX 4080         | 850-1000W       |
| Enthusiast       | i9/R9 + RTX 4090         | 1000-1200W      |
| Workstation      | Threadripper + Multi-GPU | 1200W+          |

**Efficiency Ratings**:

- 80+ Bronze: 82-85% efficient
- 80+ Silver: 85-88% efficient
- 80+ Gold: 87-90% efficient (recommended)
- 80+ Platinum: 89-92% efficient
- 80+ Titanium: 90-94% efficient

## Cooler Compatibility

### Air Cooler Height Limits

| Case Type   | Typical Max Height |
| ----------- | ------------------ |
| Full Tower  | 165-185mm          |
| Mid Tower   | 160-170mm          |
| Compact/SFF | 120-145mm          |

**Common Air Cooler Heights**:

- Low-profile (<70mm): Good for SFF cases
- Standard tower (120-160mm): Most mid-towers
- Dual tower (165mm+): Need full tower cases

### AIO Radiator Sizes

| Radiator Size | Dimensions  | Case Support Required |
| ------------- | ----------- | --------------------- |
| 120mm         | 120 × 120mm | Most cases            |
| 140mm         | 140 × 140mm | Most cases            |
| 240mm         | 240 × 120mm | Mid tower+            |
| 280mm         | 280 × 140mm | Mid tower+            |
| 360mm         | 360 × 120mm | Full tower (usually)  |
| 420mm         | 420 × 140mm | Full tower only       |

### TDP Rating

**Rule**: Cooler max TDP should be ≥ CPU TDP for safe operation.

**Recommended Headroom**:

- Stock/Light use: Cooler TDP = CPU TDP
- Normal use: Cooler TDP = CPU TDP × 1.2
- Overclocking: Cooler TDP = CPU TDP × 1.5+

## Storage Interface Guide

| Interface     | Type | Speed        | Connector    |
| ------------- | ---- | ------------ | ------------ |
| **Modern**    |
| NVMe PCIe 5.0 | SSD  | 14,000+ MB/s | M.2          |
| NVMe PCIe 4.0 | SSD  | 7,000+ MB/s  | M.2          |
| NVMe PCIe 3.0 | SSD  | 3,500+ MB/s  | M.2          |
| SATA III      | SSD  | 550 MB/s     | M.2 or 2.5"  |
| **Legacy**    |
| SATA III      | HDD  | 200 MB/s     | 3.5" or 2.5" |

### M.2 Slot Types

- **M Key**: NVMe SSDs (PCIe interface)
- **B Key**: SATA SSDs
- **B+M Key**: Both (most common on SSDs)

### Storage Slot Counting

**Motherboard typically has**:

- 2-5× M.2 slots (for NVMe/M.2 SATA)
- 4-8× SATA ports (for 2.5"/3.5" drives)

**Note**: Some M.2 slots share bandwidth with SATA ports. Check motherboard manual.

## GPU Compatibility

### GPU Size Considerations

| GPU Class | Typical Length | Slot Width  |
| --------- | -------------- | ----------- |
| Compact   | <200mm         | 2 slots     |
| Standard  | 200-280mm      | 2-2.5 slots |
| High-End  | 280-320mm      | 2.5-3 slots |
| Extreme   | 320-360mm      | 3-3.5 slots |

### Power Connectors

| Connector        | Max Power | Used By         |
| ---------------- | --------- | --------------- |
| 6-pin PCIe       | 75W       | Entry GPUs      |
| 8-pin PCIe       | 150W      | Mid-range GPUs  |
| 2× 8-pin         | 300W      | High-end GPUs   |
| 3× 8-pin         | 450W      | Enthusiast GPUs |
| 12VHPWR (16-pin) | 600W      | RTX 40 series   |

**Case Compatibility Checks**:

1. GPU length ≤ Case max GPU length
2. GPU slot width fits without blocking components
3. PSU cables can reach GPU power connectors

## Case Compatibility Checklist

When selecting a case, verify:

- [ ] Motherboard form factor supported
- [ ] GPU length clearance
- [ ] CPU cooler height clearance
- [ ] PSU length clearance (if applicable)
- [ ] Radiator mounting points (for AIO)
- [ ] Sufficient drive bays for storage
- [ ] Adequate fan mounting points
- [ ] Cable management space
- [ ] Front panel USB/audio support

## Common Incompatibility Scenarios

### ❌ Will NOT Work

1. **DDR4 RAM + DDR5 Motherboard**

   - Physical slots are different
   - Voltage incompatible

2. **Intel CPU + AMD Motherboard** (or vice versa)

   - Different socket types
   - Different chipsets

3. **360mm GPU + Small Form Factor Case**

   - Physical clearance issue

4. **400W PSU + RTX 4090**

   - Insufficient power

5. **AM4 Cooler (only) + LGA1700 CPU**
   - Mounting incompatible

### ⚠️ Will Work But Not Recommended

1. **Underpowered cooler for CPU**

   - Thermal throttling likely

2. **Minimal PSU headroom**

   - Reduced efficiency
   - Potential stability issues

3. **Max GPU length in case**

   - Difficult installation
   - Potential airflow issues

4. **Using all M.2 slots**
   - May disable SATA ports
   - Check motherboard manual

## Helpful Tips

### For Beginners

1. **Start with CPU or motherboard** - This locks in your socket type
2. **Choose RAM next** - Must match motherboard memory type
3. **Select GPU** - Determines PSU requirements
4. **Calculate PSU size** - Add 20% headroom
5. **Pick cooler** - Ensure socket compatibility and adequate TDP
6. **Choose case** - Must fit all components
7. **Add accessories** - No compatibility needed

### For Advanced Builders

1. **Check BIOS version** for CPU compatibility
2. **Verify RAM on QVL list** for stability
3. **Consider PCIe lane distribution**
4. **Plan cable management** in advance
5. **Account for RGB ecosystem** if desired
6. **Check cooler clearance** around RAM slots
7. **Verify case airflow** design for components chosen

### Performance Optimization

1. **Avoid bottlenecks**:

   - Don't pair high-end GPU with low-end CPU
   - Don't pair fast CPU with slow RAM
   - Ensure adequate cooling for performance

2. **Future-proofing**:

   - Get PSU with 20-30% extra capacity
   - Choose motherboard with extra M.2 slots
   - Get case with good upgrade potential

3. **Balanced builds**:
   - Allocate budget proportionally
   - Match tier levels (entry/mid/high)
   - Don't overspend on one component

## Database Implementation

### How to Store Component Data

```typescript
// Example: Adding RTX 4090 specs
{
  productId: "rtx-4090-id",
  componentType: "graphic_card",
  gpuChipset: "RTX 4090",
  vram: 24,
  powerConnectors: "1x 16-pin",
  recommendedPsu: 850,
  slotWidth: 3.5,
  length: 336
}
```

### How to Query Compatible Components

```typescript
// Example: Get compatible RAM for motherboard
const motherboard = await getMotherboardSpecs(motherboardId);
const compatibleRAM = await getComponentsByType({
  componentType: "memory",
  memoryType: motherboard.memoryType, // e.g., 'ddr5'
});
```

## FAQ

**Q: Can I mix DDR4 and DDR5?**
A: No, they use different slots and are not compatible.

**Q: Will my Intel cooler work on AMD?**
A: Only if it explicitly lists AMD socket support. Many modern coolers support both.

**Q: Do I need a GPU if my CPU has integrated graphics?**
A: No, but integrated graphics are limited for gaming/intensive workloads.

**Q: Can I use a larger PSU than needed?**
A: Yes, PSUs are most efficient at 50-80% load. Larger is fine.

**Q: Will a Micro-ATX motherboard in an ATX case work?**
A: Yes, cases support smaller form factors.

**Q: How many fans do I need?**
A: Minimum 2 (1 intake, 1 exhaust). More for high-power builds.

**Q: Can I mix RAM brands?**
A: Possible but not recommended. Best to use matched kits.

**Q: Do I need thermal paste?**
A: Most coolers come with pre-applied paste or a tube included.

## Resources

- **Component Specifications**: Manufacturer websites
- **Compatibility Tools**: PCPartPicker, Newegg PC Builder
- **Reviews**: TechPowerUp, Tom's Hardware, Gamers Nexus
- **Community**: r/buildapc, r/pcmasterrace, Linus Tech Tips Forums
