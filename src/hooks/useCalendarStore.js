import { useDispatch, useSelector } from "react-redux"
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from "../store";
import { calendarApi } from "../api";
import { convertEventsToDateEvents } from "../helpers";
import Swal from "sweetalert2";

export const useCalendarStore = () => {

    const dispatch = useDispatch();
    // Set default values 
    const { events, activeEvent } = useSelector( state => state.calendar);

    const { user } = useSelector( state => state.auth);
    // Active event
    const setActiveEvent = ( calendarEvent ) => {
        dispatch( onSetActiveEvent( calendarEvent ) );
    }

    // Update or create event
    const startSavingEvent = async( calendarEvent ) => {
        
        try {
            
            if( calendarEvent.id ){
                // Update
                await calendarApi.put(`/events/${ calendarEvent.id }`, calendarEvent );
                dispatch( onUpdateEvent({ ...calendarEvent }) );
                // Para detener la función
                return;
            }
            // create
            const { data } = await calendarApi.post('/events', calendarEvent )
            dispatch( onAddNewEvent({ ...calendarEvent, id: data.evento.id, user }));
            
        } catch (error) {
            // console.log(error)
            Swal.fire('Error al guardar', error.response.data?.msg, 'error');
        }

        
    }
    // Delete
    const startDeleteEvent = async() => {

        try {

            await calendarApi.delete(`/events/${ activeEvent.id }`,)
            dispatch( onDeleteEvent() );
            
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data?.msg, 'error');
        }

    }

    // Get
    const startLoadingEvents = async() => {

        try {
            
            const { data } = await calendarApi.get('/events');
            // Convierte tipo de fecha
            const events = convertEventsToDateEvents(data.eventos);
            
            dispatch( onLoadEvents( events ) );

        } catch (error) {
            console.log('Error cargando eventos');
            console.log(error)
        }

    }


    return {
        //* Properties
        events,
        activeEvent,
        // Para saber si hay un evento selccionado o no
        hasEventSelected: !!activeEvent,
        // * Methods
        setActiveEvent,
        startSavingEvent,
        startDeleteEvent,
        startLoadingEvents,
    }
}
