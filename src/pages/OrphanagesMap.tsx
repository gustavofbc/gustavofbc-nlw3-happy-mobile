import React from 'react';

import { StyleSheet, Text, View, Dimensions } from 'react-native';
import MapView, {Marker, Callout, PROVIDER_GOOGLE} from 'react-native-maps';
import { Feather } from '@expo/vector-icons';

import mapMarker from '../images/map-marker.png';
import { useNavigation } from '@react-navigation/native';
import { RectButton } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import api from '../services/api';

interface OrphanageItem {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function OrphanagesMap() {
  const [orphanages, setOrphanages] = useState<OrphanageItem[]>([]);
  const navigation = useNavigation();

  useEffect(() => {
    api.get('orphanages').then(response => {
      setOrphanages(response.data);
    });
  }, []);

  function handleNavigateToOrphanageDetails(id: number) {
    navigation.navigate('OrphanageDetails', {id})
  }
  function handleNavigateToCreateOrphanage() {
    navigation.navigate('SelectMapPosition')
  }

  return(
    <View style={styles.container}>
      <MapView 
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: -5.3828671,
          longitude: -49.1319963,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }} >
          {orphanages.map(orphanage => {
            return (
              <Marker 
                key={orphanage.id}
                icon={mapMarker}
                calloutAnchor={{
                  x: 2.7,
                  y: 0.8,
                }}
                coordinate={{
                  latitude: orphanage.latitude,
                  longitude: orphanage.longitude,
                }}
              >
              <Callout tooltip={true} onPress={ () => handleNavigateToOrphanageDetails(orphanage.id)}>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutText}>{orphanage.name}</Text>
                </View>
              </Callout>
            </Marker>
            )
          })} 
        </MapView>

        <View style={styles.footer}>
            <Text style={styles.footerText}>{orphanages.length} orfanatos encontrados</Text>
        
            <RectButton style={styles.createdOrphanageButton} onPress={handleNavigateToCreateOrphanage}>
              <Feather name='plus' size={20} color='#FFF' />
            </RectButton>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  
    calloutContainer: {
      width: 160,
      height: 46,
      paddingHorizontal: 16,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      borderRadius: 16,
      justifyContent: 'center',
    },
  
    calloutText: {
      color: '#0089A5',
      fontSize: 14,
      fontFamily: 'Nunito_700Bold',
    },
  
    footer: {
      position: "absolute",
      left: 24,
      right: 24,
      bottom: 32,
  
      backgroundColor: '#FFF',
      borderRadius: 20,
      height: 56,
      paddingLeft: 24,
  
      flexDirection: 'row',
      justifyContent:'space-between',
      alignItems: 'center',
    },
  
    footerText: {
      fontFamily: 'Nunito_700Bold',
      color: '#0fa7b3'
    },
  
    createdOrphanageButton: {
      width: 56,
      height: 56,
      backgroundColor: '#15c5d6',
      borderRadius: 20,
  
      justifyContent: 'center',
      alignItems: 'center',
  
      elevation: 3,
    }
  });
  