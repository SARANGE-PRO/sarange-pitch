import { Check, Play, RotateCcw, SkipForward, CalendarClock } from 'lucide-react';
import { Badge, Button } from '@/components/ui';
import { STATUS_LABELS, postponeToJokerDay, setActivityStatus } from '@/services/itinerary';
import { useToast } from '@/hooks/useToast';
import type { Activity, ActivityStatus } from '@/types';

export function StatusBadge({ status }: { status: ActivityStatus }) {
  const tone =
    status === 'completed' ? 'ok' : status === 'in_progress' ? 'primary' : status === 'postponed' ? 'warn' : status === 'skipped' ? 'neutral' : 'neutral';
  return <Badge tone={tone}>{STATUS_LABELS[status]}</Badge>;
}

/** Actions de statut tactiles pour une activité. */
export function StatusActions({ activity, compact = false }: { activity: Activity; compact?: boolean }) {
  const toast = useToast();

  const complete = async () => {
    await setActivityStatus(activity.id, 'completed');
    toast('Activité terminée');
  };
  const start = async () => {
    await setActivityStatus(activity.id, 'in_progress');
    toast('Activité en cours');
  };
  const postpone = async () => {
    await postponeToJokerDay(activity.id);
    toast('Reporté au 4 septembre');
  };
  const skip = async () => {
    await setActivityStatus(activity.id, 'skipped');
    toast('Activité ignorée');
  };
  const reset = async () => {
    await setActivityStatus(activity.id, 'planned');
    toast('Remise à faire');
  };

  if (activity.status === 'completed' || activity.status === 'skipped' || activity.status === 'postponed') {
    return (
      <Button variant="secondary" full={!compact} onClick={reset}>
        <RotateCcw size={16} /> Remettre à faire
      </Button>
    );
  }

  return (
    <div className={`flex gap-2 ${compact ? '' : 'flex-wrap'}`}>
      {activity.status === 'planned' && (
        <Button variant="secondary" onClick={start} className="flex-1">
          <Play size={16} /> Commencer
        </Button>
      )}
      <Button onClick={complete} className="flex-1">
        <Check size={16} /> Terminé
      </Button>
      {!compact && (
        <>
          <Button variant="secondary" onClick={postpone} className="flex-1">
            <CalendarClock size={16} /> Reporter
          </Button>
          <Button variant="secondary" onClick={skip} className="flex-1">
            <SkipForward size={16} /> Ignorer
          </Button>
        </>
      )}
    </div>
  );
}
