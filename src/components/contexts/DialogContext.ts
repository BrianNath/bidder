import React from "react";

const DialogContext = React.createContext({
  showDialog: () => {},
  hideDialog: () => {},
});

export default DialogContext;
