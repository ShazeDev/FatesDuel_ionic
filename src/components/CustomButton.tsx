import React from 'react';
import { IonButton } from '@ionic/react';
import './CustomButton.css';

interface CustomButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;  // Hacer que `disabled` sea opcional
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, onClick, disabled }) => {
  return (
    <IonButton 
      className="custom-button" 
      fill="clear" 
      disabled={disabled}  // Aplicar la propiedad disabled al botón
      onClick={onClick}
      
    >
      {label}
    </IonButton>
  );
};

// Asegúrate de que esta línea exista:
export default CustomButton;
