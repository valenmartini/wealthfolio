import { useState } from 'react';
import { EmptyPlaceholder } from '@/components/empty-placeholder';
import { Separator } from '@/components/ui/separator';
import { GoalItem } from './components/goal-item';
import { GoalEditModal } from './components/goal-edit-modal';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/icons';
import type { Goal, GoalAllocation } from '@/lib/types';
import { SettingsHeader } from '../header';
import { deleteGoal, getGoals, getGoalsAllocation, updateGoalsAllocations } from '@/commands/goal';
import { Skeleton } from '@/components/ui/skeleton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import GoalsAllocations from './components/goal-allocations';
import { useAccounts } from '@/pages/account/useAccounts';
import { useTranslation } from 'react-i18next';

const SettingsGoalsPage = () => {
  const { t } = useTranslation("settings");

  const queryClient = useQueryClient();

  const { data: goals, isLoading } = useQuery<Goal[], Error>({
    queryKey: ['goals'],
    queryFn: getGoals,
  });

  const { data: allocations } = useQuery<GoalAllocation[], Error>({
    queryKey: ['goals_allocations'],
    queryFn: getGoalsAllocation,
  });

  const { data: accounts } = useAccounts();

  const [visibleModal, setVisibleModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);

  const handleAddGoal = () => {
    setSelectedGoal(null);
    setVisibleModal(true);
  };

  const deleteGoalMutation = useMutation({
    mutationFn: deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goals_allocations'] });
      setVisibleModal(false);
      toast({
        title: 'Goal deleted successfully.',
        className: 'bg-green-500 text-white border-none',
      });
    },
  });

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setVisibleModal(true);
  };

  const handleDeleteGoal = (goal: Goal) => {
    deleteGoalMutation.mutate(goal.id);
  };

  const saveAllocationsMutation = useMutation({
    mutationFn: updateGoalsAllocations,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goals_allocations'] });
      toast({
        title: t("settings.goals.allocations.toasts.allocationSaved.title"),
        className: 'bg-green-500 text-white border-none',
      });
    },
  });

  const handleAddAllocation = (allocationData: GoalAllocation[]) => {
    saveAllocationsMutation.mutate(allocationData);
  };

  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-12" />
        <Skeleton className="h-12" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <SettingsHeader heading={t("settings.goals.page.title")} text={t("settings.goals.page.description")}>
          <Button onClick={() => handleAddGoal()}>
            <Icons.PlusCircle className="mr-2 h-4 w-4" />
            {t("settings.goals.page.addGoal")}
          </Button>
        </SettingsHeader>
        <Separator />
        <div className="mx-auto w-full pt-8 ">
          {goals?.length ? (
            <>
              <h3 className="p-2 text-xl font-bold">{t("settings.goals.page.title")}</h3>

              <div className="divide-y divide-border rounded-md border">
                {goals.map((goal: Goal) => (
                  <GoalItem
                    key={goal.id}
                    goal={goal}
                    onEdit={handleEditGoal}
                    onDelete={handleDeleteGoal}
                  />
                ))}
              </div>
              <h3 className="p-2 pt-12 text-xl font-bold">{t("settings.goals.allocations.title")}</h3>
              <h5 className="p-2 pb-4 pt-0 text-sm font-light text-muted-foreground">
                {t("settings.goals.allocations.description")}
              </h5>
              <GoalsAllocations
                goals={goals}
                existingAllocations={allocations || []}
                accounts={accounts || []}
                onSubmit={handleAddAllocation}
              />
            </>
          ) : (
            <EmptyPlaceholder>
              <EmptyPlaceholder.Icon name="Goal" />
              <EmptyPlaceholder.Title>{t("settings.goals.allocations.empty.title")}</EmptyPlaceholder.Title>
              <EmptyPlaceholder.Description>
              {t("settings.goals.allocations.empty.description")}
              </EmptyPlaceholder.Description>
              <Button onClick={() => handleAddGoal()}>
                <Icons.Plus className="mr-2 h-4 w-4" />
                {t("settings.goals.allocations.empty.addGoal")}
              </Button>
            </EmptyPlaceholder>
          )}
        </div>
      </div>
      <GoalEditModal
        goal={selectedGoal}
        open={visibleModal}
        onClose={() => setVisibleModal(false)}
      />
    </>
  );
};

export default SettingsGoalsPage;
