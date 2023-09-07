import { useDispatch, useSelector } from "react-redux";
import { onCloseDateModal, onOpenDateModal } from "../store";

export const useUiStore = () => {
    const dispatch =  useDispatch();
    // Set the default state of the modal
    const { 
        isDateModalOpen 
    } = useSelector( state => state.ui );

    // Open the modal
    const openDateModal = () => {
        dispatch( onOpenDateModal() );
    }
    // Close the modal
    const closeDateModal = () => {
        dispatch(onCloseDateModal() );
    }

    return {
        // * Properties
        isDateModalOpen,

        //* Methods
        closeDateModal,
        openDateModal
    };

}