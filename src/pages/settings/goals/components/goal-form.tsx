import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

import { Icons } from '@/components/icons';

import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

import { newGoalSchema } from '@/lib/schemas';
import { createGoal, updateGoal } from '@/commands/goal';
import { useTranslation } from 'react-i18next';

type NewGoal = z.infer<typeof newGoalSchema>;

interface GoalFormlProps {
  defaultValues?: NewGoal;
  onSuccess?: () => void;
}

export function GoalForm({ defaultValues, onSuccess = () => {} }: GoalFormlProps) {
  const queryClient = useQueryClient();

  const { t } = useTranslation("settings");

  const addGoalMutation = useMutation({
    mutationFn: createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: t("settings.goals.form.toasts.goalAdded.title"),
        description: t("settings.goals.form.toasts.goalAdded.description"),
        className: 'bg-green-500 text-white border-none',
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: t("settings.goals.form.toasts.goalAddedError.title"),
        description: t("settings.goals.form.toasts.goalAddedError.description"),
        className: 'bg-red-500 text-white border-none',
      });
    },
  });
  const updateGoalMutation = useMutation({
    mutationFn: updateGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast({
        title: t("settings.goals.form.toasts.goalUpdated.title"),
        className: 'bg-green-500 text-white border-none',
      });
      onSuccess();
    },
  });

  const form = useForm<NewGoal>({
    resolver: zodResolver(newGoalSchema),
    defaultValues,
  });

  function onSubmit(data: NewGoal) {
    const { id, ...rest } = data;
    if (id) {
      return updateGoalMutation.mutate({ id, ...rest });
    }
    return addGoalMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <DialogHeader>
          <DialogTitle> {defaultValues?.id ? t("settings.goals.form.dialog.title.update") : t("settings.goals.form.dialog.title.add") }</DialogTitle>
          <DialogDescription>
            {defaultValues?.id ? t("settings.goals.form.dialog.description.update")  : t("settings.goals.form.dialog.description.add") }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-10 p-4 ">
          {/* add input hidden for id */}
          <input type="hidden" name="id" />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("settings.goals.form.fields.title.label") }</FormLabel>
                <FormControl>
                  <Input placeholder={t("settings.goals.form.fields.title.placeholder") } {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("settings.goals.form.fields.description.label") }</FormLabel>
                <FormControl>
                  <Input placeholder={t("settings.goals.form.fields.description.placeholder") } {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="targetAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("settings.goals.form.fields.target.label") }</FormLabel>
                <FormControl>
                  <Input type="number" inputMode="decimal" placeholder={t("settings.goals.form.fields.target.placeholder") }{...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
            control={form.control}
            name="deadline"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Target Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground',
                        )}
                      >
                        {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                        <Icons.Calendar className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            )}
          /> */}
          {defaultValues?.id ? (
            <FormField
              control={form.control}
              name="isAchieved"
              render={({ field }) => (
                <FormItem className="flex items-center">
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="space-y-0 pl-2"> {t("settings.goals.form.fields.archieved.label") }</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline">{t("settings.goals.form.dialog.buttons.cancel") }</Button>
          </DialogTrigger>
          <Button type="submit">
            <Icons.Plus className="h-4 w-4" />
            <span className="hidden sm:ml-2 sm:inline">
              {defaultValues?.id ? t("settings.goals.form.dialog.buttons.update") : t("settings.goals.form.dialog.buttons.add")}
            </span>
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
