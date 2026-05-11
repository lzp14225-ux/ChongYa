/*
 * 通用表单展示组件，用于只读字段和简单表单预览。
 */

type FieldProps = {
  label: string;
  value: string;
  full?: boolean;
};

export function Field({ label, value, full }: FieldProps) {
  return (
    <div className={`field ${full ? 'full' : ''}`}>
      <label>{label}</label>
      <div>{value}</div>
    </div>
  );
}

export function FormPreview({ fields }: { fields: string[] }) {
  return (
    <div className="form-grid">
      {fields.map((field) => {
        const [label, value] = field.split('：');
        return <Field key={field} label={label} value={value} />;
      })}
    </div>
  );
}
