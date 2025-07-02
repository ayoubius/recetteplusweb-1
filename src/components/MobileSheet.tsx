
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

interface MobileSheetProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  className?: string;
}

const MobileSheet: React.FC<MobileSheetProps> = ({ 
  trigger, 
  children, 
  side = 'bottom',
  className = "h-[90vh]"
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side={side} className={className}>
        <div className="overflow-y-auto h-full p-4">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSheet;
