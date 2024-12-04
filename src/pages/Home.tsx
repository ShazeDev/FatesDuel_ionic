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
    history.push('/characterSelect'); // Navegación programática
  };

  return (
    <IonPage>
      <IonContent fullscreen>
        {/* Contenedor principal */}
        <div className="home-container">

          {/* Contenido del menú */}
          <div className="home-content">
            <h1 className="game-title">Fate's Duel</h1>
            <div>
              {/* Botón de navegación usando routerLink */}
              <CustomButton label="Nueva Partida" onClick={handleNewGame} sound="/sounds/MENU_Pick.wav" />


            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

