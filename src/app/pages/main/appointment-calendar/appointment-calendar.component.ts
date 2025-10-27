// Complete Component TypeScript File
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { LoadingService } from 'src/app/services/auth-services/loading-services';
import {
  GetAppointmentDto,
  UserServices,
} from 'src/app/services/nswag/service-proxie';

@Component({
  selector: 'app-appointment-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FullCalendarModule,
    DialogModule,
    ButtonModule,
    InputTextareaModule,
  ],
  templateUrl: './appointment-calendar.component.html',
  styleUrls: ['./appointment-calendar.component.scss'],
})
export class AppointmentCalendarComponent implements OnInit {
  visible: boolean = false;
  selectedEvent: any = null;
  showReasonTextarea: boolean = false;
  notGoingReason: string = '';

  constructor(
    private userService: UserServices,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.onGetUserAppointments();
  }

  /** Calendar configuration */
  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '',
    },
    height: 'auto',
    contentHeight: 'auto',
    dayMaxEventRows: true,
    weekends: true,
    displayEventTime: false,
    events: [],
    eventContent: (arg) => this.renderEventContent(arg),
    eventClassNames: (arg) => {
      if (arg.event.extendedProps['isConfirmed']) {
        return ['confirmed-event'];
      }
      return [];
    },
    eventClick: (info) => {
      info.jsEvent.preventDefault();
      this.onEventClick(info);
    },
    editable: false,
    selectable: true,
  };

  /** Custom event content: small color dot + title */
  private renderEventContent(arg: any) {
    const color = arg.event.extendedProps['circleColor'] || 'gray';
    const title = arg.event.title;

    const circle = document.createElement('span');
    circle.style.backgroundColor = color;
    circle.style.borderRadius = '50%';
    circle.style.display = 'inline-block';
    circle.style.width = '8px';
    circle.style.height = '8px';
    circle.style.marginRight = '6px';
    circle.style.marginTop = '2px';
    circle.style.flexShrink = '0';

    const text = document.createElement('span');
    text.innerText = title;
    text.style.fontSize = '0.85rem';
    text.style.flex = '1';

    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.alignItems = 'flex-start';
    container.style.width = '100%';
    container.appendChild(circle);
    container.appendChild(text);

    return { domNodes: [container] };
  }

  /** Handle event click -> open modal */
  onEventClick(info: any) {
    this.selectedEvent = {
      title: info.event.title,
      date: info.event.start,
      eventName: info.event.extendedProps['eventName'],
      jobTitle: info.event.extendedProps['jobTitle'],
      isConfirmed: info.event.extendedProps['isConfirmed'],
      appointmentId: info.event.extendedProps['appointmentId'],
      status: info.event.extendedProps['status'],
      fullData: info.event.extendedProps['fullData'],
    };

    this.showReasonTextarea = false;
    this.notGoingReason = '';
    this.visible = true;

    console.log('Selected event:', this.selectedEvent);
  }

  /** Check if event already confirmed */
  get isEventConfirmed(): boolean {
    return this.selectedEvent?.isConfirmed === true;
  }

  /** Convert numeric status to readable text */
  get statusLabel(): string {
    if (!this.selectedEvent) return '';
    switch (this.selectedEvent.status) {
      case 0:
        return 'Pending';
      case 1:
        return 'Going';
      case 2:
        return 'Not Going';
      default:
        return 'Unknown';
    }
  }

  /** Handle "Not Going" */
  onNotGoingClick() {
    if (this.isEventConfirmed) return;
    this.showReasonTextarea = true;
  }

  /** Handle "Going" */
  onGoingClick() {
    if (this.isEventConfirmed) return;

    console.log('User is going to the event:', this.selectedEvent);
    // TODO: API call to confirm attendance
    // this.userService.updateAppointmentStatus(this.selectedEvent.appointmentId, 1).subscribe({
    //   next: () => {
    //     this.visible = false;
    //     this.onGetUserAppointments();
    //   },
    //   error: (err) => console.error('Error updating status:', err),
    // });
    this.visible = false;
  }

  /** Submit Not Going */
  onSubmitNotGoing() {
    if (!this.notGoingReason.trim()) return;

    console.log('User not going. Reason:', this.notGoingReason);
    console.log('Event:', this.selectedEvent);

    // TODO: API call to submit not going reason
    // this.userService.updateAppointmentStatus(
    //   this.selectedEvent.appointmentId,
    //   2,
    //   this.notGoingReason
    // ).subscribe({
    //   next: () => {
    //     this.visible = false;
    //     this.showReasonTextarea = false;
    //     this.notGoingReason = '';
    //     this.onGetUserAppointments();
    //   },
    //   error: (err) => console.error('Error updating status:', err),
    // });

    this.visible = false;
    this.showReasonTextarea = false;
    this.notGoingReason = '';
  }

  /** Cancel modal */
  onCancelModal() {
    this.visible = false;
    this.showReasonTextarea = false;
    this.notGoingReason = '';
  }

  /** Date formatting */
  getFormattedDate(date: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  /** Time formatting */
  getFormattedTime(date: Date): string {
    if (!date) return '';
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  }

  /** Fetch all appointments for user */
  onGetUserAppointments() {
    this.loadingService.show();

    this.userService.getAppointment().subscribe({
      next: (res) => {
        this.loadingService.hide();

        if (res.isSuccess && res.data) {
          const mappedEvents = res.data.map((appt: GetAppointmentDto) => {
            const dateObj = new Date(appt.scheduledDateTime as any);
            const formattedTime = dateObj.toLocaleTimeString([], {
              hour: 'numeric',
              minute: '2-digit',
              hour12: true,
            });

            // Determine event circle color
            let circleColor = 'blue';
            switch (appt.status) {
              case 2:
                circleColor = 'red';
                break;
              case 1:
                circleColor = 'green';
                break;
              case 0:
              default:
                circleColor = 'blue';
                break;
            }

            const title = `${formattedTime} ${appt.events} - ${appt.jobTitle}`;

            return {
              title,
              date: appt.scheduledDateTime,
              extendedProps: {
                circleColor,
                isConfirmed: appt.isConfirmed,
                appointmentId: appt.appointmentId,
                eventName: appt.events,
                jobTitle: appt.jobTitle,
                status: appt.status,
                fullData: appt,
              },
            };
          });

          this.calendarOptions.events = mappedEvents;
        }
      },
      error: (err) => {
        this.loadingService.hide();
        console.error('Error fetching appointments:', err);
      },
    });
  }
}
