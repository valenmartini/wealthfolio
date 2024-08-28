import { Separator } from '@/components/ui/separator';
import { GeneralSettingForm } from './general-form';
import { SettingsHeader } from '../header';
import { useTranslation } from 'react-i18next';

export default function GeneralSettingsPage() {
  const { t } = useTranslation("settings");
  return (
    <div className="space-y-6">
      <SettingsHeader
        heading={t("settings.general.page.title")}
        text={t("settings.general.page.description")}
      />
      <Separator />
      <GeneralSettingForm />
    </div>
  );
}
