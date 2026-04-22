type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement>;

export function Checkbox(props: CheckboxProps) {
  return <input type="checkbox" className="h-4 w-4 rounded border-white/20 bg-white/5 text-primary" {...props} />;
}
