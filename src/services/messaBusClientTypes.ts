import { Build, BuildPushResult, GroupBuild, ProductMilestoneCloseResult } from 'pnc-api-types-ts';

export type JobNotificationType =
  | 'BUILD'
  | 'GROUP_BUILD'
  | 'BREW_PUSH'
  | 'PRODUCT_MILESTONE_CLOSE'
  | 'SCM_REPOSITORY_CREATION'
  | 'BUILD_CONFIG_CREATION'
  | 'GENERIC_SETTING';

export type JobNotificationProgress = 'PENDING' | 'FINISHED' | 'IN_PROGRESS';

export interface Notification {
  readonly job: JobNotificationType;
  readonly notificationType: string;
  readonly progress: JobNotificationProgress;
  readonly oldProgress: JobNotificationProgress;
  readonly message?: string | null;
}

export interface BuildChangedNotification extends Notification {
  readonly job: 'BUILD';
  readonly notificationType: 'BUILD_STATUS_CHANGED';
  readonly oldStatus: Build['status'];
  readonly build: Build;
}

export interface BuildPushResultNotification extends Notification {
  readonly job: 'BREW_PUSH';
  readonly notificationType: 'BREW_PUSH_RESULT';
  readonly buildPushResult: BuildPushResult;
}

export interface GenericSettingAnnouncementNotification extends Notification {
  readonly job: 'GENERIC_SETTING';
  readonly notificationType: 'NEW_ANNOUNCEMENT';
}

export interface GenericSettingMaintenanceNotification extends Notification {
  readonly job: 'GENERIC_SETTING';
  readonly notificationType: 'MAINTENANCE_STATUS_CHANGED';
}

export interface GroupBuildStatusChangedNotification extends Notification {
  readonly job: 'GROUP_BUILD';
  readonly notificationType: 'GROUP_BUILD_STATUS_CHANGED';
  readonly groupBuild: GroupBuild;
}

export interface MilestonePushResultNotification extends Notification {
  readonly job: 'PRODUCT_MILESTONE_CLOSE';
  readonly notificationType: 'PRODUCT_MILESTONE_CLOSE_RESULT';
  readonly productMilestoneCloseResult: ProductMilestoneCloseResult;
}

export interface ScmRepositoryCreationErrorNotification extends Notification {
  readonly job: 'SCM_REPOSITORY_CREATION';
  readonly notificationType: 'SCMR_CREATION_ERROR';
}

export interface ScmRepositoryCreationNotification extends Notification {
  readonly job: 'SCM_REPOSITORY_CREATION';
  readonly notificationType: 'SCMR_CREATION_SUCCESS';
}

export interface Entity {
  id: string;
}

export type ListenerWithouEntity<N extends Notification> = (notification: N) => void;

export type Listener<E extends Entity, N extends Notification> = (entity: E, notification: N) => void;

export type ListenerUnsubscriber = () => void;

export interface BuildListener extends Listener<Build, BuildChangedNotification> {
  (entity: Build, notification: BuildChangedNotification): void;
}

export interface GroupBuildListener extends Listener<GroupBuild, GroupBuildStatusChangedNotification> {
  (entity: GroupBuild, notification: GroupBuildStatusChangedNotification): void;
}

export interface GenericSettingMaintenanceListener extends ListenerWithouEntity<GenericSettingMaintenanceNotification> {
  (notification: GenericSettingMaintenanceNotification): void;
}

export interface GenericSettingNewAnnouncementListener extends ListenerWithouEntity<GenericSettingAnnouncementNotification> {
  (notification: GenericSettingAnnouncementNotification): void;
}

export interface ScmRepositoryCreationListener extends ListenerWithouEntity<ScmRepositoryCreationNotification> {
  (notification: ScmRepositoryCreationNotification): void;
}

export interface ScmRepositoryCreationErrorListener extends ListenerWithouEntity<ScmRepositoryCreationErrorNotification> {
  (notification: ScmRepositoryCreationErrorNotification): void;
}

export interface BuildPushListener extends Listener<BuildPushResult, BuildPushResultNotification> {
  (entity: BuildPushResult, notification: BuildPushResultNotification): void;
}

export interface MilestonePushListener extends Listener<ProductMilestoneCloseResult, MilestonePushResultNotification> {
  (entity: ProductMilestoneCloseResult, notification: MilestonePushResultNotification): void;
}

export function isBuildChangedNotification(notification: Notification): notification is BuildChangedNotification {
  return notification.job === 'BUILD';
}

export function isGroupBuildStatusChangedNotification(
  notification: Notification
): notification is GroupBuildStatusChangedNotification {
  return notification.job === 'GROUP_BUILD';
}

export function isGenericSettingMaintenanceNotification(
  notification: Notification
): notification is GenericSettingMaintenanceNotification {
  return notification.job === 'GENERIC_SETTING' && notification.notificationType === 'MAINTENANCE_STATUS_CHANGED';
}

export function isGenericSettingAnnouncementNotification(
  notification: Notification
): notification is GenericSettingAnnouncementNotification {
  return notification.job === 'GENERIC_SETTING' && notification.notificationType === 'NEW_ANNOUNCEMENT';
}

export function isScmRepositoryCreationSuccessNotification(
  notification: Notification
): notification is ScmRepositoryCreationNotification {
  return notification.job === 'SCM_REPOSITORY_CREATION' && notification.notificationType === 'SCMR_CREATION_SUCCESS';
}

export function isScmRepositoryCreationErrorNotification(
  notification: Notification
): notification is ScmRepositoryCreationErrorNotification {
  return !!(
    notification.job === 'SCM_REPOSITORY_CREATION' &&
    notification.notificationType &&
    notification.notificationType.includes('ERROR')
  );
}

export function isBuildPushResultNotification(notification: Notification): notification is BuildPushResultNotification {
  return notification.job === 'BREW_PUSH' && notification.notificationType === 'BREW_PUSH_RESULT';
}

export function isMilestonePushResultNotification(notification: Notification): notification is MilestonePushResultNotification {
  return notification.job === 'PRODUCT_MILESTONE_CLOSE' && notification.notificationType === 'PRODUCT_MILESTONE_CLOSE_RESULT';
}

export type Dispatcher = (notification: Notification) => void;
