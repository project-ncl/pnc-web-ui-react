export const deliveredArtifactsSourceDescriptions = {
  thisMilestone: {
    title: 'Delivered Artifacts built in this Milestone',
    description: 'Delivered Artifacts produced by Builds contained in this Milestone.',
  },
  otherMilestones: {
    title: 'Delivered Artifacts built in other Milestones',
    description: 'Delivered Artifacts produced by Builds contained in previous Milestones of the same Product.',
  },
  otherProducts: {
    title: 'Delivered Artifacts built in other Products',
    description: 'Delivered Artifacts produced by Builds contained in Milestones of other Products.',
  },
  noMilestone: {
    title: 'Delivered Artifacts built outside any Milestone',
    description: 'Delivered Artifacts produced by Builds not contained in any Milestone. This may include Artifacts from Brew.',
  },
  noBuild: {
    title: 'Not built Delivered Artifacts',
    description: 'Delivered Artifacts not produced in any Build.',
  },
} as const;
