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
import { useEffect } from "react";

import { useUpdateSpecification } from "../actions/use-update-specification";
import { updateComponentSpecsSchema } from "../schemas/specification";

type FormValues = z.infer<typeof updateComponentSpecsSchema>;

interface SpecificationEditFormProps {
  specification: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SpecificationEditForm({
  specification,
  open,
  onOpenChange,
}: SpecificationEditFormProps) {
  const updateMutation = useUpdateSpecification();

  const form = useForm<FormValues>({
    resolver: zodResolver(updateComponentSpecsSchema),
    defaultValues: {
      productId: specification?.productId || "",
      componentType: specification?.componentType || "",
      ...specification?.specs,
    },
  });

  // Reset form when specification changes
  useEffect(() => {
    if (specification) {
      form.reset({
        productId: specification.productId,
        componentType: specification.componentType,
        ...specification.specs,
      });
    }
  }, [specification, form]);

  const onSubmit = (data: FormValues) => {
    updateMutation.mutate(
      {
        id: specification.id,
        data,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
          form.reset();
        },
      }
    );
  };

  const componentType = form.watch("componentType");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Component Specification</DialogTitle>
          <DialogDescription>
            Update the technical specifications for this component
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Product ID */}
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product ID</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter product ID"
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Component Type */}
              <FormField
                control={form.control}
                name="componentType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Component Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select component type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="processor">Processor</SelectItem>
                        <SelectItem value="motherboard">Motherboard</SelectItem>
                        <SelectItem value="memory">Memory (RAM)</SelectItem>
                        <SelectItem value="graphic_card">
                          Graphics Card
                        </SelectItem>
                        <SelectItem value="ssd_nvme">SSD (NVMe)</SelectItem>
                        <SelectItem value="hard_disk">Hard Disk</SelectItem>
                        <SelectItem value="power_supply">
                          Power Supply
                        </SelectItem>
                        <SelectItem value="cooler">CPU Cooler</SelectItem>
                        <SelectItem value="pc_case">PC Case</SelectItem>
                        <SelectItem value="fan">Case Fan</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Processor Specs */}
              {componentType === "processor" && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="font-semibold">Processor Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="socketType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Socket Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select socket" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="am4">AM4</SelectItem>
                              <SelectItem value="am5">AM5</SelectItem>
                              <SelectItem value="lga1700">LGA1700</SelectItem>
                              <SelectItem value="lga1200">LGA1200</SelectItem>
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                              {...field}
                              type="number"
                              step="0.1"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                              {...field}
                              type="number"
                              step="0.1"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                          <FormLabel>TDP (W)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="integratedGraphics"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Integrated Graphics
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Motherboard Specs */}
              {componentType === "motherboard" && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="font-semibold">Motherboard Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="socketType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Socket Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select socket" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="am4">AM4</SelectItem>
                              <SelectItem value="am5">AM5</SelectItem>
                              <SelectItem value="lga1700">LGA1700</SelectItem>
                              <SelectItem value="lga1200">LGA1200</SelectItem>
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
                            <Input {...field} placeholder="e.g., B550, Z690" />
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
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select form factor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="atx">ATX</SelectItem>
                              <SelectItem value="matx">Micro-ATX</SelectItem>
                              <SelectItem value="itx">Mini-ITX</SelectItem>
                              <SelectItem value="eatx">E-ATX</SelectItem>
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
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select memory type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ddr4">DDR4</SelectItem>
                              <SelectItem value="ddr5">DDR5</SelectItem>
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                          <FormLabel>PCIe Slots</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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

              {/* Memory Specs */}
              {componentType === "memory" && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="font-semibold">Memory Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="memoryType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memory Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select memory type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ddr4">DDR4</SelectItem>
                              <SelectItem value="ddr5">DDR5</SelectItem>
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                          <FormLabel>Latency (CL)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., CL16" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Graphics Card Specs */}
              {componentType === "graphic_card" && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="font-semibold">
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
                            <Input {...field} placeholder="e.g., RTX 4070" />
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                            <Input {...field} placeholder="e.g., 1x 8-pin" />
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                              {...field}
                              type="number"
                              step="0.5"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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

              {/* Storage Specs (SSD/HDD) */}
              {(componentType === "ssd_nvme" ||
                componentType === "hard_disk") && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="font-semibold">Storage Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="storageCapacity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Capacity (GB)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                            <Input {...field} placeholder="e.g., PCIe 4.0 x4" />
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
                            <Input {...field} placeholder="e.g., M.2 2280" />
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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

              {/* Power Supply Specs */}
              {componentType === "power_supply" && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="font-semibold">Power Supply Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="wattage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wattage (W)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                            <Input {...field} placeholder="e.g., 80+ Gold" />
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
                              {...field}
                              placeholder="e.g., Fully Modular"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Cooler Specs */}
              {componentType === "cooler" && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="font-semibold">CPU Cooler Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="coolerType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cooler Type</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select cooler type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="air_cooler">
                                Air Cooler
                              </SelectItem>
                              <SelectItem value="aio_liquid">
                                AIO Liquid Cooler
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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

              {/* PC Case Specs */}
              {componentType === "pc_case" && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="font-semibold">PC Case Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="formFactor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Form Factor</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select form factor" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="atx">ATX</SelectItem>
                              <SelectItem value="matx">Micro-ATX</SelectItem>
                              <SelectItem value="itx">Mini-ITX</SelectItem>
                              <SelectItem value="eatx">E-ATX</SelectItem>
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
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
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
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
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
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
                              {...field}
                              placeholder="e.g., 240mm, 280mm, 360mm"
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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

              {/* Fan Specs */}
              {componentType === "fan" && (
                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="font-semibold">Case Fan Specifications</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="fanSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fan Size (mm)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
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
                            <Input {...field} placeholder="e.g., 500-1800" />
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
                          <FormLabel>Noise Level (dB)</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g., 15-25" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </form>
          </Form>
        </ScrollArea>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Updating..." : "Update Specification"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
