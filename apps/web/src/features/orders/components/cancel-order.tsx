"use client";
import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@repo/ui/components/dialog";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";
import { useCancelOrder } from "../actions/use-cancel-order";

type Props = {
  children: React.ReactNode;
  orderId: string;
};

export function CancelOrder({ children, orderId }: Props) {
  const { mutate, isPending } = useCancelOrder();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.currentTarget);
    const reason = formData.get("reason");

    mutate({ reason: reason?.toString(), orderId });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <DialogHeader>
            <DialogTitle>Cancel Order</DialogTitle>
            <DialogDescription>
              Let us know why you want to cancel this order. Your feedback helps
              us improve our service.
            </DialogDescription>
          </DialogHeader>

          <div className="w-full space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="Leave your feedback or reason to cancellation..."
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={isPending} loading={isPending} type="submit">
              Continue Cancellation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
