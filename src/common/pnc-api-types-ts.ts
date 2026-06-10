export interface AlignmentParameters {
    buildType?: string;
    parameters?: string;
}
export interface AnalyzedArtifact {
    archiveFilenames?: string[];
    archiveUnmatchedFilenames?: string[];
    artifact?: Artifact;
    brewId?: number; // int64
    builtFromSource?: boolean;
    distribution?: AnalyzedDistribution;
    licenses?: LicenseInfo[];
}
export interface AnalyzedArtifactPage {
    content?: AnalyzedArtifact[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface AnalyzedDistribution {
    creationTime?: string; // date-time
    distributionUrl?: string;
    md5?: string;
    sha1?: string;
    sha256?: string;
}
export interface Artifact {
    artifactQuality: "NEW" | "VERIFIED" | "TESTED" | "DEPRECATED" | "BLACKLISTED" | "DELETED" | "TEMPORARY" | "IMPORTED";
    build?: Build;
    buildCategory: "STANDARD" | "LEGACY_REDHAT" | "SERVICE";
    creationTime?: string; // date-time
    creationUser?: User;
    deployPath?: string;
    deployUrl?: string;
    filename: string;
    id: string;
    identifier: string;
    importDate?: string; // date-time
    md5: string;
    modificationTime?: string; // date-time
    modificationUser?: User;
    originUrl?: string;
    publicUrl?: string;
    purl?: string;
    qualityLevelReason?: string;
    sha1: string;
    sha256: string;
    size?: number; // int64
    targetRepository: TargetRepository;
}
export interface ArtifactInfo {
    artifactQuality?: "NEW" | "VERIFIED" | "TESTED" | "DEPRECATED" | "BLACKLISTED" | "DELETED" | "TEMPORARY" | "IMPORTED";
    buildCategory?: "STANDARD" | "LEGACY_REDHAT" | "SERVICE";
    id?: string;
    identifier?: string;
    repositoryType?: "MAVEN" | "NPM" | "COCOA_POD" | "GENERIC_PROXY" | "DISTRIBUTION_ARCHIVE" | "RPM";
}
export interface ArtifactInfoPage {
    content?: ArtifactInfo[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface ArtifactPage {
    content?: Artifact[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface ArtifactRevision {
    artifactQuality?: "NEW" | "VERIFIED" | "TESTED" | "DEPRECATED" | "BLACKLISTED" | "DELETED" | "TEMPORARY" | "IMPORTED";
    buildCategory?: "STANDARD" | "LEGACY_REDHAT" | "SERVICE";
    id: string;
    modificationTime?: string; // date-time
    modificationUser?: User;
    qualityLevelReason?: string;
    rev?: number; // int32
}
export interface ArtifactRevisionPage {
    content?: ArtifactRevision[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface Attachment {
    build?: BuildRef;
    creationTime?: string; // date-time
    description?: string;
    id: string;
    name: string;
    sha256: string;
    type: "LOG" | "SBOM" | "PROVENANCE" | "VULNERABILITY_SCAN" | "OTHER";
    url: string;
}
export interface AttachmentPage {
    content?: Attachment[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface Banner {
    banner?: string;
}
export interface Build {
    alignmentPreference?: "PREFER_PERSISTENT" | "PREFER_TEMPORARY";
    attributes?: {
        [name: string]: string;
    };
    buildConfigRevision?: BuildConfigurationRevisionRef;
    buildContentId?: string;
    buildOutputChecksum?: string;
    endTime?: string; // date-time
    environment?: Environment;
    groupBuild?: GroupBuildRef;
    id: string;
    lastUpdateTime?: string; // date-time
    noRebuildCause?: BuildRef;
    productMilestone?: ProductMilestoneRef;
    progress?: "PENDING" | "IN_PROGRESS" | "FINISHED";
    project?: ProjectRef;
    scmBuildConfigRevision?: string;
    scmBuildConfigRevisionInternal?: boolean;
    scmRepository?: SCMRepository;
    scmRevision?: string;
    scmTag?: string;
    scmUrl?: string;
    startTime?: string; // date-time
    status?: "SUCCESS" | "FAILED" | "NO_REBUILD_REQUIRED" | "ENQUEUED" | "WAITING_FOR_DEPENDENCIES" | "BUILDING" | "REJECTED" | "REJECTED_FAILED_DEPENDENCIES" | "CANCELLED" | "SYSTEM_ERROR" | "NEW";
    submitTime?: string; // date-time
    temporaryBuild?: boolean;
    user?: User;
}
export interface BuildConfigCreationResponse {
    buildConfig?: BuildConfiguration;
    taskId?: string;
}
export interface BuildConfigPage {
    content?: BuildConfiguration[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface BuildConfigRevisionPage {
    content?: BuildConfigurationRevision[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface BuildConfigWithLatestPage {
    content?: BuildConfigurationWithLatestBuild[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface BuildConfigWithSCMRequest {
    buildConfig?: BuildConfiguration;
    preBuildSyncEnabled?: boolean;
    scmUrl: string;
}
export interface BuildConfiguration {
    brewPullActive?: boolean;
    buildScript?: string;
    buildType: "MVN" | "NPM" | "GRADLE" | "SBT" | "MVN_RPM" | "RPM";
    creationTime?: string; // date-time
    creationUser?: User;
    defaultAlignmentParams?: string;
    dependencies?: {
        [name: string]: BuildConfigurationRef;
    };
    description?: string;
    environment?: Environment;
    groupConfigs?: {
        [name: string]: GroupConfigurationRef;
    };
    id: string;
    modificationTime?: string; // date-time
    modificationUser?: User;
    name: string; // ^[a-zA-Z0-9_.][a-zA-Z0-9_.-]*(?<!\.git)$
    parameters?: {
        [name: string]: string;
    };
    productVersion?: ProductVersionRef;
    project?: ProjectRef;
    scmRepository?: SCMRepository;
    scmRevision?: string;
}
export interface BuildConfigurationRef {
    brewPullActive?: boolean;
    buildScript?: string;
    buildType: "MVN" | "NPM" | "GRADLE" | "SBT" | "MVN_RPM" | "RPM";
    creationTime?: string; // date-time
    defaultAlignmentParams?: string;
    description?: string;
    id: string;
    modificationTime?: string; // date-time
    name: string; // ^[a-zA-Z0-9_.][a-zA-Z0-9_.-]*(?<!\.git)$
    scmRevision?: string;
}
export interface BuildConfigurationRevision {
    brewPullActive?: boolean;
    buildScript?: string;
    buildType?: "MVN" | "NPM" | "GRADLE" | "SBT" | "MVN_RPM" | "RPM";
    creationTime?: string; // date-time
    creationUser?: User;
    defaultAlignmentParams?: string;
    environment?: Environment;
    id: string;
    modificationTime?: string; // date-time
    modificationUser?: User;
    name?: string;
    parameters?: {
        [name: string]: string;
    };
    project?: ProjectRef;
    rev?: number; // int32
    scmRepository?: SCMRepository;
    scmRevision?: string;
}
export interface BuildConfigurationRevisionRef {
    brewPullActive?: boolean;
    buildScript?: string;
    buildType?: "MVN" | "NPM" | "GRADLE" | "SBT" | "MVN_RPM" | "RPM";
    creationTime?: string; // date-time
    defaultAlignmentParams?: string;
    id: string;
    modificationTime?: string; // date-time
    name?: string;
    rev?: number; // int32
    scmRevision?: string;
}
export interface BuildConfigurationWithLatestBuild {
    brewPullActive?: boolean;
    buildScript?: string;
    buildType: "MVN" | "NPM" | "GRADLE" | "SBT" | "MVN_RPM" | "RPM";
    creationTime?: string; // date-time
    creationUser?: User;
    defaultAlignmentParams?: string;
    dependencies?: {
        [name: string]: BuildConfigurationRef;
    };
    description?: string;
    environment?: Environment;
    groupConfigs?: {
        [name: string]: GroupConfigurationRef;
    };
    id: string;
    latestBuild?: BuildRef;
    latestBuildUsername?: string;
    modificationTime?: string; // date-time
    modificationUser?: User;
    name: string; // ^[a-zA-Z0-9_.][a-zA-Z0-9_.-]*(?<!\.git)$
    parameters?: {
        [name: string]: string;
    };
    productVersion?: ProductVersionRef;
    project?: ProjectRef;
    scmRepository?: SCMRepository;
    scmRevision?: string;
}
export interface BuildDefinition {
    buildType?: string;
    externalParameters?: {
        [name: string]: {
        };
    };
    internalParameters?: {
        [name: string]: {
        };
    };
    resolvedDependencies?: ResourceDescriptor[];
}
export interface BuildEnvironmentPage {
    content?: Environment[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface BuildPage {
    content?: Build[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface BuildPushCompleted {
    brewBuildId?: number; // int32
    brewBuildUrl?: string;
    callback?: Request;
    operationId?: string;
}
export interface BuildPushOperation {
    build?: BuildRef;
    endTime?: string; // date-time
    id: string;
    outcome?: OperationOutcome;
    parameters?: {
        [name: string]: string;
    };
    progressStatus?: "NEW" | "PENDING" | "IN_PROGRESS" | "FINISHED";
    result?: "SUCCESSFUL" | "FAILED" | "REJECTED" | "CANCELLED" | "TIMEOUT" | "SYSTEM_ERROR";
    startTime?: string; // date-time
    submitTime?: string; // date-time
    user?: User;
}
export interface BuildPushOperationPage {
    content?: BuildPushOperation[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface BuildPushParameters {
    reimport?: boolean;
    tagPrefix: string;
}
export interface BuildPushReport {
    brewBuildId?: number; // int32
    brewBuildUrl?: string;
    build?: BuildRef;
    endTime?: string; // date-time
    id?: string;
    progressStatus?: "NEW" | "PENDING" | "IN_PROGRESS" | "FINISHED";
    result?: "SUCCESSFUL" | "FAILED" | "REJECTED" | "CANCELLED" | "TIMEOUT" | "SYSTEM_ERROR";
    startTime?: string; // date-time
    submitTime?: string; // date-time
    tagPrefix?: string;
    user?: User;
}
export interface BuildRecordInsights {
    autoalign?: boolean;
    brewpullactive?: boolean;
    buildConfigSetRecordId?: number; // int64
    buildConfigurationId?: number; // int32
    buildConfigurationName?: string;
    buildConfigurationRev?: number; // int32
    buildContentId?: string;
    buildId?: number; // int64
    buildType?: string;
    endTime?: string; // date-time
    executionRootName?: string;
    executionRootVersion?: string;
    lastUpdateTime?: string; // date-time
    productId?: number; // int32
    productMilestoneId?: number; // int32
    productMilestoneVersion?: string;
    productName?: string;
    productVersionId?: number; // int32
    productVersionVersion?: string;
    projectId?: number; // int32
    projectName?: string;
    startTime?: string; // date-time
    status?: string;
    submitMonth?: number; // int32
    submitQuarter?: number; // int32
    submitTime?: string; // date-time
    submitYear?: number; // int32
    temporarybuild?: boolean;
    userId?: number; // int32
    username?: string;
}
export interface BuildRecordInsightsPage {
    content?: BuildRecordInsights[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface BuildRef {
    alignmentPreference?: "PREFER_PERSISTENT" | "PREFER_TEMPORARY";
    buildContentId?: string;
    buildOutputChecksum?: string;
    endTime?: string; // date-time
    id: string;
    lastUpdateTime?: string; // date-time
    progress?: "PENDING" | "IN_PROGRESS" | "FINISHED";
    scmBuildConfigRevision?: string;
    scmBuildConfigRevisionInternal?: boolean;
    scmRevision?: string;
    scmTag?: string;
    scmUrl?: string;
    startTime?: string; // date-time
    status?: "SUCCESS" | "FAILED" | "NO_REBUILD_REQUIRED" | "ENQUEUED" | "WAITING_FOR_DEPENDENCIES" | "BUILDING" | "REJECTED" | "REJECTED_FAILED_DEPENDENCIES" | "CANCELLED" | "SYSTEM_ERROR" | "NEW";
    submitTime?: string; // date-time
    temporaryBuild?: boolean;
}
export interface Builder {
    builderDependencies?: ResourceDescriptor[];
    id?: string;
    version?: {
        [name: string]: string;
    };
}
export interface BuildsGraph {
    edges?: EdgeBuild[];
    vertices?: {
        [name: string]: VertexBuild;
    };
}
export interface ComponentVersion {
    builtOn?: string; // date-time
    commit?: string;
    components?: ComponentVersion[];
    name?: string;
    version?: string;
}
export interface CreateAndSyncSCMRequest {
    preBuildSyncEnabled?: boolean;
    scmUrl: string;
}
export interface DeliverableAnalyzerLabelEntry {
    change?: "ADDED" | "REMOVED";
    date?: string; // date-time
    label?: "DELETED" | "SCRATCH" | "RELEASED";
    reason?: string;
    user?: User;
}
export interface DeliverableAnalyzerLabelEntryPage {
    content?: DeliverableAnalyzerLabelEntry[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface DeliverableAnalyzerOperation {
    endTime?: string; // date-time
    id: string;
    outcome?: OperationOutcome;
    parameters?: {
        [name: string]: string;
    };
    productMilestone?: ProductMilestoneRef;
    progressStatus?: "NEW" | "PENDING" | "IN_PROGRESS" | "FINISHED";
    result?: "SUCCESSFUL" | "FAILED" | "REJECTED" | "CANCELLED" | "TIMEOUT" | "SYSTEM_ERROR";
    startTime?: string; // date-time
    submitTime?: string; // date-time
    user?: User;
}
export interface DeliverableAnalyzerOperationPage {
    content?: DeliverableAnalyzerOperation[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface DeliverableAnalyzerReport {
    endTime?: string; // date-time
    id?: string;
    labels?: ("DELETED" | "SCRATCH" | "RELEASED")[];
    productMilestone?: ProductMilestoneRef;
    startTime?: string; // date-time
    submitTime?: string; // date-time
    urls?: string[];
    user?: User;
}
export interface DeliverableAnalyzerReportLabelRequest {
    label?: "DELETED" | "SCRATCH" | "RELEASED";
    reason?: string;
}
export interface DeliverableAnalyzerReportPage {
    content?: DeliverableAnalyzerReport[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface DeliverablesAnalysisRequest {
    deliverablesUrls: string[];
    runAsScratchAnalysis?: boolean;
}
export interface DeliveredArtifactInMilestones {
    artifactIdentifierPrefix?: string;
    productMilestoneArtifacts?: {
        [name: string]: ParsedArtifact[];
    };
}
export interface EdgeBuild {
    cost?: number; // int32
    source?: string;
    target?: string;
}
export interface EdgeProductMilestone {
    cost?: number; // int32
    source?: string;
    target?: string;
}
export interface Environment {
    attributes?: {
        [name: string]: string;
    };
    deprecated?: boolean;
    description?: string;
    hidden?: boolean;
    id: string;
    name?: string;
    systemImageId: string;
    systemImageRepositoryUrl?: string;
    systemImageType: "DOCKER_IMAGE" | "VIRTUAL_MACHINE_RAW" | "VIRTUAL_MACHINE_QCOW2" | "LOCAL_WORKSPACE";
}
export interface EnvironmentDeprecationRequest {
    replacementEnvironmentId: string;
}
export interface ErrorResponse {
    details?: {
    };
    errorMessage?: string;
    errorType?: string;
}
export interface GraphBuild {
    edges?: EdgeBuild[];
    vertices?: {
        [name: string]: VertexBuild;
    };
}
export interface GraphProductMilestone {
    edges?: EdgeProductMilestone[];
    vertices?: {
        [name: string]: VertexProductMilestone;
    };
}
export interface GroupBuild {
    alignmentPreference?: "PREFER_PERSISTENT" | "PREFER_TEMPORARY";
    endTime?: string; // date-time
    groupConfig?: GroupConfigurationRef;
    id: string;
    productVersion?: ProductVersionRef;
    startTime?: string; // date-time
    status?: "SUCCESS" | "FAILED" | "NO_REBUILD_REQUIRED" | "ENQUEUED" | "WAITING_FOR_DEPENDENCIES" | "BUILDING" | "REJECTED" | "REJECTED_FAILED_DEPENDENCIES" | "CANCELLED" | "SYSTEM_ERROR" | "NEW";
    temporaryBuild?: boolean;
    user?: User;
}
export interface GroupBuildPage {
    content?: GroupBuild[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface GroupBuildPushRequest {
    tagPrefix?: string;
}
export interface GroupBuildRef {
    alignmentPreference?: "PREFER_PERSISTENT" | "PREFER_TEMPORARY";
    endTime?: string; // date-time
    id: string;
    startTime?: string; // date-time
    status?: "SUCCESS" | "FAILED" | "NO_REBUILD_REQUIRED" | "ENQUEUED" | "WAITING_FOR_DEPENDENCIES" | "BUILDING" | "REJECTED" | "REJECTED_FAILED_DEPENDENCIES" | "CANCELLED" | "SYSTEM_ERROR" | "NEW";
    temporaryBuild?: boolean;
}
export interface GroupBuildRequest {
    buildConfigurationRevisions?: BuildConfigurationRevisionRef[];
}
export interface GroupConfigPage {
    content?: GroupConfiguration[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface GroupConfiguration {
    buildConfigs?: {
        [name: string]: BuildConfigurationRef;
    };
    id: string;
    name: string;
    productVersion?: ProductVersionRef;
}
export interface GroupConfigurationRef {
    id: string;
    name: string;
}
export interface Header {
    name: string;
    value: string;
}
export interface LicenseInfo {
    comments?: string;
    distribution?: string;
    name?: string;
    source?: "UNKNOWN" | "POM" | "POM_XML" | "BUNDLE_LICENSE" | "TEXT";
    sourceUrl?: string;
    spdxLicenseId?: string;
    url?: string;
}
export interface MapOfMaps {
    empty?: boolean;
}
export interface Metadata {
    finishedOn?: string; // date-time
    invocationId?: string;
    startedOn?: string; // date-time
}
export interface MilestoneCloseRequest {
    skipBrewPush?: boolean;
}
export interface MilestoneInfo {
    built?: boolean;
    milestoneEndDate?: string; // date-time
    milestoneId?: string;
    milestoneVersion?: string;
    productId?: string;
    productName?: string;
    productVersionId?: string;
    productVersionVersion?: string;
    releaseId?: string;
    releaseReleaseDate?: string; // date-time
    releaseVersion?: string;
}
export interface MilestoneInfoPage {
    content?: MilestoneInfo[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface OperationOutcome {
    proposal?: string;
    reason?: string;
    result: "SUCCESSFUL" | "FAILED" | "REJECTED" | "CANCELLED" | "TIMEOUT" | "SYSTEM_ERROR";
}
export interface PageAnalyzedArtifact {
    content?: AnalyzedArtifact[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageArtifact {
    content?: Artifact[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageArtifactInfo {
    content?: ArtifactInfo[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageArtifactRevision {
    content?: ArtifactRevision[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageAttachment {
    content?: Attachment[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageBuild {
    content?: Build[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageBuildConfiguration {
    content?: BuildConfiguration[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageBuildConfigurationRevision {
    content?: BuildConfigurationRevision[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageBuildConfigurationWithLatestBuild {
    content?: BuildConfigurationWithLatestBuild[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageBuildPushOperation {
    content?: BuildPushOperation[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageBuildRecordInsights {
    content?: BuildRecordInsights[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageDeliverableAnalyzerLabelEntry {
    content?: DeliverableAnalyzerLabelEntry[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageDeliverableAnalyzerOperation {
    content?: DeliverableAnalyzerOperation[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageDeliverableAnalyzerReport {
    content?: DeliverableAnalyzerReport[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageEnvironment {
    content?: Environment[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageGroupBuild {
    content?: GroupBuild[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageGroupConfiguration {
    content?: GroupConfiguration[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageMilestoneInfo {
    content?: MilestoneInfo[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageProduct {
    content?: Product[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageProductMilestone {
    content?: ProductMilestone[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageProductMilestoneArtifactQualityStatistics {
    content?: ProductMilestoneArtifactQualityStatistics[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageProductMilestoneRepositoryTypeStatistics {
    content?: ProductMilestoneRepositoryTypeStatistics[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageProductRelease {
    content?: ProductRelease[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageProductVersion {
    content?: ProductVersion[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageProject {
    content?: Project[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageSCMRepository {
    content?: SCMRepository[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface PageTargetRepository {
    content?: TargetRepository[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface Parameter {
    description?: string;
    name?: string;
    values?: string[];
}
export namespace Parameters {
    export type AlignmentPreference = "PREFER_PERSISTENT" | "PREFER_TEMPORARY";
    export type Attribute = string[];
    export type BuildCategories = ("STANDARD" | "LEGACY_REDHAT" | "SERVICE")[];
    export type BuildConfigName = string;
    export type BuildDependencies = boolean;
    export type BuildType = string;
    export type Callback = string;
    export type ConfigId = string;
    export type DepId = string;
    export type DepthLimit = number; // int32
    export type Id = string;
    export type Identifier = string;
    export type KeepPodOnFailure = boolean;
    export type Key = string;
    export type Latest = boolean;
    export type Md5 = string;
    export type Milestone1 = string;
    export type Milestone2 = string;
    export type MilestoneIds = string[];
    export type PageIndex = number; // int32
    export type PageSize = number; // int32
    export type Purl = string;
    export type Q = string;
    export type Qualities = ("NEW" | "VERIFIED" | "TESTED" | "DEPRECATED" | "BLACKLISTED" | "DELETED" | "TEMPORARY" | "IMPORTED")[];
    export type Quality = string;
    export type Reason = string;
    export type RebuildMode = "IMPLICIT_DEPENDENCY_CHECK" | "EXPLICIT_DEPENDENCY_CHECK" | "FORCE";
    export type RepoType = "MAVEN" | "NPM" | "COCOA_POD" | "GENERIC_PROXY" | "DISTRIBUTION_ARCHIVE" | "RPM";
    export type Rev = number; // int32
    export type Running = boolean;
    export type SearchUrl = string;
    export type Sha1 = string;
    export type Sha256 = string;
    export type Sort = string;
    export type TemporaryBuild = boolean;
    export type Timestamp = number; // int64
    export type TimestampAlignment = boolean;
    export type Url = string;
    export type Value = string;
}
export interface ParsedArtifact {
    artifactVersion?: string;
    classifier?: string;
    id?: string;
    type?: string;
}
export interface PathParameters {
    id: Parameters.Id;
}
export interface PncStatus {
    banner?: string;
    eta?: string; // date-time
    isMaintenanceMode: boolean;
}
export interface Predicate {
    buildDefinition?: BuildDefinition;
    runDetails?: RunDetails;
}
export interface Product {
    abbreviation: string; // [a-zA-Z0-9-]+
    description?: string;
    id: string;
    name: string;
    productManagers?: string;
    productPagesCode?: string;
    productVersions?: {
        [name: string]: ProductVersionRef;
    };
}
export interface ProductMilestone {
    deliveredArtifactsImporter?: User;
    distributedArtifactsImporter?: User;
    endDate?: string; // date-time
    id: string;
    plannedEndDate?: string; // date-time
    productRelease?: ProductReleaseRef;
    productVersion?: ProductVersionRef;
    startingDate?: string; // date-time
    version: string; // ^[0-9]+\.[0-9]+(\.\w[\w-]*)+$
}
export interface ProductMilestoneArtifactQualityStatistics {
    artifactQuality?: {
        [name: string]: number; // int64
    };
    productMilestone?: ProductMilestoneRef;
}
export interface ProductMilestoneDeliveredArtifactsStatistics {
    noBuild?: number; // int64
    noMilestone?: number; // int64
    otherMilestones?: number; // int64
    otherProducts?: number; // int64
    thisMilestone?: number; // int64
}
export interface ProductMilestonePage {
    content?: ProductMilestone[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface ProductMilestoneRef {
    endDate?: string; // date-time
    id: string;
    plannedEndDate?: string; // date-time
    startingDate?: string; // date-time
    version: string; // ^[0-9]+\.[0-9]+(\.\w[\w-]*)+$
}
export interface ProductMilestoneRepositoryTypeStatistics {
    productMilestone?: ProductMilestoneRef;
    repositoryType?: {
        [name: string]: number; // int64
    };
}
export interface ProductMilestoneStatistics {
    artifactQuality?: {
        [name: string]: number; // int64
    };
    artifactsInMilestone?: number; // int64
    deliveredArtifactsSource?: ProductMilestoneDeliveredArtifactsStatistics;
    repositoryType?: {
        [name: string]: number; // int64
    };
}
export interface ProductPage {
    content?: Product[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface ProductRef {
    abbreviation: string; // [a-zA-Z0-9-]+
    description?: string;
    id: string;
    name: string;
    productManagers?: string;
    productPagesCode?: string;
}
export interface ProductRelease {
    commonPlatformEnumeration?: string;
    id: string;
    productMilestone?: ProductMilestoneRef;
    productPagesCode?: string;
    productVersion?: ProductVersionRef;
    releaseDate?: string; // date-time
    supportLevel?: "UNRELEASED" | "EARLYACCESS" | "SUPPORTED" | "EXTENDED_SUPPORT" | "EOL";
    version?: string;
}
export interface ProductReleasePage {
    content?: ProductRelease[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface ProductReleaseRef {
    commonPlatformEnumeration?: string;
    id: string;
    productPagesCode?: string;
    releaseDate?: string; // date-time
    supportLevel?: "UNRELEASED" | "EARLYACCESS" | "SUPPORTED" | "EXTENDED_SUPPORT" | "EOL";
    version?: string;
}
export interface ProductVersion {
    attributes?: {
        [name: string]: string;
    };
    buildConfigs?: {
        [name: string]: BuildConfigurationRef;
    };
    currentProductMilestone?: ProductMilestoneRef;
    groupConfigs?: {
        [name: string]: GroupConfigurationRef;
    };
    id: string;
    product?: ProductRef;
    productMilestones?: {
        [name: string]: ProductMilestoneRef;
    };
    productReleases?: {
        [name: string]: ProductReleaseRef;
    };
    version: string; // ^[0-9]+\.[0-9]+$
}
export interface ProductVersionArtifactQualityStatisticsPage {
    content?: ProductMilestoneArtifactQualityStatistics[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface ProductVersionDeliveredArtifactsStatistics {
    noBuild?: number; // int64
    noMilestone?: number; // int64
    otherProducts?: number; // int64
    otherVersions?: number; // int64
    thisVersion?: number; // int64
}
export interface ProductVersionPage {
    content?: ProductVersion[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface ProductVersionRef {
    attributes?: {
        [name: string]: string;
    };
    id: string;
    version: string; // ^[0-9]+\.[0-9]+$
}
export interface ProductVersionRepositoryTypeStatisticsPage {
    content?: ProductMilestoneRepositoryTypeStatistics[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface ProductVersionStatistics {
    artifactsInVersion?: number; // int64
    deliveredArtifactsSource?: ProductVersionDeliveredArtifactsStatistics;
    milestoneDependencies?: number; // int64
    milestones?: number; // int64
    productDependencies?: number; // int64
}
export interface Project {
    buildConfigs?: {
        [name: string]: BuildConfigurationRef;
    };
    description?: string;
    engineeringTeam?: string;
    id: string;
    issueTrackerUrl?: string;
    name: string;
    projectUrl?: string;
    technicalLeader?: string;
}
export interface ProjectPage {
    content?: Project[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface ProjectRef {
    description?: string;
    engineeringTeam?: string;
    id: string;
    issueTrackerUrl?: string;
    name: string;
    projectUrl?: string;
    technicalLeader?: string;
}
export interface Provenance {
    _type?: string;
    predicate?: Predicate;
    predicateType?: string;
    subject?: ResourceDescriptor[];
}
export interface QueryParameters {
    pageIndex?: Parameters.PageIndex; // int32
    pageSize?: Parameters.PageSize; // int32
    sort?: Parameters.Sort;
    q?: Parameters.Q;
    latest?: Parameters.Latest;
    running?: Parameters.Running;
    buildConfigName?: Parameters.BuildConfigName;
}
export interface RepositoryCreationResponse {
    repository?: SCMRepository;
    taskId?: number; // int64
}
export interface Request {
    attachment?: {
    };
    headers?: Header[];
    method: "GET" | "POST" | "PUT" | "DELETE" | "HEAD" | "PATCH" | "OPTIONS";
    uri?: string; // uri
}
export type RequestBody = TargetRepository;
export interface ResourceDescriptor {
    annotations?: {
        [name: string]: {
        };
    };
    content?: string;
    digest?: {
        [name: string]: string;
    };
    downloadLocation?: string;
    mediaType?: string;
    name?: string;
    uri?: string;
}
export namespace Responses {
    export type $200 = ComponentVersion;
    export type $201 = TargetRepository;
    export type $202 = RepositoryCreationResponse;
    export interface $204 {
    }
    export interface $302 {
    }
    export type $400 = ErrorResponse;
    export type $403 = ErrorResponse;
    export interface $404 {
    }
    export type $409 = ErrorResponse;
    export type $500 = ErrorResponse;
}
export interface RunDetails {
    builder?: Builder;
    byproducts?: ResourceDescriptor[];
    metadata?: Metadata;
}
export interface RunningBuildCount {
    enqueued?: number; // int32
    running?: number; // int32
    waitingForDependencies?: number; // int32
}
export interface SCMRepository {
    externalUrl?: string;
    id: string;
    internalUrl: string;
    preBuildSyncEnabled?: boolean;
}
export interface SCMRepositoryPage {
    content?: SCMRepository[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface SSHCredentials {
    command?: string;
    password?: string;
}
export interface ScratchDeliverablesAnalysisRequest {
    deliverablesUrls: string[];
}
export interface TargetRepository {
    id: string;
    identifier: string;
    repositoryPath: string;
    repositoryType: "MAVEN" | "NPM" | "COCOA_POD" | "GENERIC_PROXY" | "DISTRIBUTION_ARCHIVE" | "RPM";
    temporaryRepo: boolean;
}
export interface TargetRepositoryPage {
    content?: TargetRepository[];
    pageIndex?: number; // int32
    pageSize?: number; // int32
    totalHits?: number; // int32
    totalPages?: number; // int32
}
export interface User {
    id: string;
    username?: string;
}
export interface ValidationResponse {
    errorType?: "FORMAT" | "DUPLICATION";
    hints?: string[];
    isValid: boolean;
}
export interface VersionValidationRequest {
    productVersionId: string;
    version: string;
}
export interface VertexBuild {
    data?: Build;
    dataType?: string;
    name?: string;
}
export interface VertexProductMilestone {
    data?: ProductMilestone;
    dataType?: string;
    name?: string;
}
