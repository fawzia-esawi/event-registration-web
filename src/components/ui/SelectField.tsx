import type { SelectHTMLAttributes, ReactNode } from "react";

type SelectFieldProps = SelectHTMLAttributes<HTMLSelectElement> & {
    label: string;
    children: ReactNode;
};

function SelectField({
                         label,
                         children,
                         className = "",
                         ...props
                     }: SelectFieldProps) {
    return (
        <div className={className}>
            <label className="mb-2 block text-sm font-medium text-gray-700" htmlFor={props.id}>
                {label}
                {props.required && <span className="ml-1 text-red-600">*</span>}
            </label>

            <select
                {...props}
                className="w-full rounded-lg border border-[#D8D8D8] bg-white px-3 py-2 text-sm outline-none focus:border-[#4C1D95]"
            >
                {children}
            </select>
        </div>
    );
}

export default SelectField;