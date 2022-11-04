import Head from 'next/head';
import { useState, useEffect } from 'react';
import { isAuthorized } from '.';
import AdminHeader from '../../components/AdminHeader';
import LoadIcon from '../../components/LoadIcon';
import { RequestHelper } from '../../lib/request-helper';
import { Ticket, TicketParticipantInfo } from '../../lib/tickets/types';
import { useAuthContext } from '../../lib/user/AuthContext';

export default function ClaimTicketPage() {
  const { user, isSignedIn } = useAuthContext();
  const [loading, setLoading] = useState(true);
  const [myClaimedTickets, setMyClaimedTickets] = useState<Ticket[]>([]);
  const [unclaimedTickets, setUnclaimedTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    async function getData() {
      const { data } = await RequestHelper.get<Ticket[]>('/api/tickets/all', {
        headers: {
          Authorization: user.token,
        },
      });
      setMyClaimedTickets(data.filter((ticket) => ticket.ticketClaimer.id === user.id));
      setUnclaimedTickets(data.filter((ticket) => ticket.ticketClaimer.id === ''));
      setLoading(false);
    }
    getData();
  }, []);

  const claimTicket = async (ticketIdx: number) => {
    try {
      await RequestHelper.post<{ ticketId: string; ticketClaimer: TicketParticipantInfo }, unknown>(
        '/api/tickets/claim',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: user.token,
          },
        },
        {
          ticketId: unclaimedTickets[ticketIdx].ticketId,
          ticketClaimer: {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        },
      );

      alert('Ticket claimed');
    } catch (error) {
      console.error(error);
      alert('Error claiming tickets');
    }
  };

  const unclaimTicket = async (ticketIdx: number) => {
    try {
      await RequestHelper.post<{ ticketId: string }, unknown>(
        '/api/tickets/unclaim',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: user.token,
          },
        },
        {
          ticketId: myClaimedTickets[ticketIdx].ticketId,
        },
      );

      alert('Ticket unclaimed');
    } catch (error) {
      console.error(error);
      alert('Error unclaiming tickets');
    }
  };

  const resolveTicket = async (ticketIdx: number) => {
    try {
      await RequestHelper.post<{ ticketId: string }, unknown>(
        '/api/tickets/resolve',
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: user.token,
          },
        },
        {
          ticketId: myClaimedTickets[ticketIdx].ticketId,
        },
      );

      alert('Ticket resolved');
    } catch (error) {
      console.error(error);
      alert('Error resolving tickets');
    }
  };

  if (!isSignedIn || !isAuthorized(user))
    return (
      <div className="background h-screen">
        <div className="md:text-4xl sm:text-2xl text-xl text-white font-medium text-center mt-[6rem]">
          Unauthorized
        </div>
      </div>
    );

  if (loading) return <LoadIcon width={200} height={200} />;
  return (
    <div className="flex flex-col flex-grow h-screen background text-white">
      <Head>
        <title>HackUTD IX - Admin</title>
        <meta name="description" content="HackUTD's Admin Page" />
      </Head>
      <AdminHeader />
      <div className="p-4">
        <div className="my-6 p-4">
          <h1 className="text-xl text-white font-bold">Unclaimed Tickets</h1>
          {unclaimedTickets.length === 0 ? (
            <h1>No unclaimed tickets at the moment</h1>
          ) : (
            unclaimedTickets.map((ticket, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between my-2 w-1/2 border-2 p-3 rounded-lg"
              >
                <div>
                  <h1>
                    <span className="font-bold">Ticket Creator: </span>
                    {ticket.ticketCreator.firstName + ' ' + ticket.ticketCreator.lastName}
                  </h1>
                  <h1>
                    <span className="font-bold">Ticket Content: </span>
                    {ticket.content}
                  </h1>
                </div>
                <div>
                  <button
                    className="border-2 p-3 rounded-lg text-white"
                    onClick={async () => {
                      await claimTicket(idx);
                    }}
                  >
                    Claim
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="my-6 p-4">
          <h1 className="text-xl text-white font-bold">My Claimed Tickets</h1>
          {myClaimedTickets.length === 0 ? (
            <h1>You do not have any tickets at the moment</h1>
          ) : (
            myClaimedTickets.map((ticket, idx) => (
              <div key={idx} className="flex flex-col gap-y-5 my-2 w-1/2 border-2 p-3 rounded-lg">
                <h1>
                  <span className="font-bold">Ticket Content: </span>
                  {ticket.content}
                </h1>
                <div className="flex gap-x-2">
                  <button
                    className="border-2 p-3 rounded-lg text-white"
                    onClick={async () => {
                      await unclaimTicket(idx);
                    }}
                  >
                    Unclaim Ticket
                  </button>
                  <button
                    className="border-2 p-3 rounded-lg text-white"
                    onClick={async () => {
                      await resolveTicket(idx);
                    }}
                  >
                    Resolve Ticket
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
