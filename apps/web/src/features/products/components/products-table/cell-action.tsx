"use client";

import { Edit, MoreHorizontal, Trash, TrashIcon } from "lucide-react";
import { useState } from "react";

import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useDeleteProduct } from "../../actions/use-delete-product";
import { useUpdateProduct } from "../../actions/use-update-product";
import { Product } from "../../schemas/products.zod";

interface CellActionProps {
  data: Product;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { mutate: mutateDelete, isPending: deleting } = useDeleteProduct();
  const { mutate: mutateUpdate, isPending: updating } = useUpdateProduct();

  const [open, setOpen] = useState(false);
  const router = useRouter();

  const onConfirmDelete = () => mutateDelete(data.id);

  const onEdit = () => {
    router.push(`/admin/products/${data.id}/edit`);
  };

  // const onToggleFeatured = () => {
  //   mutateUpdate({
  //     productId: data.id,
  //     data: { isFeatured: !data.isFeatured },
  //   });
  // };

  return (
    <>
      {/* Alert Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete created
              product and remove data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={onConfirmDelete}
                loading={deleting}
                disabled={deleting}
                icon={<TrashIcon className="size-4" />}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center gap-2">
        <Link href={`/products/${data.slug || data.id}`} target="_blank">
          <Button variant="ghost" className="h-8 w-8 p-0">
            <OpenInNewWindowIcon />
          </Button>
        </Link>

        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={onEdit} disabled={updating}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setOpen(true)}
              className="text-destructive focus:text-destructive"
              disabled={deleting || updating}
            >
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
