"use client";

import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/ui/components/alert-dialog";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";

import { useDeleteSpecification } from "../../actions/use-delete-specification";
import { SpecificationEditForm } from "../specification-edit";
import { ComponentSpecification } from "./columns";

interface CellActionProps {
  data: ComponentSpecification;
}

export function CellAction({ data }: CellActionProps) {
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);

  const deleteMutation = useDeleteSpecification();

  const onDelete = () => {
    deleteMutation.mutate(data.specs.id, {
      onSuccess: () => {
        setOpenDelete(false);
      },
    });
  };

  return (
    <>
      <SpecificationEditForm
        specification={{
          id: data.specs.id,
          productId: data.id,
          componentType: data.specs.componentType,
          // Spread all spec fields directly (not nested)
          socketType: data.specs.socketType,
          cores: data.specs.cores,
          threads: data.specs.threads,
          baseClock: data.specs.baseClock,
          boostClock: data.specs.boostClock,
          tdp: data.specs.tdp,
          integratedGraphics: data.specs.integratedGraphics,
          chipset: data.specs.chipset,
          formFactor: data.specs.formFactor,
          memoryType: data.specs.memoryType,
          maxMemory: data.specs.maxMemory,
          memorySlots: data.specs.memorySlots,
          pciSlots: data.specs.pciSlots,
          m2Slots: data.specs.m2Slots,
          sataSlots: data.specs.sataSlots,
          memoryCapacity: data.specs.memoryCapacity,
          memorySpeed: data.specs.memorySpeed,
          memoryLatency: data.specs.memoryLatency,
          gpuChipset: data.specs.gpuChipset,
          vram: data.specs.vram,
          powerConnectors: data.specs.powerConnectors,
          recommendedPsu: data.specs.recommendedPsu,
          slotWidth: data.specs.slotWidth,
          length: data.specs.length,
          storageCapacity: data.specs.storageCapacity,
          storageInterface: data.specs.storageInterface,
          formFactorStorage: data.specs.formFactorStorage,
          readSpeed: data.specs.readSpeed,
          writeSpeed: data.specs.writeSpeed,
          wattage: data.specs.wattage,
          efficiency: data.specs.efficiency,
          modular: data.specs.modular,
          coolerType: data.specs.coolerType,
          compatibleSockets: (data.specs as any).compatibleSockets,
          maxTdp: data.specs.maxTdp,
          radiatorSize: data.specs.radiatorSize,
          height: data.specs.height,
          maxGpuLength: data.specs.maxGpuLength,
          maxCoolerHeight: data.specs.maxCoolerHeight,
          maxPsuLength: data.specs.maxPsuLength,
          frontFans: data.specs.frontFans,
          topFans: data.specs.topFans,
          rearFans: data.specs.rearFans,
          radiatorSupport: data.specs.radiatorSupport,
          driveBays25: data.specs.driveBays25,
          driveBays35: data.specs.driveBays35,
          fanSize: data.specs.fanSize,
          fanRpm: data.specs.fanRpm,
          noiseLevel: data.specs.noiseLevel,
          additionalSpecs: data.specs.additionalSpecs,
        }}
        open={openEdit}
        onOpenChange={setOpenEdit}
      />

      <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              component specification.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={onDelete}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setOpenEdit(true)}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setOpenDelete(true)}
            className="text-destructive"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
