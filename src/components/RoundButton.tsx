import React from 'react';
import { IonButton } from '@ionic/react';
import './RoundButton.css';

interface CustomButtonProps {
  onClick: () => void;
  disabled?: boolean;
  image: string; // Ruta de la imagen que se usará como fondo
  sound?: string; // Nueva propiedad para la ruta del sonido
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, disabled, image, sound }) => {
   // Función para manejar el clic y reproducir el sonido
   const handleClick = () => {
    if (sound) {
      const audio = new Audio(sound);
      audio.play(); // Reproducir el sonido
    }
    onClick(); // Llamar la función original de clic
  };

  return (
    <IonButton
      className="custom-button-circle"
      fill="clear"
      onClick={handleClick}
      disabled={disabled}
    >
      <div className="button-circle">
        <img src={image} alt="Button icon" />
      </div>
    </IonButton>
  );
};

export default CustomButton;
