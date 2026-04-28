'use client';
import { useEffect, useRef } from 'react';
import { Incident } from '@/types';
import { getMapsLoader, CRISIS_MAP_COLORS } from '@/lib/maps';

interface Props {
  incidents: Incident[];
  selected: Incident | null;
  onSelect: (i: Incident) => void;
}

export default function VenueMap({ incidents, selected, onSelect }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<Map<string, google.maps.Marker>>(new Map());

  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;
      const loader = getMapsLoader();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (loader as any).importLibrary('maps');
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: { lat: 28.6139, lng: 77.2090 },
        zoom: 15,
        styles: [
          { elementType: 'geometry', stylers: [{ color: '#111111' }] },
          { elementType: 'labels.text.stroke', stylers: [{ color: '#111111' }] },
          { elementType: 'labels.text.fill', stylers: [{ color: '#A1A1AA' }] },
          { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#181818' }] },
          { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#080808' }] },
        ],
        disableDefaultUI: true,
      });
    };
    initMap();
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    markersRef.current.forEach(m => m.setMap(null));
    markersRef.current.clear();
    incidents.forEach(inc => {
      if (!inc.location?.lat) return;
      const marker = new google.maps.Marker({
        position: { lat: inc.location.lat, lng: inc.location.lng },
        map: mapInstanceRef.current!,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: selected?.id === inc.id ? 14 : 10,
          fillColor: CRISIS_MAP_COLORS[inc.crisisType],
          fillOpacity: inc.status === 'resolved' ? 0.4 : 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
        title: `${inc.crisisType.toUpperCase()} — ${inc.location.address}`,
        animation: inc.status === 'active' ? google.maps.Animation.BOUNCE : undefined,
      });
      marker.addListener('click', () => onSelect(inc));
      markersRef.current.set(inc.id, marker);
    });
  }, [incidents, selected, onSelect]);

  const handleZoom = (val: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setZoom((mapInstanceRef.current.getZoom() || 15) + val);
    }
  };

  const handleLocate = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo({ lat: 28.6139, lng: 77.2090 });
    }
  };

  return (
    <div className="w-full h-full relative bg-[#111111]">
      <div className="absolute inset-0 z-0 opacity-40 grayscale contrast-125" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCtBNCsehDiRJ5YozHpdNGBSHjYnquRdPCWn6Mb3nw9lpNj8wgx0Rd8Q030wk3lglUUK9CPq9GY62bQH4YNjCkgEie0Rwq9BFqufj0sQO0f4f2IdAsYfA-btVl50CyZOZNrFN2PqjAaQZP9G-wGX4xz-MuDdDOhZP9PjGtrrHbZ2XC6IXO6SezWbYK6IubPm57rg9YviuqRAwGkGzxzeKkieDy_lr1eZNrU16Va81761l4_FXWkzAFKHedox-lr7cKMXGKD6DaI93YV')", backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
      <div ref={mapRef} className="absolute inset-0 z-10"></div>
      
      {/* Map Controls */}
      <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
        <button onClick={() => handleZoom(1)} className="w-10 h-10 bg-[#181818] border border-[#2C2C2E] text-[#F5F5F5] flex items-center justify-center rounded-lg hover:bg-[#202020] transition-colors"><span className="material-symbols-outlined">add</span></button>
        <button onClick={() => handleZoom(-1)} className="w-10 h-10 bg-[#181818] border border-[#2C2C2E] text-[#F5F5F5] flex items-center justify-center rounded-lg hover:bg-[#202020] transition-colors"><span className="material-symbols-outlined">remove</span></button>
        <button onClick={handleLocate} className="w-10 h-10 bg-[#181818] border border-[#2C2C2E] text-[#FF3B30] flex items-center justify-center rounded-lg hover:bg-[#202020] transition-colors mt-2"><span className="material-symbols-outlined">my_location</span></button>
      </div>

      {!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-[#111111]/80 backdrop-blur-sm text-[#A1A1AA]">
          <p className="text-sm font-tactical-data">ADD GOOGLE_MAPS_API_KEY TO .env.local</p>
        </div>
      )}
    </div>
  );
}
