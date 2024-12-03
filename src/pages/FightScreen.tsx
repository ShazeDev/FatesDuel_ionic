import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { IonButton, IonContent, IonPage, } from '@ionic/react';
import CustomButton from '../components/CustomButton'; 
import RoundButton from '../components/RoundButton'
import './FightScreen.css';
import { useMusic } from '../MusicContext';

// Definición de tipos para las props y estados
interface CharacterStats {
  fuerza: number;
  agilidad: number;
  magia: number;
}

interface FightScreenParams {
  p1CharacterType?: string;
  p2CharacterType?: string;
}

const FightScreen: React.FC = () => {
  const { p1CharacterType, p2CharacterType } = useParams<FightScreenParams>();
  const history = useHistory();
  const { setMusicSource, playMusic } = useMusic();

  const [p1HP, setP1HP] = useState<number>(3);
  const [p2HP, setP2HP] = useState<number>(3);
  const [energyP1, setEnergyP1] = useState<number>(0);
  const [energyP2, setEnergyP2] = useState<number>(0);
  const [victoryMessage, setVictoryMessage] = useState<string>('');
  const [p1Stats, setP1Stats] = useState<CharacterStats>({ fuerza: 0, agilidad: 0, magia: 0 });
  const [p2Stats, setP2Stats] = useState<CharacterStats>({ fuerza: 0, agilidad: 0, magia: 0 });
  const [p1Image, setP1Image] = useState<string>('');
  const [p2Image, setP2Image] = useState<string>('');
  const [randomStat, setRandomStat] = useState<string>('');
  const [isDiceDisabled, setIsDiceDisabled] = useState<boolean>(false);
  const [isAttackDisabled, setIsAttackDisabled] = useState<boolean>(false);

  const handleMenu = () => history.push('/');
  

  useEffect(() => {
    const setCharacterStats = (
      characterType: string | undefined,
      setStats: React.Dispatch<React.SetStateAction<CharacterStats>>,
      setImage: React.Dispatch<React.SetStateAction<string>>
    ) => {
      switch (characterType) {
        case 'MAGE':
          setStats({ fuerza: 10, agilidad: 20, magia: 70 });
          setImage('/images/MAGECard.png');
          break;
        case 'ARCHER':
          setStats({ fuerza: 30, agilidad: 50, magia: 20 });
          setImage('/images/ARCHERCard.png');
          break;
        case 'ROGUE':
          setStats({ fuerza: 60, agilidad: 30, magia: 10 });
          setImage('/images/ROGUECard.png');
          break;
        default:
          break;
      }
    };

    setCharacterStats(p1CharacterType, setP1Stats, setP1Image);
    setCharacterStats(p2CharacterType, setP2Stats, setP2Image); 
  }, [p1CharacterType, p2CharacterType]);

  useEffect(() => {
    setMusicSource('/sounds/NowWeRide.mp3'); // Establece la fuente de la música
    playMusic();  // Reproduce la música
  }, [setMusicSource, playMusic]); 

  const handleDice = () => {
    setIsDiceDisabled(true);
    setIsAttackDisabled(false);

    const p1Energy = Math.floor(Math.random() * 100) + 1;
    const p2Energy = Math.floor(Math.random() * 100) + 1;

    setEnergyP1(p1Energy);
    setEnergyP2(p2Energy);

    const stats = ['fuerza', 'agilidad', 'magia'];
    const randomStat = stats[Math.floor(Math.random() * stats.length)];

    setRandomStat(randomStat);

    setTimeout(() => {
      setEnergyP1((prev) => prev + (p1Stats[randomStat as keyof CharacterStats] || 0));
      setEnergyP2((prev) => prev + (p2Stats[randomStat as keyof CharacterStats] || 0));
    }, 1000);
  };

  const handleAttack = () => {
    setIsAttackDisabled(true);
    setIsDiceDisabled(false);

    if (energyP1 > energyP2) {
      setP2HP((prevHP) => Math.max(prevHP - 1, 0));
    } else if (energyP2 > energyP1) {
      setP1HP((prevHP) => Math.max(prevHP - 1, 0));
    }
  };

  useEffect(() => {
    if (p1HP <= 0) {
      setVictoryMessage('¡Victoria del Jugador 2!');
      setIsDiceDisabled(true);
      setIsAttackDisabled(true);
    } else if (p2HP <= 0) {
      setVictoryMessage('¡Victoria del Jugador 1!');
      setIsDiceDisabled(true);
      setIsAttackDisabled(true);
    }
  }, [p1HP, p2HP]);

  const renderHearts = (hp: number) => (
    Array.from({ length: 3 }, (_, i) => (
      <img
        key={i}
        src="/images/HeartIcon.png"
        alt="Heart"
        className={`heart ${i < hp ? 'filled' : 'empty'}`}
      />
    ))
  );

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="fight-screen-container">

        
        <div className="character-container-fs">
          <div className="character-fs">
            <div className="stats-energy">
              <div className="P1stats">
                Fuerza: {p1Stats.fuerza}<br />
                Agilidad: {p1Stats.agilidad}<br />
                Magia: {p1Stats.magia}
              </div>
              <div className="P1energy">{energyP1}</div>
            </div>
            <img src={p1Image} alt="Personaje 1" className="character-image flipped-image" />
            <div className="hearts">{renderHearts(p1HP)}</div>
          </div>

          <div className="mid-elements">
            <h2 className={`fighting-for-text ${randomStat ? 'fade-in' : 'fade-out'}`}>
              Peleando por... {randomStat}
            </h2>
            <img src="/images/badge.png" className="badge-image" alt="Badge" />
            <div className="button-container">
              <RoundButton onClick={handleDice} disabled={isDiceDisabled} image="/images/DiceIcon.png" sound='/sounds/DiceButton.mp3' />
              <RoundButton onClick={handleAttack} disabled={isAttackDisabled} image="/images/SwordIcon.png" sound='/sounds/DiceButton.mp3'/>
            </div>
          </div>

          <div className="character-fs">
            <div className="stats-energy">
              <div className="P2energy">{energyP2}</div>
              <div className="P2stats">
                Fuerza: {p2Stats.fuerza}<br />
                Agilidad: {p2Stats.agilidad}<br />
                Magia: {p2Stats.magia}
              </div>
            </div>
            <img src={p2Image} alt="Personaje 2" className="character-image" />
            <div className="hearts">{renderHearts(p2HP)}</div>
          </div>
        </div>
        <div className="victory-message">{victoryMessage}</div>
        <CustomButton label="Nueva Partida" onClick={handleMenu}  className="back-button" sound="/sounds/MENU_Pick.wav"/>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FightScreen;
