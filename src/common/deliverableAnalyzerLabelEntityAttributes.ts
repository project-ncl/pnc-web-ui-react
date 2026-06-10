import { TEntityAttributes } from 'common/entityAttributes';
import { DeliverableAnalyzerLabelEntry } from 'common/pnc-api-types-ts';

interface IExtendedDeliverableAnalyzerLabelEntry extends DeliverableAnalyzerLabelEntry {
  'user.username': any;
}

export const deliverableAnalyzerLabelEntityAttributes = {
  date: {
    id: 'date',
    title: 'Date',
  },
  'user.username': {
    id: 'user.username',
    title: 'User',
  },
  label: {
    id: 'label',
    title: 'Label',
  },
  change: {
    id: 'change',
    title: 'Change',
  },
  reason: {
    id: 'reason',
    title: 'Reason',
  },
} as const satisfies TEntityAttributes<IExtendedDeliverableAnalyzerLabelEntry>;
