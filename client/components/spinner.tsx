import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import colors from 'tailwindcss/colors';

export default function Spinner() {
  return (
    <Button className="p-3 z-50 h-16">
      <ButtonSpinner color={colors.gray[400]} />
      <ButtonText className="font-medium text-sm ml-2">
        Please wait...
      </ButtonText>
    </Button>
  );
}
