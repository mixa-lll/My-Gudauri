import { useState } from 'react';
import { Checkbox, DateField, FormField, FormSummary, Input, QuantityStepper, Radio, Select, Textarea } from '../design-system';
import { defineComposition } from '../design-system/architecture/registry';

export default { title: 'Components/Forms', parameters: { controls: { disable: true } } };
const composition = (root) => ({ composition: defineComposition({ root }) });

export const InputStates = { parameters: composition('Input'), render: () => <div className="sb-canvas sb-grid"><FormField label="Default" hint="Helpful supporting text"><Input placeholder="Your name" /></FormField><FormField label="Filled" success="Looks good"><Input defaultValue="Misha" /></FormField><FormField label="Error" error="Enter a valid email"><Input defaultValue="wrong@" /></FormField><FormField label="Disabled"><Input disabled value="Unavailable" readOnly /></FormField><FormField label="Loading"><Input loading value="Checking availability" readOnly /></FormField></div> };
export const TextareaAndSelect = { parameters: composition('FormField'), render: () => <div className="sb-canvas sb-grid"><FormField label="Notes"><Textarea placeholder="Goals, group, equipment" /></FormField><FormField label="Activity"><Select defaultValue="ski"><option value="ski">Ski</option><option value="snowboard">Snowboard</option></Select></FormField><FormField label="Date"><DateField /></FormField></div> };
export const ChoiceControls = { parameters: composition('ChoiceControls'), render: () => <div className="sb-canvas sb-section"><div className="sb-row"><Checkbox label="I need rental equipment" /><Checkbox label="Disabled" disabled /></div><div className="sb-row"><Radio name="pace" label="Relaxed" defaultChecked /><Radio name="pace" label="Active" /></div></div> };
function StepperExample() { const [value, setValue] = useState(2); return <QuantityStepper label="participants" value={value} min={1} max={8} onChange={setValue} />; }
export const QuantityAndSummary = { parameters: composition('QuantityStepper'), render: () => <div className="sb-canvas sb-section"><StepperExample /><FormSummary errors={[{ id: 'email', message: 'Enter a valid email', href: '#email' }, { id: 'date', message: 'Choose a date' }]} /></div> };
