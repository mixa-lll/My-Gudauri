export const DESIGN_LAYERS = ['primitive', 'component', 'block', 'pattern', 'template'] as const;
export const DESIGN_STATUSES = ['draft', 'beta', 'stable', 'deprecated', 'internal'] as const;

export type DesignLayer = (typeof DESIGN_LAYERS)[number];
export type DesignStatus = (typeof DESIGN_STATUSES)[number];

export interface DesignSystemEntry {
  id: string;
  name: string;
  layer: DesignLayer;
  status: DesignStatus;
  storyId?: string;
  sourcePath?: string;
  description?: string;
  figmaUrl?: string;
  children?: string[];
  publicExport?: boolean;
  replacement?: string;
  removalDate?: string;
  legacyUsage?: string;
  newUsageForbidden?: boolean;
}

export interface CompositionNodeReference {
  id?: string;
  name?: string;
  children?: CompositionReference[];
}

export type CompositionReference = string | CompositionNodeReference;

export interface CompositionParameter {
  root?: string;
  children?: CompositionReference[];
  description?: string;
}

export type CompositionMode = 'direct' | 'full' | 'rendered' | 'violations';

export interface ArchitectureReportIssue {
  id: string;
  category: 'internal-import' | 'public-export';
  severity: 'error' | 'warning';
  sourcePath: string;
  message: string;
}
