import type { InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    label: string;
};

function InputField({ label, className = "", ...props }: InputFieldProps) {
    return (
        <div className={className}>
            <label htmlFor={props.id} className="mb-2 block text-sm font-medium text-gray-700">
                {label}
            </label>

            <input
                {...props}
                className=" w-full rounded-lg border border-[#D8D8D8] bg-white px-3 py-2 text-sm outline-none focus:border-[#4C1D95] focus:ring-1 focus:ring-[#4C1D95]"
            />
        </div>
    );
}

export default InputField;