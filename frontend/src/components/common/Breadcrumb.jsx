import { Link } from 'react-router-dom'

export default function Breadcrumb({ items }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm mb-4">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <div key={i} className="flex items-center gap-1.5">
            {i > 0 && (
              <span className="material-icons text-gray-300 text-base">
                chevron_right
              </span>
            )}
            {isLast ? (
              <span className="font-semibold text-gray-700">{item.label}</span>
            ) : (
              <Link to={item.path}
                className="text-blue-600 hover:text-blue-800 hover:underline
                           transition-colors flex items-center gap-1">
                {item.icon && (
                  <span className="material-icons text-base">{item.icon}</span>
                )}
                {item.label}
              </Link>
            )}
          </div>
        )
      })}
    </nav>
  )
}