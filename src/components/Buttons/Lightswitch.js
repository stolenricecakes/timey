import React, {useContext} from "react";
import {DarkModeContext} from "../DarkModeContext";

const Lightswitch = () => {
  const {darkMode, toggleDarkMode}  = useContext(DarkModeContext);
  const handleClick = () => {
      toggleDarkMode();
  }

  return (
      <div className={darkMode ? 'lightswitch off' : 'lightswitch on'} onClick={handleClick} />
  )
};

export default Lightswitch;