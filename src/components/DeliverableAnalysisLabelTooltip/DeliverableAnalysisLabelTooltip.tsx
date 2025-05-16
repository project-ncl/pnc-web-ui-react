import { deliverableAnalysisLabels } from 'common/deliverableAnalysisLabelEntryEntityAttributes';

export const DeliverableAnalysisLabelTooltip = () => (
  <div>
    Label defines additional metadata about a Deliverable Analysis. This influences which Delivered Artifacts are included in
    Product Milestone Comparison or Product statistics dashboards.
    <dl className="m-t-20">
      <dt>
        <b>SCRATCH</b>
      </dt>
      <dd>{deliverableAnalysisLabels.find((l) => l.value === 'SCRATCH')!.description}</dd>
    </dl>
    <dl className="m-t-20">
      <dt>
        <b>DELETED</b>
      </dt>
      <dd>{deliverableAnalysisLabels.find((l) => l.value === 'DELETED')!.description}</dd>
    </dl>
    <dl className="m-t-20">
      <dt>
        <b>RELEASED</b>
      </dt>
      <dd>{deliverableAnalysisLabels.find((l) => l.value === 'RELEASED')!.description}</dd>
    </dl>
  </div>
);
