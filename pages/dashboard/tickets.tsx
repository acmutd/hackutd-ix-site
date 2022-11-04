import Head from 'next/head';
import { useEffect, useState } from 'react';
import DashboardHeader from '../../components/DashboardHeader';
import LoadIcon from '../../components/LoadIcon';
import { RequestHelper } from '../../lib/request-helper';
import { Ticket, TicketSubmissionPayload } from '../../lib/tickets/types';
import { useAuthContext } from '../../lib/user/AuthContext';

export default function TicketPage() {
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { user, isSignedIn, hasProfile, profile } = useAuthContext();
  const [ticketContent, setTicketContent] = useState<string>('');
  const [submittedTicket, setSubmittedTicket] = useState<Ticket[]>([]);

  useEffect(() => {
    async function getTickets() {
      const { data } = await RequestHelper.get<Ticket[]>('/api/tickets', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: user.token,
        },
      });
      console.log(data);
      setSubmittedTicket(data);
      setLoading(false);
    }
    getTickets();
  }, []);

  const submitTicket = async () => {
    try {
      const { data } = await RequestHelper.post<TicketSubmissionPayload, { msg: string }>(
        '/api/tickets/submit',
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
        {
          ticketCreator: {
            id: user.id,
            firstName: profile.user.firstName,
            lastName: profile.user.lastName,
          },
          content: ticketContent,
        },
      );

      alert(data.msg);
    } catch (error) {
      console.error(error);
      setError(JSON.stringify(error));
    }
  };

  if (loading) {
    return <LoadIcon width={200} height={200} />;
  }

  return (
    <div className="flex flex-wrap flex-col flex-grow text-white background">
      <Head>
        <title>Submit Ticket</title>
        <meta name="description" content="HackPortal's Scan-In" /> {/* !change */}
      </Head>

      <section id="mainContent" className="px-6 py-3 mt-[5rem]">
        <DashboardHeader />
        {hasProfile ? (
          <div className="flex flex-col items-center justify-center top-6">
            <div className="mt-[2rem]">
              <h4 className="text-center text-xl">Submit Ticket</h4>
              <p className="text-center">
                Fill out the box below with what you need help with and tap the button to submit
                your ticket
              </p>
              <span className="text-center text-lg">{error}</span>
            </div>
            <textarea
              value={ticketContent}
              onChange={(e) => setTicketContent(e.target.value)}
              placeholder="What do you need help with?"
              className="p-3 rounded-lg my-2 input w-3/4"
              rows={5}
            ></textarea>
            <div
              className="rounded-2xl accountSection text-center py-3 px-5 m-auto cursor-pointer hover:brightness-150 my-6 sm:my-3"
              onClick={async () => {
                await submitTicket();
              }}
            >
              Submit Ticket
            </div>
            {submittedTicket.length === 0 ? (
              <h1>No tickets submitted</h1>
            ) : (
              <div className="w-full">
                {submittedTicket.map((ticket) => (
                  <div key={ticket.content} className="w-1/2 mx-auto border-2 p-3 rounded-lg">
                    <h1>
                      <span className="font-bold">Ticket Content: </span>
                      {ticket.content}
                    </h1>
                    <h1>
                      <span className="font-bold">Status: </span>
                      {ticket.ticketClaimer.id === ''
                        ? 'Pending'
                        : ticket.completed
                        ? 'Resolved'
                        : `Claimed by ${ticket.ticketClaimer.firstName} ${ticket.ticketClaimer.lastName}`}
                    </h1>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="top-6 flex justify-center md:text-lg text-base">
            <h4>Please register to submit tickets</h4>
          </div>
        )}
      </section>
    </div>
  );
}
