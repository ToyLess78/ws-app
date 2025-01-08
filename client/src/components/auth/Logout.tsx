import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useSessionStorage } from "../../hooks/hooks";

export const Logout = () => {

    const {clearSession} = useSessionStorage();
    const HandlerLogOut = () => {
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

    return (
        <button onClick={HandlerLogOut} className="auth__logout">Logout</button>
    );
};
