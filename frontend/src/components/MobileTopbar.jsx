import { MdMenu } from 'react-icons/md';

export default function MobileTopbar({ onMenuClick, title }) {
  return (
    <div className="mobile-topbar">
      <div className="sidebar-logo" style={{ padding: 0, border: 'none', margin: 0 }}>
        <div className="logo-icon">🎓</div>
        <h2 style={{ fontSize: '18px' }}>EduMate</h2>
      </div>
      <button className="hamburger" onClick={onMenuClick} aria-label="Open menu">
        <MdMenu />
      </button>
    </div>
  );
}
