import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut } from "react-icons/fi";

interface Props {
    open: boolean;
    onClose: () => void;
    onSignOut: () => void;
}

const SettingsDrawer: React.FC<Props> = ({ open, onClose, onSignOut }) => {
    const navigate = useNavigate();

    if (!open) return null;

    return (
        <dialog open className="drawer-dialog" aria-modal="true" aria-labelledby="drawer-title">
            <aside className="drawer-panel">
                <button
                    className="drawer-close-btn"
                    onClick={onClose}
                    aria-label="Close settings"
                    type="button"
                >
                    ×
                </button>

                <nav aria-label="Settings menu" className="drawer-nav">
                    <h2 id="drawer-title" className="sr-only">
                        Settings
                    </h2>
                    <ul className="drawer-list">
                        <li>
                            <button type="button" className="drawer-link" onClick={() => { navigate("/game"); onClose(); }}>
                                Home
                            </button>
                        </li>
                        <li>
                            <button type="button" className="drawer-link" onClick={() => { navigate("/how-to-play"); onClose(); }}>
                                How to play
                            </button>
                        </li>
                        <li>
                            {/* Characters link */}
                            <button type="button" className="drawer-link" onClick={() => { navigate("/characters"); onClose(); }}>
                                Characters
                            </button>
                        </li>
                        <li><button type="button" className="drawer-link">Invite Friends</button></li>
                        <li><button type="button" className="drawer-link">My account</button></li>
                        <li><button type="button" className="drawer-link">Language</button></li>
                        <li><button type="button" className="drawer-link">AGB</button></li>
                    </ul>

                    <div className="drawer-footer">
                        <button
                            type="button"
                            className="drawer-link"
                            onClick={onSignOut}
                            aria-label="Logout"
                        >
                            <FiLogOut style={{ marginRight: 8, verticalAlign: "-2px" }} />
                            Logout
                        </button>
                    </div>
                </nav>
            </aside>
        </dialog>
    );
};

export default SettingsDrawer;
