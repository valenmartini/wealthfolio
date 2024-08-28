import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Icons } from '@/components/icons';

import type { Goal } from '@/lib/types';
import { useTranslation } from 'react-i18next';

export interface GoalOperationsProps {
  goal: Goal;
  onEdit: (goal: Goal) => void | undefined;
  onDelete: (goal: Goal) => void | undefined;
}

export function GoalOperations({ goal, onEdit, onDelete }: GoalOperationsProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  //const navigation = useNavigation();
  const isDeleting = false; //navigation?.formData?.get('intent') === 'delete';
  const handleDelete = () => {
    onDelete(goal);
    setShowDeleteAlert(false);
  };

  const { t } = useTranslation("settings");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex h-8 w-8 items-center justify-center rounded-md border transition-colors hover:bg-muted">
          <Icons.MoreVertical className="h-4 w-4" />
          <span className="sr-only">{t("settings.goals.operations.sr")}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(goal)}>{t("settings.goals.operations.buttons.edit")}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex cursor-pointer items-center text-destructive focus:text-destructive"
            onSelect={() => setShowDeleteAlert(true)}
          >
            {t("settings.goals.operations.buttons.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
            {t("settings.goals.operations.deleteAlert.title")}
            </AlertDialogTitle>
            <AlertDialogDescription>{t("settings.goals.operations.deleteAlert.description")}</AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <input type="hidden" name="id" value={goal.id} />
            <AlertDialogCancel>{t("settings.goals.operations.deleteAlert.cancel")}</AlertDialogCancel>

            <Button
              disabled={isDeleting}
              onClick={() => handleDelete()}
              className="bg-red-600 focus:ring-red-600"
            >
              {isDeleting ? (
                <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Icons.Trash className="mr-2 h-4 w-4" />
              )}
              <span>{t("settings.goals.operations.deleteAlert.deleteButton")}</span>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
