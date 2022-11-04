export interface TicketParticipantInfo {
  id: string;
  firstName: string;
  lastName: string;
}

export interface TicketSubmissionPayload {
  ticketCreator: TicketParticipantInfo;
  content: string;
}

export interface Ticket extends TicketSubmissionPayload {
  ticketClaimer: TicketParticipantInfo;
  completed: boolean;
  ticketId: string;
}
