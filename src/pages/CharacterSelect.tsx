import React, { useState, useRef } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import CustomButton from '../components/CustomButton'; 
import './CharacterSelect.css';

type CharacterType = "MAGE" | "ARCHER" | "ROGUE"; // Tipo para los personajes

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
  // Navegar al menú
  const handleMenu = () => {
    history.push('/');
  };

  // Manejar la selección de un personaje
  const handleCharacterClick = (character: CharacterType) => {
    setP1CharacterType(character);
    setSelectedCharacter(character); // Actualizar personaje seleccionado
    console.log("Personaje seleccionado por P1:", character);
    selectRandomCharacterForP2(); // Selección aleatoria para P2
  };

  // Selección aleatoria de personaje para P2
  const selectRandomCharacterForP2 = () => {
    const characters: CharacterType[] = ["MAGE", "ARCHER", "ROGUE"];
    const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
    setP2CharacterType(randomCharacter);
    console.log("Personaje seleccionado aleatoriamente para P2:", randomCharacter);
  };

  // Iniciar el juego con los personajes seleccionados
  const startGame = () => {
    if (p1CharacterType && p2CharacterType) {
      console.log("Iniciar juego con:");
      console.log("Personaje P1:", p1CharacterType);
      console.log("Personaje P2:", p2CharacterType);
      history.push(`/fight/${p1CharacterType}/${p2CharacterType}`);
    } else {
      alert("Selecciona un personaje para ambos jugadores.");
    }
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="character-select-container" >
          <h1 className="character-select-title">Selecciona personaje</h1>
       


          {/* Contenedor de los personajes */}
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
                  onMouseEnter={playHoverSound}/>
                  <audio ref={audioRef} src="/sounds/MENU_Select.wav" />
              </div>
              
            ))}
          </div>

          {/* Contenido de selección */}
          <div className="character-select-content">
            {/* Botón de iniciar partida */}
            <CustomButton
              label="Iniciar partida"
              onClick={startGame}
              disabled={!p1CharacterType || !p2CharacterType} // Desactivar si algún personaje no está seleccionado
              sound="/sounds/MENU_Pick.wav"
            />
            
            {/* Botón de menú */}
            <CustomButton label="Menú" onClick={handleMenu} sound="/sounds/MENU_Pick.wav"/>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default CharacterSelect;
