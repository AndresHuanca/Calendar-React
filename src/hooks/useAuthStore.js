import { useDispatch, useSelector } from "react-redux";
import { calendarApi } from "../api";
import { clearErrorMessage, onChecking, onLogin, onLogout, onLogoutCalendar } from "../store";


// Otra forma de desarrollo para no hacer thunks 
export const useAuthStore = () => {

    const { status, user, errorMessage } = useSelector( state => state.auth );
    const dispatch = useDispatch();
    // Login
    const startLoading = async({email, password}) => {
        // State of store
        dispatch( onChecking() ); 
        try {
            
            const { data } = await calendarApi.post('/auth', { email, password });
            // Save in localstorage
            localStorage.setItem( 'token', data.token );
            localStorage.setItem( 'token-init-date', new Date().getTime() );
            // Save in store
            dispatch( onLogin({ name: data.name, uid: data.uid }) )
        } catch (error) {
            dispatch( onLogout('Credenciales incorrectas') );
            // Elimina el errormessage del store
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        }
    }

    // Register
    const startRegister = async({ name, email, password }) => {
        dispatch( onChecking() );

        try {
            
            const { data } = await calendarApi.post('/auth/new', { name, email, password });
            // Save in localstorage
            localStorage.setItem( 'token', data.token );
            localStorage.setItem( 'token-init-date', new Date().getTime() );
            // Save in store
            dispatch( onLogin({ name: data.name, uid: data.uid }) )
        } catch (error) {
            // Iterar mensajes de error
            dispatch( onLogout( Object.values(error.response.data.errors)[0].msg ) );

            // Elimina el errormessage del store
            setTimeout(() => {
                dispatch( clearErrorMessage() );
            }, 10);
        } 
    }

    // Revalidación de JWT automatico y update of routes
    const checkAuthToken = async() => {
        const token = localStorage.getItem('token');
        // Si token no es valido cierra sesión
        if( !token ) return dispatch( onLogout() );

        try { 
            const { data } = await calendarApi.get('auth/renew');
            localStorage.setItem( 'token', data.token );
            localStorage.setItem( 'token-init-date', new Date().getTime() );
            dispatch( onLogin({ name: data.name, uid: data.uid }) );
        } catch (error) {
            // Limpiar localstorage
            localStorage.clear();
            dispatch( onLogout() );
        }
    }

    // Logout
    const startLogout = () => {
        localStorage.clear();
        dispatch( onLogoutCalendar() );
        dispatch( onLogout() );
    }
    
    return {
        //* Properties
        status, 
        user, 
        errorMessage,

        //* Methos
        checkAuthToken,
        startLoading,
        startLogout,
        startRegister
    }
}