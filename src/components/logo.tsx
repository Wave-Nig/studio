import Link from 'next/link';
import { Waves } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <Waves className="h-6 w-6 text-primary" />
      <span className="font-headline text-2xl font-bold tracking-tighter text-foreground">
        WAVE
      </span>
    </Link>
  );
}
