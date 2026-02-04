import { IonAvatar, IonCard, IonCardContent, IonContent, IonHeader, IonItem, IonLabel, IonList, IonLoading, IonPage, IonRefresher, IonRefresherContent, IonText, IonTitle,
  IonToolbar, useIonViewWillEnter
} from '@ionic/react';
import { useState } from 'react';
import axios from 'axios';
import './Home.css';

// Interface del personaje
interface Character {
  id: number;
  name: string;
  gender: string;
  status: string;
  species: string;
  createdAt: string;
  image: string;
}

const Home: React.FC = () => {
  // Estados (alamcenar lista de personajes, control de carga de datos y errores)
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Llamada de API
  const loadCharacters = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        'https://futuramaapi.com/api/characters',
        {
          params: {
            orderBy: 'id',
            orderByDirection: 'asc',
            page: 1,
            size: 50
          }
        }
      );

      setCharacters(response.data.items);
    } catch (error) {
      console.error(' Erro: No se pudieron cargar los personajes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Se cargan los datos al iniciar la página
  useIonViewWillEnter(() => {
    loadCharacters();
  });

  // Refresh (vuelve a consultar API)
  const refresh = async (e: CustomEvent) => {
    await loadCharacters();
    e.detail.complete();
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Personajes de Futurama</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRefresher slot="fixed" onIonRefresh={refresh}>
          <IonRefresherContent />
        </IonRefresher>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Futurama</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Indicador de carga */}
        <IonLoading isOpen={loading} message="Cargando personajes..." />

        {/* Mensaje de Error */}
        {error && (
          <IonText color="danger" className="ion-padding">
            <p>{error}</p>
          </IonText>
        )}

        {/* Estado vacío */}
        {!loading && !error && characters.length === 0 && (
          <IonText className="ion-padding">
            <p>No hay personajes disponibles.</p>
          </IonText>
        )}

        {/* Lista de los personajes */}
        <IonList>
          {characters.map(character => (
            <IonCard key={character.id}>
              <IonItem lines="none">
                <IonAvatar slot="start" className="character-avatar"> 
                  <img src={character.image} alt={character.name} />
                </IonAvatar>

               <IonLabel>
                  <h2 className="character-name">{character.name}</h2>
                  <p className="character-meta">
                    Género: {character.gender}              
                    </p>
                    <p>
                    Especie: {character.species}
                    </p>
                    <p>
                    Estado: {character.status}
                    </p>
                </IonLabel>
              </IonItem>

              <IonCardContent>
                
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
