import React from 'react';
import { IonButton } from '@ionic/react';
import './CustomButton.css';

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  sound?: string; // Nueva propiedad para la ruta del sonido
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, onClick, disabled, className, sound }) => {
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
      className={`custom-button ${className || ''}`}
      fill="clear"
      disabled={disabled}
      onClick={handleClick} // Usa la nueva función que incluye sonido
    >
      {label}
    </IonButton>
  );
};

export default CustomButton;
