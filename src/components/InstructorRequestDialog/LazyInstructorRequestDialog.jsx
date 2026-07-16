import { lazy, Suspense } from 'react';

const RequestDialog = lazy(() => import('./InstructorRequestDialog').then((module) => ({ default: module.InstructorRequestDialog })));

export function LazyInstructorRequestDialog(props) {
  if (!props.open) return null;
  return <Suspense fallback={null}><RequestDialog {...props} /></Suspense>;
}
