"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@repo/ui/components/button";
import { Checkbox } from "@repo/ui/components/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@repo/ui/components/form";
import { Input } from "@repo/ui/components/input";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select";
import { useState } from "react";

import { useCreateSpecification } from "../actions/use-create-specification";
import { createComponentSpecsSchema } from "../schemas/specification";

type FormValues = z.infer<typeof createComponentSpecsSchema>;

interface NewSpecificationFormProps {
  productId?: string;
}

export function NewSpecificationForm({ productId }: NewSpecificationFormProps) {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateSpecification();

  const form = useForm<FormValues>({
    resolver: zodResolver(createComponentSpecsSchema),
    defaultValues: {
      productId: productId || "",
      componentType: "processor",
    },
  });

  const componentType = form.watch("componentType");

  const onSubmit = (data: FormValues) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Component Specification</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Component Specification</DialogTitle>
          <DialogDescription>
            Add technical specifications for a product component
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <ScrollArea className="h-[60vh] pr-4">
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Basic Information</h3>

                  <FormField
                    control={form.control}
                    name="productId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter product ID" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="componentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Component Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select component type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="processor">Processor</SelectItem>
                            <SelectItem value="motherboard">
                              Motherboard
                            </SelectItem>
                            <SelectItem value="memory">Memory</SelectItem>
                            <SelectItem value="graphic_card">
                              Graphics Card
                            </SelectItem>
                            <SelectItem value="ssd_nvme">SSD/NVMe</SelectItem>
                            <SelectItem value="hard_disk">Hard Disk</SelectItem>
                            <SelectItem value="power_supply">
                              Power Supply
                            </SelectItem>
                            <SelectItem value="cooler">Cooler</SelectItem>
                            <SelectItem value="pc_case">PC Case</SelectItem>
                            <SelectItem value="fan">Fan</SelectItem>
                            <SelectItem value="monitor">Monitor</SelectItem>
                            <SelectItem value="software">Software</SelectItem>
                            <SelectItem value="keyboard">Keyboard</SelectItem>
                            <SelectItem value="mouse">Mouse</SelectItem>
                            <SelectItem value="mouse_pad">Mouse Pad</SelectItem>
                            <SelectItem value="headset">Headset</SelectItem>
                            <SelectItem value="speaker">Speaker</SelectItem>
                            <SelectItem value="ups">UPS</SelectItem>
                            <SelectItem value="table">Table</SelectItem>
                            <SelectItem value="chair">Chair</SelectItem>
                            <SelectItem value="thermal_paste">
                              Thermal Paste
                            </SelectItem>
                            <SelectItem value="cable">Cable</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Processor Specifications */}
                {componentType === "processor" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">
                      Processor Specifications
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="socketType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Socket Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select socket" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="lga1700">LGA1700</SelectItem>
                                <SelectItem value="lga1200">LGA1200</SelectItem>
                                <SelectItem value="lga1151">LGA1151</SelectItem>
                                <SelectItem value="am5">AM5</SelectItem>
                                <SelectItem value="am4">AM4</SelectItem>
                                <SelectItem value="strx4">sTRX4</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="cores"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cores</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 8"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="threads"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Threads</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 16"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="baseClock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Base Clock (GHz)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="e.g., 3.6"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="boostClock"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Boost Clock (GHz)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="e.g., 5.0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tdp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>TDP (Watts)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 125"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="integratedGraphics"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Has Integrated Graphics</FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Motherboard Specifications */}
                {componentType === "motherboard" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">
                      Motherboard Specifications
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="socketType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Socket Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select socket" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="lga1700">LGA1700</SelectItem>
                                <SelectItem value="lga1200">LGA1200</SelectItem>
                                <SelectItem value="lga1151">LGA1151</SelectItem>
                                <SelectItem value="am5">AM5</SelectItem>
                                <SelectItem value="am4">AM4</SelectItem>
                                <SelectItem value="strx4">sTRX4</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="chipset"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Chipset</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Z790" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="formFactor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Form Factor</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select form factor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="atx">ATX</SelectItem>
                                <SelectItem value="micro_atx">
                                  Micro ATX
                                </SelectItem>
                                <SelectItem value="mini_itx">
                                  Mini ITX
                                </SelectItem>
                                <SelectItem value="e_atx">E-ATX</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="memoryType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Memory Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select memory type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ddr5">DDR5</SelectItem>
                                <SelectItem value="ddr4">DDR4</SelectItem>
                                <SelectItem value="ddr3">DDR3</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxMemory"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Memory (GB)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 128"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="memorySlots"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Memory Slots</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 4"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="pciSlots"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>PCI Slots</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 3"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="m2Slots"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>M.2 Slots</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 2"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="sataSlots"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SATA Slots</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 6"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Memory Specifications */}
                {componentType === "memory" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">
                      Memory Specifications
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="memoryType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Memory Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ddr5">DDR5</SelectItem>
                                <SelectItem value="ddr4">DDR4</SelectItem>
                                <SelectItem value="ddr3">DDR3</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="memoryCapacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capacity (GB)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 16"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="memorySpeed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Speed (MHz)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 3200"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="memoryLatency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Latency</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., CL16" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Graphics Card Specifications */}
                {componentType === "graphic_card" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">
                      Graphics Card Specifications
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="gpuChipset"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>GPU Chipset</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., RTX 4090" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="vram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>VRAM (GB)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 24"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="powerConnectors"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Power Connectors</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 2x 8-pin" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="recommendedPsu"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Recommended PSU (W)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 850"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="slotWidth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Slot Width</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.5"
                                placeholder="e.g., 2.5"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="length"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Length (mm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 336"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Storage Specifications */}
                {(componentType === "ssd_nvme" ||
                  componentType === "hard_disk") && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">
                      Storage Specifications
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="storageCapacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capacity (GB)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 1000"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="storageInterface"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Interface</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., PCIe 4.0 x4"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="formFactorStorage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Form Factor</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., M.2 2280" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="readSpeed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Read Speed (MB/s)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 7000"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="writeSpeed"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Write Speed (MB/s)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 5000"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Power Supply Specifications */}
                {componentType === "power_supply" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">
                      Power Supply Specifications
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="wattage"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Wattage (W)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 850"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="efficiency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Efficiency Rating</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 80+ Gold" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="modular"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Modular Type</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., Fully Modular"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Cooler Specifications */}
                {componentType === "cooler" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">
                      Cooler Specifications
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="coolerType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cooler Type</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="air">Air</SelectItem>
                                <SelectItem value="aio_liquid">
                                  AIO Liquid
                                </SelectItem>
                                <SelectItem value="custom_liquid">
                                  Custom Liquid
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxTdp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max TDP (W)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 250"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="radiatorSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Radiator Size (mm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 360"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="height"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Height (mm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 165"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* PC Case Specifications */}
                {componentType === "pc_case" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">
                      PC Case Specifications
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="formFactor"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Form Factor</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select form factor" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="atx">ATX</SelectItem>
                                <SelectItem value="micro_atx">
                                  Micro ATX
                                </SelectItem>
                                <SelectItem value="mini_itx">
                                  Mini ITX
                                </SelectItem>
                                <SelectItem value="e_atx">E-ATX</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxGpuLength"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max GPU Length (mm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 380"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxCoolerHeight"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max Cooler Height (mm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 170"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="maxPsuLength"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Max PSU Length (mm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 200"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="frontFans"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Front Fans</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 3x 120mm" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="topFans"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Top Fans</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 2x 140mm" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="rearFans"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rear Fans</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 1x 120mm" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="radiatorSupport"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Radiator Support</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g., 360mm front, 280mm top"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="driveBays25"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>2.5" Drive Bays</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 2"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="driveBays35"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>3.5" Drive Bays</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 2"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Fan Specifications */}
                {componentType === "fan" && (
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-semibold">
                      Fan Specifications
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="fanSize"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fan Size (mm)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="e.g., 120"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseInt(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="fanRpm"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>RPM Range</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 500-1500" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="noiseLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Noise Level (dBA)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.1"
                                placeholder="e.g., 22.5"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(
                                    parseFloat(e.target.value) || undefined
                                  )
                                }
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending
                  ? "Creating..."
                  : "Create Specification"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
