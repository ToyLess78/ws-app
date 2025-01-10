import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSessionStorage } from "../../../hooks/hooks.ts";
import { User } from "../../../interfaces/interfaces.ts";
import { useContext } from "react";
import { SocketContext } from "../../../context/socket.ts";

interface SidebarActionsProps {
  user?: User;
}

export const SidebarActions: React.FC<SidebarActionsProps> = ({user}) => {

  const socket = useContext(SocketContext);

  const {clearSession} = useSessionStorage();
  const handlerLogOut = () => {
    confirmAlert({
      message: "Do you want to Logout?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            clearSession();
            window.location.reload();
          },
        },
        {
          label: "No",
          onClick: () => {
            return;
          },
        },
      ],
    });
  };

  const handlerRandomMessages = () => {
    socket.emit("startRandomMessages", {userId: user?._id});

  };

  return (
    <div className="sidebar__actions">
      <button
        onClick={handlerLogOut}
        className="sidebar__actions-button">
        Logout
      </button>
      <button
        onClick={handlerRandomMessages}
        className="sidebar__actions-button">
        Random
      </button>
    </div>
  );
};
