import { useState } from 'react';
import './Calendar.css';

function Calendar({ selectedDate, onDateSelect, placeholder }) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get the day of week for first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
      const isPast = date < new Date().setHours(0, 0, 0, 0); // Before today
      
      days.push({
        date: date,
        dayNumber: i,
        isWeekend: isWeekend,
        isPast: isPast,
        isAvailable: !isWeekend && !isPast
      });
    }
    
    return days;
  };

  const handleDateClick = (dayInfo) => {
    if (dayInfo && dayInfo.isAvailable) {
      const dateString = dayInfo.date.toISOString().split('T')[0];
      onDateSelect(dateString);
      setIsCalendarOpen(false);
    }
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return placeholder;
    
    const date = new Date(selectedDate);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const monthYear = currentMonth.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const calendarDays = generateCalendarDays();

  return (
    <div className="calendar-component">
      <div 
        className="calendar-input"
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
      >
        <div className="calendar-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
          </svg>
        </div>
        <span className="calendar-text">
          {formatSelectedDate()}
        </span>
        <div className="calendar-dropdown-arrow">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
      </div>

      {isCalendarOpen && (
        <div className="calendar-modal">
          <div className="calendar-modal-backdrop" onClick={() => setIsCalendarOpen(false)}></div>
          <div className="calendar-widget">
            <div className="calendar-header">
              <button 
                className="calendar-nav-btn"
                onClick={handlePrevMonth}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="15,18 9,12 15,6"></polyline>
                </svg>
              </button>
              <h3 className="calendar-month-year">{monthYear}</h3>
              <button 
                className="calendar-nav-btn"
                onClick={handleNextMonth}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="9,18 15,12 9,6"></polyline>
                </svg>
              </button>
            </div>

            <div className="calendar-weekdays">
              {weekDays.map(day => (
                <div key={day} className="calendar-weekday">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-days">
              {calendarDays.map((dayInfo, index) => (
                <div
                  key={index}
                  className={`calendar-day ${
                    !dayInfo ? 'calendar-empty' : 
                    dayInfo.isPast ? 'calendar-past' :
                    dayInfo.isWeekend ? 'calendar-unavailable' :
                    dayInfo.isAvailable ? 'calendar-available' : ''
                  } ${
                    selectedDate === dayInfo?.date?.toISOString().split('T')[0] ? 'calendar-selected' : ''
                  }`}
                  onClick={() => handleDateClick(dayInfo)}
                >
                  {dayInfo ? (
                    <>
                      <span className="day-number">{dayInfo.dayNumber}</span>
                      {dayInfo.isWeekend && <div className="cross-line"></div>}
                    </>
                  ) : ''}
                </div>
              ))}
            </div>

            <div className="calendar-legend">
              <div className="legend-item">
                <div className="legend-dot available"></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="legend-dot unavailable"></div>
                <span>Unavailable (Weekend)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;
