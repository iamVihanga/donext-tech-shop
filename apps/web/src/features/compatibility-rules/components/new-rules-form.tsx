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
  FormDescription,
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
import { Textarea } from "@repo/ui/components/textarea";
import { useState } from "react";

import { useCreateRule } from "../actions/use-create-rules";
import { createCompatibilityRuleSchema } from "../schemas/rules";

type FormValues = z.infer<typeof createCompatibilityRuleSchema>;

const componentTypes = [
  { value: "processor", label: "Processor" },
  { value: "motherboard", label: "Motherboard" },
  { value: "memory", label: "Memory" },
  { value: "graphic_card", label: "Graphics Card" },
  { value: "ssd_nvme", label: "SSD NVMe" },
  { value: "hard_disk", label: "Hard Disk" },
  { value: "power_supply", label: "Power Supply" },
  { value: "cooler", label: "Cooler" },
  { value: "pc_case", label: "PC Case" },
  { value: "fan", label: "Fan" },
  { value: "monitor", label: "Monitor" },
  { value: "software", label: "Software" },
  { value: "keyboard", label: "Keyboard" },
  { value: "mouse", label: "Mouse" },
  { value: "mouse_pad", label: "Mouse Pad" },
  { value: "headset", label: "Headset" },
  { value: "speaker", label: "Speaker" },
  { value: "ups", label: "UPS" },
  { value: "table", label: "Table" },
  { value: "chair", label: "Chair" },
  { value: "thermal_paste", label: "Thermal Paste" },
  { value: "cable", label: "Cable" },
];

export function NewRuleForm() {
  const [open, setOpen] = useState(false);
  const createMutation = useCreateRule();

  const form = useForm<FormValues>({
    resolver: zodResolver(createCompatibilityRuleSchema),
    defaultValues: {
      name: "",
      description: "",
      ruleType: "socket_compatibility",
      primaryComponent: "processor",
      severity: "error",
      isActive: true,
      priority: 0,
      ruleDefinition: {
        condition: "",
        parameters: {},
        errorMessage: "",
        warningMessage: "",
      },
    },
  });

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
        <Button>Add Compatibility Rule</Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Create Compatibility Rule</DialogTitle>
          <DialogDescription>
            Define a new compatibility rule for PC components
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
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rule Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., Processor-Motherboard Socket Match"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe what this rule validates"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ruleType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rule Type</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., socket_compatibility, power_requirement"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Type identifier for the rule (e.g.,
                          socket_compatibility, memory_compatibility,
                          power_requirement)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Component Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Component Selection</h3>

                  <FormField
                    control={form.control}
                    name="primaryComponent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Component</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select primary component type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {componentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="secondaryComponent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Secondary Component (Optional)</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select secondary component type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="none">None</SelectItem>
                            {componentTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Component that this rule checks against the primary
                          component
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Rule Definition */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Rule Definition</h3>

                  <FormField
                    control={form.control}
                    name="ruleDefinition.condition"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Condition</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g., socketType_match"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The condition identifier that will be evaluated
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ruleDefinition.parameters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Parameters (JSON)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder='{"field": "socketType", "operator": "equals"}'
                            {...field}
                            value={
                              typeof field.value === "string"
                                ? field.value
                                : JSON.stringify(field.value || {}, null, 2)
                            }
                            onChange={(e) => {
                              try {
                                const parsed = JSON.parse(e.target.value);
                                field.onChange(parsed);
                              } catch {
                                field.onChange(e.target.value);
                              }
                            }}
                          />
                        </FormControl>
                        <FormDescription>
                          Rule parameters in JSON format
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ruleDefinition.errorMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Error Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Message to display when rule fails"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="ruleDefinition.warningMessage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Warning Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Warning message for non-critical issues"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Rule Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Rule Settings</h3>

                  <FormField
                    control={form.control}
                    name="severity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Severity</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select severity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="error">Error</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="info">Info</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          How critical is this rule?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Priority</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseInt(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormDescription>
                          Higher priority rules are evaluated first (0 = lowest)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Active</FormLabel>
                          <FormDescription>
                            Enable this rule for compatibility checks
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </ScrollArea>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending ? "Creating..." : "Create Rule"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
