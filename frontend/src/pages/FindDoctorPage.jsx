import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import BookingModal from '../components/BookingModal';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MOCK_DOCTORS = [
    {
        id: 1,
        name: "Dr. Rajesh Deshpande",
        specialty: "Cardiologist",
        rating: 4.9,
        reviews: 215,
        distance: "1.2 km",
        address: "Ruby Hall Clinic, Sassoon Road",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh&backgroundColor=b6e3f4",
        availability: "Available Today",
        lat: 18.5309,
        lng: 73.8765
    },
    {
        id: 2,
        name: "Dr. Priya Kulkarni",
        specialty: "Dermatologist",
        rating: 4.8,
        reviews: 142,
        distance: "2.5 km",
        address: "Skin & Soul Clinic, JM Road, Deccan",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=ffd5dc",
        availability: "Next Available: Tomorrow",
        lat: 18.5196,
        lng: 73.8427
    },
    {
        id: 3,
        name: "Dr. Amit Patil",
        specialty: "Orthopedic Surgeon",
        rating: 4.7,
        reviews: 189,
        distance: "0.8 km",
        address: "Sancheti Hospital, Shivajinagar",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit&backgroundColor=c0aede",
        availability: "Available Today",
        lat: 18.5283,
        lng: 73.8519
    },
    {
        id: 4,
        name: "Dr. Neha Sharma",
        specialty: "Pediatrician",
        rating: 5.0,
        reviews: 310,
        distance: "4.1 km",
        address: "Sahyadri Hospital, Kothrud",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Neha&backgroundColor=ffdfbf",
        availability: "Available Today",
        lat: 18.5074,
        lng: 73.8077
    },
    {
        id: 5,
        name: "Dr. Sanjay Mehta",
        specialty: "Neurologist",
        rating: 4.9,
        reviews: 167,
        distance: "3.5 km",
        address: "Deenanath Mangeshkar Hospital, Erandwane",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sanjay&backgroundColor=d1d4f9",
        availability: "Available in 2 days",
        lat: 18.5031,
        lng: 73.8373
    },
    {
        id: 6,
        name: "Dr. Anjali Joshi",
        specialty: "General Practitioner",
        rating: 4.6,
        reviews: 98,
        distance: "5.2 km",
        address: "Aditya Birla Hospital, Baner Road",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anjali&backgroundColor=c0aede",
        availability: "Available Today",
        lat: 18.5626,
        lng: 73.8087
    },
    {
        id: 7,
        name: "Dr. Vikram Gokhale",
        specialty: "Dentist",
        rating: 4.8,
        reviews: 156,
        distance: "3.2 km",
        address: "Smile Care, Koregaon Park",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram&backgroundColor=e6e6faa",
        availability: "Available Today",
        lat: 18.5362,
        lng: 73.8939
    },
    {
        id: 8,
        name: "Dr. Meera Iyer",
        specialty: "Gynecologist",
        rating: 4.9,
        reviews: 203,
        distance: "6.5 km",
        address: "Cloudnine Hospital, Kalyani Nagar",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera&backgroundColor=ffdfbf",
        availability: "Next Available: Today",
        lat: 18.5476,
        lng: 73.9015
    },
    {
        id: 9,
        name: "Dr. Rohan Shah",
        specialty: "Psychiatrist",
        rating: 5.0,
        reviews: 88,
        distance: "4.5 km",
        address: "Mind Matter Clinic, Viman Nagar",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rohan&backgroundColor=b6e3f4",
        availability: "Available Today",
        lat: 18.5679,
        lng: 73.9143
    },
    {
        id: 10,
        name: "Dr. Kavita Rao",
        specialty: "Ophthalmologist",
        rating: 4.7,
        reviews: 134,
        distance: "2.1 km",
        address: "H.V. Desai Eye Hospital, Hadapsar",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kavita&backgroundColor=ffd5dc",
        availability: "Available Tomorrow",
        lat: 18.5089,
        lng: 73.9259
    },
    {
        id: 11,
        name: "Dr. Arjun Singh",
        specialty: "ENT Specialist",
        rating: 4.6,
        reviews: 92,
        distance: "10.2 km",
        address: "Jupiter Hospital, Baner",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun&backgroundColor=d1d4f9",
        availability: "Available Today",
        lat: 18.5642,
        lng: 73.7769
    },
    {
        id: 12,
        name: "Dr. Sonal Kapoor",
        specialty: "Nutritionist",
        rating: 4.9,
        reviews: 176,
        distance: "5.8 km",
        address: "FitLife Clinic, Aundh",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sonal&backgroundColor=ffdfbf",
        availability: "Available in 3 days",
        lat: 18.5602,
        lng: 73.8031
    },
    {
        id: 13,
        name: "Dr. Manish Malhotra",
        specialty: "Urologist",
        rating: 4.8,
        reviews: 110,
        distance: "7.1 km",
        address: "Inamdar Hospital, Fatima Nagar",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Manish&backgroundColor=c0aede",
        availability: "Available Today",
        lat: 18.5025,
        lng: 73.9025
    },
    {
        id: 14,
        name: "Dr. Prachi Desai",
        specialty: "Endocrinologist",
        rating: 4.9,
        reviews: 145,
        distance: "3.8 km",
        address: "Noble Hospital, Hadapsar",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Prachi&backgroundColor=ffd5dc",
        availability: "Next Available: Friday",
        lat: 18.5137,
        lng: 73.9276
    },
    {
        id: 15,
        name: "Dr. Rahul Khanna",
        specialty: "Physiotherapist",
        rating: 4.7,
        reviews: 89,
        distance: "8.5 km",
        address: "PhysioActive, Magarpatta City",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul&backgroundColor=b6e3f4",
        availability: "Available Today",
        lat: 18.5147,
        lng: 73.9312
    },
    {
        id: 16,
        name: "Dr. Swati Joshi",
        specialty: "Oncologist",
        rating: 5.0,
        reviews: 212,
        distance: "12.0 km",
        address: "Columbia Asia Hospital, Kharadi",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Swati&backgroundColor=ffdfbf",
        availability: "Next Available: Monday",
        lat: 18.5492,
        lng: 73.9392
    },
    {
        id: 17,
        name: "Dr. Sameer Rizvi",
        specialty: "Pulmonologist",
        rating: 4.8,
        reviews: 104,
        distance: "1.5 km",
        address: "Jehangir Hospital, Sassoon Road",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sameer&backgroundColor=d1d4f9",
        availability: "Available Today",
        lat: 18.5303,
        lng: 73.8770
    },
    {
        id: 18,
        name: "Dr. Nisha Gupta",
        specialty: "Rheumatologist",
        rating: 4.7,
        reviews: 76,
        distance: "4.2 km",
        address: "Hardikar Hospital, Shivajinagar",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nisha&backgroundColor=ffd5dc",
        availability: "Available in 2 days",
        lat: 18.5314,
        lng: 73.8446
    }
];

const FindDoctorPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSpecialty, setSelectedSpecialty] = useState('All');
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    const specialties = ['All', ...new Set(MOCK_DOCTORS.map(d => d.specialty))];

    const filteredDoctors = MOCK_DOCTORS.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
        return matchesSearch && matchesSpecialty;
    });

    return (
        <div className="h-full overflow-y-auto bg-slate-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8 custom-scrollbar">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header Section */}
                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
                        Find Specialists in Pune
                    </h1>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Connect with top-rated doctors across Pune's leading hospitals.
                    </p>
                </div>

                {/* Search & Filter Bar */}
                <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="relative flex-1 w-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name, specialty, or hospital..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                        {specialties.map(spec => (
                            <button
                                key={spec}
                                onClick={() => setSelectedSpecialty(spec)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${selectedSpecialty === spec
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                            >
                                {spec}
                            </button>
                        ))}
                    </div>

                    <div className="flex bg-slate-800 p-1 rounded-xl">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            title="List View"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('map')}
                            className={`p-2 rounded-lg transition-all ${viewMode === 'map' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:text-white'}`}
                            title="Map View"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                {viewMode === 'list' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDoctors.map(doctor => (
                            <div key={doctor.id} className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 hover:border-blue-500/30 transition-all hover:shadow-lg hover:shadow-blue-500/10 group">
                                <div className="flex items-start gap-4">
                                    <img src={doctor.image} alt={doctor.name} className="w-16 h-16 rounded-full bg-slate-800" />
                                    <div>
                                        <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">{doctor.name}</h3>
                                        <p className="text-blue-500 text-sm font-medium">{doctor.specialty}</p>
                                        <div className="flex items-center gap-1 mt-1 text-amber-400 text-xs">
                                            <span>★</span>
                                            <span className="font-semibold">{doctor.rating}</span>
                                            <span className="text-slate-500 ml-1">({doctor.reviews} reviews)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 space-y-2 text-sm text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        <span>{doctor.address} ({doctor.distance})</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className={doctor.availability === 'Available Today' ? 'text-green-400' : 'text-slate-400'}>
                                            {doctor.availability}
                                        </span>
                                    </div>
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-800 flex gap-3">
                                    <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2 rounded-lg text-sm font-medium transition-colors">
                                        View Profile
                                    </button>
                                    <button
                                        onClick={() => setSelectedDoctor(doctor)}
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors shadow-lg shadow-blue-500/20"
                                    >
                                        Book Visit
                                    </button>
                                </div>
                            </div>
                        ))}
                        {filteredDoctors.length === 0 && (
                            <div className="col-span-full text-center py-12 text-slate-500">
                                No doctors found matching your criteria.
                            </div>
                        )}
                    </div>
                ) : (
                    /* Real Leaflet Map View */
                    <div className="bg-slate-900 border border-slate-800 rounded-2xl h-[600px] overflow-hidden relative z-0">
                        <MapContainer
                            center={[18.5204, 73.8567]}
                            zoom={13}
                            style={{ height: '100%', width: '100%' }}
                            className="z-0"
                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />

                            {filteredDoctors.map(doctor => (
                                <Marker position={[doctor.lat, doctor.lng]} key={doctor.id}>
                                    <Popup>
                                        <div className="text-slate-900 min-w-[200px]">
                                            <h3 className="font-bold text-base">{doctor.name}</h3>
                                            <p className="text-blue-600 font-medium text-sm">{doctor.specialty}</p>
                                            <p className="text-slate-600 text-xs mt-1">{doctor.address}</p>
                                            <div className="mt-2 flex gap-2">
                                                <span className="text-amber-500 font-bold text-xs">★ {doctor.rating}</span>
                                                <span className="text-green-600 text-xs font-semibold">{doctor.availability}</span>
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                )}

            </div>
            {selectedDoctor && (
                <BookingModal
                    doctor={selectedDoctor}
                    onClose={() => setSelectedDoctor(null)}
                />
            )}
        </div>
    );
};

export default FindDoctorPage;
