type ToastType = "success" | "error"

type Props = {
  message: string
  type: ToastType
}

function Toast({ message, type }: Props) {
  return (
    <div
      className={`fixed top-5 right-5 z-50 rounded-lg px-4 py-3 shadow-lg text-white ${
        type === "success" ? "bg-green-500" : "bg-red-500"
      }`}
    >
      {message}
    </div>
  )
}

export default Toast