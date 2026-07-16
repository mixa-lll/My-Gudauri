import { InstructorRequestDialog } from './InstructorRequestDialog';

export function LazyInstructorRequestDialog(props) {
  if (!props.open) return null;
  return <InstructorRequestDialog {...props} />;
}
