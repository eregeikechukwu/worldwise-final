import {
  createContext,
  useEffect,
  useState,
  useContext,
  useReducer,
  useCallback,
} from "react";

const SUPABASE_URL = "https://idpwtafovblubdwiypkd.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkcHd0YWZvdmJsdWJkd2l5cGtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2NTE1MTksImV4cCI6MjA1NzIyNzUxOX0.qCt44fJJER_vUj8kcV17BpzclojnmNsHelcclEpOn9I";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/cities`, {
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading cities...",
        });
      }
    }
    fetchCities();
  }, [isUpdated]);

  const getCity = useCallback(
    async (id) => {
      if (Number(id) === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/cities?id=eq.${id}`, {
          headers: {
            "Content-Type": "application/json",
            apikey: SUPABASE_ANON_KEY,
            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
          },
        });
        const data = await res.json();
        dispatch({ type: "city/loaded", payload: data[0] });
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the city...",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });
    setIsUpdated(!isUpdated);
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/cities`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(newCity),
      });
      if (!res.ok) throw new Error("Error creating city");
      const data = await res.json();
      dispatch({ type: "city/created", payload: data[0] });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city...",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/cities?id=eq.${id}`, {
        method: "DELETE",
        headers: {
          apikey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });
      if (!res.ok) throw new Error("Error deleting city");
      dispatch({ type: "city/deleted", payload: id });
      setIsUpdated(!isUpdated);
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}

export { CitiesProvider, useCities };

///////////////////////////////////
//ORIGINAL CODE
///////////////////////////////////

// import {
//   createContext,
//   useEffect,
//   useContext,
//   useReducer,
//   useCallback,
// } from "react";

// const BASE_URL = "http://localhost:9000";

// const CitiesContext = createContext();

// const initialState = {
//   cities: [],
//   isLoading: false,
//   currentCity: {},
//   error: "",
// };

// function reducer(state, action) {
//   switch (action.type) {
//     case "loading":
//       return { ...state, isLoading: true };

//     case "cities/loaded":
//       return {
//         ...state,
//         isLoading: false,
//         cities: action.payload,
//       };

//     case "city/loaded":
//       return { ...state, isLoading: false, currentCity: action.payload };

//     case "city/created":
//       return {
//         ...state,
//         isLoading: false,
//         cities: [...state.cities, action.payload],
//         currentCity: action.payload,
//       };

//     case "city/deleted":
//       return {
//         ...state,
//         isLoading: false,
//         cities: state.cities.filter((city) => city.id !== action.payload),
//         currentCity: {},
//       };

//     case "rejected":
//       return {
//         ...state,
//         isLoading: false,
//         error: action.payload,
//       };

//     default:
//       throw new Error("Unknown action type");
//   }
// }

// function CitiesProvider({ children }) {
//   const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
//     reducer,
//     initialState
//   );

//   useEffect(function () {
//     async function fetchCities() {
//       dispatch({ type: "loading" });

//       try {
//         const res = await fetch(`${BASE_URL}/cities`);
//         const data = await res.json();
//         dispatch({ type: "cities/loaded", payload: data });
//       } catch {
//         dispatch({
//           type: "rejected",
//           payload: "There was an error loading cities...",
//         });
//       }
//     }
//     fetchCities();
//   }, []);

//   const getCity = useCallback(
//     async function getCity(id) {
//       if (Number(id) === currentCity.id) return;

//       dispatch({ type: "loading" });

//       try {
//         const res = await fetch(`${BASE_URL}/cities/${id}`);
//         const data = await res.json();
//         dispatch({ type: "city/loaded", payload: data });
//       } catch {
//         dispatch({
//           type: "rejected",
//           payload: "There was an error loading the city...",
//         });
//       }
//     },
//     [currentCity.id]
//   );

//   async function createCity(newCity) {
//     dispatch({ type: "loading" });

//     try {
//       const res = await fetch(`${BASE_URL}/cities`, {
//         method: "POST",
//         body: JSON.stringify(newCity),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//       const data = await res.json();

//       dispatch({ type: "city/created", payload: data });
//     } catch {
//       dispatch({
//         type: "rejected",
//         payload: "There was an error creating the city...",
//       });
//     }
//   }

//   async function deleteCity(id) {
//     dispatch({ type: "loading" });

//     try {
//       await fetch(`${BASE_URL}/cities/${id}`, {
//         method: "DELETE",
//       });

//       dispatch({ type: "city/deleted", payload: id });
//     } catch {
//       dispatch({
//         type: "rejected",
//         payload: "There was an error deleting the city...",
//       });
//     }
//   }

//   return (
//     <CitiesContext.Provider
//       value={{
//         cities,
//         isLoading,
//         currentCity,
//         error,
//         getCity,
//         createCity,
//         deleteCity,
//       }}
//     >
//       {children}
//     </CitiesContext.Provider>
//   );
// }

// function useCities() {
//   const context = useContext(CitiesContext);
//   if (context === undefined)
//     throw new Error("CitiesContext was used outside the CitiesProvider");
//   return context;
// }

// export { CitiesProvider, useCities };
