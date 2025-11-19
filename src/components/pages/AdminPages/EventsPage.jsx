import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./../stylesheets/EventsPage.css";
import Navbar from "./../CommonPages/Navbar";

export default function EventsPage() {
  const [events, setEvents] = useState([
    { title: "First Term Exam", start: "2025-06-10" },
    { title: "Science Fair", start: "2025-07-12" },
    { title: "Parent Meeting", start: "2025-08-05" },
    { title: "Sports Day", start: "2025-09-18" },
    { title: "Diwali Holidays", start: "2025-11-03", end: "2025-11-09" },
  ]);

  const handleDateClick = (info) => {
    const title = prompt("Enter Event Title:");
    if (title) {
      setEvents([...events, { title, start: info.dateStr }]);
    }
  };

  return (
    <>
      <Navbar />
      <div className="events-container">
        <h2 className="page-title">Academic Calendar</h2>
        <p className="subtitle">Manage your school’s academic schedule and holidays</p>

        <div className="calendar-card">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            editable
            selectable
            height="auto"
          />
        </div>
      </div>
    </>
  );
}