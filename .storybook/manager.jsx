import React, { useMemo, useState } from 'react';
import { addons, types, useParameter, useStorybookState } from 'storybook/manager-api';
import { evaluateComposition, flattenTree, resolveComposition } from '../src/design-system/architecture/evaluate';
import staticIssues from '../src/design-system/architecture/generated-report.json';
import './design-architecture-panel.css';

const ADDON_ID = 'my-gudauri/design-architecture';
const COMPOSITION_PANEL_ID = `${ADDON_ID}/composition`;
const QA_PANEL_ID = `${ADDON_ID}/design-qa`;
const MODES = [
  ['direct', 'Direct'],
  ['full', 'Full tree'],
  ['rendered', 'Rendered only'],
  ['violations', 'Violations']
];

function getKnownStoryIds(index) {
  return new Set(Object.keys(index ?? {}).filter((id) => index[id]?.type === 'story'));
}

function getRelevantStaticIssues(root) {
  const sources = new Set(flattenTree(root).map((node) => node.entry?.sourcePath).filter(Boolean));
  return staticIssues.filter((issue) => sources.has(issue.sourcePath));
}

function StoryLink({ entry, label = 'Story' }) {
  if (!entry?.storyId) return null;
  return <a className="ds-architecture__link" href={`?path=/story/${entry.storyId}`}>{label}</a>;
}

function DocsLink({ entry }) {
  if (!entry?.storyId) return null;
  return <a className="ds-architecture__link" href={`?path=/docs/${entry.storyId}`}>Docs</a>;
}

function Summary({ root, issues }) {
  const nodes = flattenTree(root);
  const counts = nodes.reduce((result, node) => {
    const layer = node.entry?.layer ?? 'unknown';
    result[layer] = (result[layer] ?? 0) + 1;
    return result;
  }, {});
  const errors = issues.filter((issue) => issue.severity === 'error').length;
  const warnings = issues.filter((issue) => issue.severity === 'warning').length;

  return (
    <div className="ds-architecture__summary">
      <span>{nodes.length} nodes</span>
      {Object.entries(counts).map(([layer, count]) => <span key={layer}>{count} {layer}</span>)}
      <span className={errors ? 'is-error' : ''}>{errors} errors</span>
      <span className={warnings ? 'is-warning' : ''}>{warnings} warnings</span>
    </div>
  );
}

function NodeRow({ node, depth, mode, issueNodeIds }) {
  const visible = mode === 'full' || mode === 'violations' || depth <= 1;
  if (!visible) return null;
  const isViolation = node.unregistered || node.incomplete || node.cycle || (node.id && issueNodeIds.has(node.id));
  if (mode === 'violations' && !isViolation && !node.children.some((child) => issueNodeIds.has(child.id))) return null;
  const entry = node.entry;
  return (
    <React.Fragment key={node.key}>
      <div className={`ds-architecture__node ${isViolation ? 'is-violation' : ''}`} style={{ '--depth': depth }}>
        <span className="ds-architecture__node-name">{node.name}</span>
        {entry ? <span className="ds-architecture__badge">{entry.layer}</span> : <span className="ds-architecture__badge is-error">unregistered</span>}
        {entry ? <span className={`ds-architecture__status is-${entry.status}`}>{entry.status}</span> : null}
        {node.cycle ? <span className="ds-architecture__badge is-error">cycle</span> : null}
        {node.incomplete ? <span className="ds-architecture__badge is-error">incomplete</span> : null}
        <StoryLink entry={entry} />
        <DocsLink entry={entry} />
        {entry?.sourcePath ? <code title={entry.sourcePath}>{entry.sourcePath}</code> : null}
        {entry?.description ? <p>{entry.description}</p> : null}
        {entry?.status === 'deprecated' ? <p>Replace with: {entry.replacement ?? 'not specified'} · Remove after: {entry.removalDate ?? 'not scheduled'} · New usage: forbidden</p> : null}
      </div>
      {node.children.map((child) => <NodeRow key={child.key} node={child} depth={depth + 1} mode={mode} issueNodeIds={issueNodeIds} />)}
    </React.Fragment>
  );
}

function EmptyState({ children }) {
  return <div className="ds-architecture__empty">{children}</div>;
}

function CompositionPanel({ active }) {
  const composition = useParameter('composition', null);
  const state = useStorybookState();
  const [mode, setMode] = useState('full');
  const root = useMemo(() => resolveComposition(composition), [composition]);
  const knownStoryIds = useMemo(() => getKnownStoryIds(state.index), [state.index]);
  const issues = useMemo(() => evaluateComposition(composition, knownStoryIds, getRelevantStaticIssues(root)), [composition, knownStoryIds, root]);
  const issueNodeIds = useMemo(() => new Set(issues.map((issue) => issue.nodeId).filter(Boolean)), [issues]);

  if (!active) return null;
  if (!root) {
    return <EmptyState>Нет composition metadata для этой story. Добавьте <code>parameters.composition</code> с <code>root</code>.</EmptyState>;
  }

  return (
    <section className="ds-architecture" aria-label="Composition">
      <header className="ds-architecture__header">
        <div><strong>{root.name}</strong><span>Current story: {state.storyId ?? 'unknown'}</span></div>
        <Summary root={root} issues={issues} />
      </header>
      <nav className="ds-architecture__tabs" aria-label="Composition mode">
        {MODES.map(([value, label]) => <button key={value} type="button" className={mode === value ? 'is-active' : ''} onClick={() => setMode(value)}>{label}</button>)}
      </nav>
      {mode === 'rendered' ? (
        <EmptyState>Rendered only недоступен: дерево строится только из registry и story metadata. В проекте есть portal-меню и фрагменты; React internals и production data-атрибуты намеренно не используются.</EmptyState>
      ) : (
        <div className="ds-architecture__tree"><NodeRow node={root} depth={0} mode={mode} issueNodeIds={issueNodeIds} /></div>
      )}
      {issues.some((issue) => issue.category === 'unregistered') ? <p className="ds-architecture__notice">Есть незарегистрированные узлы. Добавьте их в registry до использования в публичной композиции.</p> : null}
    </section>
  );
}

function DesignQaPanel({ active }) {
  const composition = useParameter('composition', null);
  const state = useStorybookState();
  const root = useMemo(() => resolveComposition(composition), [composition]);
  const knownStoryIds = useMemo(() => getKnownStoryIds(state.index), [state.index]);
  const issues = useMemo(() => evaluateComposition(composition, knownStoryIds, getRelevantStaticIssues(root)), [composition, knownStoryIds, root]);
  const errors = issues.filter((issue) => issue.severity === 'error');
  const warnings = issues.filter((issue) => issue.severity === 'warning');

  if (!active) return null;
  return (
    <section className="ds-architecture" aria-label="Design QA">
      <header className="ds-architecture__header">
        <div><strong>Design QA</strong><span>{root ? `Composition: ${root.name}` : 'No composition metadata'}</span></div>
        <div className="ds-architecture__summary"><span className={errors.length ? 'is-error' : ''}>{errors.length} errors</span><span className={warnings.length ? 'is-warning' : ''}>{warnings.length} warnings</span></div>
      </header>
      {!composition ? <EmptyState>У этой story нет metadata. Это безопасное пустое состояние — добавьте <code>parameters.composition</code>, когда story описывает публичную архитектуру.</EmptyState> : null}
      {composition && !issues.length ? <EmptyState>Нарушений не найдено.</EmptyState> : null}
      {issues.length ? <ul className="ds-architecture__issues">{issues.map((issue) => (
        <li key={issue.id} className={`is-${issue.severity}`}>
          <span>{issue.severity}</span><strong>{issue.category}</strong><p>{issue.message}</p>{issue.sourcePath ? <code>{issue.sourcePath}</code> : null}
        </li>
      ))}</ul> : null}
      <footer className="ds-architecture__footer">Checks: unregistered, story links, layer rules, public exports, direct internal imports, deprecated usage, registry mismatches, cycles and incomplete metadata.</footer>
    </section>
  );
}

addons.register(ADDON_ID, () => {
  addons.add(COMPOSITION_PANEL_ID, { type: types.PANEL, title: 'Composition', render: CompositionPanel });
  addons.add(QA_PANEL_ID, { type: types.PANEL, title: 'Design QA', render: DesignQaPanel });
});
