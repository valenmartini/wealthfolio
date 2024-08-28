import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { cn } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Icons } from '@/components/icons';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

import { worldCurrencies } from '@/lib/currencies';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { useSettingsContext } from '@/lib/settings-provider';
import { useTranslation } from 'react-i18next';

const appearanceFormSchema = z.object({
  baseCurrency: z.string({ required_error: 'Please select a base currency.' }),
  lng: z.string({required_error: "Please select a language"})
});

type GeneralSettingFormValues = z.infer<typeof appearanceFormSchema>;

export function GeneralSettingForm() {
  const { t, i18n } = useTranslation("settings");

  const { settings, updateSettings } = useSettingsContext();
  const defaultValues: Partial<GeneralSettingFormValues> = {
    baseCurrency: settings?.baseCurrency || 'USD',
  };
  const form = useForm<GeneralSettingFormValues>({
    resolver: zodResolver(appearanceFormSchema),
    defaultValues,
  });

  function onSubmit(data: GeneralSettingFormValues) {
    i18n.changeLanguage(data.lng);
    const updatedSettings = {
      id: settings?.id || 1,
      theme: settings?.theme || 'light',
      font: settings?.font || 'font-mono',
      ...data,
    };
    updateSettings(updatedSettings);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="baseCurrency"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>{t("settings.general.fields.currency.label")}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl className="w-[300px] ">
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn('justify-between', !field.value && 'text-muted-foreground')}
                    >
                      {field.value
                        ? worldCurrencies.find((currency) => currency.value === field.value)?.label
                        : t("settings.general.fields.currency.placeholderButton")}
                      <Icons.ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder={t("settings.general.fields.currency.placeholderInput")} />
                    <CommandEmpty>{t("settings.general.fields.currency.notFound")}</CommandEmpty>
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
              <FormDescription>{t("settings.general.fields.currency.description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lng"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("settings.general.fields.language.label")}</FormLabel>
              <div className="relative w-max">
                <FormControl>
                  <select
                    className={cn(
                      buttonVariants({ variant: 'outline' }),
                      'w-[200px] appearance-none bg-transparent font-normal',
                    )}
                    {...field}
                  >
                    <option value="en">English</option>
                    <option value="es">Español</option>
                  </select>
                </FormControl>
                <Icons.ChevronDown className="absolute right-3 top-2.5 h-4 w-4 opacity-50" />
              </div>
              <FormDescription>{t("settings.general.fields.language.description")}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">{t("settings.general.submitButton")}</Button>
      </form>
    </Form>
  );
}
