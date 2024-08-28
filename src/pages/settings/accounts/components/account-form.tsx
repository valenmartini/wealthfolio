import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

import { Icons } from '@/components/icons';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';

const accountTypes = [
  { label: 'Securities', value: 'SECURITIES' },
  { label: 'Cash', value: 'CASH' },
  { label: 'Crypto', value: 'CRYPTOCURRENCY' },
] as const;

import { worldCurrencies } from '@/lib/currencies';
import { newAccountSchema } from '@/lib/schemas';
import { createAccount, updateAccount } from '@/commands/account';
import { useTranslation } from 'react-i18next';

type NewAccount = z.infer<typeof newAccountSchema>;

interface AccountFormlProps {
  defaultValues?: NewAccount;
  onSuccess?: () => void;
}

export function AccountForm({ defaultValues, onSuccess = () => {} }: AccountFormlProps) {
  const { t } = useTranslation("settings")

  const queryClient = useQueryClient();

  const addAccountMutation = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast({
        title: t("settings.accounts.form.toasts.accountAdded.title"),
        description: t("settings.accounts.form.toasts.accountAdded.description"),
        className: 'bg-green-500 text-white border-none',
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: t("settings.accounts.form.toasts.accountAddedError.title"),
        description: t("settings.accounts.form.toasts.accountAddedError.description"),
        className: 'bg-red-500 text-white border-none',
      });
    },
  });
  const updateAccountMutation = useMutation({
    mutationFn: updateAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['holdings'] });
      queryClient.invalidateQueries({ queryKey: ['portfolio_history'] });
      toast({
        title: t("settings.accounts.form.toasts.accountUpdated.title"),
        className: 'bg-green-500 text-white border-none',
      });
      onSuccess();
    },
  });

  const form = useForm<NewAccount>({
    resolver: zodResolver(newAccountSchema),
    defaultValues,
  });

  function onSubmit(data: NewAccount) {
    const { id, ...rest } = data;
    if (id) {
      return updateAccountMutation.mutate({ id, ...rest });
    }
    return addAccountMutation.mutate(data);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <DialogHeader>
          <DialogTitle> {defaultValues?.id ? t("settings.accounts.form.dialog.title.update") : t("settings.accounts.form.dialog.title.add") }</DialogTitle>
          <DialogDescription>
            {defaultValues?.id
              ? t("settings.accounts.form.dialog.description.update") 
              : t("settings.accounts.form.dialog.description.add") }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-10 p-4 ">
          {/* add input hidden for id */}
          <input type="hidden" name="id" />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("settings.accounts.form.fields.name.label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("settings.accounts.form.fields.name.placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="group"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("settings.accounts.form.fields.group.label")}</FormLabel>
                <FormControl>
                  <Input placeholder={t("settings.accounts.form.fields.group.placeholder")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="accountType"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>{t("settings.accounts.form.fields.type.label")}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("settings.accounts.form.fields.type.placeholder")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {accountTypes.map((type) => (
                      <SelectItem value={type.value} key={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {!defaultValues?.id ? (
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("settings.accounts.form.fields.currency.label")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn('justify-between', !field.value && 'text-muted-foreground')}
                        >
                          {field.value
                            ? worldCurrencies.find((currency) => currency.value === field.value)
                                ?.label
                            : t("settings.accounts.form.fields.currency.placeholderButton")}
                          <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[300px] p-0">
                      <Command>
                        <CommandInput placeholder={t("settings.accounts.form.fields.currency.placeholderInput")} />
                        <CommandEmpty>{t("settings.accounts.form.fields.currencynotFound")}</CommandEmpty>
                        <CommandGroup>
                          {worldCurrencies.map((currency) => (
                            <CommandItem
                              value={currency.label}
                              key={currency.value}
                              onSelect={() => {
                                form.setValue(field.name, currency.value);
                              }}
                            >
                              <Icons.Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  currency.value === field.value ? 'opacity-100' : 'opacity-0',
                                )}
                              />
                              {currency.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : null}

          <FormField
            control={form.control}
            name="isDefault"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="space-y-0 pl-2"> {t("settings.accounts.form.fields.defaultAccount.label")}</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex items-center">
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <FormLabel className="space-y-0 pl-2"> {t("settings.accounts.form.fields.isActive.label")}</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline">{t("settings.accounts.form.dialog.buttons.cancel")}</Button>
          </DialogTrigger>
          <Button type="submit">
            <Icons.Plus className="h-4 w-4" />
            <span className="hidden sm:ml-2 sm:inline">
              {defaultValues?.id ? t("settings.accounts.form.dialog.buttons.update") : t("settings.accounts.form.dialog.buttons.add")}
            </span>
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}
