import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import appLogo from "./assets/app-logo.png"; // لوگو

const AgbPage: React.FC = () => {
    const [checked1, setChecked1] = useState(false);
    const [checked2, setChecked2] = useState(false);
    const [showModal, setShowModal] = useState<null | "agb" | "privacy">(null);

    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (checked1 && checked2) {
            try {
                // 🆕 ذخیره AGB در بک‌اند
                await fetch("http://localhost:8080/api/users/accept-agb", {
                    method: "POST",
                    credentials: "include",
                });

                // بعد از تایید → برو به صفحه GameMenuPage
                navigate("/game");
            } catch (err) {
                console.error("Fehler beim Speichern der AGB:", err);
                alert("Fehler beim Speichern der AGB-Zustimmung.");
            }
        } else {
            alert("Bitte akzeptiere die Bedingungen.");
        }
    };

    const agbText = `
1. Geltungsbereich
Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der App "Mafia". Mit der Nutzung der App akzeptierst du diese Bedingungen.

2. Nutzungsvoraussetzungen
Die Nutzung der App ist ab einem Mindestalter von 12 Jahren erlaubt. Nutzer unter 12 Jahren dürfen die App nicht verwenden.

3. Registrierung und Daten
Für bestimmte Funktionen kann eine Registrierung mit persönlichen Daten (z. B. Benutzername, E-Mail-Adresse) erforderlich sein. Die Nutzer verpflichten sich, nur korrekte Angaben zu machen.

4. Rechte und Pflichten
Die Inhalte der App dürfen nur im Rahmen der vorgesehenen Nutzung verwendet werden. Jede missbräuchliche Nutzung ist untersagt.

5. Haftungsausschluss
Die App wird „wie gesehen“ bereitgestellt. Der Anbieter übernimmt keine Haftung für Ausfälle, Datenverluste oder Schäden, die durch die Nutzung entstehen.

6. Änderungen
Der Anbieter behält sich das Recht vor, diese AGB jederzeit zu ändern. Änderungen werden in der App veröffentlicht.

7. Anwendbares Recht
Es gilt das Recht der Bundesrepublik Deutschland.
    `;

    const privacyText = `
1. Verantwortlicher
Der Verantwortliche für die Datenverarbeitung in der App "Mafia" ist der Betreiber dieser Anwendung.

2. Erhobene Daten
Bei der Nutzung der App können folgende personenbezogene Daten erhoben werden:
- Benutzername
- E-Mail-Adresse
- Nutzungsdaten innerhalb der App

3. Zweck der Datenverarbeitung
Die Daten werden ausschließlich zur Bereitstellung und Verbesserung der App sowie zur Kommunikation mit den Nutzern verwendet.

4. Speicherung
Die Daten werden nur so lange gespeichert, wie es für den angegebenen Zweck erforderlich ist.

5. Weitergabe
Es erfolgt keine Weitergabe der Daten an Dritte, außer wenn eine gesetzliche Verpflichtung besteht.

6. Rechte der Nutzer
Jeder Nutzer hat das Recht auf Auskunft, Berichtigung, Löschung oder Einschränkung der Verarbeitung seiner personenbezogenen Daten. Außerdem besteht das Recht auf Datenübertragbarkeit.

7. Kontakt
Bei Fragen zum Datenschutz können Nutzer den Betreiber über die im Impressum angegebene E-Mail-Adresse kontaktieren.
    `;

    return (
        <div
            style={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage: "url('/game-bg.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                padding: "16px",
                boxSizing: "border-box",
                flexDirection: "column",
            }}
        >
            {/* لوگو */}
            <div style={{ marginBottom: "20px" }}>
                <img
                    src={appLogo}
                    alt="Mafia Logo"
                    style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "contain",
                    }}
                />
            </div>

            <div
                style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                    padding: "24px",
                    maxWidth: "500px",
                    width: "100%",
                    marginBottom: "26px",
                }}
            >
                <h1
                    style={{
                        textAlign: "center",
                        marginBottom: "16px",
                        fontWeight: "bold",
                        fontSize: "22px",
                    }}
                >
                    MAFIA
                </h1>

                <p style={{ marginBottom: "12px", fontSize: "14px", lineHeight: "1.5" }}>
                    Wenn du diese App verwendest, hast du die Möglichkeit bestimmte persönliche Informationen
                    einzugeben, z. B. E-Mail oder einen Benutzernamen. Zum Speichern dieser Daten benötigen
                    wir deine Zustimmung.
                </p>

                <div style={{ marginBottom: "12px" }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={checked1}
                            onChange={(e) => setChecked1(e.target.checked)}
                        />{" "}
                        Ich bin 16 Jahre, oder älter und ich stimme der Verarbeitung meiner persönlichen
                        Informationen zu.
                    </label>
                </div>

                <div style={{ marginBottom: "12px" }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={checked2}
                            onChange={(e) => setChecked2(e.target.checked)}
                        />{" "}
                        Ich habe die Allgemeinen Geschäftsbedingungen und die Datenschutzrichtlinien gelesen
                        und bin damit einverstanden.
                    </label>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "16px",
                        marginBottom: "16px",
                        fontSize: "14px",
                    }}
                >
                    <span
                        onClick={() => setShowModal("agb")}
                        style={{ color: "#646cff", cursor: "pointer" }}
                    >
                        Geschäftsbedingungen
                    </span>
                    <span
                        onClick={() => setShowModal("privacy")}
                        style={{ color: "#646cff", cursor: "pointer" }}
                    >
                        Datenschutzrichtlinien
                    </span>
                </div>

                <button
                    onClick={handleSubmit}
                    style={{
                        width: "100%",
                        padding: "12px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: checked1 && checked2 ? "#6c43f3" : "gray",
                        color: "white",
                        cursor: checked1 && checked2 ? "pointer" : "not-allowed",
                        fontSize: "16px",
                        fontWeight: "600",
                    }}
                >
                    Weiter
                </button>
            </div>

            {/* Modal */}
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.6)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "16px",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "12px",
                            maxWidth: "600px",
                            width: "100%",
                            maxHeight: "80vh",
                            overflowY: "auto",
                            padding: "24px",
                            position: "relative",
                        }}
                    >
                        <button
                            onClick={() => setShowModal(null)}
                            style={{
                                position: "absolute",
                                top: "12px",
                                right: "12px",
                                background: "transparent",
                                border: "none",
                                fontSize: "20px",
                                cursor: "pointer",
                            }}
                        >
                            ×
                        </button>

                        <h2 style={{ marginBottom: "12px" }}>
                            {showModal === "agb" ? "Geschäftsbedingungen" : "Datenschutzrichtlinien"}
                        </h2>

                        <div style={{ fontSize: "14px", lineHeight: "1.6", whiteSpace: "pre-line" }}>
                            {showModal === "agb" ? agbText : privacyText}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AgbPage;
