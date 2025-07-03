"use client";

import { Input } from "@repo/ui/components/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@repo/ui/components/select";

interface AddressFormProps {
  form: any; // TanStack Form instance
  prefix: "shippingAddress" | "billingAddress";
  title: string;
  className?: string;
}

const COUNTRIES = [
  { value: "US", label: "United States" },
  { value: "CA", label: "Canada" },
  { value: "UK", label: "United Kingdom" },
  { value: "AU", label: "Australia" },
  { value: "LK", label: "Sri Lanka" },
  { value: "IN", label: "India" }
];

export function AddressForm({
  form,
  prefix,
  title,
  className
}: AddressFormProps) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-1 gap-4">
        <form.AppField
          name={`${prefix}.street`}
          children={(field: any) => (
            <field.FormItem>
              <field.FormLabel>Street Address</field.FormLabel>
              <field.FormControl>
                <Input
                  placeholder="123 Main Street"
                  value={field.state.value}
                  onChange={(e: any) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                />
              </field.FormControl>
              <field.FormMessage />
            </field.FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.AppField
            name={`${prefix}.city`}
            children={(field: any) => (
              <field.FormItem>
                <field.FormLabel>City</field.FormLabel>
                <field.FormControl>
                  <Input
                    placeholder="New York"
                    value={field.state.value}
                    onChange={(e: any) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />

          <form.AppField
            name={`${prefix}.state`}
            children={(field: any) => (
              <field.FormItem>
                <field.FormLabel>State/Province</field.FormLabel>
                <field.FormControl>
                  <Input
                    placeholder="NY"
                    value={field.state.value}
                    onChange={(e: any) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <form.AppField
            name={`${prefix}.postalCode`}
            children={(field: any) => (
              <field.FormItem>
                <field.FormLabel>Postal Code</field.FormLabel>
                <field.FormControl>
                  <Input
                    placeholder="10001"
                    value={field.state.value}
                    onChange={(e: any) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />

          <form.AppField
            name={`${prefix}.country`}
            children={(field: any) => (
              <field.FormItem>
                <field.FormLabel>Country</field.FormLabel>
                <field.FormControl>
                  <Select
                    value={field.state.value}
                    onValueChange={(value: string) => field.handleChange(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRIES.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </field.FormControl>
                <field.FormMessage />
              </field.FormItem>
            )}
          />
        </div>
      </div>
    </div>
  );
}
