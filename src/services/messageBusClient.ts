import { Build } from 'pnc-api-types-ts';

import {
  BuildListener,
  BuildPushListener,
  Dispatcher,
  GenericSettingMaintenanceListener,
  GenericSettingNewAnnouncementListener,
  GroupBuildListener,
  JobNotificationProgress,
  ListenerUnsubscriber,
  ListenerWithouEntity,
  MilestonePushListener,
  Notification,
  ScmRepositoryCreationErrorListener,
  ScmRepositoryCreationListener,
  isBuildChangedNotification,
  isBuildPushResultNotification,
  isGenericSettingAnnouncementNotification,
  isGenericSettingMaintenanceNotification,
  isGroupBuildStatusChangedNotification,
  isMilestonePushResultNotification,
  isScmRepositoryCreationErrorNotification,
  isScmRepositoryCreationSuccessNotification,
} from 'services/messaBusClientTypes';
import * as webConfigService from 'services/webConfigService';

class MessageBusClient {
  private readonly url: string;
  private ws: WebSocket | undefined = undefined;
  private dispatchers: Dispatcher[] = [];

  constructor(url: string) {
    this.url = url;
  }

  public async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.url);
      this.ws.addEventListener('open', () => resolve());
      this.ws.addEventListener('message', (message) => this.dispatch(message));
    });
  }

  public async close(): Promise<CloseEvent | undefined> {
    return new Promise((resolve) => {
      if (this.ws?.readyState === this.ws?.CLOSED) {
        resolve(undefined);
        return;
      }
      this.ws?.addEventListener('close', (event) => resolve(event));
      this.ws?.close(1000, 'Client session finished');
    });
  }

  private addDispatcher(dispatcher: Dispatcher): ListenerUnsubscriber {
    this.dispatchers.push(dispatcher);
    return () => this.removeDispatcher(dispatcher);
  }

  private removeDispatcher(dispatcher: Dispatcher): void {
    const index: number = this.dispatchers.indexOf(dispatcher);
    if (index >= 0) {
      this.dispatchers.splice(index, 1);
    }
  }

  private dispatch(message: MessageEvent) {
    const notification: Notification = JSON.parse(message.data);
    this.dispatchers.forEach((dispatcher) => dispatcher(notification));
  }

  public onMessage(listener: ListenerWithouEntity<any>): ListenerUnsubscriber {
    return this.addDispatcher((message) => listener(message));
  }

  public onBuildProgressChange(listener: BuildListener): ListenerUnsubscriber {
    const dispatcher: Dispatcher = (notification) => {
      if (isBuildChangedNotification(notification) && notification.progress !== notification.oldProgress) {
        listener(notification.build, notification);
      }
    };

    return this.addDispatcher(dispatcher);
  }

  public onBuildProgress(progress: JobNotificationProgress, listener: BuildListener): ListenerUnsubscriber {
    return this.addDispatcher((notification) => {
      if (
        isBuildChangedNotification(notification) &&
        notification.progress === progress &&
        notification.progress !== notification.oldProgress
      ) {
        listener(notification.build, notification);
      }
    });
  }

  public onBuildStatusChange(listener: BuildListener): ListenerUnsubscriber {
    return this.addDispatcher((notification) => {
      if (isBuildChangedNotification(notification)) {
        listener(notification.build, notification);
      }
    });
  }

  public onBuildStatus(status: Build['status'], listener: BuildListener): ListenerUnsubscriber {
    return this.addDispatcher((notification) => {
      if (isBuildChangedNotification(notification) && notification.build.status === status) {
        listener(notification.build, notification);
      }
    });
  }

  public onGroupBuildProgressChange(listener: GroupBuildListener): ListenerUnsubscriber {
    return this.addDispatcher((notification) => {
      if (isGroupBuildStatusChangedNotification(notification) && notification.progress !== notification.oldProgress) {
        listener(notification.groupBuild, notification);
      }
    });
  }

  public onGroupBuildProgress(progress: JobNotificationProgress, listener: GroupBuildListener): ListenerUnsubscriber {
    return this.addDispatcher((notification) => {
      if (
        isGroupBuildStatusChangedNotification(notification) &&
        notification.progress === progress &&
        notification.progress !== notification.oldProgress
      ) {
        listener(notification.groupBuild, notification);
      }
    });
  }

  public onGroupBuildStatusChange(listener: GroupBuildListener): ListenerUnsubscriber {
    return this.addDispatcher((notification) => {
      if (isGroupBuildStatusChangedNotification(notification)) {
        listener(notification.groupBuild, notification);
      }
    });
  }

  public onGroupBuildStatus(status: Build['status'], listener: GroupBuildListener): ListenerUnsubscriber {
    return this.addDispatcher((notification) => {
      if (isGroupBuildStatusChangedNotification(notification) && notification.groupBuild.status === status) {
        listener(notification.groupBuild, notification);
      }
    });
  }

  public onGenericSettingMaintenanceChanged(listener: GenericSettingMaintenanceListener): ListenerUnsubscriber {
    return this.addDispatcher((notification) => {
      if (isGenericSettingMaintenanceNotification(notification)) {
        listener(notification);
      }
    });
  }

  public onGenericSettingNewAnnouncement(listener: GenericSettingNewAnnouncementListener): ListenerUnsubscriber {
    return this.addDispatcher((notification) => {
      if (isGenericSettingAnnouncementNotification(notification)) {
        listener(notification);
      }
    });
  }

  public onScmRepositoryCreationSuccess(listener: ScmRepositoryCreationListener): ListenerUnsubscriber {
    return this.addDispatcher((notification) => {
      if (isScmRepositoryCreationSuccessNotification(notification)) {
        listener(notification);
      }
    });
  }

  public onScmRepositoryCreationError(listener: ScmRepositoryCreationErrorListener): ListenerUnsubscriber {
    return this.addDispatcher((notification) => {
      if (isScmRepositoryCreationErrorNotification(notification)) {
        listener(notification);
      }
    });
  }

  public onBuildPushStatusChange(listener: BuildPushListener): ListenerUnsubscriber {
    return this.addDispatcher((notification) => {
      if (isBuildPushResultNotification(notification)) {
        listener(notification.buildPushResult, notification);
      }
    });
  }

  public onMilestonePushStatusChange(listener: MilestonePushListener): ListenerUnsubscriber {
    return this.addDispatcher((notification) => {
      if (isMilestonePushResultNotification(notification)) {
        listener(notification.productMilestoneCloseResult, notification);
      }
    });
  }
}

export const messageBusClient = new MessageBusClient(webConfigService.getPncNotificationsUrl());
