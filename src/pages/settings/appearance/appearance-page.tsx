import { Separator } from '@/components/ui/separator';
import { AppearanceForm } from './appearance-form';
import { SettingsHeader } from '../header';
import { useTranslation } from 'react-i18next';

export default function SettingsAppearancePage() {
  const { t } = useTranslation("settings");
  return (
    <div className="space-y-6">
      <SettingsHeader heading={t("settings.appearance.page.title")} text={t("settings.appearance.page.description")}/>
      <Separator />
      <AppearanceForm />
    </div>
  );
}
