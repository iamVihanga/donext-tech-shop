"use client";
import React from "react";

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

import { UserCheck } from "lucide-react";
import { useUnbanUser } from "../api";

type Props = {
  userId: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export function UnbanUserAlert({ userId, open, setOpen }: Props) {
  const { mutate, isPending } = useUnbanUser();

  const onSubmit = () => {
    mutate({ userId }, { onSuccess: () => setOpen(false) });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure ?</AlertDialogTitle>
          <AlertDialogDescription>
            With this action, you can permanently unban previously banned user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild onClick={onSubmit}>
            <Button loading={isPending} icon={<UserCheck className="size-4" />}>
              Unban user
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
