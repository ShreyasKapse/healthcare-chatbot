import React, { useState } from 'react';

const BookingModal = ({ doctor, onClose }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Generate next 3 days
  const getNextDays = () => {
    const days = [];
    for (let i = 0; i < 3; i++) {
        const d = new Date();
        d.setDate(d.getDate() + i);
        days.push({
            label: i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
            date: d.toISOString().split('T')[0],
            dayNum: d.getDate(),
            month: d.toLocaleDateString('en-US', { month: 'short' })
        });
    }
    return days;
  };

  const timeSlots = ['10:00 AM', '11:30 AM', '02:00 PM', '04:30 PM', '06:00 PM'];
  const dates = getNextDays();

  const handleBook = () => {
      setIsBooking(true);
      // Simulate API call
      setTimeout(() => {
          setIsBooking(false);
          setStep(2);
      }, 1500);
  };

  if (!doctor) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 md:p-8 animate-in zoom-in-95 duration-200 overflow-hidden">
        
        {step === 1 ? (
            <>
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Book Appointment</h2>
                        <p className="text-slate-400 text-sm mt-1">with {doctor.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Date Selection */}
                <div className="mb-6">
                    <label className="text-slate-300 text-sm font-medium mb-3 block">Select Date</label>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                        {dates.map((d) => (
                            <button
                                key={d.date}
                                onClick={() => {
                                    setSelectedDate(d.date);
                                    setSelectedTime(''); // Reset time on date change
                                }}
                                className={`flex-1 min-w-[80px] p-3 rounded-xl border-2 transition-all ${
                                    selectedDate === d.date 
                                    ? 'border-blue-500 bg-blue-500/10 text-white' 
                                    : 'border-slate-800 bg-slate-800/50 text-slate-400 hover:border-slate-600'
                                }`}
                            >
                                <div className="text-xs font-semibold uppercase opacity-60">{d.label}</div>
                                <div className="text-xl font-bold mt-1">{d.dayNum}</div>
                                <div className="text-xs font-medium">{d.month}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Selection */}
                <div className="mb-8">
                    <label className="text-slate-300 text-sm font-medium mb-3 block">Available Slots</label>
                    <div className="grid grid-cols-3 gap-3">
                        {timeSlots.map((time) => (
                            <button
                                key={time}
                                onClick={() => setSelectedTime(time)}
                                disabled={!selectedDate}
                                className={`p-2 rounded-lg text-sm font-medium transition-all ${
                                    selectedTime === time
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : !selectedDate 
                                        ? 'bg-slate-800/50 text-slate-600 cursor-not-allowed'
                                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                            >
                                {time}
                            </button>
                        ))}
                    </div>
                    {!selectedDate && (
                         <p className="text-xs text-amber-500 mt-2">Please select a date first</p>
                    )}
                </div>

                {/* Actions */}
                <button
                    onClick={handleBook}
                    disabled={!selectedDate || !selectedTime || isBooking}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 rounded-xl shadow-xl shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                    {isBooking ? (
                        <>
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Confirming...
                        </>
                    ) : 'Confirm Booking'}
                </button>
            </>
        ) : (
            /* Success Step */
            <div className="text-center py-6">
                 <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                 </div>
                 <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                 <p className="text-slate-400 mb-8 max-w-xs mx-auto">
                     Your appointment with <span className="text-blue-400">{doctor.name}</span> is scheduled.
                 </p>

                 <div className="bg-slate-800/50 rounded-2xl p-4 mb-8 border border-slate-700/50">
                     <div className="flex justify-between items-center mb-2">
                         <span className="text-slate-500 text-sm">Date</span>
                         <span className="text-white font-medium">{selectedDate}</span>
                     </div>
                     <div className="flex justify-between items-center mb-2">
                         <span className="text-slate-500 text-sm">Time</span>
                         <span className="text-white font-medium">{selectedTime}</span>
                     </div>
                     <div className="border-t border-slate-700/50 my-2 pt-2 flex justify-between items-center">
                         <span className="text-slate-500 text-sm">Token</span>
                         <span className="text-amber-400 font-mono font-bold text-lg">#A-84</span>
                     </div>
                 </div>

                 <button
                    onClick={onClose}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-semibold py-3 rounded-xl transition-colors"
                >
                    Close
                </button>
            </div>
        )}

      </div>
    </div>
  );
};

export default BookingModal;
