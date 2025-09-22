export type CharacterInfo = {
    image: string;
    side: "Mafia" | "Good" | "Neutral";
    description: string;
};

export const characterInfo: Record<string, CharacterInfo> = {
    "God Father": {
        image: "godfather.png",
        side: "Mafia",
        description:
            "Mafia’s leader and strategist — survives the first elimination attempt. May use the Silence of the Lambs card once per game to stop a player from speaking during the day. Wins if all Citizens are eliminated.",
    },
    "Citizen": {
        image: "citizen.png",
        side: "Good",
        description:
            "Armed with pitchforks, paranoia, and loud voices. Has no special powers. Votes during the day to eliminate suspected Mafia members. Wins when all Mafia are dead.",
    },
    "Dr Watson": {
        image: "dr-watson.png",
        side: "Good",
        description:
            "Each night, may protect one Citizen from the Mafia’s kill. Cannot protect the same person two nights in a row. If the protected person is targeted by the Mafia, they survive.",
    },
    "Saul Goodman": {
        image: "saul-goodman.png",
        side: "Mafia",
        description:
            "If a Mafia member dies, Saul can recruit a new Mafia member once per game. Recruitment fails on special roles such as Leon or Dr Watson. A true con artist and negotiator.",
    },
    "Leon": {
        image: "leon.png",
        side: "Good",
        description:
            "Can shoot twice per game. If Leon kills a Mafia member, he survives. If he kills a Citizen, Leon dies instantly. A silent avenger who takes justice into his own hands.",
    },
    "Constantine": {
        image: "constantine.png",
        side: "Good",
        description:
            "May bring one dead player back to life once per game. The resurrected player returns as a Citizen regardless of their former role.",
    },
    "Matador": {
        image: "matador.png",
        side: "Mafia",
        description:
            "Each night may block one powerful Citizen role (like Dr Watson or Leon) from performing their action. A master of disruption and chaos.",
    },
    "Citizen Kane": {
        image: "citizen-kane.png",
        side: "Good",
        description:
            "Once per game, may request a public investigation. The Game Master must reveal the loyalty (Mafia or Citizen) of a chosen player to everyone. If target is Citizen, nothing else happens.",
    },
    "Nostradamus": {
        image: "nostradamus.png",
        side: "Neutral",
        description:
            "Before the game begins, secretly selects a player. If that player dies during the first night, Nostradamus joins the Mafia. If not, he remains Neutral and wins if he survives to the end.",
    },
};
