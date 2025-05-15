'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export default function LocaleSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = pathname.split('/')[1] || 'en';

  const handleChange = (value: string) => {
    router.push(`/${value}`);
  };

  return (
    <Select onValueChange={handleChange} defaultValue={currentLocale}>
      <SelectTrigger>
        <SelectValue placeholder={currentLocale === 'en' ? 'English' : 'Português'} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="pt-br">Português</SelectItem>
      </SelectContent>
    </Select>
  );
}