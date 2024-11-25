import React from 'react';
import { IonButton } from '@ionic/react';
import './CustomButton.css';

interface CustomButtonProps {
  label: string;
  onClick: () => void;
}

const CustomButton: React.FC<CustomButtonProps> = ({ label, onClick }) => {
  return (
    <IonButton 
      className="custom-button" 
      fill="clear" 
      onClick={onClick}
    >
      {label}
    </IonButton>
  );
};

// Asegúrate de que esta línea exista:
export default CustomButton;
