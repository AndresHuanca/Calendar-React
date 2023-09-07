import { parseISO } from "date-fns";

// Cambia la fecha de string a fecha tipo js
export const convertEventsToDateEvents = ( events = [] ) => {

    return events.map( event =>{

        event.end = parseISO( event.end );
        event.start = parseISO( event.start );

        return event;
    });
}