/**
 * SidebarCategory.jsx
 * Componentes reutilizables para categorías e ítems
 */

export const Category = ({ title, icon: Icon, isOpen, onToggle, children, isExperimental }) => (
  <div className={`category ${isOpen ? 'open' : ''} ${isExperimental ? 'experimental' : ''}`}>
    <button onClick={onToggle} className="category-header">
      <span className="category-icon">
        <Icon />
      </span>
      <h3 className="category-label">{title}</h3>
      <span className="category-toggle">›</span>
    </button>
    <ul className="category-items">
      {children}
    </ul>
  </div>
);

export const CategoryItem = ({ label, isActive, onClick }) => (
  <li className="category-item">
    <button
      onClick={onClick}
      className={`category-item-link ${isActive ? 'active' : ''}`}
    >
      {label}
    </button>
  </li>
);

export const NavItem = ({ label, isActive, onClick }) => (
  <li className="nav-item">
    <button
      onClick={onClick}
      className={`nav-item-link ${isActive ? 'active' : ''}`}
    >
      {label}
    </button>
  </li>
);

export const CategorySpacer = ({ large = false }) => (
  <div className="category-spacer" style={large ? { height: '20px' } : {}}></div>
);
