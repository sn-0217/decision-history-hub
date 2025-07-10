
import { Calendar, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TimedApprovalCardProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

const TimedApprovalCard = ({ 
  startTime, 
  endTime, 
  onStartTimeChange, 
  onEndTimeChange 
}: TimedApprovalCardProps) => {
  return (
    <Card className="animate-in fade-in-50 duration-500 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 shadow-sm" data-section="timed-approval">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-amber-800 text-base">
          <div className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <span className="text-sm">Time Window</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <div className="space-y-2">
            <label htmlFor="start-time" className="text-xs font-semibold text-amber-700">
              Start Date & Time
            </label>
            <div className="relative rounded-md">
              <Input
                id="start-time"
                type="datetime-local"
                value={startTime}
                onChange={(e) => onStartTimeChange(e.target.value)}
                className="border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 bg-white h-9 text-sm pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                data-input="start-time"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Calendar className="h-4 w-4 text-amber-500" aria-hidden="true" />
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="end-time" className="text-xs font-semibold text-amber-700">
              End Date & Time
            </label>
            <div className="relative rounded-md">
              <Input
                id="end-time"
                type="datetime-local"
                value={endTime}
                onChange={(e) => onEndTimeChange(e.target.value)}
                className="border-amber-300 focus:border-amber-500 focus:ring-amber-500/20 bg-white h-9 text-sm pr-10 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-8 [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                data-input="end-time"
              />
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                <Calendar className="h-4 w-4 text-amber-500" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimedApprovalCard;
