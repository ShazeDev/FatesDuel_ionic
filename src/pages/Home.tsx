import React, { useEffect } from 'react';
import { IonPage, IonContent } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import './Home.css';
import CustomButton from '../components/CustomButton';
import { useMusic } from '../MusicContext';


const Home: React.FC = () => {
  const history = useHistory();
  const { playMusic, setMusicSource } = useMusic();

  useEffect(() => {
    setMusicSource('/sounds/TranquilFieldsEastern.mp3');  // Establece la fuente de la música
    playMusic();  // Reproduce la música
  }, [setMusicSource, playMusic]);  // Se ejecutará una vez al montar el componente


  const handleNewGame = () => {
    history.push('/characterSelect');
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        <div className="home-container">
          <div className="home-content">
            <h1 className="game-title">Fate's Duel</h1>
            <div>
              <CustomButton
                label="Nueva Partida"
                onClick={handleNewGame}
                sound="/sounds/MENU_Pick.wav" />
            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

