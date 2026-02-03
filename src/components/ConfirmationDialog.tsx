import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

/**
 * TROLL: Props for the ConfirmationDialog component
 * This dialog is part of the intentionally bad UX that makes users
 * confirm multiple times before completing a todo.
 */
export interface ConfirmationDialogProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * TROLL: ConfirmationDialog Component
 * 
 * This component displays increasingly desperate confirmation messages
 * when users try to mark a todo as complete. It's part of the intentional
 * bad UX design that can be demonstrated and fixed using coding agents.
 * 
 * Messages displayed in sequence:
 * 1. "Are you SURE?"
 * 2. "Really?"
 * 3. "But what if you're wrong?"
 * 
 * TROLL: This is intentionally annoying - users must confirm 3 times!
 * 
 * @param isOpen - Whether the dialog is currently visible
 * @param message - The current confirmation message to display
 * @param onConfirm - Callback when user confirms (progresses to next dialog or completes)
 * @param onCancel - Callback when user cancels (resets dialog progression)
 */
export function ConfirmationDialog({
  isOpen,
  message,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) {
  return (
    // TROLL: Using shadcn/ui Dialog for a polished look while being annoying
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent showCloseButton={false} className="max-w-md">
        <DialogHeader className="space-y-4">
          {/* TROLL: Small title, the message is the star */}
          <DialogTitle className="text-sm font-bold uppercase tracking-wide opacity-60">
            Confirm Action
          </DialogTitle>
          {/* TROLL: The escalating message - BIG and CENTER STAGE! */}
          <DialogDescription className="text-2xl font-black text-black dark:text-white text-center py-4">
            {message}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-center gap-4 pt-4">
          {/* TROLL: Cancel button - resets the dialog progression, user has to start over! */}
          <Button
            variant="outline"
            onClick={onCancel}
            data-testid="confirmation-cancel"
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          {/* TROLL: Confirm button - progresses to next dialog or finally completes */}
          <Button
            onClick={onConfirm}
            data-testid="confirmation-confirm"
            className="min-w-[100px]"
          >
            Yes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
