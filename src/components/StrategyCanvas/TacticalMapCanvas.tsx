import React, { useState, useEffect, useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { 
  APIProvider, 
  Map, 
  useMap,
  MapMouseEvent 
} from '@vis.gl/react-google-maps';
import { 
  ZoomIn, 
  ZoomOut, 
  Crosshair, 
  Flame, 
  DollarSign, 
  Building, 
  Truck, 
  Anchor, 
  Diamond, 
  Compass, 
  X, 
  MapPin, 
  PlusCircle, 
  Eye, 
  EyeOff, 
  Navigation, 
  RotateCcw, 
  Layers,
  ChevronDown,
  ChevronUp,
  Tag,
  Store,
  FileText,
  Camera,
  Edit3,
  Trash2,
  Upload
} from 'lucide-react';
import { RacketNode, TerritoryRegion, CitySector } from '../../types/dashboard';
import { 
  TacticalMapPinGraphic, 
  getPinTypeMeta, 
  renderPinIcon 
} from './TacticalPinRegistry';
import { AddMapLocationModal } from '../Modals/AddMapLocationModal';

export type MapThemeMode = 'parchment' | 'noir' | 'sepia' | 'satellite';

// Dynamic Google Maps Styles Generator
const getMapStyles = (
  theme: MapThemeMode,
  showRoadsAndPOIs: boolean
): google.maps.MapTypeStyle[] | undefined => {
  if (theme === 'satellite') return undefined;

  // Rules for street names & commercial shops/POIs
  const labelRules: google.maps.MapTypeStyle[] = showRoadsAndPOIs
    ? [
        { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'on' }] },
        { featureType: 'road.arterial', elementType: 'labels.text.fill', stylers: [{ color: '#FFFFFF' }] },
        { featureType: 'road.arterial', elementType: 'labels.text.stroke', stylers: [{ color: '#332D3A' }, { weight: 2 }] },
        { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
        { featureType: 'administrative.neighborhood', stylers: [{ visibility: 'on' }] },
      ]
    : [
        // Completely strip ALL street names, road names, and commercial shops/POIs!
        { featureType: 'road', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'road.highway', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'road.arterial', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'road.local', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi.business', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi.government', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi.medical', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi.park', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi.place_of_worship', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi.school', stylers: [{ visibility: 'off' }] },
        { featureType: 'poi.sports_complex', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
        { featureType: 'administrative.land_parcel', stylers: [{ visibility: 'off' }] },
        { featureType: 'administrative.neighborhood', stylers: [{ visibility: 'off' }] },
      ];

  if (theme === 'noir') {
    return [
      { elementType: 'geometry', stylers: [{ color: '#131318' }] },
      { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#D4AF37' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#0A0A0C' }, { weight: 2 }] },
      { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#990000' }, { weight: 1 }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#23232C' }, { weight: 0.4 }] },
      { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#343340' }, { weight: 0.6 }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#881A1A' }, { weight: 0.8 }] },
      { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#4A0808' }, { weight: 0.3 }] },
      { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: '#DEDFDA' }, { weight: 0.3 }] },
      { featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{ color: '#DEDFDA' }, { weight: 0.2 }] },
      { featureType: 'landscape.man_made', elementType: 'geometry.stroke', stylers: [{ color: '#DEDFDA' }, { weight: 0.4 }] },
      { featureType: 'poi', elementType: 'geometry.stroke', stylers: [{ color: '#DEDFDA' }, { weight: 0.4 }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e66e70' }] },
      ...labelRules,
    ];
  }

  if (theme === 'sepia') {
    return [
      { elementType: 'geometry', stylers: [{ color: '#EAE1C8' }] },
      { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
      { elementType: 'labels.text.fill', stylers: [{ color: '#4A3B22' }] },
      { elementType: 'labels.text.stroke', stylers: [{ color: '#FAF4E3' }, { weight: 1.5 }] },
      { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#DACCA5' }, { weight: 0.4 }] },
      { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#7D6238' }, { weight: 0.6 }] },
      { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#8F4129' }, { weight: 0.8 }] },
      { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#5C2B1B' }, { weight: 0.3 }] },
      { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: '#DEDFDA' }, { weight: 0.3 }] },
      { featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{ color: '#DEDFDA' }, { weight: 0.2 }] },
      { featureType: 'landscape.man_made', elementType: 'geometry.stroke', stylers: [{ color: '#DEDFDA' }, { weight: 0.4 }] },
      { featureType: 'poi', elementType: 'geometry.stroke', stylers: [{ color: '#DEDFDA' }, { weight: 0.4 }] },
      { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e66e70' }] },
      ...labelRules,
    ];
  }

  // Default: Don's View Parchment (Matches ivory/cream palette)
  return [
    { elementType: 'geometry', stylers: [{ color: '#F5EFEB' }] },
    { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#2E2833' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#FFFFFF' }, { weight: 1.5 }] },
    { featureType: 'administrative', elementType: 'geometry.stroke', stylers: [{ color: '#C8BDB0' }] },
    { featureType: 'administrative.country', elementType: 'geometry.stroke', stylers: [{ color: '#B31B24' }, { weight: 1.2 }] },
    { featureType: 'administrative.neighborhood', elementType: 'geometry.stroke', stylers: [{ color: '#DEDFDA' }, { weight: 0.4 }] },
    { featureType: 'administrative.land_parcel', elementType: 'geometry.stroke', stylers: [{ color: '#DEDFDA' }, { weight: 0.4 }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#DFE8D7' }, { visibility: 'simplified' }] },
    // Major & Arterial Roads (width preserved from previous customization)
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#EDE5D6' }, { weight: 0.4 }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#D8CEBE' }, { weight: 0.2 }] },
    { featureType: 'road.arterial', elementType: 'geometry', stylers: [{ color: '#4A4350' }, { weight: 0.6 }] },
    { featureType: 'road.arterial', elementType: 'geometry.stroke', stylers: [{ color: '#332D3A' }, { weight: 0.2 }] },
    { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#685D73' }, { weight: 0.8 }] },
    { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#4A4350' }, { weight: 0.3 }] },
    // Interior Lines: Local Streets, Buildings & Small Places (#DEDFDA)
    { featureType: 'road.local', elementType: 'geometry', stylers: [{ color: '#DEDFDA' }, { weight: 0.3 }] },
    { featureType: 'road.local', elementType: 'geometry.stroke', stylers: [{ color: '#DEDFDA' }, { weight: 0.2 }] },
    { featureType: 'landscape.man_made', elementType: 'geometry.stroke', stylers: [{ color: '#DEDFDA' }, { weight: 0.4 }] },
    { featureType: 'poi', elementType: 'geometry.stroke', stylers: [{ color: '#DEDFDA' }, { weight: 0.4 }] },
    // Water / Sea (#e66e70)
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#e66e70' }] },
    { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#7E252D' }] },
    ...labelRules,
  ];
};

// Robust React Portal Overlay Marker for Google Maps
interface TacticalOverlayMarkerProps {
  position: { lat: number; lng: number };
  children: React.ReactNode;
  zIndex?: number;
}

const TacticalOverlayMarker: React.FC<TacticalOverlayMarkerProps> = ({ position, children, zIndex = 10 }) => {
  const map = useMap();
  const [container] = useState(() => {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.transform = 'translate(-50%, -50%)';
    return el;
  });

  useEffect(() => {
    if (!map || typeof google === 'undefined' || !google.maps || !google.maps.OverlayView) return;

    const overlay = new google.maps.OverlayView();

    overlay.onAdd = function () {
      const panes = this.getPanes();
      if (panes) {
        panes.overlayMouseTarget.appendChild(container);
      }
    };

    overlay.draw = function () {
      const projection = this.getProjection();
      if (!projection) return;
      const point = projection.fromLatLngToDivPixel(new google.maps.LatLng(position.lat, position.lng));
      if (point) {
        container.style.left = `${point.x}px`;
        container.style.top = `${point.y}px`;
        container.style.zIndex = String(zIndex);
      }
    };

    overlay.onRemove = function () {
      if (container.parentElement) {
        container.parentElement.removeChild(container);
      }
    };

    overlay.setMap(map);

    return () => {
      overlay.setMap(null);
    };
  }, [map, position.lat, position.lng, zIndex]);

  return ReactDOM.createPortal(children, container);
};

// Camera Controller Helper
const MapController: React.FC<{
  center: { lat: number; lng: number };
  zoom: number;
}> = ({ center, zoom }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    map.panTo(center);
    map.setZoom(zoom);
  }, [map, center, zoom]);

  return null;
};

// Custom Zoom Controls
const MapViewControls: React.FC<{
  onReset: () => void;
}> = ({ onReset }) => {
  const map = useMap();

  return (
    <div className="flex flex-col gap-1 bg-[#FFFFFF]/95 backdrop-blur-xs border border-[#E2DACB] rounded-lg p-1 shadow-md">
      <button
        onClick={() => map && map.setZoom((map.getZoom() || 12) + 1)}
        title="Zoom In"
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#F4F1EA] text-[#1C191E] transition-colors cursor-pointer"
      >
        <ZoomIn className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={() => map && map.setZoom((map.getZoom() || 12) - 1)}
        title="Zoom Out"
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#F4F1EA] text-[#1C191E] transition-colors cursor-pointer"
      >
        <ZoomOut className="w-3.5 h-3.5" />
      </button>
      <div className="h-px bg-[#EFEAE0] my-0.5" />
      <button
        onClick={onReset}
        title="Reset Camera to Region"
        className="w-7 h-7 flex items-center justify-center rounded hover:bg-[#F4F1EA] text-[#7A747D] hover:text-[#B31B24] transition-colors cursor-pointer"
      >
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

interface TacticalMapCanvasProps {
  region: TerritoryRegion;
  sectors?: CitySector[];
  nodes: RacketNode[];
  allRackets?: RacketNode[];
  selectedNode: RacketNode | null;
  onSelectNode: (node: RacketNode | null) => void;
  onLaunchOperation: (node: RacketNode, type: 'takeover' | 'reinforce' | 'extort' | 'arson_bomb') => void;
  filterRingCategory?: string | null;
  onAddNewRacket?: (newRacket: RacketNode) => void;
  onDeleteRacket?: (nodeId: string) => void;
  onUpdateRacket?: (updatedNode: RacketNode) => void;
  onSelectRegion?: (region: TerritoryRegion) => void;
}

export const TacticalMapCanvas: React.FC<TacticalMapCanvasProps> = ({
  region,
  sectors = [],
  nodes,
  allRackets = [],
  selectedNode,
  onSelectNode,
  onLaunchOperation,
  onAddNewRacket,
  onDeleteRacket,
  onUpdateRacket,
  onSelectRegion,
}) => {
  // Region Center Presets (Defaulting to Mansoura and looking up dynamic sectors)
  const getRegionCenter = useCallback((r: TerritoryRegion) => {
    const foundSector = sectors.find((s) => s.id === r);
    if (foundSector) {
      return { lat: foundSector.lat, lng: foundSector.lng, zoom: foundSector.zoom || 13 };
    }
    if (r === 'mansoura') {
      return { lat: 31.0409, lng: 31.3785, zoom: 13 };
    }
    // Fallback default is Mansoura
    return { lat: 31.0409, lng: 31.3785, zoom: 13 };
  }, [sectors]);

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>(() => getRegionCenter(region));
  const [mapZoom, setMapZoom] = useState<number>(() => getRegionCenter(region).zoom);

  // Active Map Theme
  const [mapTheme, setMapTheme] = useState<MapThemeMode>('parchment');

  // USER TOGGLE: Hide road names and shops by default! Only show custom points
  const [showRoadsAndPOIs, setShowRoadsAndPOIs] = useState<boolean>(false);

  // Custom node title badges & tactical grid toggles
  const [showVenueLabels, setShowVenueLabels] = useState<boolean>(true);
  const [showTacticalGrid, setShowTacticalGrid] = useState<boolean>(true);
  const [showInfluenceRings, setShowInfluenceRings] = useState<boolean>(true);

  // Floating coordinates dialog toggle
  const [isCoordinatesModalOpen, setIsCoordinatesModalOpen] = useState<boolean>(false);

  // Dossier minimized state
  const [isDossierMinimized, setIsDossierMinimized] = useState<boolean>(false);

  // Coordinate Input States for manual GPS jump
  const [inputLat, setInputLat] = useState<string>(String(getRegionCenter(region).lat));
  const [inputLng, setInputLng] = useState<string>(String(getRegionCenter(region).lng));
  const [isPickMode, setIsPickMode] = useState<boolean>(false);
  const [pickedLocation, setPickedLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Hover state
  const [hoveredNode, setHoveredNode] = useState<RacketNode | null>(null);

  // Add Pin / Map Location Modal & Editing State
  const [isAddLocationModalOpen, setIsAddLocationModalOpen] = useState<boolean>(false);
  const [editingNode, setEditingNode] = useState<RacketNode | null>(null);

  // Telemetry
  const [currentTelemetry, setCurrentTelemetry] = useState<{ lat: number; lng: number; zoom: number }>({
    lat: getRegionCenter(region).lat,
    lng: getRegionCenter(region).lng,
    zoom: 12,
  });

  // Sync region changes
  useEffect(() => {
    const preset = getRegionCenter(region);
    setMapCenter({ lat: preset.lat, lng: preset.lng });
    setMapZoom(preset.zoom);
    setInputLat(String(preset.lat));
    setInputLng(String(preset.lng));
    setCurrentTelemetry(preset);
  }, [region, getRegionCenter]);

  // Active venue
  const activeVenue = selectedNode || nodes[0] || null;

  // Jump to specific custom coordinates
  const handleJumpToCoordinates = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const lat = parseFloat(inputLat);
    const lng = parseFloat(inputLng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setMapCenter({ lat, lng });
      setMapZoom(13);
      setCurrentTelemetry({ lat, lng, zoom: 13 });
      setIsCoordinatesModalOpen(false);
    }
  };

  // Quick Preset Jumps
  const quickJumpPresets = [
    { label: 'Miami', lat: 25.7617, lng: -80.1918, regionKey: 'florida' as TerritoryRegion },
    { label: 'New York', lat: 40.7128, lng: -74.0060, regionKey: 'new-york' as TerritoryRegion },
    { label: 'Havana', lat: 23.1136, lng: -82.3666, regionKey: 'cuba' as TerritoryRegion },
    { label: 'Chicago', lat: 41.8781, lng: -87.6298, regionKey: null },
    { label: 'Las Vegas', lat: 36.1716, lng: -115.1391, regionKey: null },
    { label: 'Palermo', lat: 38.1157, lng: 13.3615, regionKey: null },
  ];

  // Map Click to capture location
  const handleMapClick = (e: MapMouseEvent) => {
    if (!e.detail.latLng) return;
    const clickedLat = e.detail.latLng.lat;
    const clickedLng = e.detail.latLng.lng;
    setPickedLocation({ lat: clickedLat, lng: clickedLng });
    setInputLat(clickedLat.toFixed(6));
    setInputLng(clickedLng.toFixed(6));
    setIsPickMode(true);
  };

  // Open fresh Add Pin Modal
  const handleOpenAddPin = () => {
    setEditingNode(null);
    setIsAddLocationModalOpen(true);
  };

  // Open Edit Pin Modal
  const handleOpenEditPin = (node: RacketNode) => {
    setEditingNode(node);
    setIsAddLocationModalOpen(true);
  };

  // Delete Pin Handler
  const handleDeletePin = (nodeId: string) => {
    if (onDeleteRacket) {
      onDeleteRacket(nodeId);
    }
    if (activeVenue?.id === nodeId) {
      onSelectNode(null);
    }
  };

  // Add new Pin Location to Map
  const handleAddLocation = (newNode: RacketNode) => {
    if (onAddNewRacket) {
      onAddNewRacket(newNode);
    }
    setEditingNode(null);
    setIsAddLocationModalOpen(false);
    setIsPickMode(false);
    setPickedLocation(null);
  };

  // Update existing Pin Location
  const handleUpdateLocation = (updatedNode: RacketNode) => {
    if (onUpdateRacket) {
      onUpdateRacket(updatedNode);
    }
    setEditingNode(null);
    setIsAddLocationModalOpen(false);
  };

  // Handle direct image upload on the active venue card
  const handleActiveVenueImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeVenue || !onUpdateRacket) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const updated: RacketNode = {
          ...activeVenue,
          imageUrl: reader.result,
        };
        onUpdateRacket(updated);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle image removal on active venue card
  const handleRemoveActiveVenueImage = () => {
    if (!activeVenue || !onUpdateRacket) return;
    const updated: RacketNode = {
      ...activeVenue,
      imageUrl: undefined,
    };
    onUpdateRacket(updated);
  };

  // Medallion Styling
  const getMedallionConfig = (node: RacketNode) => {
    switch (node.type) {
      case 'Casino':
        return {
          bgGradient: 'from-[#F59E0B] to-[#B45309]',
          border: 'border-[#FDE68A]',
          glowColor: 'rgba(245, 158, 11, 0.4)',
          icon: <Diamond className="w-3.5 h-3.5 text-white" />,
          tallyBg: 'bg-[#D97706]',
        };
      case 'Diner':
        return {
          bgGradient: node.status === 'contested' ? 'from-[#DC2626] to-[#991B1B]' : 'from-[#B31B24] to-[#7F1D1D]',
          border: 'border-[#FECACA]',
          glowColor: 'rgba(179, 27, 36, 0.5)',
          icon: <DollarSign className="w-3.5 h-3.5 text-white" />,
          tallyBg: 'bg-[#B31B24]',
        };
      case 'Armory':
        return {
          bgGradient: 'from-[#2563EB] to-[#1E40AF]',
          border: 'border-[#BFDBFE]',
          glowColor: 'rgba(37, 99, 235, 0.4)',
          icon: <Crosshair className="w-3.5 h-3.5 text-white" />,
          tallyBg: 'bg-[#2563EB]',
        };
      case 'Chop Shop':
        return {
          bgGradient: 'from-[#EA580C] to-[#9A3412]',
          border: 'border-[#FED7AA]',
          glowColor: 'rgba(234, 88, 12, 0.4)',
          icon: <Truck className="w-3.5 h-3.5 text-white" />,
          tallyBg: 'bg-[#EA580C]',
        };
      case 'Shipping Docks':
        return {
          bgGradient: 'from-[#0D9488] to-[#115E59]',
          border: 'border-[#99F6E4]',
          glowColor: 'rgba(13, 148, 136, 0.4)',
          icon: <Anchor className="w-3.5 h-3.5 text-white" />,
          tallyBg: 'bg-[#0D9488]',
        };
      default:
        return {
          bgGradient: 'from-[#4B5563] to-[#1F2937]',
          border: 'border-[#E5E7EB]',
          glowColor: 'rgba(75, 85, 99, 0.4)',
          icon: <Building className="w-3.5 h-3.5 text-white" />,
          tallyBg: 'bg-[#4B5563]',
        };
    }
  };

  // Compute dynamic Google Maps styles (handles toggle for road names & shops)
  const activeGoogleMapStyles = useMemo(() => {
    return getMapStyles(mapTheme, showRoadsAndPOIs);
  }, [mapTheme, showRoadsAndPOIs]);

  const activeMapTypeId = mapTheme === 'satellite' ? 'satellite' : 'roadmap';
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "AIzaSyCRa8SQV9NLQ7TqAIHOEjzKs677wGol30Y";

  return (
    <div className="relative flex-1 w-full h-full bg-[#F4F1EA] overflow-hidden select-none border border-[#E2DACB] rounded-xl shadow-xs flex flex-col">
      
      {/* ============================================================== */}
      {/* 1. FULL VIEWPORT GOOGLE MAP (TOP BOX REMOVED AS REQUESTED)     */}
      {/* ============================================================== */}
      <div className={`relative flex-1 w-full h-full min-h-[400px] overflow-hidden ${
        mapTheme === 'parchment' ? 'dons-view-map-parchment' : ''
      }`}>
        <APIProvider apiKey={apiKey}>
          <Map
            defaultCenter={mapCenter}
            defaultZoom={mapZoom}
            mapTypeId={activeMapTypeId}
            styles={activeGoogleMapStyles}
            disableDefaultUI={true}
            zoomControl={false}
            streetViewControl={false}
            mapTypeControl={false}
            fullscreenControl={false}
            onClick={handleMapClick}
            className="w-full h-full"
            internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
            onCameraChanged={(ev) => {
              setCurrentTelemetry({
                lat: ev.detail.center.lat,
                lng: ev.detail.center.lng,
                zoom: ev.detail.zoom,
              });
            }}
          >
            {/* Smooth Fly Controller */}
            <MapController center={mapCenter} zoom={mapZoom} />

            {/* RENDER EXCLUSIVELY TACTICAL PINS (ALL MAP ITEMS ARE IN PIN SHAPE) */}
            {nodes.map((node) => {
              const isSelected = activeVenue?.id === node.id;
              const isHovered = hoveredNode?.id === node.id;
              const isContested = node.status === 'contested';
              
              // Pin styling: custom hexColor, customIcon or pinType
              const pinMeta = getPinTypeMeta(node.pinType || node.customIcon);
              const pinColor = node.hexColor || pinMeta?.defaultColor || '#B31B24';
              const pinIconName = node.customIcon || pinMeta?.iconName || 'MapPin';

              return (
                <TacticalOverlayMarker
                  key={node.id}
                  position={{ lat: node.lat, lng: node.lng }}
                  zIndex={isSelected ? 40 : isHovered ? 30 : 20}
                >
                  <div
                    className="flex flex-col items-center cursor-pointer group"
                    style={{ transform: 'translate(0, -22px)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectNode(node);
                      setIsDossierMinimized(false);
                    }}
                    onMouseEnter={() => setHoveredNode(node)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* The Real Pin Graphic */}
                    <div className="relative">
                      <TacticalMapPinGraphic
                        color={pinColor}
                        iconName={pinIconName}
                        isSelected={isSelected}
                        isHovered={isHovered}
                        size="md"
                      />

                      {/* Contested Badge */}
                      {isContested && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B31B24] border border-white flex items-center justify-center text-white text-[9px] font-black shadow-sm animate-bounce z-40">
                          <Flame className="w-2.5 h-2.5" />
                        </div>
                      )}

                      {/* Note indicator pip if note exists */}
                      {node.notes && (
                        <div 
                          className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-[#FEF08A] border border-[#CA8A04] flex items-center justify-center text-[9px] text-[#854D0E] font-bold shadow-xs z-40"
                          title={`ملاحظة: ${node.notes}`}
                        >
                          📝
                        </div>
                      )}
                    </div>

                    {/* Venue Name Label & Pin Category */}
                    {(showVenueLabels || isSelected || isHovered) && (
                      <div className={`mt-0.5 px-2 py-0.5 rounded-md border font-serif-title font-bold text-[9px] tracking-wide whitespace-nowrap shadow-xs transition-all flex items-center gap-1 z-30 ${
                        isSelected
                          ? 'bg-[#B31B24] text-white border-[#B31B24]'
                          : isHovered
                          ? 'bg-[#1C191E] text-white border-black'
                          : 'bg-[#FFFFFF]/95 text-[#1C191E] border-[#E2DACB]'
                      }`}>
                        <span>{node.name}</span>
                        {pinMeta && (
                          <span className={`text-[7.5px] px-1 py-0.2 rounded font-normal ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-[#FAF8F5] text-[#7A747D]'
                          }`}>
                            {pinMeta.shortTitle}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Interactive Hover Card with Note */}
                    {isHovered && !isSelected && (
                      <div 
                        className="absolute bottom-14 z-50 pointer-events-none bg-[#FFFFFF] border border-[#E2DACB] rounded-xl p-2.5 shadow-2xl text-[#1C191E] w-52 text-right animate-in fade-in zoom-in-95 duration-100"
                        dir="rtl"
                      >
                        <div className="flex items-center gap-1.5 mb-1">
                          <div 
                            className="w-4 h-4 rounded flex items-center justify-center text-white shrink-0" 
                            style={{ backgroundColor: pinColor }}
                          >
                            {renderPinIcon(pinIconName, "w-2.5 h-2.5 text-white")}
                          </div>
                          <div className="font-serif-title font-bold text-xs text-[#1C191E] truncate">
                            {node.name}
                          </div>
                        </div>
                        <div className="text-[9.5px] font-bold text-[#B31B24] mb-1">
                          {pinMeta ? `${pinMeta.label} (${pinMeta.meaning})` : (node.controllingSyndicate || node.type)}
                        </div>
                        {node.notes && (
                          <div className="p-1.5 rounded bg-[#FEF9C3]/80 border border-[#FDE047] text-[9px] text-[#854D0E] font-medium mb-1">
                            <span className="font-bold">📝 ملاحظة: </span>
                            <span>{node.notes}</span>
                          </div>
                        )}
                        <div className="text-[8.5px] text-[#7A747D] font-mono-num">
                          الإحداثيات: {node.lat.toFixed(4)}°, {node.lng.toFixed(4)}°
                        </div>
                      </div>
                    )}
                  </div>
                </TacticalOverlayMarker>
              );
            })}

            {/* Captured Target Marker (bouncing pin in pick mode) */}
            {pickedLocation && (
              <TacticalOverlayMarker position={pickedLocation} zIndex={50}>
                <div 
                  className="flex flex-col items-center animate-bounce cursor-pointer"
                  style={{ transform: 'translate(0, -22px)' }}
                  onClick={() => setIsAddLocationModalOpen(true)}
                >
                  <TacticalMapPinGraphic
                    color="#D97706"
                    iconName="MapPin"
                    isSelected={true}
                    size="md"
                  />
                  <span className="text-[8px] font-bold bg-[#1C191E] text-white px-2 py-0.5 rounded-full mt-0.5 whitespace-nowrap shadow-sm">
                    موقع محدد (اضغط لإضافة دبوس)
                  </span>
                </div>
              </TacticalOverlayMarker>
            )}
          </Map>
        </APIProvider>

        {/* ------------------------------------------------------------- */}
        {/* TACTICAL CANVAS OVERLAYS: HUD GRID & TICKS                     */}
        {/* ------------------------------------------------------------- */}
        {showTacticalGrid && (
          <div className="absolute inset-0 pointer-events-none z-10">
            <div 
              className="w-full h-full opacity-20"
              style={{
                backgroundImage: 'radial-gradient(circle, #7A747D 1px, transparent 1px)',
                backgroundSize: '48px 48px'
              }}
            />
            {/* Brass Corner Accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#D4AF37] opacity-60" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#D4AF37] opacity-60" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#D4AF37] opacity-60" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#D4AF37] opacity-60" />
          </div>
        )}

        {/* Vintage Compass Rose (Top Right) */}
        <div className="absolute top-3 right-3 z-20 pointer-events-none flex flex-col items-center opacity-85">
          <div className="w-7 h-7 rounded-full border border-[#D4AF37]/60 bg-[#FFFFFF]/80 backdrop-blur-xs flex items-center justify-center shadow-xs">
            <div className="relative flex flex-col items-center">
              <span className="text-[7px] font-bold text-[#B31B24] font-serif-title leading-none">N</span>
              <div className="w-0.5 h-2.5 bg-gradient-to-b from-[#B31B24] to-[#7A747D]" />
            </div>
          </div>
        </div>

        {/* Floating Custom Zoom Controls (Top Left) */}
        <div className="absolute top-3 left-3 z-20">
          <APIProvider apiKey={apiKey}>
            <MapViewControls
              onReset={() => {
                const preset = getRegionCenter(region);
                setMapCenter({ lat: preset.lat, lng: preset.lng });
                setMapZoom(preset.zoom);
              }}
            />
          </APIProvider>
        </div>

        {/* Captured Location Quick Bar */}
        {isPickMode && pickedLocation && (
          <div className="absolute top-3 left-14 z-30 bg-[#FEF3C7] border border-[#FDE68A] px-3 py-1.5 rounded-lg flex items-center gap-2.5 shadow-md text-xs text-[#92400E]">
            <MapPin className="w-3.5 h-3.5 text-[#D97706]" />
            <span>
              موقع محدد: <strong className="font-mono-num">{pickedLocation.lat.toFixed(4)}°, {pickedLocation.lng.toFixed(4)}°</strong>
            </span>
            <button
              onClick={() => setIsAddLocationModalOpen(true)}
              className="px-2.5 py-1 rounded bg-[#B31B24] hover:bg-[#C7232D] text-white font-bold text-[10px] cursor-pointer shadow-xs flex items-center gap-1"
            >
              <MapPin className="w-3 h-3" />
              <span>+ تأكيد الدبوس هنا</span>
            </button>
            <button
              onClick={() => {
                setPickedLocation(null);
                setIsPickMode(false);
              }}
              className="text-[#92400E] hover:text-black font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* 2. DOCKED NON-OVERLAPPING TACTICAL VENUE DOSSIER (BOTTOM RIGHT) */}
        {/* ============================================================== */}
        {activeVenue && (() => {
          const activePinMeta = getPinTypeMeta(activeVenue.pinType || activeVenue.customIcon);
          const activePinColor = activeVenue.hexColor || activePinMeta?.defaultColor || '#B31B24';
          const activePinIcon = activeVenue.customIcon || activePinMeta?.iconName || 'MapPin';

          return (
            <div className="absolute bottom-12 right-3 z-20 max-w-[290px] w-full bg-[#FFFFFF] border border-[#E2DACB] rounded-xl shadow-xl text-[#1C191E] overflow-hidden transition-all duration-200" dir="rtl">
              {/* Image Banner at Top (صورة تعبيرية لشكل المكان) */}
              {activeVenue.imageUrl ? (
                <div className="relative w-full h-28 bg-[#1C191E] overflow-hidden group">
                  <img 
                    src={activeVenue.imageUrl} 
                    alt={activeVenue.name} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <label 
                    className="absolute bottom-2 left-2 bg-black/70 hover:bg-black/90 text-white text-[9px] font-bold px-2 py-0.5 rounded backdrop-blur-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 shadow-xs"
                    title="تغيير الصورة"
                  >
                    <Camera className="w-3 h-3 text-white" />
                    <span>تغيير الصورة</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleActiveVenueImageUpload} 
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleRemoveActiveVenueImage}
                    className="absolute top-2 left-2 bg-black/60 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-xs cursor-pointer opacity-0 group-hover:opacity-100 transition-all shadow-xs"
                    title="حذف الصورة"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="relative w-full bg-[#FAF8F5] border-b border-[#EFEAE0] p-2 text-center group hover:bg-[#F4F1EA] transition-colors">
                  <label className="cursor-pointer flex items-center justify-center gap-1.5 text-[#7A747D] hover:text-[#B31B24] transition-colors w-full">
                    <div className="w-5 h-5 rounded-full bg-white border border-[#E2DACB] flex items-center justify-center text-[#B31B24] shadow-xs group-hover:scale-110 transition-transform">
                      <Camera className="w-3 h-3" />
                    </div>
                    <span className="text-[9.5px] font-bold">
                      + إضافة صورة تعبيرية لشكل المكان
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleActiveVenueImageUpload} 
                    />
                  </label>
                </div>
              )}

              {/* Header */}
              <div className="bg-[#FAF8F5] border-b border-[#EFEAE0] px-3 py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-2 truncate">
                  <div 
                    className="w-5 h-5 rounded-md flex items-center justify-center text-white shrink-0 shadow-xs"
                    style={{ backgroundColor: activePinColor }}
                  >
                    {renderPinIcon(activePinIcon, "w-3 h-3 text-white")}
                  </div>
                  <h3 className="font-serif-title text-xs font-bold text-[#1C191E] truncate">
                    {activeVenue.name}
                  </h3>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setIsDossierMinimized(!isDossierMinimized)}
                    className="p-1 text-[#7A747D] hover:text-[#1C191E] cursor-pointer"
                    title={isDossierMinimized ? "تكبير" : "تصغير"}
                  >
                    {isDossierMinimized ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => onSelectNode(null)}
                    className="p-1 text-[#7A747D] hover:text-[#B31B24] cursor-pointer"
                    title="إغلاق"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Collapsible Content */}
              {!isDossierMinimized && (
                <div className="p-2.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <span 
                        className="text-[9px] font-bold px-2 py-0.5 rounded-full text-white"
                        style={{ backgroundColor: activePinColor }}
                      >
                        {activePinMeta?.shortTitle || activeVenue.controllingSyndicate || activeVenue.type}
                      </span>
                      {activePinMeta && (
                        <span className="text-[9px] text-[#7A747D]">
                          {activePinMeta.label}
                        </span>
                      )}
                    </div>
                    {activeVenue.status === 'contested' ? (
                      <span className="text-[8px] font-bold uppercase px-1.5 py-0.2 bg-[#F7D5D8] border border-[#E89EAA] text-[#B31B24] rounded">
                        قيد النزاع
                      </span>
                    ) : (
                      <span className="text-[8px] font-bold uppercase px-1.5 py-0.2 bg-[#DCFCE7] border border-[#86EFAC] text-[#15803D] rounded">
                        مسجل ونشط
                      </span>
                    )}
                  </div>

                  {/* Note display */}
                  {activeVenue.notes && (
                    <div className="p-2 rounded-lg bg-[#FEF9C3]/80 border border-[#FDE047] text-xs text-[#854D0E] space-y-0.5">
                      <div className="font-bold flex items-center gap-1 text-[10px]">
                        <FileText className="w-3 h-3" />
                        <span>ملاحظة الدبوس:</span>
                      </div>
                      <p className="text-[10px] leading-relaxed whitespace-pre-wrap">
                        {activeVenue.notes}
                      </p>
                    </div>
                  )}

                  <div className="space-y-1 bg-[#FAF8F5] border border-[#EFEAE0] rounded-lg p-2 text-[10px]">
                    <div className="flex justify-between items-center">
                      <span className="text-[#7A747D] font-bold">الإحداثيات الجغرافية:</span>
                      <span className="font-mono-num font-bold text-[#1C191E]">
                        {activeVenue.lat.toFixed(4)}°, {activeVenue.lng.toFixed(4)}°
                      </span>
                    </div>
                    {activePinMeta?.meaning && (
                      <div className="flex justify-between items-center text-[9px] text-[#7A747D] pt-0.5 border-t border-[#EFEAE0]">
                        <span>التصنيف الميداني:</span>
                        <span className="font-medium text-[#1C191E]">{activePinMeta.meaning}</span>
                      </div>
                    )}
                    {activeVenue.addressDetails && (
                      <div className="flex justify-between items-center text-[9px] text-[#7A747D] pt-0.5 border-t border-[#EFEAE0]">
                        <span>العنوان / المنطقة:</span>
                        <span className="font-medium text-[#1C191E] truncate max-w-[150px]">{activeVenue.addressDetails}</span>
                      </div>
                    )}
                  </div>

                  {/* ACTION BUTTONS: Replace Sabotage & Reinforce with Edit & Delete */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1.5 border-t border-[#EFEAE0]">
                    <button
                      type="button"
                      onClick={() => handleOpenEditPin(activeVenue)}
                      className="py-1.5 px-2 rounded-lg bg-[#FAF8F5] hover:bg-[#EFEAE0] border border-[#E5DECE] text-[#1C191E] text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      title="تعديل تفاصيل الدبوس"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#B31B24]" />
                      <span>تعديل الدبوس</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeletePin(activeVenue.id)}
                      className="py-1.5 px-2 rounded-lg bg-[#FAF8F5] hover:bg-[#FEE2E2] border border-[#E5DECE] hover:border-[#FCA5A5] text-[#DC2626] text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                      title="حذف هذا الدبوس نهائياً من الخريطة"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[#DC2626]" />
                      <span>حذف الدبوس</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })()}

        {/* ============================================================== */}
        {/* 3. SMALL BOTTOM DOCK WITH REQUESTED ROADS & SHOPS TOGGLE ICON  */}
        {/* ============================================================== */}
        <div className="absolute bottom-2 left-2 right-2 z-30 flex items-center justify-between pointer-events-none">
          
          {/* Left Dock: Telemetry & Controls */}
          <div className="flex items-center gap-1.5 bg-[#FFFFFF]/95 backdrop-blur-xs border border-[#E2DACB] rounded-lg px-2 py-1 shadow-md pointer-events-auto">
            
            {/* MANDATORY USER FEATURE: Small Icon at bottom to toggle Street Names & Shops */}
            <button
              onClick={() => setShowRoadsAndPOIs(!showRoadsAndPOIs)}
              title={showRoadsAndPOIs ? "Hide Street Names & Shops (Clean Custom View)" : "Show Street Names & Shops"}
              className={`flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                showRoadsAndPOIs
                  ? 'bg-[#B31B24] text-white shadow-xs'
                  : 'bg-[#FAF8F5] hover:bg-[#EFEAE0] text-[#554F59] border border-[#E5DECE]'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {showRoadsAndPOIs ? 'Shops & Streets: ON' : 'Shops & Streets: OFF'}
              </span>
            </button>

            <div className="h-4 w-px bg-[#E2DACB]" />

            {/* GPS Teleport & Sector Finder Trigger */}
            <button
              onClick={() => setIsCoordinatesModalOpen(true)}
              title="Open GPS Coordinates & Teleport Deck"
              className="flex items-center gap-1 px-2 py-1 rounded bg-[#FAF8F5] hover:bg-[#EFEAE0] border border-[#E5DECE] text-[#554F59] text-[10px] font-bold uppercase transition-colors cursor-pointer"
            >
              <Navigation className="w-3 h-3 text-[#B31B24]" />
              <span className="hidden md:inline">Coordinates</span>
            </button>

            {/* Add Pin Button */}
            <button
              onClick={handleOpenAddPin}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#B31B24] hover:bg-[#C7232D] text-white text-[10px] font-bold shadow-xs transition-colors cursor-pointer"
              title="إضافة دبوس جديد على الخريطة"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>+ إضافة دبوس</span>
            </button>

            {/* Pick on Map Mode Toggle */}
            <button
              onClick={() => setIsPickMode(!isPickMode)}
              title="انقر على الخريطة لتحديد إحداثيات موقع وإضافة دبوس"
              className={`p-1 rounded border text-[10px] transition-colors cursor-pointer ${
                isPickMode 
                  ? 'bg-[#F7D5D8] border-[#E89EAA] text-[#B31B24]' 
                  : 'bg-[#FAF8F5] border-[#E5DECE] text-[#554F59] hover:bg-[#EFEAE0]'
              }`}
            >
              <Crosshair className="w-3.5 h-3.5" />
            </button>

            {/* Custom Node Labels Toggle */}
            <button
              onClick={() => setShowVenueLabels(!showVenueLabels)}
              title={showVenueLabels ? "Hide Node Titles" : "Show Node Titles"}
              className={`p-1 rounded border text-[10px] transition-colors cursor-pointer ${
                showVenueLabels ? 'bg-[#FAF8F5] text-[#1C191E] border-[#E5DECE]' : 'bg-[#EFEAE0] text-[#7A747D] border-[#D5CDBC]'
              }`}
            >
              {showVenueLabels ? <Eye className="w-3.5 h-3.5 text-[#B31B24]" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>

            <div className="h-4 w-px bg-[#E2DACB] hidden sm:block" />

            {/* Map Theme Toggle */}
            <div className="hidden sm:flex items-center gap-1">
              <button
                onClick={() => setMapTheme('parchment')}
                title="Parchment Theme"
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                  mapTheme === 'parchment' ? 'bg-[#F7D5D8] text-[#B31B24]' : 'text-[#7A747D]'
                }`}
              >
                Parchment
              </button>
              <button
                onClick={() => setMapTheme('satellite')}
                title="Satellite Theme"
                className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                  mapTheme === 'satellite' ? 'bg-[#F7D5D8] text-[#B31B24]' : 'text-[#7A747D]'
                }`}
              >
                Satellite
              </button>
            </div>
          </div>

          {/* Right Dock: Live Telemetry Indicator */}
          <div className="bg-[#FFFFFF]/90 backdrop-blur-xs border border-[#E2DACB] rounded-lg px-2.5 py-1 text-[9px] font-mono-num text-[#7A747D] shadow-md pointer-events-auto hidden md:flex items-center gap-2">
            <span>POS: <strong className="text-[#1C191E]">{currentTelemetry.lat.toFixed(4)}°, {currentTelemetry.lng.toFixed(4)}°</strong></span>
            <span>ZOOM: <strong className="text-[#1C191E]">{Math.round(currentTelemetry.zoom)}x</strong></span>
          </div>

        </div>
      </div>

      {/* ============================================================== */}
      {/* 4. MODAL: GPS COORDINATES & SECTOR TELEPORT                    */}
      {/* ============================================================== */}
      {isCoordinatesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E2DACB] rounded-2xl p-5 shadow-2xl text-[#1C191E]">
            <div className="flex items-center justify-between border-b border-[#EFEAE0] pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#B31B24]" />
                <h3 className="font-serif-title font-bold text-sm text-[#1C191E]">GPS Coordinates & Sector Fly</h3>
              </div>
              <button onClick={() => setIsCoordinatesModalOpen(false)} className="text-[#7A747D] hover:text-[#1C191E] cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Coordinate Form */}
            <form onSubmit={handleJumpToCoordinates} className="space-y-3 text-xs mb-4">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1">Latitude (LAT)</span>
                  <input
                    type="text"
                    required
                    value={inputLat}
                    onChange={(e) => setInputLat(e.target.value)}
                    placeholder="e.g. 25.7617"
                    className="w-full p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] outline-none font-mono-num font-bold text-xs text-[#1C191E]"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1">Longitude (LNG)</span>
                  <input
                    type="text"
                    required
                    value={inputLng}
                    onChange={(e) => setInputLng(e.target.value)}
                    placeholder="e.g. -80.1918"
                    className="w-full p-2 rounded-lg bg-[#FAF8F5] border border-[#E5DECE] outline-none font-mono-num font-bold text-xs text-[#1C191E]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2 rounded-lg bg-[#B31B24] hover:bg-[#C7232D] text-white font-serif-title text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Fly Camera To Target Coordinates</span>
              </button>
            </form>

            {/* Quick Sector Jumps */}
            <div>
              <span className="text-[10px] text-[#7A747D] uppercase font-bold block mb-1.5">Quick Sector Presets</span>
              <div className="grid grid-cols-3 gap-1.5">
                {quickJumpPresets.map((city) => (
                  <button
                    key={city.label}
                    onClick={() => {
                      setMapCenter({ lat: city.lat, lng: city.lng });
                      setMapZoom(13);
                      setInputLat(String(city.lat));
                      setInputLng(String(city.lng));
                      if (city.regionKey && onSelectRegion) {
                        onSelectRegion(city.regionKey);
                      }
                      setIsCoordinatesModalOpen(false);
                    }}
                    className="p-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#EFEAE0] border border-[#E5DECE] text-[#1C191E] text-xs font-medium text-center transition-colors cursor-pointer"
                  >
                    {city.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. MODAL: ADD / EDIT PIN LOCATION AT TARGET LOCATION           */}
      {/* ============================================================== */}
      <AddMapLocationModal
        isOpen={isAddLocationModalOpen}
        onClose={() => {
          setIsAddLocationModalOpen(false);
          setEditingNode(null);
        }}
        onAddLocation={handleAddLocation}
        onUpdateLocation={handleUpdateLocation}
        region={region}
        initialLat={pickedLocation ? pickedLocation.lat : currentTelemetry.lat}
        initialLng={pickedLocation ? pickedLocation.lng : currentTelemetry.lng}
        editNode={editingNode}
      />

    </div>
  );
};
