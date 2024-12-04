import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { IonButton, IonContent, IonPage, } from '@ionic/react';
import CustomButton from '../components/CustomButton'; 
import RoundButton from '../components/RoundButton'
import './FightScreen.css';
import { useMusic } from '../MusicContext';


// Definición de tipos para las props y estados
interface CharacterStats {
  FUERZA: number;
  AGILIDAD: number;
  MAGIA: number;
}

interface FightScreenParams {
  p1CharacterType?: string;
  p2CharacterType?: string;
}

const FightScreen: React.FC = () => {

  const useAnimatedValue = (initialValue: number) => {
    const [value, setValue] = useState(initialValue);
  
    const animateTo = useCallback((targetValue: number, duration: number = 1000) => {
      return new Promise<void>((resolve) => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          const currentValue = Math.floor(progress * (targetValue - value) + value);
          setValue(currentValue);
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        };
        requestAnimationFrame(step);
      });
    }, [value]);
  
    return [value, animateTo] as const;
  };
  const { p1CharacterType, p2CharacterType } = useParams<FightScreenParams>();
  const history = useHistory();
  const { setMusicSource, playMusic } = useMusic();


  const [p1HP, setP1HP] = useState<number>(3);
  const [p2HP, setP2HP] = useState<number>(3);
  const [energyP1, setEnergyP1] = useState<number>(0);
  const [energyP2, setEnergyP2] = useState<number>(0);
  const [victoryMessage, setVictoryMessage] = useState<string>('');
  const [p1Stats, setP1Stats] = useState<CharacterStats>({ FUERZA: 0, AGILIDAD: 0, MAGIA: 0 });
  const [p2Stats, setP2Stats] = useState<CharacterStats>({ FUERZA: 0, AGILIDAD: 0, MAGIA: 0 });
  const [p1Image, setP1Image] = useState<string>('');
  const [p2Image, setP2Image] = useState<string>('');
  const [randomStat, setRandomStat] = useState<string>('');
  const [isDiceDisabled, setIsDiceDisabled] = useState<boolean>(false);
  const [isAttackDisabled, setIsAttackDisabled] = useState<boolean>(false);
  const [p1HeartFlicker, setP1HeartFlicker] = useState<boolean[]>([false, false, false]);
  const [p2HeartFlicker, setP2HeartFlicker] = useState<boolean[]>([false, false, false]);
  const [isFading, setIsFading] = useState(false);
  

  const handleMenu = () => history.push('/');
  const handleReload = () => {
    setIsFading(true);

    setTimeout(() => {
      setP1HP(3);
      setP2HP(3);
      setEnergyP1(0);
      setEnergyP2(0);
      setVictoryMessage('');
      setRandomStat('');
      setIsAttackDisabled(false);
      setIsDiceDisabled(false);
      // Aquí puedes navegar o recargar la página si es necesario
      setTimeout(() => {
        setIsFading(false); // Elimina la pantalla negra tras el efecto
      }, 200); // Duración del desvanecimiento de regreso
    }, 200); // Duración del fade-in
  };
      
  

  useEffect(() => {
    const setCharacterStats = (
      characterType: string | undefined,
      setStats: React.Dispatch<React.SetStateAction<CharacterStats>>,
      setImage: React.Dispatch<React.SetStateAction<string>>
    ) => {
      switch (characterType) {
        case 'MAGE':
          setStats({ FUERZA: 10, AGILIDAD: 20, MAGIA: 70 });
          setImage('/images/MAGECard.png');
          break;
        case 'ARCHER':
          setStats({ FUERZA: 30, AGILIDAD: 50, MAGIA: 20 });
          setImage('/images/ARCHERCard.png');
          break;
        case 'ROGUE':
          setStats({ FUERZA: 60, AGILIDAD: 30, MAGIA: 10 });
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
   

    const p1Energy = Math.floor(Math.random() * 100) + 1;
    const p2Energy = Math.floor(Math.random() * 100) + 1;

    setEnergyP1(p1Energy);
    setEnergyP2(p2Energy);

    const stats = ['FUERZA', 'AGILIDAD', 'MAGIA'];
    const randomStat = stats[Math.floor(Math.random() * stats.length)];

    setRandomStat(randomStat);

    setTimeout(() => {
      setIsAttackDisabled(false);
      setEnergyP1((prev) => prev + (p1Stats[randomStat as keyof CharacterStats] || 0));
      setEnergyP2((prev) => prev + (p2Stats[randomStat as keyof CharacterStats] || 0));
    }, 1000);
  };

  const handleAttack = () => {
    setIsAttackDisabled(true);
    setIsDiceDisabled(false);

    if (energyP1 > energyP2) {
      startHeartFlicker(2, p2HP - 1);
    } else if (energyP2 > energyP1) {
      startHeartFlicker(1, p1HP - 1);
    }
  // Animación para reducir la energía a 0
  animateEnergy(energyP1, setEnergyP1);
  animateEnergy(energyP2, setEnergyP2);
  setRandomStat('');
  };

// Función que realiza la animación de la energía
const animateEnergy = (initialEnergy: number, setEnergy: React.Dispatch<React.SetStateAction<number>>) => {
  let currentEnergy = initialEnergy;
  const decrement = initialEnergy / 100; // Reducir un pequeño valor en cada intervalo
  const interval = setInterval(() => {
    if (currentEnergy > 0) {
      currentEnergy -= decrement;
      // Redondear la energía a un número entero para evitar decimales
      setEnergy(Math.max(Math.floor(currentEnergy), 0)); // Usar Math.floor para asegurar que es entero
    } else {
      clearInterval(interval); // Detener la animación cuando llegue a 0
    }
  }, 5); // Decrementar cada 5ms para hacer una animación suave
};

  const startHeartFlicker = (player: number, newHP: number) => {
    const flickerDuration = 1000; // 1 segundo de parpadeo
    const flickerInterval = 100; // Cambio cada 100ms
    let flickerCount = 0;
  
    const flickerTimer = setInterval(() => {
      if (player === 1) {
        setP1HeartFlicker(prev => prev.map((_, index) => index === newHP ? !prev[index] : false));
      } else {
        setP2HeartFlicker(prev => prev.map((_, index) => index === newHP ? !prev[index] : false));
      }
  
      flickerCount++;
  
      if (flickerCount * flickerInterval >= flickerDuration) {
        clearInterval(flickerTimer);
        if (player === 1) {
          setP1HP(newHP);
          setP1HeartFlicker([false, false, false]);
        } else {
          setP2HP(newHP);
          setP2HeartFlicker([false, false, false]);
        }
      }
    }, flickerInterval);
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

  const renderHearts = (hp: number, flickerState: boolean[]) => (
    Array.from({ length: 3 }, (_, i) => (
      <img
        key={i}
        src="/images/HeartIcon.png"
        alt="Heart"
        className={`heart ${i < hp ? 'filled' : 'empty'} ${flickerState[i] ? 'flicker' : ''}`}
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
                Fuerza: {p1Stats.FUERZA}<br />
                Agilidad: {p1Stats.AGILIDAD}<br />
                Magia: {p1Stats.MAGIA}
              </div>
              <div className="P1energy">{energyP1}</div>
            </div>
            <img src={p1Image} alt="Personaje 1" className="character-image flipped-image" />
            <div className="hearts">{renderHearts(p1HP, p1HeartFlicker)}</div>
          </div>
          <div className="mid-elements">
            <h2 className={`fighting-for-text ${randomStat}`}>
              {randomStat}
            </h2>

            <img src="/images/badge.png" className="badge-image" alt="Badge"/>
            <div className="button-container">
              <RoundButton onClick={handleDice} disabled={isDiceDisabled} image="/images/DiceIcon.png" sound='/sounds/DiceButton.mp3' />
              <RoundButton onClick={handleAttack} disabled={isAttackDisabled} image="/images/SwordIcon.png" sound='/sounds/DiceButton.mp3'/>
            </div>
          </div>

          <div className="character-fs">
            <div className="stats-energy">
              <div className="P2energy">{energyP2}</div>
              <div className="P2stats">
                Fuerza: {p2Stats.FUERZA}<br />
                Agilidad: {p2Stats.AGILIDAD}<br />
                Magia: {p2Stats.MAGIA}
              </div>
            </div>
            <img src={p2Image} alt="Personaje 2" className="character-image" />
            <div className="hearts">{renderHearts(p2HP,p2HeartFlicker)}</div>
          </div>
        </div>
        <div className="victory-message">{victoryMessage}</div>
        <div className="button-container2">
        <CustomButton label="Nueva Partida" onClick={handleReload} className='back-button' sound="/sounds/MENU_Pick.wav"/>
        <CustomButton label="Menú" onClick={handleMenu} className='back-button' sound="/sounds/MENU_Pick.wav"/>
        </div>
        
        <div className={`fade-overlay ${isFading ? 'visible' : ''}`}></div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default FightScreen;
