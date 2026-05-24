export default function RequiredLabel({ children, optional = false }) {
  return (
    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
      {children}
      {!optional && <span className="text-red-500 ml-0.5">*</span>}
      {optional && (
        <span className="text-gray-400 font-normal ml-1 text-xs">(ស្រេចចិត្ត)</span>
      )}
    </label>
  )
}