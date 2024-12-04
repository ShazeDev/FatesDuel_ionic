import React, { useState, useRef } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import CustomButton from '../components/CustomButton';
import './CharacterSelect.css';

type CharacterType = "MAGE" | "ARCHER" | "ROGUE";

const CharacterSelect: React.FC = () => {
  const history = useHistory();
  const audioRef = useRef<HTMLAudioElement>(null);

  const [p1CharacterType, setP1CharacterType] = useState<CharacterType | null>(null);
  const [p2CharacterType, setP2CharacterType] = useState<CharacterType | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterType | null>(null);

  const playHoverSound = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reinicia el sonido si ya se está reproduciendo
      audioRef.current.play();
    }
  };

  const handleMenu = () => {
    history.push('/');
  };

  const handleCharacterClick = (character: CharacterType) => {
    setP1CharacterType(character);
    setSelectedCharacter(character);
    console.log("Personaje seleccionado por P1:", character);
    selectRandomCharacterForP2();
  };

  const selectRandomCharacterForP2 = () => {
    const characters: CharacterType[] = ["MAGE", "ARCHER", "ROGUE"];
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    setP2CharacterType(randomCharacter);
    console.log("Personaje seleccionado aleatoriamente para P2:", randomCharacter);
  };

  const startGame = () => {
    if (p1CharacterType && p2CharacterType) {
      history.push(`/fight/${p1CharacterType}/${p2CharacterType}`);
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="character-select-container" >
          <h1 className="character-select-title">Selecciona personaje</h1>
          <div className="character-container" >
            {["MAGE", "ARCHER", "ROGUE"].map((character) => (
              <div
                key={character}
                className="character-sc"
                onClick={() => handleCharacterClick(character as CharacterType)}
              >
                <img
                  src={`/images/${character}Card.png`}
                  alt={`Personaje ${character}`}
                  className={`character-image ${selectedCharacter === character ? "selected" : ""}`}
                  onMouseEnter={playHoverSound} />
                <audio ref={audioRef} src="/sounds/MENU_Select.wav" />
              </div>
            ))}
          </div>
          <div className="character-select-content">
            <CustomButton
              label="Iniciar partida"
              onClick={startGame}
              disabled={!p1CharacterType || !p2CharacterType}
              sound="/sounds/MENU_Pick.wav"
            />
            <CustomButton label="Menú" onClick={handleMenu} sound="/sounds/MENU_Pick.wav" />
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CharacterSelect;
