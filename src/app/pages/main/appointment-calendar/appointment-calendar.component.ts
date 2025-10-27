import { Component } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core'; // useful for typechecking
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-appointment-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './appointment-calendar.component.html',
  styleUrl: './appointment-calendar.component.scss',
})
export class AppointmentCalendarComponent {
  constructor() {}

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '',
    },
    aspectRatio: 1.2, // controls height/width ratio
    height: 'auto',
    contentHeight: 'auto',
    dayMaxEventRows: true,
    weekends: true,
    events: [
      { title: 'Interview', date: '2025-10-25', classNames: ['pending'] },
      { title: 'Rejected', date: '2025-10-26', classNames: ['not-going'] },
      { title: 'Accepted', date: '2025-10-27', classNames: ['going'] },
      { title: 'PMD Approved', date: '2025-10-28', classNames: ['confirmed'] },
    ],
  };
}
