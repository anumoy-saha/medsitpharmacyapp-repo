
import React, { useState, useEffect, useMemo, useRef, useCallback, memo } from 'react';
import { 
  Pill, 
  Search, 
  Plus, 
  Minus,
  Trash2,
  X, 
  Stethoscope, 
  Upload, 
  Star,
  Activity,
  Camera,
  Home,
  User as UserIcon,
  Bot,
  Siren,
  ShoppingCart,
  Loader2,
  Truck,
  Map as MapIcon,
  PhoneCall,
  ChevronRight as ChevronRightIcon,
  Mic,
  SendHorizontal,
  MapPin,
  Clock,
  Video,
  Heart,
  Sparkles,
  Info,
  Check,
  CreditCard,
  ChevronRight,
  ArrowRight,
  MessageCircle,
  FileText,
  AlertTriangle,
  Zap,
  LogOut,
  RefreshCw,
  ThumbsUp,
  MessageSquare,
  Sun,
  Maximize,
  ImageIcon,
  ChevronDown,
  ShieldAlert,
  Navigation,
  Wind,
  Calendar,
  VideoIcon,
  MapPinIcon,
  CameraIcon,
  Bell,
  CheckCircle2,
  Store,
  MicOff,
  VideoOff,
  PhoneOff,
  Package,
  ShoppingBag,
  CalendarDays,
  Filter,
  ArrowUpRight,
  IndianRupee,
  Locate,
  Settings,
  UserPlus,
  Navigation2,
  Edit2,
  Wallet,
  Smartphone,
  Banknote,
  FileSearch,
  Scan,
  RefreshCcw,
  ShoppingCartIcon,
  Phone,
  Flame,
  LifeBuoy,
  Volume2,
  VolumeX,
  ShieldCheck,
  SmartphoneNfc,
  Target,
  Smile
} from 'lucide-react';
import { MEDICINES, DOCTORS, CATEGORIES, SUGGESTED_HOSPITALS } from './constants';
import { 
  Medicine, 
  CartItem, 
  User as UserType, 
  TabType, 
  Order, 
  Doctor, 
  Reminder, 
  Address, 
  AmbulanceType,
  Hospital,
  AmbulanceOrder,
  Consultation,
  EmergencyContact
} from './types';
import { analyzePrescriptionImage, getAssistantResponse } from './services/geminiService';

// --- Optimized Sub-Components ---

const MedicineCard = memo(({ med, onSelect, onAdd }: { med: Medicine, onSelect: (m: Medicine) => void, onAdd: (m: Medicine) => void }) => (
  <div className="bg-white rounded-[40px] p-4 border border-slate-50 shadow-sm flex flex-col space-y-3 group active:scale-95 transition-all">
    <div onClick={() => onSelect(med)} className="aspect-square bg-slate-50 rounded-[32px] overflow-hidden relative cursor-pointer">
      <img 
        src={med.image} 
        alt={med.name}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
      />
      {med.popular && <div className="absolute top-3 left-3 bg-blue-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full shadow-lg">Popular</div>}
    </div>
    <div className="flex-1 space-y-1">
      <h4 className="font-black text-sm text-[#101935] line-clamp-1">{med.name}</h4>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">1 Strip • 10 tabs</p>
    </div>
    <div className="flex items-center justify-between">
      <p className="font-black text-blue-600">₹{med.price}</p>
      <button 
        onClick={(e) => { e.stopPropagation(); onAdd(med); }} 
        className="w-10 h-10 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center active:bg-blue-600 active:text-white transition-colors"
      >
        <Plus size={18}/>
      </button>
    </div>
  </div>
));

const ReminderCard = memo(({ rem, onToggleTaken }: { rem: Reminder & { taken?: boolean }, onToggleTaken: (id: string) => void }) => (
  <div className="min-w-[160px] bg-white p-4 rounded-[32px] border border-slate-100 shadow-sm flex flex-col gap-3 group active:scale-95 transition-all">
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${rem.taken ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
        {rem.taken ? <Check size={20} /> : <Clock size={20} />}
      </div>
      <span className="text-[10px] font-black text-slate-400">{rem.time}</span>
    </div>
    <div>
      <h4 className={`text-xs font-black line-clamp-1 ${rem.taken ? 'text-slate-400 line-through' : 'text-[#101935]'}`}>{rem.medicineName}</h4>
      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{rem.dosage}</p>
    </div>
    <button 
      onClick={() => onToggleTaken(rem.id)}
      className={`w-full py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${rem.taken ? 'bg-slate-100 text-slate-400' : 'bg-blue-600 text-white shadow-lg shadow-blue-100'}`}
    >
      {rem.taken ? 'Taken' : 'Mark Taken'}
    </button>
  </div>
));

const ChatMessageItem = memo(({ chat }: { chat: ChatMessage }) => (
  <div className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom`}>
    <div className={`max-w-[85%] p-5 rounded-[32px] shadow-sm text-sm font-medium leading-relaxed ${chat.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-50 text-slate-800 rounded-tl-none'}`}>
      {chat.parts[0].text}
    </div>
  </div>
));

// --- Constants & Data Helpers ---

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const AMBULANCE_TYPES: AmbulanceType[] = [
  { id: 'at1', name: 'Basic life support', description: 'Standard medical transport', price: 499, icon: Truck },
  { id: 'at2', name: 'Cardiac / ACLS', description: 'Advanced emergency care', price: 1299, icon: Activity },
  { id: 'at3', name: 'Oxygen Specialized', description: 'Continuous O2 support', price: 899, icon: Wind as any },
];

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '11:00 AM', '11:30 AM',
  '02:00 PM', '02:30 PM', '03:00 PM', '05:00 PM', '06:00 PM'
];

const FREQUENCIES: Reminder['frequency'][] = ['Daily', 'Twice a Day', 'Thrice a Day'];

const App: React.FC = () => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authStep, setAuthStep] = useState<'phone' | 'name' | 'otp'>('phone');
  const [phoneInput, setPhoneInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // --- User Core State ---
  const [currentUser, setCurrentUser] = useState<UserType | null>({ 
    name: 'John Doe', 
    phone: '9876543210',
    membershipType: 'Gold',
    walletBalance: 1250,
    profilePic: 'https://i.pravatar.cc/300?u=johndoe',
    address: '42 Health St, Wellness Valley'
  });
  
  // --- Core UI Navigation ---
  const [activeTab, setActiveTab] = useState<TabType>('medicines');
  const [activeCategory, setActiveCategory] = useState<string>('fever');
  
  // --- Functional State ---
  const [cart, setCart] = useState<CartItem[]>([]);
  const [userLocation, setUserLocation] = useState('42 Health St, Wellness Valley');
  const [reminders, setReminders] = useState<(Reminder & { taken?: boolean })[]>([
    { id: '1', medicineName: 'Paracetamol', dosage: '500mg', time: '09:00', frequency: 'Daily', active: true, taken: false },
    { id: '2', medicineName: 'Evion 400mg', dosage: '1 Capsule', time: '14:00', frequency: 'Daily', active: true, taken: false }
  ]);
  const [appointments, setAppointments] = useState<Consultation[]>([]);
  
  // --- SOS Logic State ---
  const [showSOSModal, setShowSOSModal] = useState(false);
  const [sosStep, setSosStep] = useState<'menu' | 'contacts' | 'sending' | 'success'>('menu');
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { id: '1', name: 'Home / Dad', phone: '9123456781' },
    { id: '2', name: 'Dr. Aditi', phone: '9123456782' }
  ]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');

  // --- UI Toggles ---
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showAmbulanceBookingModal, setShowAmbulanceBookingModal] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [cartStep, setCartStep] = useState<'items' | 'payment'>('items');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'Wallet' | 'UPI' | 'Card' | 'COD'>('Wallet');
  const [showAddReminderModal, setShowAddReminderModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // --- Call States & Refs ---
  const [showInstantCall, setShowInstantCall] = useState(false);
  const [instantCallStatus, setInstantCallStatus] = useState<'connecting' | 'active' | 'ended'>('connecting');
  const [isMicMuted, setIsMicMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [callTime, setCallTime] = useState(0);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callTimerRef = useRef<any>(null);
  
  // --- Notification State ---
  const [lastNotifiedReminderId, setLastNotifiedReminderId] = useState<string | null>(null);

  // --- New Reminder Form State ---
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    medicineName: '',
    dosage: '',
    time: '08:00',
    frequency: 'Daily',
    active: true
  });

  // --- Checkout Form State ---
  const [deliveryNote, setDeliveryNote] = useState('');

  // --- Appointment Booking Flow State ---
  const [selectedDocForBooking, setSelectedDocForBooking] = useState<Doctor | null>(null);
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('');
  const [bookingReason, setBookingReason] = useState<string>('');
  const [bookingMode, setBookingMode] = useState<'Video' | 'In-Clinic'>('Video');
  const [isBookingInProgress, setIsBookingInProgress] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [showBookingConfirmation, setShowBookingConfirmation] = useState(false);

  // --- Doctor Search & Filters State ---
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('All');
  const [maxFee, setMaxFee] = useState(2000);
  const [minRating, setMinRating] = useState(0);

  // --- AI Assistant State ---
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [assistantInput, setAssistantInput] = useState('');
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // --- AI Rx Scanner State ---
  const [isScanning, setIsScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState<'idle' | 'scanning' | 'success' | 'error' | 'camera'>('idle');
  const [scannedItemsForReview, setScannedItemsForReview] = useState<CartItem[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- Order Tracking Logic ---
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [trackingProgress, setTrackingProgress] = useState(0);
  const [deliveryTip, setDeliveryTip] = useState(0);
  const [customTipInput, setCustomTipInput] = useState('');

  // --- Ambulance State ---
  const [ambulanceStep, setAmbulanceStep] = useState<'type' | 'destination' | 'confirm'>('type');
  const [selectedAmbType, setSelectedAmbType] = useState<AmbulanceType | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [manualHospital, setManualHospital] = useState('');
  const [activeAmbulanceOrder, setActiveAmbulanceOrder] = useState<AmbulanceOrder | null>(null);
  const [isSearchingAmbulance, setIsSearchingAmbulance] = useState(false);
  const [ambulanceProgress, setAmbulanceProgress] = useState(0);

  // --- Location Feature State ---
  const [isLocating, setIsLocating] = useState(false);
  const [manualAddress, setManualAddress] = useState(currentUser?.address || '');

  // --- Derived Memoized Data ---

  const cartTotal = useMemo(() => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0), [cart]);
  const totalItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const filteredMedicines = useMemo(() => MEDICINES.filter(m => 
    m.category === activeCategory && 
    (searchQuery === '' || m.name.toLowerCase().includes(searchQuery.toLowerCase()))
  ), [activeCategory, searchQuery]);

  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(doctorSearchQuery.toLowerCase()) ||
                            doc.specialty.toLowerCase().includes(doctorSearchQuery.toLowerCase());
      const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
      const matchesFee = doc.fee <= maxFee;
      const matchesRating = doc.rating >= minRating;
      return matchesSearch && matchesSpecialty && matchesFee && matchesRating;
    });
  }, [doctorSearchQuery, selectedSpecialty, maxFee, minRating]);

  const docSpecialties = useMemo(() => ['All', ...new Set(DOCTORS.map(d => d.specialty))], []);

  const availableSlots = useMemo(() => TIME_SLOTS, []);

  const getMapPosition = useCallback((progress: number) => {
    const startX = 60, startY = 320;
    const endX = 320, endY = 80;
    let x, y;
    if (progress < 50) {
      const p = progress * 2 / 100;
      x = startX + (120 - startX) * p;
      y = startY + (160 - startY) * p;
    } else {
      const p = (progress - 50) * 2 / 100;
      x = 120 + (endX - 120) * p;
      y = 160 + (endY - 160) * p;
    }
    return { x, y };
  }, []);

  const partnerPos = useMemo(() => getMapPosition(trackingProgress), [trackingProgress, getMapPosition]);
  const ambPos = useMemo(() => getMapPosition(100 - ambulanceProgress), [ambulanceProgress, getMapPosition]);

  const milestones = useMemo(() => [
    { title: 'Order Confirmed', description: 'Your order is verified', icon: CheckCircle2, activeAt: 0, completed: trackingProgress >= 15 },
    { title: 'Processing at Pharmacy', description: 'Packing your medicines', icon: Package, activeAt: 15, completed: trackingProgress >= 35 },
    { title: 'Driver picked up order', description: 'Amit is on his way', icon: Truck, activeAt: 35, completed: trackingProgress >= 80 },
    { title: 'Driver is near', description: 'Almost at your location', icon: MapPin, activeAt: 80, completed: trackingProgress >= 100 },
    { title: 'Delivered', description: 'Enjoy your health essentials', icon: ThumbsUp, activeAt: 100, completed: trackingProgress === 100 },
  ], [trackingProgress]);

  // --- Optimized Callbacks ---

  const addToCart = useCallback((med: Medicine) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === med.id);
      if (existing) return prev.map(c => c.id === med.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...med, quantity: 1 }];
    });
    sendPushNotification("Added to Bag! 🛒", `${med.name} is waiting for checkout.`);
  }, []);

  const addAllScannedToCart = useCallback(() => {
    setCart(prev => {
      let newCart = [...prev];
      scannedItemsForReview.forEach(item => {
        const existing = newCart.find(c => c.id === item.id);
        if (existing) {
          newCart = newCart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + item.quantity } : c);
        } else {
          newCart.push({ ...item });
        }
      });
      return newCart;
    });
    setShowPrescriptionModal(false);
    setScannedItemsForReview([]);
    setScanStatus('idle');
    sendPushNotification("Scanned Items Added! 📋", `${scannedItemsForReview.length} medicines added from prescription.`);
  }, [scannedItemsForReview]);

  const toggleReminderTaken = useCallback((id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, taken: !r.taken } : r));
  }, []);

  const removeFromCart = useCallback((id: number) => {
    setCart(prev => prev.filter(item => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  const updateScannedQuantity = useCallback((id: number, delta: number) => {
    setScannedItemsForReview(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  }, []);

  const removeFromScanned = useCallback((id: number) => {
    setScannedItemsForReview(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleSelectMedicine = useCallback((med: Medicine) => {
    setSelectedMedicine(med);
  }, []);

  const toggleReminder = useCallback((id: string) => {
    setReminders(prev => prev.map(r => r.id === id ? { ...r, active: !r.active } : r));
  }, []);

  const deleteReminder = useCallback((id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  }, []);

  const confirmAmbulanceBooking = useCallback(() => {
    if (!selectedAmbType) return;
    setIsSearchingAmbulance(true);
    setTimeout(() => {
      const newAmbulanceOrder: AmbulanceOrder = {
        id: 'AMB' + Math.floor(Math.random() * 9000 + 1000),
        type: selectedAmbType.name,
        destination: selectedHospital?.name || manualHospital || 'Emergency Center',
        driverName: 'Rajesh Khanna',
        driverPhone: '9123456780',
        driverRating: 4.9,
        driverImage: 'https://i.pravatar.cc/150?u=rajeshkhanna',
        eta: 8,
        status: 'On the way'
      };
      setActiveAmbulanceOrder(newAmbulanceOrder);
      setIsSearchingAmbulance(false);
      setShowAmbulanceBookingModal(false);
      setAmbulanceStep('type');
      setAmbulanceProgress(0);
      sendPushNotification("Ambulance Dispatched! 🚑", `A ${newAmbulanceOrder.type} is on the way to ${newAmbulanceOrder.destination}.`);
    }, 2000);
  }, [selectedAmbType, selectedHospital, manualHospital]);

  const handleCallNumber = (num: string) => {
    window.location.href = `tel:${num}`;
  };

  const detectLocation = () => {
    setIsLocating(true);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setTimeout(() => {
            const detectedAddr = `Sector ${Math.floor(latitude % 100)}, Wellness Valley, Delhi 110001`;
            setManualAddress(detectedAddr);
            setCurrentUser(prev => prev ? { ...prev, address: detectedAddr } : null);
            setIsLocating(false);
            sendPushNotification("Location Detected! 📍", `We've set your delivery address to ${detectedAddr}`);
          }, 2000);
        },
        (error) => {
          console.error("Error detecting location", error);
          setIsLocating(false);
          alert("Could not detect location. Please check your browser permissions.");
        }
      );
    } else {
      setIsLocating(false);
      alert("Geolocation is not supported by your browser.");
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setCurrentUser(prev => prev ? { ...prev, profilePic: base64 } : null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSendDistressSignal = useCallback(() => {
    setSosStep('sending');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setTimeout(() => {
            setSosStep('success');
            sendPushNotification("SOS Distress Sent! 🚨", `Your emergency contacts have been notified of your location. Help is on the way.`);
          }, 2500);
        },
        (err) => {
          setTimeout(() => {
            setSosStep('success');
            sendPushNotification("SOS Distress Sent! 🚨", "Your emergency contacts have been notified.");
          }, 2500);
        }
      );
    } else {
      setTimeout(() => {
        setSosStep('success');
        sendPushNotification("SOS Distress Sent! 🚨", "Distress message sent to your emergency circle.");
      }, 2000);
    }
  }, []);

  const addEmergencyContact = () => {
    if (!newContactName || !newContactPhone) return;
    const newContact: EmergencyContact = {
      id: Math.random().toString(36).substr(2, 9),
      name: newContactName,
      phone: newContactPhone
    };
    setEmergencyContacts(prev => [...prev, newContact]);
    setNewContactName('');
    setNewContactPhone('');
  };

  const deleteEmergencyContact = (id: string) => {
    setEmergencyContacts(prev => prev.filter(c => c.id !== id));
  };

  const handleSendOtp = () => {
    if (phoneInput.length < 10) return;
    setIsLoggingIn(true);
    setTimeout(() => { 
      if (authMode === 'signup') {
        setAuthStep('name'); 
      } else {
        setAuthStep('otp');
      }
      setIsLoggingIn(false); 
    }, 1200);
  };

  const handleGoToOtpFromSignup = () => {
    if (nameInput.length < 2) return;
    setIsLoggingIn(true);
    setTimeout(() => {
      setAuthStep('otp');
      setIsLoggingIn(false);
    }, 1000);
  };

  const handleVerifyOtp = async () => {
    if (otpInput.length < 4) return;
    setIsLoggingIn(true);
    if ("Notification" in window) {
      await Notification.requestPermission();
    }
    setTimeout(() => { 
      setCurrentUser({
        name: authMode === 'signup' ? nameInput : 'John Doe',
        phone: phoneInput,
        membershipType: 'Gold',
        walletBalance: 500,
        profilePic: `https://i.pravatar.cc/300?u=${phoneInput}`,
        address: 'Set your address'
      });
      setIsAuthenticated(true); 
      setIsLoggingIn(false); 
    }, 1500);
  };

  const handleConfirmBooking = () => {
    if (!selectedDocForBooking || !bookingDate || !bookingTime) return;
    setIsBookingInProgress(true);
    setTimeout(() => {
      const newAppointment: Consultation = {
        id: 'APT' + Math.floor(Math.random() * 90000 + 10000),
        doctorId: selectedDocForBooking.id,
        doctorName: selectedDocForBooking.name,
        specialty: selectedDocForBooking.specialty,
        date: bookingDate,
        time: bookingTime,
        reason: bookingReason,
        mode: bookingMode,
        status: 'Upcoming',
        doctorImage: selectedDocForBooking.image
      };
      setAppointments(prev => [newAppointment, ...prev]);
      setIsBookingInProgress(false);
      setBookingSuccess(true);
      sendPushNotification("Booking Confirmed! 📅", `Your consultation with ${newAppointment.doctorName} is set for ${newAppointment.date} at ${newAppointment.time}.`);
      setTimeout(() => {
        setBookingSuccess(false);
        setSelectedDocForBooking(null);
        setBookingDate('');
        setBookingTime('');
        setBookingReason('');
        setActiveTab('profile');
      }, 2000);
    }, 1500);
  };

  const handleAddReminder = () => {
    if (!newReminder.medicineName || !newReminder.dosage || !newReminder.time) {
      alert("Please fill all details");
      return;
    }
    const reminder: Reminder & { taken?: boolean } = {
      id: Math.random().toString(36).substr(2, 9),
      medicineName: newReminder.medicineName!,
      dosage: newReminder.dosage!,
      time: newReminder.time!,
      frequency: newReminder.frequency as Reminder['frequency'] || 'Daily',
      active: true,
      taken: false
    };
    setReminders(prev => [...prev, reminder]);
    setShowAddReminderModal(false);
    setNewReminder({ medicineName: '', dosage: '', time: '08:00', frequency: 'Daily', active: true });
    sendPushNotification("Reminder Set! ⏰", `We'll notify you to take ${reminder.medicineName} at ${reminder.time}.`);
    setActiveTab('reminders');
  };

  const handleAssistantSend = async () => {
    if (!assistantInput.trim() || isAssistantTyping) return;
    const userMsg: ChatMessage = { role: 'user', parts: [{ text: assistantInput }] };
    setChatHistory(prev => [...prev, userMsg]);
    setAssistantInput('');
    setIsAssistantTyping(true);
    try {
      const response = await getAssistantResponse(
        assistantInput,
        chatHistory,
        { 
          name: currentUser?.name || 'User', 
          reminders, 
          membershipType: currentUser?.membershipType || 'Basic',
          currentTime: new Date().toLocaleTimeString()
        }
      );
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: response }] }]);
    } catch (err) {
      setChatHistory(prev => [...prev, { role: 'model', parts: [{ text: "I'm having a little trouble connecting. Can you try again? 🧡" }] }]);
    } finally {
      setIsAssistantTyping(false);
    }
  };

  const handleCheckout = () => {
    setIsLoggingIn(true);
    setTimeout(() => {
      const newOrder: Order = { 
        id: 'ORD' + Math.floor(Math.random()*9000+1000), 
        date: new Date().toLocaleDateString(), 
        items: [...cart], 
        total: cartTotal + deliveryTip, 
        status: 'Processing',
        deliveryNote: deliveryNote,
        paymentMethod: selectedPaymentMethod,
        tip: deliveryTip,
        tracking: {
          partnerName: 'Amit Bansal',
          partnerPhone: '9876543210',
          partnerRating: 4.8,
          partnerImage: 'https://i.pravatar.cc/150?u=amitbansal',
          eta: 12,
          lat: 0,
          lng: 0
        }
      };
      setCart([]);
      setShowCart(false);
      setCartStep('items');
      setDeliveryNote('');
      setActiveOrder(newOrder);
      setTrackingProgress(0);
      setIsLoggingIn(false);
      sendPushNotification("Order Placed! 🛒", `Your order ${newOrder.id} for ₹${newOrder.total} is being processed via ${selectedPaymentMethod}.`);
    }, 2000);
  };

  const updateOrderTip = (amount: number) => {
    setDeliveryTip(amount);
    if (activeOrder) {
      setActiveOrder(prev => prev ? { ...prev, tip: amount, total: (prev.total - (prev.tip || 0)) + amount } : null);
    }
  };

  const startLocalVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera/mic:", err);
      alert("Failed to access camera/mic. Please check permissions.");
      setShowInstantCall(false);
    }
  };

  const stopLocalVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (userVideoRef.current) {
      userVideoRef.current.srcObject = null;
    }
  };

  const handleInstantCall = useCallback(() => {
    setInstantCallStatus('connecting');
    setShowInstantCall(true);
    setIsMicMuted(false);
    setIsVideoOff(false);
    setCallTime(0);
    startLocalVideo();
  }, []);

  const endInstantCall = useCallback(() => {
    setShowInstantCall(false);
    setInstantCallStatus('connecting');
    stopLocalVideo();
    if (callTimerRef.current) clearInterval(callTimerRef.current);
    setCallTime(0);
  }, []);

  const toggleMic = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsMicMuted(!isMicMuted);
    }
  };

  const toggleVideo = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
      });
      setIsVideoOff(!isVideoOff);
    }
  };

  const formatCallTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startCamera = async () => {
    setScanStatus('camera');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access denied", err);
      setScanStatus('idle');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const captureAndScan = async () => {
    if (!canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const base64Data = canvas.toDataURL('image/jpeg').split(',')[1];
      stopCamera();
      processPrescription(base64Data, 'image/jpeg');
    }
  };

  const processPrescription = async (base64Data: string, mimeType: string) => {
    setScanStatus('scanning');
    setIsScanning(true);
    try {
      const detectedNames = await analyzePrescriptionImage(base64Data, mimeType);
      
      // Match detected strings with our internal database
      const matches = MEDICINES.filter(med => 
        detectedNames.some(name => med.name.toLowerCase().includes(name.toLowerCase()))
      );
      
      const cartItems: CartItem[] = matches.map(m => ({ ...m, quantity: 1 }));
      setScannedItemsForReview(cartItems);
      setScanStatus(cartItems.length > 0 ? 'success' : 'error');
    } catch { 
      setScanStatus('error'); 
    } finally { 
      setIsScanning(false); 
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = (reader.result as string).split(',')[1];
      processPrescription(base64Data, file.type);
    };
    reader.readAsDataURL(file);
  };

  const sendPushNotification = (title: string, body: string) => {
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(title, {
        body: body,
        icon: "https://cdn-icons-png.flaticon.com/512/822/822143.png"
      });
    }
  };

  const saveAddress = () => {
    if (!manualAddress.trim()) return;
    setCurrentUser(prev => prev ? { ...prev, address: manualAddress } : null);
    setShowAddressModal(false);
    sendPushNotification("Address Saved! 🏠", `Deliveries will now go to: ${manualAddress}`);
  };

  // Sync local preview whenever video tag remounts
  useEffect(() => {
    if (showInstantCall && !isVideoOff && userVideoRef.current && localStreamRef.current) {
      userVideoRef.current.srcObject = localStreamRef.current;
    }
  }, [showInstantCall, isVideoOff]);

  useEffect(() => {
    if (activeAmbulanceOrder && activeAmbulanceOrder.status !== 'Reached') {
      const interval = setInterval(() => {
        setAmbulanceProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setActiveAmbulanceOrder(curr => curr ? { ...curr, status: 'Reached' } : null);
            sendPushNotification("Ambulance Arrived! 🚑", "Your emergency response team has reached your location.");
            return 100;
          }
          return prev + 1.5;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [activeAmbulanceOrder?.id]);

  useEffect(() => {
    if (showInstantCall && instantCallStatus === 'connecting') {
      const timer = setTimeout(() => {
        setInstantCallStatus('active');
        callTimerRef.current = setInterval(() => {
          setCallTime(prev => prev + 1);
        }, 1000);
      }, 3000);
      return () => clearTimeout(timer);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [showInstantCall, instantCallStatus]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      const now = new Date();
      const currentHHmm = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      reminders.forEach(rem => {
        if (rem.active && rem.time === currentHHmm && lastNotifiedReminderId !== `${rem.id}-${currentHHmm}`) {
          sendPushNotification(`Time for your medicine! 💊`, `Please take your ${rem.medicineName} (${rem.dosage}).`);
          setLastNotifiedReminderId(`${rem.id}-${currentHHmm}`);
        }
      });
    }, 30000);
    return () => clearInterval(interval);
  }, [reminders, isAuthenticated, lastNotifiedReminderId]);

  useEffect(() => {
    if (activeOrder && activeOrder.status !== 'Delivered') {
      const interval = setInterval(() => {
        setTrackingProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setActiveOrder(current => {
              if (current && current.status !== 'Delivered') {
                sendPushNotification("Order Delivered! 🎉", `Your order ${current.id} has arrived.`);
                return { ...current, status: 'Delivered' };
              }
              return current;
            });
            return 100;
          }
          return prev + 5;
        });
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [activeOrder?.id]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-8 animate-in fade-in">
        <div className="w-24 h-24 bg-blue-600 rounded-[32px] flex items-center justify-center text-white shadow-2xl mb-8 active:scale-90 transition-transform">
          <Pill size={48} fill="white" />
        </div>
        
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-[#101935] mb-2 tracking-tighter">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-400 font-bold text-sm uppercase tracking-widest">
            {authMode === 'login' ? 'Log in to continue' : 'Join the Medsit community'}
          </p>
        </div>

        <div className="w-full max-w-sm space-y-8">
          {authStep === 'phone' && (
            <div className="space-y-6 animate-in slide-in-from-bottom">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-4">Mobile Number</label>
                <div className="flex bg-slate-50 rounded-[28px] border border-slate-100 overflow-hidden focus-within:border-blue-600 focus-within:ring-4 ring-blue-500/5 transition-all">
                  <div className="px-6 py-5 border-r border-slate-200 text-slate-400 font-black">+91</div>
                  <input 
                    type="tel" 
                    placeholder="9876543210" 
                    className="flex-1 bg-transparent px-6 py-5 font-black outline-none" 
                    value={phoneInput} 
                    onChange={e => setPhoneInput(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                  />
                </div>
              </div>
              <button 
                onClick={handleSendOtp} 
                disabled={phoneInput.length < 10 || isLoggingIn} 
                className="w-full bg-blue-600 text-white py-6 rounded-[32px] font-black text-xl shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
              >
                {isLoggingIn ? <Loader2 className="animate-spin" /> : <>Continue <ArrowRight size={20}/></>}
              </button>
            </div>
          )}

          {authStep === 'name' && (
            <div className="space-y-6 animate-in slide-in-from-right">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-4">What's your name?</label>
                <div className="flex bg-slate-50 rounded-[28px] border border-slate-100 overflow-hidden focus-within:border-blue-600 transition-all">
                  <input 
                    type="text" 
                    placeholder="e.g. John Doe" 
                    className="w-full bg-transparent px-8 py-5 font-black outline-none" 
                    value={nameInput} 
                    onChange={e => setNameInput(e.target.value)} 
                  />
                </div>
              </div>
              <button 
                onClick={handleGoToOtpFromSignup} 
                disabled={nameInput.length < 2 || isLoggingIn} 
                className="w-full bg-blue-600 text-white py-6 rounded-[32px] font-black text-xl shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
              >
                {isLoggingIn ? <Loader2 className="animate-spin" /> : <>Send OTP <ArrowRight size={20}/></>}
              </button>
            </div>
          )}

          {authStep === 'otp' && (
            <div className="space-y-8 animate-in slide-in-from-right">
              <div className="text-center space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Code sent to +91 {phoneInput}</p>
                <input 
                  type="text" 
                  placeholder="0000" 
                  className="w-full bg-slate-50 rounded-[28px] border border-slate-100 px-8 py-6 font-black text-center text-4xl tracking-[0.5em] outline-none focus:border-blue-600 transition-all" 
                  value={otpInput} 
                  onChange={e => setOtpInput(e.target.value.replace(/\D/g, '').slice(0, 4))} 
                />
              </div>
              <button 
                onClick={handleVerifyOtp} 
                disabled={otpInput.length < 4 || isLoggingIn} 
                className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-xl shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
              >
                {isLoggingIn ? <Loader2 className="animate-spin" /> : 'Verify & Enter'}
              </button>
              <div className="flex flex-col items-center gap-4">
                <button onClick={() => setAuthStep('phone')} className="text-blue-600 font-black text-[10px] uppercase tracking-[0.2em] hover:underline">Change Phone Number</button>
                <button className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Resend Code in 45s</button>
              </div>
            </div>
          )}

          <div className="pt-6 text-center">
            <button 
              onClick={() => {
                setAuthMode(authMode === 'login' ? 'signup' : 'login');
                setAuthStep('phone');
              }}
              className="text-[#101935] font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 mx-auto group"
            >
              {authMode === 'login' ? 'New to Medsit? ' : 'Already have an account? '}
              <span className="text-blue-600 group-hover:underline">
                {authMode === 'login' ? 'Create Account' : 'Login'}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF] text-slate-900 font-sans pb-32 overflow-x-hidden">
      
      {/* Main Header */}
      {!activeOrder && !activeAmbulanceOrder && !showSOSModal && !selectedDocForBooking && !showInstantCall && !showAddressModal && (
        <header className="px-6 pt-12 pb-6 sticky top-0 bg-[#F8FAFF]/90 backdrop-blur-xl z-[2000] border-b border-slate-100/50">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 mb-1 opacity-60"><div className="w-4 h-4 bg-blue-600 rounded flex items-center justify-center text-white"><Pill size={10} fill="white" /></div><h1 className="text-[9px] font-black text-[#101935] uppercase tracking-[0.1em]">Medsit Health</h1></div>
              <div className="flex items-baseline gap-2"><h2 className="text-3xl font-black text-[#101935] tracking-tighter">12 MINS</h2><div className="flex items-center gap-1 bg-emerald-100 px-2 py-0.5 rounded-full"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /><span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Arrival</span></div></div>
              <button onClick={() => { setShowAddressModal(true); setManualAddress(currentUser?.address || ''); }} className="flex items-center gap-1.5 mt-0.5 text-[12px] font-black text-slate-500 truncate max-w-[180px] hover:text-blue-600 transition-colors active:scale-95">
                <MapPin size={12} className="text-blue-500" /> 
                <span className="truncate">{currentUser?.address || "Set Address"}</span>
                <ChevronDown size={12} className="text-slate-300" />
              </button>
            </div>
            <div className="flex items-center gap-3 self-end mb-1">
               <button onClick={() => { setShowCart(true); setCartStep('items'); }} className="relative w-11 h-11 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-600 shadow-sm active:scale-95 transition-all">
                  {totalItems > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full border-2 border-white flex items-center justify-center text-[10px] text-white font-bold">{totalItems}</div>}
                  <ShoppingCart size={20} />
               </button>
               <button onClick={() => { setActiveTab('profile'); }} className="w-11 h-11 bg-blue-100 rounded-2xl overflow-hidden shadow-md border-2 border-white active:scale-95 transition-all">
                <img src={currentUser?.profilePic} loading="lazy" decoding="async" className="w-full h-full object-cover" />
               </button>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main className="px-6">
        {activeTab === 'medicines' && (
          <div className="space-y-8 pt-4">
            <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} /><input type="text" placeholder="Search medicines..." className="w-full bg-white border border-slate-100 rounded-[24px] py-4 pl-12 pr-4 shadow-sm outline-none font-medium focus:ring-2 ring-blue-500/10" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} /></div>
            
            <section className="space-y-4">
              <h3 className="font-black text-lg text-[#101935]">Quick Services</h3>
              <div className="grid grid-cols-3 gap-4">
                <button onClick={() => setShowAmbulanceBookingModal(true)} className="group relative p-5 bg-blue-50/50 rounded-[32px] border border-blue-100/50 active:scale-95 transition-all text-center flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-white text-blue-600 rounded-2xl flex items-center justify-center shadow-md shadow-blue-100 transition-transform group-hover:scale-110"><Siren size={30} strokeWidth={2.5}/></div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-blue-700">Ambulance</span>
                </button>
                <button onClick={() => { setSosStep('menu'); setShowSOSModal(true); }} className="group relative p-5 bg-rose-50/50 rounded-[32px] border border-rose-100/50 active:scale-95 transition-all text-center flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-white text-rose-600 rounded-2xl flex items-center justify-center shadow-md shadow-rose-100 transition-transform group-hover:scale-110"><ShieldAlert size={30} strokeWidth={2.5}/></div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-rose-700">SOS Help</span>
                </button>
                <button onClick={() => setShowPrescriptionModal(true)} className="group relative p-5 bg-purple-50/50 rounded-[32px] border border-purple-100/50 active:scale-95 transition-all text-center flex flex-col items-center gap-3">
                  <div className="w-14 h-14 bg-white text-purple-600 rounded-2xl flex items-center justify-center shadow-md shadow-purple-100 transition-transform group-hover:scale-110"><CameraIcon size={30} strokeWidth={2.5}/></div>
                  <span className="text-[11px] font-black uppercase tracking-widest text-purple-700">AI Scan</span>
                </button>
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-black text-lg text-[#101935]">Daily Reminders</h3>
                <button onClick={() => setActiveTab('reminders')} className="text-blue-600 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">Manage <ChevronRight size={12}/></button>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar py-1 -mx-2 px-2">
                {reminders.filter(r => r.active).map(rem => (
                  <ReminderCard key={rem.id} rem={rem} onToggleTaken={toggleReminderTaken} />
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <div className="flex items-center justify-between"><h3 className="font-black text-lg text-[#101935]">Shop by Category</h3></div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar py-2 -mx-2 px-2">
                {CATEGORIES.map(cat => (
                  <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-3 rounded-[24px] font-black text-[11px] uppercase tracking-widest flex items-center gap-2 transition-all whitespace-nowrap shadow-sm border ${activeCategory === cat.id ? 'bg-blue-600 text-white border-blue-600 shadow-blue-100' : 'bg-white text-slate-400 border-slate-50'}`}>{cat.icon} {cat.name}</button>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-2 gap-4">
              {filteredMedicines.map(med => (
                <MedicineCard key={med.id} med={med} onSelect={handleSelectMedicine} onAdd={addToCart} />
              ))}
            </section>
          </div>
        )}

        {activeTab === 'doctors' && (
          <div className="space-y-8 pt-4">
            <div className="bg-gradient-to-br from-rose-600 to-red-500 rounded-[48px] p-8 text-white space-y-4 relative overflow-hidden shadow-2xl shadow-red-200">
              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none"><Video size={120} /></div>
              <div className="relative z-10 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border border-white/20">Urgent</span>
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest animate-pulse">Live</span>
                </div>
                <h3 className="text-2xl font-black tracking-tighter">Instant Video Call</h3>
                <p className="text-red-50 text-[11px] font-bold uppercase tracking-widest leading-relaxed">Consult with a general physician <br/> within 60 seconds • <span className="underline decoration-2">FREE</span></p>
              </div>
              <button 
                onClick={handleInstantCall}
                className="relative z-20 bg-white text-red-600 px-6 py-3 rounded-full font-black text-[11px] uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2"
              >
                Connect Now <Activity size={14} />
              </button>
            </div>
            
            <section className="space-y-6">
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                <input 
                  type="text" 
                  placeholder="Search by name or specialty..." 
                  className="w-full bg-white border border-slate-100 rounded-[28px] py-5 pl-14 pr-6 shadow-sm outline-none font-bold text-sm focus:ring-4 ring-blue-500/5 transition-all"
                  value={doctorSearchQuery}
                  onChange={e => setDoctorSearchQuery(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Specialty</h4>
                <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-6 px-6 py-1">
                  {docSpecialties.map(spec => (
                    <button 
                      key={spec} 
                      onClick={() => setSelectedSpecialty(spec)}
                      className={`px-6 py-3.5 rounded-[22px] font-black text-[11px] uppercase tracking-widest transition-all whitespace-nowrap border ${selectedSpecialty === spec ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100 scale-105' : 'bg-white text-slate-400 border-slate-100 hover:border-blue-200'}`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Experience</h4>
                  <div className="flex gap-2">
                    {[0, 4.5, 4.8].map(r => (
                      <button 
                        key={r} 
                        onClick={() => setMinRating(r)}
                        className={`flex-1 py-3 rounded-2xl border font-black text-[10px] uppercase transition-all flex items-center justify-center gap-1.5 ${minRating === r ? 'bg-amber-100 border-amber-400 text-amber-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400'}`}
                      >
                        <Star size={10} fill={minRating === r ? "currentColor" : "none"} /> {r === 0 ? 'All' : `${r}+`}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Max Fee</h4>
                  <div className="flex gap-2">
                    {[500, 1000, 2000].map(f => (
                      <button 
                        key={f} 
                        onClick={() => setMaxFee(f)}
                        className={`flex-1 py-3 rounded-2xl border font-black text-[10px] uppercase transition-all flex items-center justify-center gap-1 ${maxFee === f ? 'bg-emerald-100 border-emerald-400 text-emerald-700 shadow-sm' : 'bg-white border-slate-100 text-slate-400'}`}
                      >
                        <IndianRupee size={10} /> {f === 2000 ? 'Any' : `<${f}`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between px-2">
                  <h3 className="font-black text-lg text-[#101935]">Available Doctors</h3>
                  <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-3 py-1 rounded-full uppercase">{filteredDoctors.length} found</span>
                </div>
                {filteredDoctors.length > 0 ? (
                  filteredDoctors.map(doc => (
                    <div key={doc.id} onClick={() => setSelectedDocForBooking(doc)} className="bg-white p-5 rounded-[40px] border border-slate-50 shadow-sm flex items-center justify-between group active:scale-[0.98] cursor-pointer transition-all hover:shadow-md hover:border-blue-100">
                      <div className="flex items-center gap-5">
                        <div className="w-20 h-20 rounded-[28px] overflow-hidden shadow-inner bg-slate-50">
                          <img src={doc.image} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="font-black text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{doc.name}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.specialty}</p>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-amber-500 gap-1"><Star size={12} fill="currentColor" /><span className="text-xs font-black">{doc.rating}</span></div>
                            <div className="w-1 h-1 bg-slate-200 rounded-full" />
                            <p className="text-xs font-black text-blue-600">₹{doc.fee}</p>
                          </div>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-slate-50 text-blue-600 rounded-2xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg transition-all group-hover:rotate-[-5deg]">
                        <ArrowUpRight size={22}/>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="bg-white p-12 rounded-[48px] border-2 border-dashed border-slate-100 text-center space-y-4 animate-in fade-in">
                    <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-[32px] flex items-center justify-center mx-auto">
                      <Search size={40}/>
                    </div>
                    <div className="space-y-1">
                      <p className="text-slate-900 font-black">No doctors found</p>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Try adjusting your filters</p>
                    </div>
                    <button 
                      onClick={() => { setDoctorSearchQuery(''); setSelectedSpecialty('All'); setMaxFee(2000); setMinRating(0); }}
                      className="text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] pt-2"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}

        {activeTab === 'assistant' && (
          <div className="flex flex-col h-[75vh] space-y-4 pt-4">
             <div className="flex-1 bg-white rounded-[48px] shadow-sm border border-slate-50 p-6 flex flex-col space-y-4 overflow-hidden relative">
                <div className="absolute top-0 left-0 right-0 p-4 border-b border-slate-50 bg-white/50 backdrop-blur flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center animate-pulse"><Bot size={20}/></div>
                  <div><h3 className="font-black text-sm">Medsit Assistant</h3><div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /><span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active Now</span></div></div>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar pt-16 space-y-6">
                  {chatHistory.length === 0 && (
                    <div className="text-center py-10 space-y-4 animate-in fade-in">
                       <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[24px] flex items-center justify-center mx-auto"><Bot size={32}/></div>
                       <div className="space-y-2 px-6">
                         <h4 className="font-black text-lg text-slate-900">Hello, {currentUser?.name}!</h4>
                         <p className="text-slate-400 text-xs font-medium leading-relaxed">I'm your health companion. Ask me anything about meds, symptoms, or health tips! 🧡</p>
                       </div>
                    </div>
                  )}
                  {chatHistory.map((chat, i) => (
                    <ChatMessageItem key={i} chat={chat} />
                  ))}
                  {isAssistantTyping && (
                    <div className="flex justify-start animate-pulse">
                      <div className="bg-slate-50 p-5 rounded-[32px] rounded-tl-none flex gap-1.5 items-center">
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '0ms'}} />
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '200ms'}} />
                        <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{animationDelay: '400ms'}} />
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>
             </div>
             <div className="flex gap-3 bg-white p-3 rounded-[32px] border border-slate-50 shadow-lg">
                <input type="text" placeholder="Ask Medsit AI..." className="flex-1 bg-slate-50/50 rounded-[24px] px-6 py-4 font-bold text-sm outline-none" value={assistantInput} onChange={e => setAssistantInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleAssistantSend()} />
                <button onClick={handleAssistantSend} disabled={!assistantInput.trim() || isAssistantTyping} className="w-14 h-14 bg-blue-600 text-white rounded-[24px] flex items-center justify-center shadow-xl active:scale-90 transition-all disabled:opacity-50"><SendHorizontal size={24}/></button>
             </div>
          </div>
        )}

        {activeTab === 'reminders' && (
          <div className="space-y-8 pt-4">
             <div className="flex items-center justify-between"><h3 className="font-black text-2xl text-[#101935] tracking-tighter">My Schedule</h3><button onClick={() => setShowAddReminderModal(true)} className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-slate-100 active:scale-90 transition-all"><Plus size={24}/></button></div>
             <div className="space-y-4 pb-4">
               {reminders.length === 0 ? (
                 <div className="bg-white p-12 rounded-[48px] border border-slate-50 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-[32px] flex items-center justify-center mx-auto"><Clock size={40}/></div>
                    <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No reminders set</p>
                 </div>
               ) : (
                 reminders.map(rem => (
                   <div key={rem.id} className="bg-white p-6 rounded-[40px] border border-slate-50 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
                      <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors ${rem.active ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-300'}`}><Clock size={28}/></div>
                        <div className="space-y-1">
                          <h4 className={`font-black text-lg transition-colors ${rem.active ? (rem.taken ? 'text-slate-400 line-through' : 'text-slate-900') : 'text-slate-400 line-through'}`}>{rem.medicineName}</h4>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{rem.dosage} • {rem.time} • {rem.frequency}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button onClick={() => toggleReminderTaken(rem.id)} className={`p-2 rounded-lg transition-colors ${rem.taken ? 'text-emerald-600 bg-emerald-50' : 'text-slate-300 bg-slate-50'}`}><CheckCircle2 size={24}/></button>
                        <button onClick={() => toggleReminder(rem.id)} className={`w-12 h-6 rounded-full relative transition-colors ${rem.active ? 'bg-blue-600' : 'bg-slate-200'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${rem.active ? 'right-1' : 'left-1'}`} /></button>
                        <button onClick={() => deleteReminder(rem.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={20}/></button>
                      </div>
                   </div>
                 ))
               )}
             </div>
          </div>
        )}

        {activeTab === 'profile' && (
           <div className="space-y-8 pt-4">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[48px] overflow-hidden shadow-2xl border-4 border-white bg-slate-100">
                    <img src={currentUser?.profilePic} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                  </div>
                  <label className="absolute inset-0 bg-black/20 rounded-[48px] flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <Edit2 className="text-white" size={24} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleProfileImageChange} />
                  </label>
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg border-2 border-white"><Zap size={20} fill="white" /></div>
                </div>
                <div><h3 className="text-3xl font-black text-[#101935] tracking-tighter">{currentUser?.name}</h3><div className="flex items-center justify-center gap-2 mt-1"><div className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-[9px] font-black uppercase border border-amber-200">{currentUser?.membershipType} Member</div><div className="w-1 h-1 bg-slate-200 rounded-full" /><p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{currentUser?.phone}</p></div></div>
              </div>
              <div className="bg-slate-900 rounded-[48px] p-8 text-white flex items-center justify-between shadow-2xl">
                 <div className="space-y-1"><p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Wallet Balance</p><h4 className="text-3xl font-black tracking-tighter">₹{currentUser?.walletBalance.toLocaleString()}</h4></div>
                 <button className="bg-white/10 hover:bg-white/20 px-6 py-4 rounded-[24px] font-black text-[11px] uppercase tracking-widest border border-white/10 transition-all">+ Add Cash</button>
              </div>
              <div className="space-y-3">
                 {[
                   { icon: FileText, label: 'Order History', color: 'blue' },
                   { icon: MessageCircle, label: 'Help & Support', color: 'purple' },
                   { icon: Heart, label: 'Saved Items', color: 'rose' },
                   { icon: Activity, label: 'Medical Records', color: 'emerald' },
                   { icon: LogOut, label: 'Logout', color: 'slate' }
                 ].map((item, idx) => (
                   <button key={idx} onClick={() => item.label === 'Logout' && setIsAuthenticated(false)} className="w-full bg-white p-6 rounded-[32px] border border-slate-50 flex items-center justify-between active:scale-[0.98] transition-all shadow-sm group">
                      <div className="flex items-center gap-5">
                         <div className={`w-12 h-12 bg-${item.color}-50 text-${item.color}-600 rounded-2xl flex items-center justify-center group-hover:bg-${item.color}-600 group-hover:text-white transition-colors`}><item.icon size={24}/></div>
                         <span className="font-black text-slate-900">{item.label}</span>
                      </div>
                      <ChevronRightIcon size={20} className="text-slate-300" />
                   </button>
                 ))}
              </div>
           </div>
        )}
      </main>

      {/* MODALS & OVERLAYS */}

      {/* ADDRESS MANAGEMENT MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-[12000] bg-slate-900/60 backdrop-blur-xl flex items-end">
           <div className="w-full bg-white rounded-t-[60px] p-8 animate-in slide-in-from-bottom flex flex-col space-y-8 max-h-[95vh] overflow-y-auto no-scrollbar shadow-2xl">
              <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                    <MapPinIcon size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Delivery Location</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Where should we send your meds?</p>
                  </div>
                </div>
                <button onClick={() => setShowAddressModal(false)} className="p-4 bg-slate-50 rounded-full active:scale-90 transition-all hover:bg-slate-100"><X /></button>
              </div>

              <div className="space-y-8 animate-in fade-in">
                 <button 
                  onClick={detectLocation}
                  disabled={isLocating}
                  className="w-full p-8 bg-blue-50 rounded-[40px] border-2 border-blue-100 flex items-center justify-between group active:scale-95 transition-all relative overflow-hidden"
                 >
                   <div className="flex items-center gap-6 relative z-10">
                     <div className="w-16 h-16 bg-white rounded-[28px] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                       {isLocating ? <Loader2 size={32} className="text-blue-600 animate-spin" /> : <Target size={32} className="text-blue-600" />}
                     </div>
                     <div className="text-left">
                       <h4 className="text-xl font-black text-blue-900">{isLocating ? 'Locating...' : 'Use Current Location'}</h4>
                       <p className="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Automatic via Geolocation</p>
                     </div>
                   </div>
                   <Navigation2 size={32} className="text-blue-200 group-hover:text-blue-600 transition-colors" />
                 </button>

                 <div className="space-y-4">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Manual Entry</label>
                    <div className="relative group">
                       <textarea 
                        placeholder="House No, Floor, Street Name, Landmark..." 
                        rows={4}
                        className="w-full bg-slate-50 rounded-[40px] p-8 font-black text-slate-900 outline-none focus:ring-4 ring-blue-500/5 border border-slate-100 transition-all resize-none"
                        value={manualAddress}
                        onChange={e => setManualAddress(e.target.value)}
                       />
                       <Edit2 className="absolute top-8 right-8 text-slate-200 group-focus-within:text-blue-600 transition-colors" size={24} />
                    </div>
                 </div>

                 <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-4">Saved Addresses</h4>
                    <div className="grid grid-cols-1 gap-4">
                       {[
                         { label: 'Home', icon: Home, addr: '42 Health St, Wellness Valley, Sector 4' },
                         { label: 'Office', icon: Store, addr: 'Tech Park South, Block B, Floor 12' }
                       ].map((item, idx) => (
                         <button 
                          key={idx} 
                          onClick={() => setManualAddress(item.addr)}
                          className="p-6 bg-white border border-slate-100 rounded-[32px] flex items-center gap-5 active:bg-slate-50 transition-all group"
                         >
                            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                              <item.icon size={24} />
                            </div>
                            <div className="text-left flex-1">
                               <h5 className="font-black text-slate-900 text-sm">{item.label}</h5>
                               <p className="text-slate-400 text-xs truncate max-w-[200px]">{item.addr}</p>
                            </div>
                            <CheckCircle2 size={24} className={`${manualAddress === item.addr ? 'text-emerald-500' : 'text-slate-100'}`} />
                         </button>
                       ))}
                    </div>
                 </div>

                 <div className="pt-4">
                    <button 
                      onClick={saveAddress}
                      disabled={!manualAddress.trim()}
                      className="w-full bg-slate-900 text-white py-7 rounded-[40px] font-black text-xl shadow-2xl active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
                    >
                      Save Address <ShieldCheck size={24} />
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* SOS HELP MODAL */}
      {showSOSModal && (
        <div className="fixed inset-0 z-[10000] bg-rose-950/80 backdrop-blur-2xl flex items-end">
           <div className="w-full bg-white rounded-t-[60px] p-8 animate-in slide-in-from-bottom flex flex-col space-y-8 max-h-[95vh] overflow-y-auto no-scrollbar shadow-[0_-20px_60px_rgba(225,29,72,0.3)]">
              <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-100">
                    <ShieldAlert size={32} strokeWidth={2.5}/>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">SOS Help</h3>
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Immediate Emergency Response</p>
                  </div>
                </div>
                <button onClick={() => { setShowSOSModal(false); setSosStep('menu'); }} className="p-4 bg-slate-50 rounded-full active:scale-90 transition-all hover:bg-slate-100"><X /></button>
              </div>

              {sosStep === 'menu' && (
                <div className="grid grid-cols-1 gap-5 animate-in fade-in">
                  <button onClick={handleSendDistressSignal} className="p-8 bg-rose-600 text-white rounded-[40px] flex items-center justify-between shadow-2xl shadow-rose-500/30 group active:scale-95 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white/20 rounded-[28px] flex items-center justify-center group-hover:scale-110 transition-transform"><Navigation size={32} fill="white" /></div>
                      <div className="text-left"><h4 className="text-xl font-black">Alert Emergency Circle</h4><p className="text-rose-100 text-[10px] font-bold uppercase tracking-widest">Share location with family</p></div>
                    </div>
                    <ChevronRight size={32} className="opacity-50" />
                  </button>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => handleCallNumber('102')} className="p-6 bg-slate-900 text-white rounded-[40px] flex flex-col items-center gap-4 active:scale-95 transition-all">
                       <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center"><PhoneCall size={28} /></div>
                       <div className="text-center"><h5 className="font-black">Call 102</h5><p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Govt. Ambulance</p></div>
                    </button>
                    <button onClick={() => setSosStep('contacts')} className="p-6 bg-white border-2 border-slate-100 rounded-[40px] flex flex-col items-center gap-4 active:scale-95 transition-all">
                       <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center"><UserPlus size={28} /></div>
                       <div className="text-center"><h5 className="font-black text-slate-900">Emergency Contacts</h5><p className="text-slate-400 text-[9px] font-bold uppercase tracking-widest">Edit Circle</p></div>
                    </button>
                  </div>
                </div>
              )}

              {sosStep === 'contacts' && (
                <div className="space-y-6 animate-in slide-in-from-right">
                  <div className="space-y-4">
                    <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-2">Your Emergency Circle</h4>
                    {emergencyContacts.map(contact => (
                      <div key={contact.id} className="bg-slate-50 p-5 rounded-[32px] flex items-center justify-between border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-slate-400 shadow-inner">{contact.name[0]}</div>
                          <div><h5 className="font-black text-slate-900">{contact.name}</h5><p className="text-xs font-bold text-slate-400 tracking-tight">{contact.phone}</p></div>
                        </div>
                        <button onClick={() => deleteEmergencyContact(contact.id)} className="p-3 text-rose-300 hover:text-rose-600 transition-colors"><Trash2 size={20}/></button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white border-2 border-dashed border-slate-100 p-6 rounded-[40px] space-y-4">
                     <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-widest text-center">Add New Contact</h4>
                     <div className="space-y-3">
                       <input type="text" placeholder="Full Name" className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:ring-2 ring-blue-500/10" value={newContactName} onChange={e => setNewContactName(e.target.value)} />
                       <input type="tel" placeholder="Phone Number" className="w-full bg-slate-50 rounded-2xl px-6 py-4 font-bold text-sm outline-none focus:ring-2 ring-blue-500/10" value={newContactPhone} onChange={e => setNewContactPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} />
                       <button onClick={addEmergencyContact} disabled={!newContactName || newContactPhone.length < 10} className="w-full bg-blue-600 text-white py-4 rounded-[28px] font-black text-sm uppercase tracking-widest active:scale-95 disabled:opacity-50 transition-all">+ Link to Circle</button>
                     </div>
                  </div>
                  <button onClick={() => setSosStep('menu')} className="w-full text-slate-400 font-black text-xs uppercase tracking-widest py-2">Back to Menu</button>
                </div>
              )}

              {sosStep === 'sending' && (
                <div className="py-16 flex flex-col items-center justify-center space-y-10 animate-in zoom-in">
                  <div className="relative">
                    <div className="w-32 h-32 bg-rose-600 rounded-[48px] flex items-center justify-center text-white relative z-10 shadow-[0_0_60px_rgba(225,29,72,0.4)]">
                      <Siren size={64} className="animate-pulse" />
                    </div>
                    <div className="absolute inset-0 bg-rose-600/30 rounded-[48px] animate-ping" />
                    <div className="absolute inset-0 bg-rose-600/20 rounded-[48px] animate-ping" style={{animationDelay: '500ms'}} />
                  </div>
                  <div className="text-center space-y-3">
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">Broadcasting SOS...</h4>
                    <div className="flex items-center justify-center gap-2 text-rose-600 font-black text-xs uppercase tracking-[0.2em]">
                       <div className="w-1.5 h-1.5 bg-rose-600 rounded-full animate-pulse" /> Encrypted Distress Signal
                    </div>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest pt-4 leading-relaxed">
                      Coordinates: 28.6139° N, 77.2090° E <br/>
                      Alerting {emergencyContacts.length} emergency contacts
                    </p>
                  </div>
                </div>
              )}

              {sosStep === 'success' && (
                <div className="py-16 flex flex-col items-center justify-center space-y-10 animate-in zoom-in">
                  <div className="w-32 h-32 bg-emerald-500 rounded-[48px] flex items-center justify-center text-white shadow-2xl shadow-emerald-500/20">
                    <ShieldCheck size={64} />
                  </div>
                  <div className="text-center space-y-3">
                    <h4 className="text-3xl font-black text-[#101935] tracking-tighter">Signal Received</h4>
                    <p className="text-slate-500 text-sm font-medium px-10 leading-relaxed">Your emergency contacts have been notified. Please stay calm and find a safe spot. Help is on the way.</p>
                  </div>
                  <button onClick={() => { setShowSOSModal(false); setSosStep('menu'); }} className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-lg shadow-xl active:scale-95 transition-all">I am safe now</button>
                </div>
              )}
           </div>
        </div>
      )}

      {/* NEW REMINDER MODAL */}
      {showAddReminderModal && (
        <div className="fixed inset-0 z-[9000] bg-slate-900/60 backdrop-blur-xl flex items-end">
           <div className="w-full bg-white rounded-t-[56px] p-10 animate-in slide-in-from-bottom flex flex-col space-y-8 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
              <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                    <Clock size={32} />
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight">Set Reminder</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Never miss a dose again</p>
                  </div>
                </div>
                <button onClick={() => setShowAddReminderModal(false)} className="p-4 bg-slate-50 rounded-full active:scale-90 transition-all"><X /></button>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Medicine Name</label>
                   <div className="relative">
                      <Pill className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                      <input 
                        type="text" 
                        placeholder="e.g. Crocin Advance" 
                        className="w-full bg-slate-50 rounded-[28px] py-5 pl-16 pr-8 font-black text-slate-900 outline-none focus:ring-4 ring-blue-500/5 transition-all"
                        value={newReminder.medicineName}
                        onChange={e => setNewReminder({...newReminder, medicineName: e.target.value})}
                      />
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Dosage</label>
                      <input 
                        type="text" 
                        placeholder="1 Tablet" 
                        className="w-full bg-slate-50 rounded-[28px] py-5 px-8 font-black text-slate-900 outline-none focus:ring-4 ring-blue-500/5 transition-all"
                        value={newReminder.dosage}
                        onChange={e => setNewReminder({...newReminder, dosage: e.target.value})}
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Time</label>
                      <input 
                        type="time" 
                        className="w-full bg-slate-50 rounded-[28px] py-5 px-8 font-black text-slate-900 outline-none focus:ring-4 ring-blue-500/5 transition-all"
                        value={newReminder.time}
                        onChange={e => setNewReminder({...newReminder, time: e.target.value})}
                      />
                   </div>
                </div>

                <div className="space-y-3">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-4">Frequency</label>
                   <div className="flex gap-2">
                      {FREQUENCIES.map(freq => (
                        <button 
                          key={freq} 
                          onClick={() => setNewReminder({...newReminder, frequency: freq})}
                          className={`flex-1 py-4 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest transition-all ${newReminder.frequency === freq ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105' : 'bg-white border-slate-50 text-slate-400 hover:border-slate-200'}`}
                        >
                          {freq}
                        </button>
                      ))}
                   </div>
                </div>

                <div className="pt-6">
                   <button 
                    onClick={handleAddReminder} 
                    disabled={!newReminder.medicineName || !newReminder.dosage || !newReminder.time}
                    className="w-full bg-blue-600 text-white py-6 rounded-[32px] font-black text-xl shadow-2xl shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     Save Reminder <ArrowRight size={24} />
                   </button>
                </div>
              </div>
           </div>
        </div>
      )}

      {/* INSTANT VIDEO CALL OVERLAY */}
      {showInstantCall && (
        <div className="fixed inset-0 z-[9999] bg-slate-900 flex flex-col animate-in fade-in overflow-hidden">
          {instantCallStatus === 'connecting' ? (
            <div className="flex-1 flex flex-col items-center justify-center space-y-10 animate-in fade-in">
              <div className="relative">
                <div className="w-48 h-48 bg-rose-600 rounded-full flex items-center justify-center text-white shadow-[0_0_80px_rgba(225,29,72,0.4)]">
                   <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 relative">
                      <img src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-rose-600/20 animate-pulse" />
                   </div>
                </div>
                <div className="absolute inset-0 border-8 border-rose-500/20 rounded-full animate-ping" />
                <div className="absolute inset-0 border-8 border-rose-500/10 rounded-full animate-ping" style={{ animationDelay: '500ms' }} />
              </div>
              <div className="text-center space-y-4 px-10">
                <h3 className="text-white text-3xl font-black tracking-tighter">Connecting to Doctor...</h3>
                <p className="text-rose-100 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">Establishing Secure Channel • 128-bit Encrypted</p>
                <div className="flex justify-center gap-1.5 pt-4">
                   {[1,2,3].map(i => <div key={i} className="w-2 h-2 bg-rose-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 150}ms` }} />)}
                </div>
              </div>
              <button 
                onClick={endInstantCall}
                className="bg-white/10 backdrop-blur-xl p-8 rounded-full text-white active:scale-90 transition-all border border-white/10 mt-12 hover:bg-rose-600/50"
              >
                <PhoneOff size={32} />
              </button>
            </div>
          ) : (
            <div className="relative flex-1 flex flex-col">
              {/* Doctor Main View (Simulated) */}
              <div className="absolute inset-0 bg-slate-800">
                <img 
                  src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1000&q=80" 
                  className="w-full h-full object-cover opacity-80" 
                  alt="Doctor"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-slate-900/40" />
              </div>

              {/* User Local View */}
              <div className="absolute top-12 right-6 w-32 aspect-[3/4] bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border-2 border-white/20 z-20">
                {!isVideoOff ? (
                  <video 
                    ref={userVideoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover mirror" 
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-600 gap-2">
                    <VideoOff size={24} />
                    <span className="text-[8px] font-black uppercase tracking-tighter">Cam Off</span>
                  </div>
                )}
              </div>

              {/* Call Info Header */}
              <div className="absolute top-12 left-6 z-20 flex flex-col gap-1">
                <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 w-fit">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                   <span className="text-white text-xs font-black tracking-tighter uppercase">{formatCallTime(callTime)}</span>
                </div>
                <h4 className="text-white text-xl font-black mt-2 drop-shadow-lg">Dr. Priya Sharma</h4>
                <div className="flex items-center gap-2">
                   <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest drop-shadow-md">Senior Cardiologist</span>
                   <div className="w-1 h-1 bg-white/30 rounded-full" />
                   <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">HD Live</span>
                </div>
              </div>

              {/* Floating Controls */}
              <div className="absolute bottom-16 left-0 right-0 z-30 flex justify-center items-center gap-6 px-8 animate-in slide-in-from-bottom">
                 <button 
                  onClick={toggleMic}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isMicMuted ? 'bg-white text-slate-900 shadow-xl scale-110' : 'bg-white/10 text-white backdrop-blur-xl border border-white/20 hover:bg-white/20'}`}
                 >
                   {isMicMuted ? <MicOff size={28} /> : <Mic size={28} />}
                 </button>
                 <button 
                  onClick={endInstantCall}
                  className="w-20 h-20 bg-rose-600 text-white rounded-[40px] flex items-center justify-center shadow-2xl shadow-rose-600/40 active:scale-90 transition-all ring-8 ring-rose-500/10 hover:bg-rose-700"
                 >
                   <PhoneOff size={36} />
                 </button>
                 <button 
                  onClick={toggleVideo}
                  className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isVideoOff ? 'bg-white text-slate-900 shadow-xl scale-110' : 'bg-white/10 text-white backdrop-blur-xl border border-white/20 hover:bg-white/20'}`}
                 >
                   {isVideoOff ? <VideoOff size={28} /> : <Video size={28} />}
                 </button>
              </div>
              
              {/* Bottom Subtle Overlay for UI readability */}
              <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
            </div>
          )}
        </div>
      )}

      {/* AMBULANCE TRACKING OVERLAY */}
      {activeAmbulanceOrder && (
        <div className="fixed inset-0 z-[9950] bg-white flex flex-col animate-in slide-in-from-bottom overflow-hidden">
          {/* Map Section */}
          <div className="h-[45vh] bg-slate-900 relative overflow-hidden shrink-0">
             <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
             <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M320 320 L180 200 L60 80" 
                  stroke="#f43f5e" 
                  strokeWidth="6" 
                  fill="none" 
                  strokeLinecap="round" 
                  strokeDasharray="400" 
                  strokeDashoffset={400 - (ambulanceProgress * 4)}
                  className="transition-all duration-1000"
                />
             </svg>
             
             {/* Map Markers */}
             <div className="absolute inset-0 pointer-events-none">
                {/* User House */}
                <div className="absolute" style={{ left: '60px', top: '80px', transform: 'translate(-50%, -50%)' }}>
                  <div className="relative">
                    <div className="w-12 h-12 bg-white border-2 border-emerald-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <Home size={24} className="text-emerald-500" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                  </div>
                </div>

                {/* Hospital Marker */}
                <div className="absolute" style={{ left: '320px', top: '320px', transform: 'translate(-50%, -50%)' }}>
                   <div className="w-12 h-12 bg-white border-2 border-blue-500 rounded-2xl flex items-center justify-center shadow-xl">
                      <Store size={24} className="text-blue-500" />
                   </div>
                </div>

                {/* Moving Ambulance */}
                <div 
                  className="absolute z-20 transition-all duration-1000 ease-linear" 
                  style={{ left: `${ambPos.x}px`, top: `${ambPos.y}px`, transform: 'translate(-50%, -50%)', willChange: 'left, top' }}
                >
                  <div className="relative">
                    <div className="w-14 h-14 bg-rose-600 text-white rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.5)] border-2 border-white rotate-[-10deg]">
                      <Siren size={32} className="animate-pulse" />
                    </div>
                    <div className="absolute inset-0 bg-rose-600/30 rounded-full animate-ping -z-10" />
                  </div>
                </div>
             </div>

             <div className="absolute top-10 left-6 right-6 flex items-center justify-between z-10">
                <div className="bg-rose-600/90 backdrop-blur px-5 py-2 rounded-2xl shadow-2xl border border-white/20">
                   <p className="text-[10px] font-black text-rose-100 uppercase tracking-widest mb-0.5">Emergency ID</p>
                   <h3 className="text-sm font-black text-white">{activeAmbulanceOrder.id}</h3>
                </div>
                <button onClick={() => { setActiveAmbulanceOrder(null); setAmbulanceProgress(0); }} className="w-12 h-12 bg-white/20 backdrop-blur rounded-full shadow-2xl flex items-center justify-center text-white active:scale-90 transition-all border border-white/20"><X size={24}/></button>
             </div>
          </div>

          {/* Tracking Bottom Sheet */}
          <div className="flex-1 p-8 space-y-6 bg-white rounded-t-[56px] shadow-[0_-20px_60px_rgba(0,0,0,0.1)] relative z-20 overflow-y-auto no-scrollbar border-t border-slate-50">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Flame size={12} className="text-rose-500" /> Current Status
                  </p>
                  <h4 className="text-2xl font-black text-[#101935]">{activeAmbulanceOrder.status === 'Reached' ? 'Ambulance is here! 🚨' : 'En Route to Location'}</h4>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ETA</p>
                  <p className="text-3xl font-black text-rose-600">{Math.max(0, activeAmbulanceOrder.eta - Math.floor(ambulanceProgress / 12))} MINS</p>
                </div>
             </div>

             {/* Driver Card */}
             <div className="bg-slate-50 p-6 rounded-[40px] border border-slate-100 flex items-center justify-between shadow-sm animate-in slide-in-from-right">
                <div className="flex items-center gap-5">
                   <div className="w-16 h-16 rounded-[24px] overflow-hidden border-2 border-white shadow-md">
                      <img src={activeAmbulanceOrder.driverImage} alt={activeAmbulanceOrder.driverName} className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-black text-lg text-slate-900 leading-none">{activeAmbulanceOrder.driverName}</h5>
                        <div className="flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-lg">
                          <Star size={12} fill="currentColor" className="text-amber-600" />
                          <span className="text-[11px] font-black text-amber-700">{activeAmbulanceOrder.driverRating}</span>
                        </div>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Certified Life Support Pilot</p>
                   </div>
                </div>
                <button 
                  onClick={() => handleCallNumber(activeAmbulanceOrder.driverPhone)}
                  className="w-14 h-14 bg-rose-600 text-white rounded-3xl flex items-center justify-center shadow-xl shadow-rose-200 active:scale-90 transition-all hover:bg-rose-700 ring-4 ring-rose-50"
                >
                  <Phone size={28} fill="currentColor" />
                </button>
             </div>

             {/* Emergency Circle Quick Access */}
             <div className="space-y-4 pt-2">
                <div className="flex items-center justify-between px-2">
                  <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                    <LifeBuoy size={14} className="text-blue-500" /> Emergency Circle
                  </h5>
                  <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{emergencyContacts.length} Contacts Linked</span>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {emergencyContacts.length > 0 ? (
                    emergencyContacts.map(contact => (
                      <div key={contact.id} className="bg-white p-5 rounded-[32px] border border-slate-100 flex items-center justify-between active:bg-slate-50 transition-colors group">
                        <div className="flex items-center gap-4">
                           <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-black text-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                              {contact.name[0]}
                           </div>
                           <div>
                              <h6 className="font-black text-slate-900 text-sm">{contact.name}</h6>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Family/Circle</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => handleCallNumber(contact.phone)}
                          className="w-11 h-11 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center active:scale-90 active:bg-blue-600 active:text-white transition-all shadow-sm"
                        >
                          <Phone size={20} />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No contacts added to circle</p>
                    </div>
                  )}
                </div>
             </div>

             {activeAmbulanceOrder.status === 'Reached' && (
               <button 
                 onClick={() => { setActiveAmbulanceOrder(null); setAmbulanceProgress(0); setActiveTab('profile'); }}
                 className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-lg shadow-2xl active:scale-95 transition-all animate-bounce"
               >
                 Dismiss & Record Incident
               </button>
             )}
          </div>
        </div>
      )}

      {/* AI PRESCRIPTION SCAN MODAL */}
      {showPrescriptionModal && (
        <div className="fixed inset-0 z-[9500] bg-slate-900/60 backdrop-blur-xl flex items-end">
           <div className="w-full bg-white rounded-t-[56px] p-8 animate-in slide-in-from-bottom flex flex-col space-y-8 max-h-[95vh] overflow-hidden shadow-2xl relative">
              <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <Scan size={24}/>
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">AI Rx Scanner</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Powered by Gemini AI</p>
                  </div>
                </div>
                <button onClick={() => { setShowPrescriptionModal(false); setScanStatus('idle'); stopCamera(); }} className="p-4 bg-slate-50 rounded-full active:scale-90 transition-all"><X /></button>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-6">
                {scanStatus === 'idle' && (
                  <div className="space-y-8 py-4 animate-in fade-in">
                    <div className="bg-purple-50 rounded-[40px] p-10 text-center space-y-6 border border-purple-100 relative overflow-hidden">
                       <div className="absolute -top-10 -right-10 opacity-10"><FileSearch size={160} /></div>
                       <div className="w-20 h-20 bg-white text-purple-600 rounded-[28px] flex items-center justify-center mx-auto shadow-xl"><Camera size={40}/></div>
                       <div className="space-y-2 relative z-10">
                         <h4 className="font-black text-lg text-slate-900">Scan Prescription</h4>
                         <p className="text-slate-500 text-sm font-medium leading-relaxed px-4">Our AI will read your prescription and find matching medicines instantly.</p>
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <button onClick={startCamera} className="bg-slate-900 text-white p-6 rounded-[32px] flex flex-col items-center gap-3 shadow-xl active:scale-95 transition-all">
                         <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center"><CameraIcon size={24}/></div>
                         <span className="font-black text-[11px] uppercase tracking-[0.1em]">Take Photo</span>
                       </button>
                       <label className="bg-white border-2 border-slate-100 p-6 rounded-[32px] flex flex-col items-center gap-3 shadow-sm active:scale-95 cursor-pointer hover:border-purple-200 transition-all">
                         <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center"><Upload size={24}/></div>
                         <span className="font-black text-[11px] text-slate-900 uppercase tracking-[0.1em]">Upload File</span>
                         <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                       </label>
                    </div>
                  </div>
                )}

                {scanStatus === 'camera' && (
                  <div className="relative aspect-[3/4] bg-black rounded-[40px] overflow-hidden animate-in zoom-in">
                    <video ref={videoRef} className="w-full h-full object-cover" playsInline />
                    <div className="absolute inset-0 border-2 border-white/20 pointer-events-none rounded-[40px]" />
                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/40 shadow-[0_0_15px_rgba(255,255,255,0.5)] animate-scan" />
                    <div className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8">
                       <button onClick={() => setScanStatus('idle')} className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white"><RefreshCcw size={24}/></button>
                       <button onClick={captureAndScan} className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform"><div className="w-16 h-16 border-4 border-slate-900 rounded-full" /></button>
                       <button onClick={() => { stopCamera(); setScanStatus('idle'); }} className="w-14 h-14 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white"><X size={24}/></button>
                    </div>
                    <canvas ref={canvasRef} className="hidden" />
                  </div>
                )}

                {scanStatus === 'scanning' && (
                  <div className="py-20 flex flex-col items-center justify-center space-y-10 animate-in fade-in">
                    <div className="relative">
                      <div className="w-32 h-32 bg-purple-50 rounded-[48px] flex items-center justify-center text-purple-600 relative overflow-hidden">
                        <Bot size={64} className="animate-bounce" />
                        <div className="absolute top-0 left-0 right-0 h-1 bg-purple-600/40 animate-scan" />
                      </div>
                      <div className="absolute inset-0 border-4 border-purple-100 rounded-[48px] animate-pulse" />
                    </div>
                    <div className="text-center space-y-3">
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">AI is analyzing...</h4>
                      <p className="text-[10px] font-black text-purple-600 uppercase tracking-[0.3em] animate-pulse">Reading Prescription • Finding Meds</p>
                    </div>
                  </div>
                )}

                {scanStatus === 'success' && (
                  <div className="space-y-6 animate-in slide-in-from-right pb-20">
                     <div className="bg-emerald-50 border border-emerald-100 rounded-3xl p-5 flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center"><Check size={20}/></div>
                        <div>
                          <h5 className="font-black text-slate-900 text-sm">{scannedItemsForReview.length} Medicines Detected</h5>
                          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Review and adjust before adding</p>
                        </div>
                     </div>

                     <div className="space-y-4">
                        {scannedItemsForReview.map(item => (
                          <div key={item.id} className="bg-white p-4 rounded-[32px] border border-slate-50 shadow-sm flex items-center gap-4 group animate-in slide-in-from-bottom">
                            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-50"><img src={item.image} className="w-full h-full object-cover" /></div>
                            <div className="flex-1 space-y-1">
                               <div className="flex items-center justify-between">
                                 <h5 className="font-black text-sm text-slate-900 line-clamp-1">{item.name}</h5>
                                 <button onClick={() => removeFromScanned(item.id)} className="text-slate-300 hover:text-rose-500"><X size={16}/></button>
                               </div>
                               <div className="flex items-center justify-between">
                                  <p className="font-black text-blue-600 text-xs">₹{item.price}</p>
                                  <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-1 px-2">
                                    <button onClick={() => updateScannedQuantity(item.id, -1)} className="text-slate-400"><Minus size={14}/></button>
                                    <span className="font-black text-xs w-3 text-center">{item.quantity}</span>
                                    <button onClick={() => updateScannedQuantity(item.id, 1)} className="text-slate-400"><Plus size={14}/></button>
                                  </div>
                               </div>
                            </div>
                          </div>
                        ))}
                     </div>
                  </div>
                )}

                {scanStatus === 'error' && (
                  <div className="py-20 text-center space-y-8 animate-in zoom-in">
                    <div className="w-24 h-24 bg-rose-50 text-rose-500 rounded-[32px] flex items-center justify-center mx-auto"><AlertTriangle size={48}/></div>
                    <div className="space-y-2">
                      <h4 className="text-2xl font-black text-slate-900 tracking-tight">No Meds Found</h4>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed px-10">We couldn't identify any medicines from this image. Please try a clearer photo or manual search.</p>
                    </div>
                    <button onClick={() => setScanStatus('idle')} className="text-blue-600 font-black text-xs uppercase tracking-widest underline underline-offset-8">Try Again</button>
                  </div>
                )}
              </div>

              {scanStatus === 'success' && (
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-white/80 backdrop-blur-md border-t border-slate-100 flex gap-4">
                   <button onClick={() => setScanStatus('idle')} className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-3xl flex items-center justify-center text-slate-400 active:scale-90 transition-all"><RefreshCcw size={24}/></button>
                   <button onClick={addAllScannedToCart} className="flex-1 bg-purple-600 text-white py-5 rounded-[32px] font-black text-lg shadow-xl shadow-purple-200 active:scale-95 transition-all flex items-center justify-center gap-3">Add to Cart <ArrowRight size={20}/></button>
                </div>
              )}
           </div>
        </div>
      )}

      {/* Appointment Booking Modal */}
      {selectedDocForBooking && (
        <div className="fixed inset-0 z-[8500] bg-slate-900/60 backdrop-blur-xl flex items-end">
           <div className="w-full bg-white rounded-t-[56px] p-8 animate-in slide-in-from-bottom flex flex-col space-y-8 max-h-[95vh] overflow-y-auto shadow-2xl no-scrollbar">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-[24px] overflow-hidden border border-slate-100 shadow-lg"><img src={selectedDocForBooking.image} loading="lazy" decoding="async" className="w-full h-full object-cover" /></div>
                  <div><h3 className="text-2xl font-black text-slate-900">{selectedDocForBooking.name}</h3><p className="text-blue-600 text-[10px] font-black uppercase tracking-widest">{selectedDocForBooking.specialty}</p></div>
                </div>
                <button onClick={() => setSelectedDocForBooking(null)} className="p-4 bg-slate-50 rounded-full active:scale-90 transition-all hover:bg-slate-100"><X /></button>
              </div>

              {!bookingSuccess ? (
                <div className="space-y-8 animate-in fade-in">
                  <section className="space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                        <CalendarDays size={18} />
                      </div>
                      <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Step 1: Choose Date</h4>
                    </div>
                    <div className="flex gap-3 overflow-x-auto no-scrollbar -mx-2 px-2 py-2">
                      {[0,1,2,3,4,5,6].map(i => {
                        const date = new Date();
                        date.setDate(date.getDate() + i);
                        const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
                        const fullDate = date.toLocaleDateString('en-US');
                        const isSelected = bookingDate === fullDate;
                        return (
                          <button 
                            key={i} 
                            onClick={() => setBookingDate(fullDate)} 
                            className={`flex flex-col items-center gap-1 min-w-[76px] p-5 rounded-[28px] border transition-all relative overflow-hidden ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/30 scale-105' : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200'}`}
                          >
                            {isSelected && <div className="absolute top-1 right-1"><CheckCircle2 size={12} className="text-white/80" /></div>}
                            <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-white/70' : 'text-slate-300'}`}>{dayStr}</span>
                            <span className="text-xl font-black">{date.getDate()}</span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  {bookingDate && (
                    <section className="space-y-4 animate-in zoom-in">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                          <Clock size={18} />
                        </div>
                        <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">Step 2: Pick Available Slot</h4>
                      </div>
                      
                      {availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-3">
                          {availableSlots.map(time => {
                            const isSelected = bookingTime === time;
                            return (
                              <button 
                                key={time} 
                                onClick={() => setBookingTime(time)} 
                                className={`p-4 rounded-[24px] border font-black text-[11px] transition-all relative ${isSelected ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-500/20 ring-2 ring-blue-100 ring-offset-2' : 'bg-slate-50 border-slate-100 text-slate-500 hover:bg-blue-50'}`}
                              >
                                {isSelected && <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5 border border-blue-600 shadow-sm"><Check size={8} className="text-blue-600" /></div>}
                                {time}
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-slate-50 p-8 rounded-[32px] border border-dashed border-slate-200 text-center">
                          <p className="text-slate-400 text-xs font-black uppercase">No slots available for this date</p>
                        </div>
                      )}
                    </section>
                  )}

                  {bookingTime && (
                    <div className="animate-in slide-in-from-bottom pt-4">
                       <button onClick={() => setShowBookingConfirmation(true)} disabled={isBookingInProgress} className="w-full bg-slate-900 text-white py-6 rounded-[32px] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
                        {isBookingInProgress ? <Loader2 className="animate-spin" size={24} /> : 'Book Consultation'}
                      </button>
                      <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">Confirming appointment for {bookingDate} at {bookingTime}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center space-y-8 animate-in zoom-in">
                   <div className="w-32 h-32 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-3xl mx-auto border-8 border-emerald-50"><Check size={64} /></div>
                   <div className="space-y-2">
                    <h4 className="text-3xl font-black text-slate-900 tracking-tighter">Booking Confirmed!</h4>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Redirecting to your schedule...</p>
                   </div>
                </div>
              )}
           </div>
        </div>
      )}

      {/* BOOKING CONFIRMATION DIALOG */}
      {showBookingConfirmation && (
        <div className="fixed inset-0 z-[11000] bg-black/60 flex items-center justify-center p-8 backdrop-blur-md">
           <div className="bg-white w-full max-sm rounded-[48px] p-10 animate-in zoom-in space-y-8 shadow-2xl">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[28px] flex items-center justify-center mx-auto shadow-inner"><Calendar size={36}/></div>
                <h4 className="text-2xl font-black tracking-tight text-slate-900">Confirm Booking?</h4>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest leading-relaxed px-4">Secure your slot for consultation. A reminder will be sent 15m before.</p>
              </div>
              <div className="flex gap-4">
                 <button onClick={() => setShowBookingConfirmation(false)} className="flex-1 py-4 rounded-[24px] bg-slate-50 text-slate-400 font-black text-xs uppercase tracking-widest active:scale-95 transition-all">Dismiss</button>
                 <button onClick={() => { setShowBookingConfirmation(false); handleConfirmBooking(); }} className="flex-[2] py-4 rounded-[24px] bg-blue-600 text-white font-black text-xs uppercase tracking-widest shadow-xl active:scale-95 transition-all">Confirm Now</button>
              </div>
           </div>
        </div>
      )}

      {/* Medicine Details Modal */}
      {selectedMedicine && (
        <div className="fixed inset-0 z-[8500] bg-slate-900/60 backdrop-blur-xl flex items-end">
           <div className="w-full bg-white rounded-t-[56px] p-8 animate-in slide-in-from-bottom flex flex-col space-y-8 max-h-[95vh] overflow-y-auto shadow-2xl no-scrollbar">
              <div className="flex justify-between items-center"><div className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest">{selectedMedicine.category}</div><button onClick={() => setSelectedMedicine(null)} className="p-4 bg-slate-50 rounded-full active:scale-90 transition-all"><X /></button></div>
              <div className="aspect-square bg-slate-50 rounded-[48px] overflow-hidden shadow-inner"><img src={selectedMedicine.image} loading="eager" decoding="async" className="w-full h-full object-cover" /></div>
              <div className="space-y-6">
                 <div className="space-y-2">
                    <h3 className="text-4xl font-black text-[#101935] tracking-tighter">{selectedMedicine.name}</h3>
                    <div className="flex items-center gap-4"><p className="text-4xl font-black text-blue-600">₹{selectedMedicine.price}</p></div>
                 </div>
                 <div className="space-y-4">
                    <h4 className="font-black uppercase text-[11px] tracking-widest text-slate-400">Description</h4>
                    <p className="text-slate-600 text-sm font-medium leading-relaxed">{selectedMedicine.description}</p>
                 </div>
              </div>
              <button onClick={() => { addToCart(selectedMedicine); setSelectedMedicine(null); }} className="w-full bg-blue-600 text-white py-6 rounded-[32px] font-black text-xl shadow-2xl shadow-blue-100 active:scale-95 transition-all flex items-center justify-center gap-3"><Plus size={24}/> Add to Cart</button>
           </div>
        </div>
      )}

      {/* AMBULANCE BOOKING MODAL */}
      {showAmbulanceBookingModal && (
        <div className="fixed inset-0 z-[8500] bg-slate-900/60 backdrop-blur-xl flex items-end">
           <div className="w-full bg-white rounded-t-[56px] p-10 animate-in slide-in-from-bottom flex flex-col space-y-8 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
              <div className="flex justify-between items-center">
                 <div><h3 className="text-3xl font-black text-[#101935]">Book Ambulance</h3></div>
                 <button onClick={() => { setShowAmbulanceBookingModal(false); setAmbulanceStep('type'); }} className="p-4 bg-slate-50 rounded-full active:scale-90 transition-all"><X /></button>
              </div>
              {ambulanceStep === 'type' && (
                <div className="space-y-6 animate-in slide-in-from-right">
                   {AMBULANCE_TYPES.map(amb => (
                     <button key={amb.id} onClick={() => { setSelectedAmbType(amb); setAmbulanceStep('destination'); }} className="w-full p-6 rounded-[32px] border-2 border-slate-50 bg-white flex items-center justify-between group active:scale-98 shadow-sm">
                        <div className="flex items-center gap-5"><div className="w-16 h-16 rounded-[24px] bg-blue-50 text-blue-600 flex items-center justify-center"><amb.icon size={32} /></div><div className="text-left"><h4 className="font-black text-[#101935]">{amb.name}</h4><p className="text-xs font-bold text-slate-400">{amb.description}</p></div></div>
                        <ChevronRight size={24} className="text-slate-200" />
                     </button>
                   ))}
                </div>
              )}
              {ambulanceStep === 'destination' && (
                <div className="space-y-6 animate-in slide-in-from-right">
                   {SUGGESTED_HOSPITALS.map(h => (
                     <button key={h.id} onClick={() => { setSelectedHospital(h); setAmbulanceStep('confirm'); }} className="w-full p-6 rounded-[32px] border-2 border-slate-50 bg-white flex items-center justify-between group active:scale-98 shadow-sm">
                        <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl bg-emerald-50 text-emerald-600">🏥</div><div className="text-left"><h4 className="font-black text-[#101935]">{h.name}</h4><p className="text-xs font-bold text-slate-400">{h.distance} • {h.type}</p></div></div>
                        <ChevronRight size={24} className="text-slate-200" />
                     </button>
                   ))}
                </div>
              )}
              {ambulanceStep === 'confirm' && (
                <div className="space-y-8 animate-in zoom-in">
                   <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100 space-y-6">
                      <div className="flex items-center justify-between"><div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fare Estimate</p><h4 className="text-3xl font-black text-[#101935]">₹{selectedAmbType?.price}</h4></div></div>
                   </div>
                   <button onClick={confirmAmbulanceBooking} disabled={isSearchingAmbulance} className="w-full bg-rose-600 text-white py-6 rounded-[32px] font-black text-xl shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">
                     {isSearchingAmbulance ? <Loader2 className="animate-spin" size={28} /> : <><Siren size={28} /> Confirm Ambulance</>}
                   </button>
                </div>
              )}
           </div>
        </div>
      )}

      {/* ORDER TRACKING OVERLAY */}
      {activeOrder && (
         <div className="fixed inset-0 z-[9900] bg-white flex flex-col animate-in slide-in-from-bottom overflow-hidden">
            <div className="h-[40vh] bg-slate-50 relative overflow-hidden shrink-0 border-b border-slate-100">
               <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
               <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 100 L400 100 M0 200 L400 200 M0 300 L400 300 M100 0 L100 400 M200 0 L200 400 M300 0 L300 400" stroke="#cbd5e1" strokeWidth="1" fill="none" opacity="0.3" />
                  <path 
                    d="M60 320 L120 160 L320 80" 
                    stroke="#3b82f6" 
                    strokeWidth="4" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeDasharray="400" 
                    strokeDashoffset={400 - (trackingProgress * 4)}
                    className="transition-all duration-1000"
                  />
               </svg>
               <div className="absolute top-10 left-6 right-6 flex items-center justify-between z-10">
                  <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-2xl shadow-sm border border-white/50">
                     <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest mb-0.5">Order ID</p>
                     <h3 className="text-sm font-black text-[#101935]">{activeOrder.id}</h3>
                  </div>
                  <button onClick={() => { setActiveOrder(null); setTrackingProgress(0); }} className="w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-slate-400 active:scale-90 transition-all"><X size={20}/></button>
               </div>
               <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute" style={{ left: '60px', top: '320px', transform: 'translate(-50%, -50%)' }}><div className="w-10 h-10 bg-white border-2 border-blue-500 rounded-xl flex items-center justify-center shadow-lg"><Store size={18} className="text-blue-500" /></div></div>
                  <div 
                    className="absolute z-20 transition-all duration-1000 ease-linear" 
                    style={{ left: `${partnerPos.x}px`, top: `${partnerPos.y}px`, transform: 'translate(-50%, -50%)', willChange: 'left, top' }}
                  >
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-2xl border-2 border-white rotate-[-5deg]"><Truck size={20} /></div>
                  </div>
                  <div className="absolute" style={{ left: '320px', top: '80px', transform: 'translate(-50%, -50%)' }}><div className="w-10 h-10 bg-white border-2 border-emerald-500 rounded-xl flex items-center justify-center shadow-lg"><Home size={18} className="text-emerald-500" /></div></div>
               </div>
            </div>
            <div className="flex-1 p-8 space-y-6 bg-white rounded-t-[48px] shadow-[0_-20px_50px_rgba(0,0,0,0.06)] relative z-20 overflow-y-auto no-scrollbar">
               <div className="flex items-center justify-between">
                  <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Delivery Status</p><h4 className="text-2xl font-black text-[#101935]">{activeOrder.status === 'Delivered' ? 'Delivered successfully! 🎉' : activeOrder.status}</h4></div>
                  <div className="text-right"><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Arrival In</p><p className="text-2xl font-black text-blue-600">{Math.max(0, 12 - Math.floor(trackingProgress / 8))} MINS</p></div>
               </div>

               {/* Delivery Partner Info & Calling Card */}
               {activeOrder.tracking && activeOrder.status !== 'Delivered' && (
                 <div className="bg-slate-50 p-5 rounded-[32px] border border-slate-100 flex items-center justify-between animate-in zoom-in">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-sm border-2 border-white">
                        <img src={activeOrder.tracking.partnerImage} alt={activeOrder.tracking.partnerName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h5 className="font-black text-slate-900">{activeOrder.tracking.partnerName}</h5>
                          <div className="flex items-center gap-1 bg-amber-100 px-1.5 py-0.5 rounded-md">
                            <Star size={10} fill="currentColor" className="text-amber-600" />
                            <span className="text-[10px] font-black text-amber-700">{activeOrder.tracking.partnerRating}</span>
                          </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Delivery Hero</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleCallNumber(activeOrder.tracking!.partnerPhone)}
                      className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 active:scale-90 transition-all hover:bg-blue-700"
                    >
                      <Phone size={20} fill="currentColor" />
                    </button>
                 </div>
               )}

               {/* TIP DELIVERY PARTNER SECTION */}
               {activeOrder.status !== 'Delivered' && (
                 <section className="bg-blue-50/50 p-6 rounded-[40px] border border-blue-100 space-y-5 animate-in slide-in-from-bottom">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                       <Heart size={20} fill="currentColor" />
                     </div>
                     <div>
                       <h5 className="font-black text-slate-900 text-sm">Tip your delivery hero</h5>
                       <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">100% of the tip goes to Amit</p>
                     </div>
                   </div>

                   <div className="flex gap-3">
                     {[20, 50, 100].map(amt => (
                       <button
                         key={amt}
                         onClick={() => { updateOrderTip(amt); setCustomTipInput(''); }}
                         className={`flex-1 py-3 rounded-2xl font-black text-xs transition-all border-2 ${deliveryTip === amt ? 'bg-blue-600 border-blue-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-500 hover:border-blue-200'}`}
                       >
                         ₹{amt}
                       </button>
                     ))}
                   </div>

                   <div className="relative group">
                     <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                     <input
                       type="number"
                       placeholder="Enter custom amount"
                       className="w-full bg-white border border-slate-100 rounded-2xl py-3 pl-10 pr-4 font-bold text-xs outline-none focus:ring-4 ring-blue-500/5 transition-all"
                       value={customTipInput}
                       onChange={e => {
                         const val = parseInt(e.target.value) || 0;
                         setCustomTipInput(e.target.value);
                         updateOrderTip(val);
                       }}
                     />
                   </div>
                   
                   {deliveryTip > 0 && (
                     <div className="flex items-center gap-2 text-emerald-600 animate-in fade-in">
                       <Smile size={14} />
                       <span className="text-[10px] font-black uppercase tracking-widest">₹{deliveryTip} Tip will be added to your total</span>
                     </div>
                   )}
                 </section>
               )}

               <div className="space-y-6 py-2">
                  {milestones.map((step, idx) => (
                    <div key={idx} className="flex gap-4 relative">
                      {idx !== milestones.length - 1 && <div className={`absolute left-[19px] top-10 w-0.5 h-6 transition-colors duration-500 ${step.completed ? 'bg-emerald-500' : 'bg-slate-100'}`} />}
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 z-10 transition-all duration-500 ${step.completed ? 'bg-emerald-100 text-emerald-600' : (trackingProgress >= step.activeAt ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-50 text-slate-300')}`}>
                        {step.completed ? <Check size={20} /> : <step.icon size={20} />}
                      </div>
                      <div className="flex-1 space-y-0.5">
                        <h5 className={`text-sm font-black transition-colors ${step.completed ? 'text-emerald-900' : 'text-slate-400'}`}>{step.title}</h5>
                        <p className="text-[11px] font-medium text-slate-400 leading-tight">{step.description}</p>
                      </div>
                    </div>
                  ))}
               </div>
               {activeOrder.status === 'Delivered' && (
                 <div className="space-y-4 animate-in slide-in-from-bottom">
                   <div className="bg-emerald-50 p-6 rounded-[32px] border border-emerald-100 flex items-center justify-between">
                     <div className="space-y-1">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Grand Total</p>
                        <h4 className="text-2xl font-black text-emerald-900">₹{activeOrder.total}</h4>
                     </div>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Includes Tip</p>
                        <p className="text-lg font-black text-emerald-900">₹{activeOrder.tip || 0}</p>
                     </div>
                   </div>
                   <button onClick={() => { setActiveOrder(null); setTrackingProgress(0); setDeliveryTip(0); setCustomTipInput(''); setActiveTab('medicines'); }} className="w-full bg-slate-900 text-white py-5 rounded-[28px] font-black text-lg shadow-xl active:scale-95 transition-all">Back to Home</button>
                 </div>
               )}
            </div>
         </div>
      )}

      {/* BOTTOM NAVIGATION */}
      {!activeOrder && !activeAmbulanceOrder && !showSOSModal && !selectedDocForBooking && !showInstantCall && !showAddressModal && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 flex justify-around items-center px-4 pt-4 pb-10 z-[1000] rounded-t-[48px] shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
          {[
            { id: 'medicines', icon: Home, label: 'SHOP' },
            { id: 'doctors', icon: Stethoscope, label: 'DOCS' },
            { id: 'assistant', icon: Bot, label: 'AI' },
            { id: 'reminders', icon: Clock, label: 'TIME' },
            { id: 'profile', icon: UserIcon, label: 'ME' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)} className={`flex flex-col items-center gap-2 p-3 transition-all ${activeTab === tab.id ? 'text-blue-600 scale-110' : 'text-slate-300'}`}>
              <tab.icon size={24} strokeWidth={activeTab === tab.id ? 3 : 2} />
              <span className="text-[9px] font-black uppercase tracking-tighter">{tab.label}</span>
            </button>
          ))}
        </nav>
      )}

      {/* CART MODAL & PAYMENT FLOW */}
      {showCart && (
        <div className="fixed inset-0 z-[9000] bg-slate-900/60 backdrop-blur-md flex justify-end">
           <div className="w-full max-w-lg bg-white h-full animate-in slide-in-from-right flex flex-col shadow-3xl overflow-hidden">
              <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-[#F8FAFF]">
                 <div>
                   <h3 className="text-3xl font-black text-[#101935] tracking-tighter">
                     {cartStep === 'items' ? 'My Bag' : 'Checkout'}
                   </h3>
                   <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">
                     {cartStep === 'items' ? `${totalItems} Items Selected` : 'Select Payment Method'}
                   </p>
                 </div>
                 <button onClick={() => setShowCart(false)} className="p-4 bg-white border border-slate-100 rounded-full active:scale-90 transition-all shadow-sm"><X /></button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                 {cartStep === 'items' ? (
                   cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                       <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-[40px] flex items-center justify-center"><ShoppingCart size={64}/></div>
                       <p className="text-slate-400 font-black uppercase text-xs tracking-widest">Your bag is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="bg-white p-5 rounded-[40px] border border-slate-50 shadow-sm flex items-center gap-5 group animate-in slide-in-from-bottom">
                            <div className="w-24 h-24 bg-slate-50 rounded-[32px] overflow-hidden shadow-inner"><img src={item.image} loading="lazy" decoding="async" className="w-full h-full object-cover" /></div>
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center justify-between"><h4 className="font-black text-slate-900 line-clamp-1">{item.name}</h4><button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18}/></button></div>
                              <div className="flex items-center justify-between">
                                  <p className="font-black text-blue-600">₹{item.price}</p>
                                  <div className="flex items-center gap-3 bg-slate-50 rounded-2xl p-1 px-3 border border-slate-100">
                                    <button onClick={() => updateQuantity(item.id, -1)} className="w-8 h-8 text-slate-400 hover:text-blue-600"><Minus size={16}/></button>
                                    <span className="font-black text-sm w-4 text-center">{item.quantity}</span>
                                    <button onClick={() => updateQuantity(item.id, 1)} className="w-8 h-8 text-slate-400 hover:text-blue-600"><Plus size={16}/></button>
                                  </div>
                              </div>
                            </div>
                        </div>
                      ))}
                      <div className="bg-blue-50/50 p-6 rounded-[40px] border border-blue-100 space-y-3">
                         <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400"><span>Subtotal</span><span className="text-slate-900">₹{cartTotal}</span></div>
                         <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-slate-400"><span>Delivery Fee</span><span className="text-emerald-500">FREE</span></div>
                         <div className="h-px bg-blue-100 my-1" />
                         <div className="flex justify-between items-center text-lg font-black text-blue-600"><span>Grand Total</span><span>₹{cartTotal}</span></div>
                      </div>
                    </div>
                  )
                 ) : (
                   <div className="space-y-6 animate-in slide-in-from-right">
                      <div className="bg-slate-900 rounded-[40px] p-8 text-white shadow-2xl relative overflow-hidden">
                         <div className="absolute -top-10 -right-10 opacity-10"><Wallet size={120} /></div>
                         <div className="relative z-10 space-y-1">
                            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Amount to Pay</p>
                            <h4 className="text-4xl font-black tracking-tighter">₹{cartTotal}</h4>
                         </div>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-4">Payment Methods</label>
                        {[
                          { id: 'Wallet', icon: Wallet, label: 'Medsit Wallet', balance: `₹${currentUser?.walletBalance}` },
                          { id: 'UPI', icon: Smartphone, label: 'UPI (GPay, PhonePe)' },
                          { id: 'Card', icon: CreditCard, label: 'Credit / Debit Card' },
                          { id: 'COD', icon: Banknote, label: 'Cash on Delivery' }
                        ].map(method => (
                          <button 
                            key={method.id} 
                            onClick={() => setSelectedPaymentMethod(method.id as any)}
                            className={`w-full p-6 rounded-[32px] border-2 flex items-center justify-between transition-all group ${selectedPaymentMethod === method.id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-50 hover:border-slate-200'}`}
                          >
                             <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${selectedPaymentMethod === method.id ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'}`}>
                                   <method.icon size={24} />
                                </div>
                                <div className="text-left"><h5 className="font-black text-slate-900 text-sm">{method.label}</h5>{method.balance && <p className="text-[10px] font-bold text-blue-600">{method.balance}</p>}</div>
                             </div>
                             <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selectedPaymentMethod === method.id ? 'border-blue-600' : 'border-slate-200'}`}>
                                {selectedPaymentMethod === method.id && <div className="w-3 h-3 bg-blue-600 rounded-full" />}
                             </div>
                          </button>
                        ))}
                      </div>
                   </div>
                 )}
              </div>

              <div className="p-8 border-t border-slate-100 bg-[#F8FAFF] rounded-t-[48px] space-y-4">
                 {cartStep === 'items' ? (
                   <button 
                    onClick={() => setCartStep('payment')} 
                    disabled={cart.length === 0}
                    className="w-full bg-blue-600 text-white py-6 rounded-[32px] font-black text-xl shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
                   >
                     Proceed to Pay <ArrowRight size={24}/>
                   </button>
                 ) : (
                   <div className="flex gap-4">
                      <button onClick={() => setCartStep('items')} className="w-16 h-16 bg-white border border-slate-100 rounded-3xl flex items-center justify-center text-slate-400 active:scale-90 shadow-sm"><ChevronRight size={24} className="rotate-180" /></button>
                      <button 
                        onClick={handleCheckout} 
                        disabled={isLoggingIn}
                        className="flex-1 bg-blue-600 text-white py-6 rounded-[32px] font-black text-xl shadow-2xl active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
                      >
                        {isLoggingIn ? <Loader2 className="animate-spin" /> : <>Pay ₹{cartTotal}</>}
                      </button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      )}

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-in-from-bottom { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes slide-in-from-right { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes zoom-in { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes scan { 0% { top: 10%; opacity: 0; } 50% { opacity: 1; } 100% { top: 90%; opacity: 0; } }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 4s linear infinite; }
        .animate-in { animation: var(--animation-name) 450ms cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .fade-in { --animation-name: fade-in; }
        .slide-in-from-bottom { --animation-name: slide-in-from-bottom; }
        .slide-in-from-right { --animation-name: slide-in-from-right; }
        .zoom-in { --animation-name: zoom-in; }
        @keyframes loading { 0% { left: -100%; } 100% { left: 100%; } }
        @keyframes bounce-slow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .animate-bounce-slow { animation: bounce-slow 2s ease-in-out infinite; }
        @keyframes scan-horizontal { 0% { transform: translateY(0); } 50% { transform: translateY(100%); } 100% { transform: translateY(0); } }
        .animate-scan { animation: scan-horizontal 2s ease-in-out infinite; }
        .mirror { transform: scaleX(-1); }
      `}</style>
    </div>
  );
};

export default App;
