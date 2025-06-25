"use client";

import { Edit, MoreHorizontal, Trash, TrashIcon } from "lucide-react";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@repo/ui/components/alert-dialog";
import { Button } from "@repo/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from "@repo/ui/components/dropdown-menu";

import { CategoryWithSubcategories } from "../../schemas/categories.zod";

import { useDeleteCategory } from "@/features/categories/actions/use-delete-category";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { UpdateCategory } from "../update-category";

interface CellActionProps {
  data: CategoryWithSubcategories;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const { mutate: mutateDelete, isPending: deleting } = useDeleteCategory();

  const [isUpdateOpen, setUpdateOpen] = useState(false);
  const [isLeaveOpen, setLeaveOpen] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirmDelete = () => mutateDelete(data.id);

  return (
    <>
      {/* Update Sheet */}
      <UpdateCategory
        open={isUpdateOpen}
        setOpen={setUpdateOpen}
        updateCategoryId={data.id}
      />

      {/* Alert Dialog */}
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete created
              category and remove data from our servers.
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
        <Link href={`/admin/categories/${data.id}`}>
          <OpenInNewWindowIcon />
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

            <DropdownMenuItem onClick={() => setUpdateOpen(true)}>
              <Edit className="mr-2 h-4 w-4" /> Update
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => setOpen(true)}>
              <Trash className="mr-2 h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};
