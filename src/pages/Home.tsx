import React from 'react';
import { IonPage, IonContent} from '@ionic/react';
import { useHistory } from 'react-router-dom'; 
import './Home.css';
import CustomButton from '../components/CustomButton';


const Home: React.FC = () => {
  const history = useHistory();

  const handleNewGame = () => {
    history.push('/characterSelect'); // Navegación programática
  };
  
  return (
    <IonPage>
      <IonContent fullscreen>
        {/* Contenedor principal */}
        <div className="home-container">
          {/* Video de fondo */}
          <video autoPlay loop muted className="home-video">
            <source src="/videos/menuVideo.mp4" type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>

          {/* Contenido del menú */}
          <div className="home-content">
            <h1 className="game-title">Fate's Duel</h1>
            <div>
              {/* Botón de navegación usando routerLink */}
              <CustomButton label="Nueva Partida" onClick={handleNewGame} />
            

            </div>
          </div>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;

