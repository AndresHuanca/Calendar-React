import { useEffect, useState } from 'react';
import { Calendar } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Navbar, CalendarEvent, CalendarModal, FabAddNew, FabDelete } from "../"
import { getMessagesES, localizer } from '../../helpers';
import { useUiStore, useCalendarStore, useAuthStore } from '../../hooks';


export const CalendarPage = () => {

    const { user } = useAuthStore(); 
    const { openDateModal } = useUiStore();
    const { events, setActiveEvent, startLoadingEvents } = useCalendarStore();


    const [ lastView, setLastView ] = useState( localStorage.getItem('lastView') || 'week' );
    // Extrae los atributos del día
    const eventStyleGetter = ( event, start, end, isSelected) => {
        // styles by users
        const isMyEvent = ( user.uid === event.user._id) || ( user.uid === event.user.uid )
        
        // styles del día
        const style = {
            backgroundColor: isMyEvent ? '#347cf7' :'#465660' ,
            borderRadius: '0px',
            opacity: 0.8,
            color: 'white'
        };
        
        return{
            style
        }
    };

    const onDoubleClick = ( event ) => {
        // console.log({doubleClick: event});
        openDateModal();
    }

    // Set values of event
    const onSelect = ( event ) => {
        // console.log({click: event});
        setActiveEvent( event );
        // console.log(event)
    }
    // permanencia con localstorage 
    const onViewChanged = ( event ) => {
        localStorage.setItem( 'lastView', event );
        setLastView(event)
    }

    // getEvents
    useEffect(() => {
        startLoadingEvents();
    }, [])
    


    return (
        <>
            <Navbar />
            
            <Calendar
                // Para el idioma español 
                culture='es'
                localizer={ localizer }
                events={ events }
                // establece el lugar de permanencia(mes-semana-dia-agenda)
                defaultView={ lastView }
                startAccessor="start"
                endAccessor="end"
                // Para el tamaño del calendario y el navbar
                style={{ height: 'calc( 100vh - 80px )' }}
                // Para el idioma español 
                messages={ getMessagesES() }
                eventPropGetter={ eventStyleGetter }
                // establece la forma visual del día
                components={{
                    event : CalendarEvent
                }}
                // detecta los clicks
                onDoubleClickEvent={ onDoubleClick }
                onSelectEvent={ onSelect }
                onView={ onViewChanged }
            />
            {/* Modal */}
            <CalendarModal />
            {/* button Add*/}
            <FabAddNew />
            {/* button Delete*/}
            <FabDelete />
        </>
    )
}
