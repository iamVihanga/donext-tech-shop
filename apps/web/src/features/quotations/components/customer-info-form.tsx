"use client";

import { useQuotationStore } from "@/features/quotations/store/quotation-store";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";

export function CustomerInfoForm() {
  const { customerInfo, setCustomerInfo } = useQuotationStore();

  const updateField = (field: string, value: string) => {
    if (field.startsWith("customerAddress.")) {
      const addressField = field.replace("customerAddress.", "");
      setCustomerInfo({
        customerAddress: {
          ...customerInfo.customerAddress,
          [addressField]: value
        }
      });
    } else {
      setCustomerInfo({ [field]: value });
    }
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customerName">Customer Name *</Label>
          <Input
            id="customerName"
            value={customerInfo.customerName}
            onChange={(e) => updateField("customerName", e.target.value)}
            placeholder="Enter customer name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerEmail">Email Address *</Label>
          <Input
            id="customerEmail"
            type="email"
            value={customerInfo.customerEmail}
            onChange={(e) => updateField("customerEmail", e.target.value)}
            placeholder="customer@example.com"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerPhone">Phone Number</Label>
          <Input
            id="customerPhone"
            value={customerInfo.customerPhone}
            onChange={(e) => updateField("customerPhone", e.target.value)}
            placeholder="+1 (555) 123-4567"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerCompany">Company</Label>
          <Input
            id="customerCompany"
            value={customerInfo.customerCompany}
            onChange={(e) => updateField("customerCompany", e.target.value)}
            placeholder="Company name"
          />
        </div>
      </div>

      {/* Address Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Address Information</h3>

        <div className="space-y-2">
          <Label htmlFor="street">Street Address</Label>
          <Input
            id="street"
            value={customerInfo.customerAddress.street}
            onChange={(e) =>
              updateField("customerAddress.street", e.target.value)
            }
            placeholder="123 Main Street"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={customerInfo.customerAddress.city}
              onChange={(e) =>
                updateField("customerAddress.city", e.target.value)
              }
              placeholder="New York"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              value={customerInfo.customerAddress.state}
              onChange={(e) =>
                updateField("customerAddress.state", e.target.value)
              }
              placeholder="NY"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="postalCode">Postal Code</Label>
            <Input
              id="postalCode"
              value={customerInfo.customerAddress.postalCode}
              onChange={(e) =>
                updateField("customerAddress.postalCode", e.target.value)
              }
              placeholder="12345"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              value={customerInfo.customerAddress.country}
              onChange={(e) =>
                updateField("customerAddress.country", e.target.value)
              }
              placeholder="United States"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
