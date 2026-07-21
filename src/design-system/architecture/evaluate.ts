import { LAYER_DEPENDENCIES, registryById } from './registry';
import type {
  ArchitectureReportIssue,
  CompositionParameter,
  CompositionReference,
  DesignSystemEntry
} from './types';

export type QaCategory =
  | 'unregistered'
  | 'missing-story-link'
  | 'layer-dependency'
  | 'internal-import'
  | 'public-export'
  | 'deprecated'
  | 'registry-mismatch'
  | 'broken-story-id'
  | 'cycle'
  | 'incomplete-data';

export interface QaIssue {
  id: string;
  category: QaCategory;
  severity: 'error' | 'warning';
  nodeId?: string;
  sourcePath?: string;
  message: string;
}

export interface ResolvedTreeNode {
  key: string;
  id?: string;
  name: string;
  entry?: DesignSystemEntry;
  children: ResolvedTreeNode[];
  cycle?: boolean;
  unregistered?: boolean;
  incomplete?: boolean;
}

function referenceId(reference: CompositionReference): string | undefined {
  return typeof reference === 'string' ? reference : reference?.id;
}

function referenceChildren(reference: CompositionReference): CompositionReference[] | undefined {
  return typeof reference === 'string' ? undefined : reference?.children;
}

function resolveNode(
  reference: CompositionReference,
  ancestors: string[],
  depth: number,
  rootChildren?: CompositionReference[]
): ResolvedTreeNode {
  const id = referenceId(reference);
  const entry = id ? registryById.get(id) : undefined;
  const fallbackName = typeof reference === 'string' ? reference : reference?.name;
  const name = entry?.name ?? fallbackName ?? 'Incomplete node';
  const key = `${ancestors.join('/')}/${id ?? name}/${depth}`;

  if (!id) {
    return { key, name, children: [], incomplete: true };
  }

  if (ancestors.includes(id)) {
    return { key, id, name, entry, children: [], cycle: true };
  }

  const explicitChildren = depth === 0 ? rootChildren : referenceChildren(reference);
  const childReferences = explicitChildren ?? entry?.children ?? [];
  return {
    key,
    id,
    name,
    entry,
    unregistered: !entry,
    children: childReferences.map((child) => resolveNode(child, [...ancestors, id], depth + 1))
  };
}

export function resolveComposition(composition?: CompositionParameter | null): ResolvedTreeNode | null {
  if (!composition?.root) return null;
  return resolveNode(composition.root, [], 0, composition.children);
}

export function flattenTree(root: ResolvedTreeNode | null): ResolvedTreeNode[] {
  if (!root) return [];
  const nodes: ResolvedTreeNode[] = [];
  const visit = (node: ResolvedTreeNode) => {
    nodes.push(node);
    node.children.forEach(visit);
  };
  visit(root);
  return nodes;
}

function compareChildren(composition: CompositionParameter, root: ResolvedTreeNode): QaIssue[] {
  if (!composition.children || !root.entry) return [];
  const registered = root.entry.children ?? [];
  const declared = composition.children.map(referenceId).filter(Boolean) as string[];
  if (registered.join('|') === declared.join('|')) return [];
  return [{
    id: `registry-mismatch:${root.id}`,
    category: 'registry-mismatch',
    severity: 'warning',
    nodeId: root.id,
    sourcePath: root.entry.sourcePath,
    message: `Story metadata declares [${declared.join(', ') || 'none'}], registry declares [${registered.join(', ') || 'none'}].`
  }];
}

export function evaluateComposition(
  composition: CompositionParameter | null | undefined,
  knownStoryIds: ReadonlySet<string>,
  staticIssues: readonly ArchitectureReportIssue[] = []
): QaIssue[] {
  const root = resolveComposition(composition);
  if (!root || !composition) return staticIssues.map((issue) => ({ ...issue }));
  const issues: QaIssue[] = [...compareChildren(composition, root)];
  const nodes = flattenTree(root);

  nodes.forEach((node) => {
    if (node.incomplete) {
      issues.push({ id: `incomplete:${node.key}`, category: 'incomplete-data', severity: 'error', message: 'Composition node has neither id nor a usable name.' });
      return;
    }
    if (node.unregistered) {
      issues.push({ id: `unregistered:${node.id}`, category: 'unregistered', severity: 'error', nodeId: node.id, message: `“${node.id}” is used by the story but is absent from the registry.` });
      return;
    }
    if (!node.entry) return;
    if (node.cycle) {
      issues.push({ id: `cycle:${node.key}`, category: 'cycle', severity: 'error', nodeId: node.id, sourcePath: node.entry.sourcePath, message: `Cycle detected at “${node.name}”.` });
    }
    if (node.entry.status === 'deprecated') {
      issues.push({ id: `deprecated:${node.key}`, category: 'deprecated', severity: 'warning', nodeId: node.id, sourcePath: node.entry.sourcePath, message: `“${node.name}” is deprecated but still appears in this composition.` });
    }
    if (!node.entry.storyId) {
      issues.push({ id: `missing-story:${node.key}`, category: 'missing-story-link', severity: 'warning', nodeId: node.id, sourcePath: node.entry.sourcePath, message: `“${node.name}” has no linked story or Docs page.` });
    } else if (knownStoryIds.size > 0 && !knownStoryIds.has(node.entry.storyId)) {
      issues.push({ id: `broken-story:${node.key}`, category: 'broken-story-id', severity: 'error', nodeId: node.id, sourcePath: node.entry.sourcePath, message: `Story id “${node.entry.storyId}” does not exist in the current Storybook index.` });
    }
    if (node.entry.publicExport === false && node.entry.status !== 'internal') {
      issues.push({ id: `public-export:${node.key}`, category: 'public-export', severity: 'warning', nodeId: node.id, sourcePath: node.entry.sourcePath, message: `“${node.name}” is public in the registry but missing from the component barrel.` });
    }
    node.children.forEach((child) => {
      if (!child.entry || !node.entry) return;
      if (!LAYER_DEPENDENCIES[node.entry.layer].includes(child.entry.layer)) {
        issues.push({
          id: `layer:${node.key}:${child.key}`,
          category: 'layer-dependency',
          severity: 'error',
          nodeId: child.id,
          sourcePath: node.entry.sourcePath,
          message: `${node.entry.layer} “${node.name}” must not depend on ${child.entry.layer} “${child.name}”.`
        });
      }
    });
  });

  return [...issues, ...staticIssues.map((issue) => ({ ...issue }))];
}
